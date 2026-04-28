import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { Community, Event } from '../types';
import { fetchCommunityById, fetchEventsByCommunity } from '../services/eventService';
import { formatDateTurkish } from '../mockData';

interface CommunityDetailScreenProps {
    communityId: string;
    isFollowing: boolean;
    onFollowToggle: () => void;
    onClose: () => void;
}

export default function CommunityDetailScreen({
    communityId,
    isFollowing,
    onFollowToggle,
    onClose,
}: CommunityDetailScreenProps) {
    const [community, setCommunity] = useState<Community | null>(null);
    const [communityEvents, setCommunityEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCommunityData = async () => {
            setLoading(true);
            try {
                const [communityData, eventsData] = await Promise.all([
                    fetchCommunityById(communityId),
                    fetchEventsByCommunity(communityId),
                ]);
                setCommunity(communityData);
                setCommunityEvents(eventsData);
            } catch (error) {
                console.error('Community data load error:', error);
            } finally {
                setLoading(false);
            }
        };

        void loadCommunityData();
    }, [communityId]);

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!community) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.emptyText}>Topluluk bulunamadı.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backButton} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerLabel}>TOPLULUK DETAYI</Text>
                    <Text style={styles.headerTitle}>Topluluk</Text>
                </View>
                <View style={styles.placeholder} />
            </View>

            <FlatList
                data={communityEvents}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View>
                        <View style={styles.profileCard}>
                            <Image source={{ uri: community.logo }} style={styles.logo} />
                            <Text style={styles.communityName}>{community.name}</Text>
                            {community.description ? <Text style={styles.description}>{community.description}</Text> : null}

                            <View style={styles.statsRow}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{community.memberCount || 0}</Text>
                                    <Text style={styles.statLabel}>Üye</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{communityEvents.length}</Text>
                                    <Text style={styles.statLabel}>Etkinlik</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.followButton, isFollowing && styles.followButtonActive]}
                                onPress={onFollowToggle}
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.followButtonText, isFollowing && styles.followButtonTextActive]}>
                                    {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.sectionTitle}>Yaklaşan Etkinlikler</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.eventRow}>
                        <Image source={{ uri: item.image }} style={styles.eventImage} />
                        <View style={styles.eventContent}>
                            <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
                            <Text style={styles.eventMeta}>{formatDateTurkish(item.date)}  {item.time}</Text>
                            <View style={styles.eventLocationRow}>
                                <Ionicons name="location-outline" size={13} color={colors.accent} />
                                <Text style={styles.eventLocation} numberOfLines={1}>{item.location}</Text>
                            </View>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Henüz etkinlik yok.</Text>}
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        backgroundColor: colors.backgroundLight,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerLabel: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
        letterSpacing: 1,
        textAlign: 'center',
    },
    headerTitle: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    placeholder: {
        width: 36,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxxl,
    },
    profileCard: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.cardLight,
        alignItems: 'center',
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadows.card,
    },
    logo: {
        width: 82,
        height: 82,
        borderRadius: 41,
        marginBottom: spacing.md,
        backgroundColor: colors.border,
    },
    communityName: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    description: {
        marginTop: spacing.sm,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.md,
        width: '100%',
    },
    statBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        alignItems: 'center',
    },
    statValue: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    statLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginTop: 2,
    },
    followButton: {
        marginTop: spacing.md,
        width: '100%',
        height: 44,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    followButtonActive: {
        backgroundColor: colors.cardLight,
        borderColor: colors.border,
    },
    followButtonText: {
        color: colors.textWhite,
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
    },
    followButtonTextActive: {
        color: colors.textSecondary,
    },
    sectionTitle: {
        marginTop: spacing.xs,
        marginBottom: spacing.sm,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.semibold,
        letterSpacing: 0.5,
    },
    eventRow: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        backgroundColor: colors.cardLight,
        padding: spacing.sm,
        marginBottom: spacing.sm,
        ...shadows.card,
    },
    eventImage: {
        width: 72,
        height: 72,
        borderRadius: borderRadius.sm,
        marginRight: spacing.sm,
        backgroundColor: colors.border,
    },
    eventContent: {
        flex: 1,
    },
    eventTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    eventMeta: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    eventLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventLocation: {
        marginLeft: 4,
        fontSize: fontSize.sm,
        color: colors.accent,
        fontWeight: fontWeight.medium,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginTop: spacing.xl,
        fontSize: fontSize.md,
    },
});
