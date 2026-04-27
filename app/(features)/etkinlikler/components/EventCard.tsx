/**
 * EventCard Bileşeni - Feed kart yapısı
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { Event, Community } from '../types';
import { getTimeAgo, formatDateTurkish } from '../mockData';

interface EventCardProps {
    event: Event;
    community: Community;
    onCommunityPress?: (communityId: string) => void;
}

export default function EventCard({ event, community, onCommunityPress, onEventPress }: EventCardProps & { onEventPress?: (event: Event) => void }) {
    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => onEventPress?.(event)}
        >
            {/* Community Header */}
            <View style={styles.header}>
                <Image source={{ uri: community.logo }} style={styles.logo} />
                <View style={styles.headerText}>
                    <TouchableOpacity onPress={() => onCommunityPress?.(community.id)}>
                        <Text style={styles.communityName}>{community.name}</Text>
                    </TouchableOpacity>
                    <Text style={styles.timeAgo}>{getTimeAgo(event.createdAt)}</Text>
                </View>
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>Eğitim</Text>
                </View>
            </View>

            {/* Event Image */}
            <View style={styles.imageWrapper}>
                <Image source={{ uri: event.image }} style={styles.eventImage} resizeMode="cover" />
            </View>

            {/* Event Info */}
            <View style={styles.content}>
                <Text style={styles.eventTitle}>{event.title}</Text>

                <View style={styles.stackedDetails}>
                    <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={14} color={colors.primary} />
                        <Text style={styles.detailText}>{formatDateTurkish(event.date)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={14} color={colors.primary} />
                        <Text style={styles.detailText}>{event.time}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={14} color={colors.primary} />
                        <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
                    </View>
                </View>

                {/* Card Button (Matching HomeScreen) */}
                <View style={styles.cardButton}>
                    <Text style={styles.cardButtonText}>Detaylar</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cardLight,
        borderRadius: 16,
        paddingHorizontal: 0,
        paddingBottom: 0,
        paddingTop: 0,
        marginBottom: 24,
        marginHorizontal: 18,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        ...shadows.card,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.border,
    },
    headerText: {
        marginLeft: 12,
        flex: 1,
    },
    communityName: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    timeAgo: {
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: 2,
    },
    categoryBadge: {
        backgroundColor: '#EBF5FF',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.primary,
    },
    imageWrapper: {
        width: '100%',
        height: 140, // Reduced from 180
        position: 'relative',
    },
    eventImage: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: 14, // Reduced from 18
    },
    eventTitle: {
        fontSize: 16, // Reduced from 18
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    stackedDetails: {
        gap: 6,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    cardButton: {
        backgroundColor: '#F1F5F9', // More subtle
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    cardButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.primary,
    },
});
