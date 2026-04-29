import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import type { Exam } from '../utils';
import { formatDate } from '../utils';
import { Feather } from '@expo/vector-icons';

interface ExamDetailModalProps {
    visible: boolean;
    exam: Exam | null;
    onClose: () => void;
    onNavigateToCalculator?: () => void; // Keep prop signature but ignore usage as requested
}

export default function ExamDetailModal({ visible, exam, onClose }: ExamDetailModalProps) {
    if (!exam) {
        return null;
    }

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <TouchableOpacity 
                style={styles.overlay} 
                activeOpacity={1} 
                onPress={onClose}
            >
                <TouchableOpacity 
                    activeOpacity={1} 
                    style={styles.card}
                    onPress={(e) => e.stopPropagation()} // Prevent closing when clicking inside card
                >
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{exam.examType.toUpperCase()}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                            <Feather name="x" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Title */}
                    <Text style={styles.courseName} numberOfLines={2}>{exam.courseName}</Text>
                    <Text style={styles.courseCode}>{exam.courseCode}</Text>

                    {/* Info Grid */}
                    <View style={styles.infoGrid}>
                        <View style={styles.infoCol}>
                            <View style={styles.infoRow}>
                                <Feather name="calendar" size={14} color={colors.accent} />
                                <Text style={styles.infoText}>{formatDate(exam.date)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Feather name="clock" size={14} color={colors.accent} />
                                <Text style={styles.infoText}>{exam.startTime} - {exam.endTime}</Text>
                            </View>
                        </View>
                        <View style={styles.infoCol}>
                            <View style={styles.infoRow}>
                                <Feather name="map" size={14} color={colors.accent} />
                                <Text style={styles.infoText} numberOfLines={1}>{exam.building}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Feather name="map-pin" size={14} color={colors.accent} />
                                <Text style={styles.infoText} numberOfLines={1}>Derslik: {exam.room}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Conflict Warning */}
                    {exam.hasConflict && (
                        <View style={styles.conflictCard}>
                            <Feather name="alert-triangle" size={16} color={colors.conflictBlockText} />
                            <Text style={styles.conflictText}>
                                Çakışma: {exam.conflictWith}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 44, 89, 0.4)', // Temaya uygun koyu lacivert yari saydam arka plan
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        ...shadows.card,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    badge: {
        backgroundColor: '#EFF6FF', // Soft blue
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    badgeText: {
        fontSize: fontSize.xs,
        color: colors.accent,
        fontWeight: fontWeight.bold,
    },
    closeIcon: {
        padding: 4,
        marginTop: -4,
        marginRight: -4,
    },
    courseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F2C59', // Lacivert tema
        marginBottom: 2,
    },
    courseCode: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    infoCol: {
        flex: 1,
        gap: spacing.sm,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    infoText: {
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    conflictCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2', // Red warning bg
        borderRadius: borderRadius.sm,
        padding: spacing.sm,
        marginTop: spacing.md,
        borderWidth: 1,
        borderColor: '#FECACA',
        gap: spacing.sm,
    },
    conflictText: {
        flex: 1,
        fontSize: fontSize.xs,
        color: '#DC2626',
        fontWeight: '600',
    },
});
