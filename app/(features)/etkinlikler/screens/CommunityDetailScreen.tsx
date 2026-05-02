/**
 * CommunityDetailScreen - Topluluk detay sayfası (Supabase entegrasyonlu)
 */
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { Community, Event } from '../types';
import { fetchCommunityById, fetchEventsByCommunity } from '../services/eventService';
import { formatDateTurkish } from '../mockData';
import EventMiniCard from '../components/EventMiniCard';

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
    onClose
}: CommunityDetailScreenProps) {
    const [community, setCommunity] = useState<Community | null>(null);
    const [communityEvents, setCommunityEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCommunityData();
    }, [communityId]);

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

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!community) return null;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Topluluk</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Community Info */}
            <View style={styles.communityInfo}>
                <Image source={{ uri: community.logo }} style={styles.logo} />
                <View style={styles.nameContainer}>
                    <Text style={styles.communityName}>{community.name}</Text>
                    {community.isVerified && <Text style={styles.verifiedBadge}>✓</Text>}
                </View>

                {community.description && (
                    <Text style={styles.description}>{community.description}</Text>
                )}

                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{community.memberCount || 0}</Text>
                        <Text style={styles.statLabel}>Üye</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{communityEvents.length}</Text>
                        <Text style={styles.statLabel}>Etkinlik</Text>
                    </View>
                </View>

                {/* Follow Button */}
                <TouchableOpacity
                    style={[styles.followButton, isFollowing && styles.followingButton]}
                    onPress={onFollowToggle}
                >
                    <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                        {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Events List */}
            <View style={styles.eventsSection}>
                <Text style={styles.sectionTitle}>Etkinlikler</Text>
                <FlatList
                    data={communityEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <EventMiniCard event={item} community={community} />
                    )}
                    contentContainerStyle={styles.eventsList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Henüz etkinlik yok</Text>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundLight
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    backIcon: {
        fontSize: 24,
        color: colors.textPrimary
    },
    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary
    },
    placeholder: {
        width: 40
    },
    communityInfo: {
        padding: spacing.lg,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: borderRadius.full,
        backgroundColor: colors.border,
        marginBottom: spacing.md,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm
    },
    communityName: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    verifiedBadge: {
        fontSize: 18,
        color: colors.primary,
        marginLeft: spacing.xs
    },
    description: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 32,
        marginBottom: spacing.lg
    },
    stat: {
        alignItems: 'center'
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.textPrimary
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2
    },
    followButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 14,
        minWidth: 180,
        alignItems: 'center',
        ...shadows.card,
    },
    followingButton: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 0,
        shadowOpacity: 0,
    },
    followButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF'
    },
    followingButtonText: {
        color: colors.textSecondary
    },
    eventsSection: {
        flex: 1,
        padding: spacing.lg
    },
    sectionTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    eventsList: {
        paddingBottom: spacing.xxl
    },
    emptyText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.xxl,
    },
});
