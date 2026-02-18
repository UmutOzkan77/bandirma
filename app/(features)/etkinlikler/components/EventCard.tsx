/**
 * EventCard Bileşeni - Feed kart yapısı
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { Event, Community } from '../types';
import { getTimeAgo, formatDateTurkish } from '../mockData';

interface EventCardProps {
    event: Event;
    community: Community;
    onCommunityPress?: (communityId: string) => void;
}

export default function EventCard({ event, community, onCommunityPress }: EventCardProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: community.logo }} style={styles.logo} />
                <View style={styles.headerText}>
                    <TouchableOpacity onPress={() => onCommunityPress?.(community.id)}>
                        <Text style={styles.communityName}>{community.name}</Text>
                    </TouchableOpacity>
                    <Text style={styles.timeAgo}>{getTimeAgo(event.createdAt)}</Text>
                </View>
            </View>
            <View style={styles.imageContainer}>
                <Image source={{ uri: event.image }} style={styles.eventImage} resizeMode="cover" />
            </View>
            <View style={styles.content}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDescription} numberOfLines={2}>{event.description}</Text>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>📅</Text>
                        <Text style={styles.detailText}>{formatDateTurkish(event.date)}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>📍</Text>
                        <Text style={styles.detailText}>{event.location}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>🕐</Text>
                        <Text style={styles.detailText}>{event.time}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: colors.cardLight, borderRadius: borderRadius.lg, marginHorizontal: spacing.lg, marginBottom: spacing.lg, ...shadows.card },
    header: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
    logo: { width: 40, height: 40, borderRadius: borderRadius.full, backgroundColor: colors.border },
    headerText: { marginLeft: spacing.md },
    communityName: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.textPrimary },
    timeAgo: { fontSize: fontSize.sm, color: colors.accent, marginTop: 2 },
    imageContainer: { paddingHorizontal: spacing.md },
    eventImage: { width: '100%', height: 200, borderRadius: borderRadius.md, backgroundColor: colors.border },
    content: { padding: spacing.md },
    eventTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.xs },
    eventDescription: { fontSize: fontSize.md, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.md },
    detailsContainer: { gap: spacing.sm },
    detailItem: { flexDirection: 'row', alignItems: 'center' },
    detailIcon: { fontSize: 14, marginRight: spacing.sm },
    detailText: { fontSize: fontSize.md, color: colors.accent },
});
