import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { Event, Community } from '../types';
import { formatDateTurkish } from '../mockData';

interface EventDetailScreenProps {
    event: Event;
    community: Community;
    isParticipated: boolean;
    onParticipationToggle: (participate: boolean) => void;
    onClose: () => void;
    onOpenCalendar: () => void;
}

export default function EventDetailScreen({
    event,
    community,
    isParticipated,
    onParticipationToggle,
    onClose,
    onOpenCalendar,
}: EventDetailScreenProps) {
    const [isJoinModalVisible, setIsJoinModalVisible] = React.useState(false);

    const handleJoinPress = () => {
        onParticipationToggle(true);
        setIsJoinModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backButton} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Etkinlik Detayı</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.infoCard}>
                    <Image source={{ uri: event.image }} style={styles.image} resizeMode="cover" />
                    <Text style={styles.communityName}>{community.name}</Text>
                    <Text style={styles.title}>{event.title}</Text>
                    <Text style={styles.eventDescription} numberOfLines={3}>{event.description}</Text>

                    <View style={styles.metaGroup}>
                        <View style={styles.metaRow}>
                            <Ionicons name="calendar-outline" size={15} color={colors.primary} />
                            <Text style={styles.metaText}>{formatDateTurkish(event.date)}</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Ionicons name="time-outline" size={15} color={colors.primary} />
                            <Text style={styles.metaText}>{event.time}</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Ionicons name="location-outline" size={15} color={colors.primary} />
                            <Text style={styles.metaText}>{event.location}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.primaryButton, isParticipated && styles.primaryButtonActive]}
                        onPress={handleJoinPress}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.primaryButtonText}>
                            {isParticipated ? 'Katılacağım (Seçili)' : 'Katılacağım'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal visible={isJoinModalVisible} transparent animationType="fade" onRequestClose={() => setIsJoinModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Katılım Başarılı</Text>
                        <Text style={styles.modalText}>Katılımınız için teşekkürler. Etkinlik takviminize eklendi.</Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalSecondaryButton}
                                onPress={() => setIsJoinModalVisible(false)}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.modalSecondaryText}>Tamam</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalPrimaryButton}
                                onPress={() => {
                                    setIsJoinModalVisible(false);
                                    onOpenCalendar();
                                }}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.modalPrimaryText}>Takvime Git</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cardLight,
    },
    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    headerSpacer: {
        width: 36,
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxxl,
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.border,
        marginBottom: spacing.md,
    },
    infoCard: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.cardLight,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        width: '88%',
        maxWidth: 520,
        alignSelf: 'center',
    },
    communityName: {
        fontSize: fontSize.sm,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: fontSize.lg,
        color: colors.textPrimary,
        fontWeight: fontWeight.bold,
        marginBottom: 2,
    },
    eventDescription: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 22,
        marginBottom: spacing.md,
    },
    metaGroup: {
        gap: 2,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 18,
    },
    metaText: {
        marginLeft: 8,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.semibold,
    },
    actions: {
        gap: spacing.sm,
        marginBottom: spacing.md,
        width: '88%',
        maxWidth: 520,
        alignSelf: 'center',
    },
    primaryButton: {
        height: 48,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonActive: {
        backgroundColor: '#0F7A34',
        borderColor: '#0F7A34',
    },
    primaryButtonText: {
        color: colors.textWhite,
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
    },
    modalCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
    },
    modalTitle: {
        fontSize: fontSize.xl,
        color: colors.textPrimary,
        fontWeight: fontWeight.bold,
        marginBottom: spacing.xs,
    },
    modalText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        lineHeight: 20,
        marginBottom: spacing.lg,
    },
    modalActions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    modalSecondaryButton: {
        flex: 1,
        height: 42,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalSecondaryText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.semibold,
    },
    modalPrimaryButton: {
        flex: 1,
        height: 42,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalPrimaryText: {
        fontSize: fontSize.sm,
        color: '#FFFFFF',
        fontWeight: fontWeight.semibold,
    },
});
