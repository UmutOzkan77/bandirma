/**
 * ExamDetailModal Component
 * Sınav detayları popup'ı - tam işlevsel
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Switch, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { Exam, formatDate } from '../mockData';

interface ExamDetailModalProps {
    visible: boolean;
    exam: Exam | null;
    onClose: () => void;
    onNavigateToCalculator?: () => void;
}

// Örnek notlar
const sampleNotes = [
    { id: '1', title: 'Konu 1: Limitler', content: 'Limit tanımı, tek taraflı limitler, sonsuz limitler' },
    { id: '2', title: 'Konu 2: Türev', content: 'Türev tanımı, türev kuralları, zincir kuralı' },
    { id: '3', title: 'Konu 3: İntegral', content: 'Belirsiz integral, belirli integral, alan hesabı' },
];

export default function ExamDetailModal({ visible, exam, onClose, onNavigateToCalculator }: ExamDetailModalProps) {
    const [reminderEnabled, setReminderEnabled] = useState(true);
    const [showNotes, setShowNotes] = useState(false);
    const [reminderMessage, setReminderMessage] = useState('');

    if (!exam) return null;

    const getExamTypeLabel = (type: string): string => {
        const labels: Record<string, string> = {
            'vize': 'VİZE SINAVI',
            'final': 'FİNAL SINAVI',
            'bütünleme': 'BÜTÜNLEME SINAVI',
            'quiz': 'QUIZ',
        };
        return labels[type] || 'SINAV';
    };

    const handleReminderToggle = (value: boolean) => {
        setReminderEnabled(value);
        if (value) {
            setReminderMessage('✅ Hatırlatıcı ayarlandı! Sınavdan 1 gün önce bildirim alacaksınız.');
        } else {
            setReminderMessage('❌ Hatırlatıcı iptal edildi.');
        }
        // 3 saniye sonra mesajı temizle
        setTimeout(() => setReminderMessage(''), 3000);
    };

    const handleViewNotes = () => {
        setShowNotes(!showNotes);
    };

    const handleNavigateToCalculator = () => {
        onClose();
        if (onNavigateToCalculator) {
            onNavigateToCalculator();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Exam Type Badge */}
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{getExamTypeLabel(exam.examType)}</Text>
                        </View>

                        {/* Course Name */}
                        <Text style={styles.courseName}>{exam.courseName}</Text>

                        {/* Details List */}
                        <View style={styles.detailsList}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailIcon}>📅</Text>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>TARİH</Text>
                                    <Text style={styles.detailValue}>{formatDate(exam.date)}</Text>
                                </View>
                            </View>

                            <View style={styles.detailItem}>
                                <Text style={styles.detailIcon}>🕐</Text>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>SAAT</Text>
                                    <Text style={styles.detailValue}>{exam.startTime} - {exam.endTime}</Text>
                                </View>
                            </View>

                            <View style={styles.detailItem}>
                                <Text style={styles.detailIcon}>📍</Text>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>BİNA / KAT</Text>
                                    <Text style={styles.detailValue}>{exam.building}</Text>
                                </View>
                            </View>

                            <View style={styles.detailItem}>
                                <Text style={styles.detailIcon}>🚪</Text>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>SINIF</Text>
                                    <Text style={styles.detailValue}>{exam.room}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Reminder Toggle */}
                        <View style={styles.reminderRow}>
                            <View style={styles.reminderContent}>
                                <Text style={styles.reminderIcon}>🔔</Text>
                                <Text style={styles.reminderText}>Hatırlatıcı Ekle</Text>
                            </View>
                            <Switch
                                value={reminderEnabled}
                                onValueChange={handleReminderToggle}
                                trackColor={{ false: colors.border, true: colors.accent }}
                                thumbColor={colors.textPrimary}
                            />
                        </View>

                        {/* Reminder Message */}
                        {reminderMessage !== '' && (
                            <View style={styles.reminderMessageContainer}>
                                <Text style={styles.reminderMessageText}>{reminderMessage}</Text>
                            </View>
                        )}


                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>Kapat</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.backgroundModal,
        borderTopLeftRadius: borderRadius.xxl,
        borderTopRightRadius: borderRadius.xxl,
        padding: spacing.xl,
        paddingBottom: spacing.xxxl,
        maxHeight: '85%',
        ...shadows.modal,
    },
    badge: {
        backgroundColor: colors.accent + '20',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        alignSelf: 'flex-start',
        marginBottom: spacing.md,
    },
    badgeText: {
        fontSize: fontSize.xs,
        color: colors.accent,
        fontWeight: fontWeight.bold,
        letterSpacing: 1,
    },
    courseName: {
        fontSize: fontSize.title,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xl,
    },
    detailsList: {
        marginBottom: spacing.xl,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },
    detailIcon: {
        fontSize: 18,
        marginRight: spacing.md,
        marginTop: 2,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        fontWeight: fontWeight.medium,
        letterSpacing: 0.5,
        marginBottom: spacing.xs,
    },
    detailValue: {
        fontSize: fontSize.md,
        color: colors.textPrimary,
        fontWeight: fontWeight.medium,
    },
    reminderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.backgroundCard,
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    reminderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reminderIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    reminderText: {
        fontSize: fontSize.md,
        color: colors.textPrimary,
        fontWeight: fontWeight.medium,
    },
    reminderMessageContainer: {
        backgroundColor: colors.accent + '10',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
    reminderMessageText: {
        fontSize: fontSize.sm,
        color: colors.accent,
        textAlign: 'center',
    },
    viewNotesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.accent,
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
    viewNotesIcon: {
        fontSize: 16,
        marginRight: spacing.sm,
    },
    viewNotesText: {
        fontSize: fontSize.md,
        color: colors.textInverse,
        fontWeight: fontWeight.bold,
    },
    notesSection: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    notesSectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    noteCard: {
        backgroundColor: colors.backgroundSubtle,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    noteTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    noteContent: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    calculatorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondary,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginTop: spacing.md,
    },
    calculatorIcon: {
        fontSize: 16,
        marginRight: spacing.sm,
    },
    calculatorText: {
        fontSize: fontSize.sm,
        color: colors.textInverse,
        fontWeight: fontWeight.semibold,
    },
    closeButton: {
        alignItems: 'center',
        padding: spacing.md,
    },
    closeButtonText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
});
