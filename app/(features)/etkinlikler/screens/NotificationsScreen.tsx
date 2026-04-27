/**
 * NotificationsScreen - Bildirimler listesi (Supabase entegrasyonlu)
 */
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { Notification } from '../types';
import { fetchNotifications } from '../services/eventService';
import NotificationCard from '../components/NotificationCard';

interface NotificationsScreenProps {
    onClose: () => void;
    onBack: () => void;
}

export default function NotificationsScreen({ onClose, onBack }: NotificationsScreenProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const data = await fetchNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Notifications load error:', error);
        } finally {
            setLoading(false);
        }
    };

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
            {loading ? (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={notifications}
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
            )}
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
