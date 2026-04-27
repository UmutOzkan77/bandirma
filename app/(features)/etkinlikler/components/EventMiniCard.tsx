/**
 * EventMiniCard Bileşeni - Günlük program için
 */
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { Event, Community } from '../types';

interface EventMiniCardProps {
    event: Event;
    community?: Community;
    onDetailsPress?: (eventId: string) => void;
}

export default function EventMiniCard({ event, community, onDetailsPress }: EventMiniCardProps) {
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
                {onDetailsPress && (
                    <TouchableOpacity style={styles.detailsButton} onPress={() => onDetailsPress(event.id)} activeOpacity={0.7}>
                        <Text style={styles.detailsButtonText}>Detayları Gör</Text>
                        <Text style={styles.arrowIcon}>›</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.cardLight,
        borderRadius: 16,
        marginHorizontal: 18,
        marginBottom: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: colors.border
    },
    content: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center'
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 6
    },
    detailsContainer: {
        gap: 4
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    detailIcon: {
        fontSize: 12,
        marginRight: 6
    },
    detailText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500'
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8
    },
    detailsButtonText: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600'
    },
    arrowIcon: {
        fontSize: 16,
        color: colors.primary,
        marginLeft: 4
    },
});
