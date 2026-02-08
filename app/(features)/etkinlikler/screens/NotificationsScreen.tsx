/**
 * NotificationsScreen - Bildirimler listesi
 */
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { notifications } from '../mockData';
import NotificationCard from '../components/NotificationCard';

interface NotificationsScreenProps {
    onClose: () => void;
    onBack: () => void;
}

export default function NotificationsScreen({ onClose, onBack }: NotificationsScreenProps) {
    const recentNotifications = notifications.slice(0, 10);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.title}>BİLDİRİMLER</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                    <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={recentNotifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NotificationCard notification={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Henüz bildiriminiz bulunmuyor.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.backgroundLight },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    backIcon: { fontSize: 32, color: colors.textPrimary, fontWeight: fontWeight.bold },
    title: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, letterSpacing: 1 },
    closeButton: { width: 40, height: 40, borderRadius: borderRadius.full, backgroundColor: colors.textSecondary, justifyContent: 'center', alignItems: 'center' },
    closeIcon: { fontSize: fontSize.lg, color: colors.textWhite, fontWeight: fontWeight.bold },
    listContent: { paddingTop: spacing.md, paddingBottom: spacing.xxl },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxxl },
    emptyText: { fontSize: fontSize.md, color: colors.textSecondary },
});
