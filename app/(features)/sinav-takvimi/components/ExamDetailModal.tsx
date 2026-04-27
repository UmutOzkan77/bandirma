import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Switch, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import type { Exam } from '../utils';
import { formatDate } from '../utils';

interface ExamDetailModalProps {
    visible: boolean;
    exam: Exam | null;
    onClose: () => void;
    onNavigateToCalculator?: () => void;
}

export default function ExamDetailModal({ visible, exam, onClose, onNavigateToCalculator }: ExamDetailModalProps) {
    const [reminderEnabled, setReminderEnabled] = useState(true);

    if (!exam) {
        return null;
    }

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{exam.examType.toUpperCase()}</Text>
                        </View>

                        <Text style={styles.courseName}>{exam.courseName}</Text>
                        <Text style={styles.courseCode}>{exam.courseCode}</Text>

                        <View style={styles.detailsList}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Tarih</Text>
                                <Text style={styles.detailValue}>{formatDate(exam.date)}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Saat</Text>
                                <Text style={styles.detailValue}>{exam.startTime} - {exam.endTime}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Bina</Text>
                                <Text style={styles.detailValue}>{exam.building}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Salon</Text>
                                <Text style={styles.detailValue}>{exam.room}</Text>
                            </View>
                            {exam.hasConflict && (
                                <View style={styles.conflictCard}>
                                    <Text style={styles.conflictTitle}>Cakisma uyarisi</Text>
                                    <Text style={styles.conflictText}>
                                        Bu saat diliminde {exam.conflictWith} ile cakisan bir baska sinav var.
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.reminderRow}>
                            <View>
                                <Text style={styles.reminderTitle}>Hatirlatici</Text>
                                <Text style={styles.reminderSubtitle}>Sinavdan bir gun once bildirim al.</Text>
                            </View>
                            <Switch
                                value={reminderEnabled}
                                onValueChange={setReminderEnabled}
                                trackColor={{ false: colors.border, true: colors.accent }}
                                thumbColor={colors.textPrimary}
                            />
                        </View>

                        {onNavigateToCalculator && (
                            <TouchableOpacity style={styles.secondaryButton} onPress={onNavigateToCalculator}>
                                <Text style={styles.secondaryButtonText}>Puan Hesaplayiciya Git</Text>
                            </TouchableOpacity>
                        )}

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
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
        alignSelf: 'flex-start',
        backgroundColor: colors.accent + '20',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        marginBottom: spacing.md,
    },
    badgeText: {
        fontSize: fontSize.xs,
        color: colors.accent,
        fontWeight: fontWeight.bold,
    },
    courseName: {
        fontSize: fontSize.title,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    courseCode: {
        marginTop: spacing.xs,
        fontSize: fontSize.md,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
    },
    detailsList: {
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    detailItem: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    detailLabel: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        fontWeight: fontWeight.bold,
        marginBottom: spacing.xs,
    },
    detailValue: {
        fontSize: fontSize.md,
        color: colors.textPrimary,
        fontWeight: fontWeight.medium,
    },
    conflictCard: {
        backgroundColor: colors.conflictBlock,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
    },
    conflictTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.conflictBlockText,
        marginBottom: spacing.xs,
    },
    conflictText: {
        fontSize: fontSize.sm,
        color: colors.conflictBlockText,
        lineHeight: 20,
    },
    reminderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
    },
    reminderTitle: {
        fontSize: fontSize.md,
        color: colors.textPrimary,
        fontWeight: fontWeight.bold,
    },
    reminderSubtitle: {
        marginTop: spacing.xs,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    secondaryButton: {
        backgroundColor: colors.backgroundSubtle,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.lg,
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    secondaryButtonText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.accent,
    },
    closeButton: {
        backgroundColor: colors.accent,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.lg,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.textInverse,
    },
});
