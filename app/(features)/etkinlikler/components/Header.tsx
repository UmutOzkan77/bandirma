/**
 * Header Bileşeni
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';

interface HeaderProps {
    onNotificationsPress: () => void;
    onCalendarPress: () => void;
    unreadCount?: number;
}

export default function Header({ onNotificationsPress, onCalendarPress, unreadCount = 0 }: HeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>TOPLULUK ETKİNLİKLERİ</Text>
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={onNotificationsPress} activeOpacity={0.7}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.iconText}>🔔</Text>
                    </View>
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={onCalendarPress} activeOpacity={0.7}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.iconText}>📅</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.backgroundLight },
    title: { fontSize: fontSize.title, fontWeight: fontWeight.bold, color: colors.textPrimary, letterSpacing: 0.5 },
    iconContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    iconButton: { position: 'relative' },
    iconCircle: { width: 44, height: 44, borderRadius: borderRadius.full, backgroundColor: colors.cardLight, justifyContent: 'center', alignItems: 'center' },
    iconText: { fontSize: 20 },
    badge: { position: 'absolute', top: -2, right: -2, backgroundColor: colors.notificationRed, borderRadius: borderRadius.full, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
    badgeText: { color: colors.textWhite, fontSize: fontSize.xs, fontWeight: fontWeight.bold },
});
