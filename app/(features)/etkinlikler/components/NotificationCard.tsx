/**
 * NotificationCard Bileşeni
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows, notificationTypeColors } from '../theme';
import { Notification, NotificationType } from '../types';
import { getTimeAgo } from '../mockData';

interface NotificationCardProps {
    notification: Notification;
}

const getNotificationIcon = (type: NotificationType): string => {
    switch (type) {
        case 'timeChange': return '🕐';
        case 'dateChange': return '📅';
        case 'cancelled': return '❌';
        case 'newEvent': return '⭐';
        case 'locationChange': return '📍';
        case 'reminder': return '⏰';
        default: return '📢';
    }
};

export default function NotificationCard({ notification }: NotificationCardProps) {
    const icon = getNotificationIcon(notification.type);
    const iconColor = notificationTypeColors[notification.type];

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
                <Text style={styles.icon}>{icon}</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={1}>{notification.title}</Text>
                    <Text style={styles.timeAgo}>{getTimeAgo(notification.createdAt)}</Text>
                </View>
                <Text style={styles.description} numberOfLines={2}>{notification.description}</Text>
            </View>
            {!notification.isRead && <View style={styles.unreadDot} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardLight, borderRadius: borderRadius.lg, marginHorizontal: spacing.lg, marginBottom: spacing.md, padding: spacing.md, ...shadows.card },
    iconContainer: { width: 48, height: 48, borderRadius: borderRadius.full, justifyContent: 'center', alignItems: 'center' },
    icon: { fontSize: 22 },
    content: { flex: 1, marginLeft: spacing.md },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs },
    title: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
    timeAgo: { fontSize: fontSize.sm, color: colors.textSecondary },
    description: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 18 },
    unreadDot: { width: 8, height: 8, borderRadius: borderRadius.full, backgroundColor: colors.unreadDot, marginLeft: spacing.sm },
});
