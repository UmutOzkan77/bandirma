/**
 * FeedScreen - Ana etkinlik akışı (Supabase entegrasyonlu)
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { colors, spacing } from '../theme';
import { Community, Event, Notification } from '../types';
import { fetchEvents, fetchCommunities, fetchNotifications, fetchCommunityById } from '../services/eventService';
import Header from '../components/Header';
import EventCard from '../components/EventCard';

interface FeedScreenProps {
    onNotificationsPress: () => void;
    onCalendarPress: () => void;
    onCommunityPress?: (communityId: string) => void;
    onEventPress?: (event: Event) => void;
    followedCommunities?: Set<string>;
    highlightedEventId?: string;
}

export default function FeedScreen({
    onNotificationsPress,
    onCalendarPress,
    onCommunityPress,
    onEventPress,
    followedCommunities = new Set(),
    highlightedEventId
}: FeedScreenProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [communities, setCommunities] = useState<Map<string, Community>>(new Map());
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [eventsData, communitiesData, notificationsData] = await Promise.all([
                fetchEvents(),
                fetchCommunities(),
                fetchNotifications(),
            ]);
            setEvents(eventsData);
            const communityMap = new Map<string, Community>();
            communitiesData.forEach(c => communityMap.set(c.id, c));
            setCommunities(communityMap);
            setUnreadCount(notificationsData.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Feed data load error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Sort events: followed communities first, then by creation time
    const sortedEvents = [...events].sort((a, b) => {
        const aIsFollowed = followedCommunities.has(a.communityId);
        const bIsFollowed = followedCommunities.has(b.communityId);
        if (aIsFollowed && !bIsFollowed) return -1;
        if (!aIsFollowed && bIsFollowed) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
    });

    // Scroll to highlighted event when it changes
    useEffect(() => {
        if (highlightedEventId && flatListRef.current) {
            const index = sortedEvents.findIndex(e => e.id === highlightedEventId);
            if (index !== -1) {
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
                }, 300);
            }
        }
    }, [highlightedEventId]);

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header onNotificationsPress={onNotificationsPress} onCalendarPress={onCalendarPress} unreadCount={unreadCount} />
            <FlatList
                ref={flatListRef}
                data={sortedEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const community = communities.get(item.communityId);
                    if (!community) return null;
                    return <EventCard event={item} community={community} onCommunityPress={onCommunityPress} onEventPress={onEventPress} />;
                }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
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
    container: { flex: 1, backgroundColor: colors.backgroundLight },
    centered: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: spacing.md, color: colors.textSecondary },
    listContent: { paddingTop: spacing.md, paddingBottom: spacing.xxl },
});
