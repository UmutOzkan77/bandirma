/**
 * EventMiniCard Bileşeni - Günlük program için
 */
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { Event } from '../types';

interface EventMiniCardProps {
    event: Event;
    onDetailsPress: (eventId: string) => void;
}

export default function EventMiniCard({ event, onDetailsPress }: EventMiniCardProps) {
    const timeDisplay = event.endTime ? `${event.time} - ${event.endTime}` : event.time;

    return (
        <View style={styles.container}>
            <Image source={{ uri: event.image }} style={styles.image} resizeMode="cover" />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>📍</Text>
                        <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>🕐</Text>
                        <Text style={styles.detailText}>{timeDisplay}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.detailsButton} onPress={() => onDetailsPress(event.id)} activeOpacity={0.7}>
                    <Text style={styles.detailsButtonText}>Detayları Gör</Text>
                    <Text style={styles.arrowIcon}>›</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', backgroundColor: colors.cardLight, borderRadius: borderRadius.lg, marginHorizontal: spacing.lg, marginBottom: spacing.md, padding: spacing.md, ...shadows.card },
    image: { width: 80, height: 100, borderRadius: borderRadius.sm, backgroundColor: colors.border },
    content: { flex: 1, marginLeft: spacing.md, justifyContent: 'space-between' },
    title: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.xs },
    detailsContainer: { gap: spacing.xs },
    detailItem: { flexDirection: 'row', alignItems: 'center' },
    detailIcon: { fontSize: 12, marginRight: spacing.xs },
    detailText: { fontSize: fontSize.sm, color: colors.accent, flex: 1 },
    detailsButton: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
    detailsButtonText: { fontSize: fontSize.md, color: colors.accent, fontWeight: fontWeight.medium },
    arrowIcon: { fontSize: fontSize.lg, color: colors.accent, marginLeft: spacing.xs },
});
