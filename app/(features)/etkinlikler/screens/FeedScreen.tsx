import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { Community, Event } from '../types';
import { fetchEvents, fetchCommunities } from '../services/eventService';
import { formatDateTurkish } from '../mockData';

interface FeedScreenProps {
    onNotificationsPress: () => void;
    onCalendarPress: () => void;
    onCommunityPress?: (communityId: string) => void;
    onEventPress?: (event: Event, community: Community) => void;
    followedCommunities?: Set<string>;
    highlightedEventId?: string;
}

function eventDateValue(event: Event): number {
    return new Date(`${event.date}T${event.time || '00:00'}`).getTime();
}

export default function FeedScreen({
    onCalendarPress,
    onCommunityPress,
    onEventPress,
    followedCommunities = new Set(),
    highlightedEventId,
}: FeedScreenProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [communities, setCommunities] = useState<Map<string, Community>>(new Map());
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef<FlatList<Event>>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [eventsData, communitiesData] = await Promise.all([
                    fetchEvents(),
                    fetchCommunities(),
                ]);
                setEvents(eventsData);
                const map = new Map<string, Community>();
                communitiesData.forEach(item => map.set(item.id, item));
                setCommunities(map);
            } catch (error) {
                console.error('Feed data load error:', error);
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, []);

    const sortedEvents = useMemo(() => {
        return [...events].sort((a, b) => {
            const aFollowed = followedCommunities.has(a.communityId);
            const bFollowed = followedCommunities.has(b.communityId);
            if (aFollowed !== bFollowed) return aFollowed ? -1 : 1;
            return eventDateValue(a) - eventDateValue(b);
        });
    }, [events, followedCommunities]);

    useEffect(() => {
        if (!highlightedEventId || !flatListRef.current) return;
        const index = sortedEvents.findIndex(e => e.id === highlightedEventId);
        if (index === -1) return;
        setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.2 });
        }, 250);
    }, [highlightedEventId, sortedEvents]);

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Etkinlikler yükleniyor</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerLabel}>TOPLULUK ETKİNLİKLERİ</Text>
                    <Text style={styles.headerTitle}>Etkinlik Akışı</Text>
                </View>
                <TouchableOpacity style={styles.calendarButton} onPress={onCalendarPress} activeOpacity={0.75}>
                    <Ionicons name="calendar-outline" size={19} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={sortedEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const community = communities.get(item.communityId);
                    if (!community) return null;

                    return (
                        <TouchableOpacity style={styles.card} activeOpacity={0.86} onPress={() => onEventPress?.(item, community)}>
                            <Image source={{ uri: item.image }} style={styles.eventImage} resizeMode="cover" />

                            <View style={styles.content}>
                                <View style={styles.communityRow}>
                                    <TouchableOpacity onPress={() => onCommunityPress?.(community.id)} activeOpacity={0.7}>
                                        <Text style={styles.communityName}>{community.name}</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.eventTitle}>{item.title}</Text>
                                <Text style={styles.eventDescription} numberOfLines={2}>{item.description}</Text>

                                <View style={styles.metaBar}>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="calendar-outline" size={13} color={colors.primary} />
                                        <Text style={styles.metaItemText}>{formatDateTurkish(item.date)}</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="time-outline" size={13} color={colors.primary} />
                                        <Text style={styles.metaItemText}>{item.time}</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="location-outline" size={13} color={colors.primary} />
                                        <Text style={styles.metaItemText} numberOfLines={1}>{item.location}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>Etkinlik bulunamadı</Text>
                        <Text style={styles.emptySubtitle}>Daha sonra tekrar kontrol edebilirsiniz.</Text>
                    </View>
                }
                onScrollToIndexFailed={(info) => {
                    setTimeout(() => {
                        flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
                    }, 100);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundLight,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: spacing.md,
        color: colors.textSecondary,
        fontSize: fontSize.md,
    },
    header: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        backgroundColor: colors.backgroundLight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLabel: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
        letterSpacing: 1,
        marginBottom: spacing.xs,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: fontWeight.bold,
        color: '#000000',
    },
    calendarButton: {
        width: 42,
        height: 42,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cardLight,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 90,
    },
    card: {
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.cardLight,
        overflow: 'hidden',
        ...shadows.card,
    },
    eventImage: {
        width: '100%',
        height: 108,
        backgroundColor: colors.border,
    },
    content: {
        padding: spacing.lg,
    },
    communityRow: {
        marginBottom: spacing.md,
    },
    communityName: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.primary,
    },
    eventTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    eventDescription: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 15,
        marginBottom: spacing.lg,
    },
    metaBar: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 2,
        paddingTop: 0,
        marginTop: -2,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        minHeight: 18,
    },
    metaItemText: {
        marginLeft: 4,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.semibold,
        textAlign: 'left',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    emptySubtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});
