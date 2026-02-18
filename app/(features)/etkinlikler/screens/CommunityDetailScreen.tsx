/**
 * CommunityDetailScreen - Topluluk detay sayfası
 */
import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { Community, Event } from '../types';
import { getEventsByCommunityId, getCommunityById, formatDateTurkish } from '../mockData';
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
    const community = getCommunityById(communityId);
    const communityEvents = getEventsByCommunityId(communityId);

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
        fontSize: 20,
        color: colors.primary,
        marginLeft: spacing.xs
    },
    description: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: spacing.xxl,
        marginBottom: spacing.lg
    },
    stat: {
        alignItems: 'center'
    },
    statValue: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary
    },
    statLabel: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: spacing.xs
    },
    followButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xxl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        minWidth: 200,
        alignItems: 'center',
    },
    followingButton: {
        backgroundColor: colors.backgroundLight,
        borderWidth: 1,
        borderColor: colors.border,
    },
    followButtonText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
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
