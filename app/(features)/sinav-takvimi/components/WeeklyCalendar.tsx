/**
 * WeeklyCalendar Component
 * Haftalık/Aylık sınav takvimi görünümü - tam işlevsel
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { Exam, WeekDay, timeSlots } from '../mockData';

type ViewMode = 'weekly' | 'monthly';

interface WeeklyCalendarProps {
    weekDays: WeekDay[];
    exams: Exam[];
    selectedDate: string;
    onDayPress: (date: string) => void;
    onExamPress: (exam: Exam) => void;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    weekLabel: string;
}

export default function WeeklyCalendar({
    weekDays,
    exams,
    selectedDate,
    onDayPress,
    onExamPress,
    onPreviousWeek,
    onNextWeek,
    weekLabel,
}: WeeklyCalendarProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('weekly');
    const [showViewPicker, setShowViewPicker] = useState(false);
    const [showConflictModal, setShowConflictModal] = useState(false);
    const [conflictResolved, setConflictResolved] = useState(false);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [showExamModal, setShowExamModal] = useState(false);

    // Belirli bir gün ve saat için sınav var mı kontrol et
    const getExamForSlot = (date: string, time: string): Exam | null => {
        // Önce çakışan sınavı bul
        const conflictExam = exams.find(exam =>
            exam.date === date && exam.startTime === time && exam.hasConflict
        );
        // Çakışan sınav varsa onu göster (kırmızı renkte)
        if (conflictExam) {
            return conflictExam;
        }
        // Yoksa normal sınavı göster
        return exams.find(exam =>
            exam.date === date && exam.startTime === time
        ) || null;
    };

    const handleViewToggle = () => {
        setShowViewPicker(!showViewPicker);
    };

    const selectViewMode = (mode: ViewMode) => {
        setViewMode(mode);
        setShowViewPicker(false);
    };

    const handleResolveConflict = () => {
        setShowConflictModal(true);
    };

    const resolveConflict = (action: 'reschedule' | 'cancel' | 'keep') => {
        if (action === 'reschedule' || action === 'cancel') {
            setConflictResolved(true);
        }
        setShowConflictModal(false);
    };

    // Çakışan sınavları bul
    const conflictingExams = exams.filter(e => e.hasConflict);
    const hasConflicts = conflictingExams.length > 0 && !conflictResolved;

    return (
        <View style={styles.container}>
            {/* Week Navigation */}
            <View style={styles.weekNav}>
                <TouchableOpacity onPress={onPreviousWeek} style={styles.navArrow}>
                    <Text style={styles.navArrowText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.weekLabel}>{weekLabel}</Text>
                <TouchableOpacity onPress={onNextWeek} style={styles.navArrow}>
                    <Text style={styles.navArrowText}>›</Text>
                </TouchableOpacity>
            </View>

            {/* Days Header */}
            <View style={styles.daysHeader}>
                {weekDays.slice(0, viewMode === 'weekly' ? 7 : 5).map((day) => (
                    <TouchableOpacity
                        key={day.date}
                        style={[
                            styles.dayColumn,
                            day.date === selectedDate && styles.dayColumnSelected
                        ]}
                        onPress={() => onDayPress(day.date)}
                    >
                        <Text style={styles.dayName}>{day.dayName}</Text>
                        <View style={[
                            styles.dayNumber,
                            day.date === selectedDate && styles.dayNumberSelected
                        ]}>
                            <Text style={[
                                styles.dayNumberText,
                                day.date === selectedDate && styles.dayNumberTextSelected
                            ]}>
                                {day.dayNumber}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Time Grid */}
            <ScrollView style={styles.gridContainer} showsVerticalScrollIndicator={false}>
                {timeSlots.map((time) => (
                    <View key={time} style={styles.timeRow}>
                        <View style={styles.timeLabel}>
                            <Text style={styles.timeLabelText}>{time}</Text>
                        </View>
                        <View style={styles.timeCells}>
                            {weekDays.slice(0, viewMode === 'weekly' ? 7 : 5).map((day) => {
                                const exam = getExamForSlot(day.date, time);
                                return (
                                    <View key={`${day.date}-${time}`} style={styles.timeCell}>
                                        {exam && (
                                            <TouchableOpacity
                                                style={[
                                                    styles.examBlock,
                                                    exam.hasConflict && styles.examBlockConflict
                                                ]}
                                                onPress={() => {
                                                    setSelectedExam(exam);
                                                    setShowExamModal(true);
                                                }}
                                            >
                                                {exam.hasConflict && !conflictResolved && (
                                                    <View style={styles.conflictBadge}>
                                                        <Text style={styles.conflictIcon}>⚠️</Text>
                                                        <Text style={styles.conflictText}>ÇAKIŞMA</Text>
                                                    </View>
                                                )}
                                                <Text style={styles.examCode} numberOfLines={2} ellipsizeMode="tail">
                                                    {exam.courseName}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Conflict Warning */}
            {hasConflicts && (
                <View style={styles.conflictWarning}>
                    <Text style={styles.conflictWarningIcon}>⚠️</Text>
                    <View style={styles.conflictWarningContent}>
                        <Text style={styles.conflictWarningTitle}>Sınav Çakışması (PZT 09:00)</Text>
                        <Text style={styles.conflictWarningSubtitle}>
                            MAT101 ve {conflictingExams[0]?.courseCode} aynı saatte
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.conflictActionButton} onPress={handleResolveConflict}>
                        <Text style={styles.conflictActionText}>Uyarı</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Conflict Resolution Modal - Sadece uyarı */}
            <Modal
                visible={showConflictModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowConflictModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalWarningIcon}>⚠️</Text>
                        <Text style={styles.modalTitle}>Sınav Çakışması Uyarısı</Text>
                        <Text style={styles.modalDescription}>
                            Aşağıdaki sınavlarınız aynı tarih ve saatte planlanmıştır:
                        </Text>

                        <View style={styles.conflictExamsList}>
                            <View style={styles.conflictExamItem}>
                                <Text style={styles.conflictExamCode}>📚 MAT101</Text>
                                <Text style={styles.conflictExamName}>Matematik I</Text>
                            </View>
                            <View style={styles.conflictDivider}>
                                <Text style={styles.conflictDividerText}>ile</Text>
                            </View>
                            <View style={styles.conflictExamItem}>
                                <Text style={styles.conflictExamCode}>📚 {conflictingExams[0]?.courseCode || 'CEZA201'}</Text>
                                <Text style={styles.conflictExamName}>{conflictingExams[0]?.courseName || 'Ceza Hukuku'}</Text>
                            </View>
                        </View>

                        <View style={styles.conflictInfoBox}>
                            <Text style={styles.conflictInfoIcon}>ℹ️</Text>
                            <Text style={styles.conflictInfoText}>
                                Lütfen öğrenci işleri ile iletişime geçerek mazeret sınavı talebinde bulunun.
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => {
                                setConflictResolved(true);
                                setShowConflictModal(false);
                            }}
                        >
                            <Text style={styles.modalCloseButtonText}>Tamam, Anladım</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* Exam Details Modal */}
            <Modal
                visible={showExamModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowExamModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedExam && (
                            <>
                                <View style={styles.examDetailHeader}>
                                    <Text style={styles.examDetailTitle}>Sınav Detayları</Text>
                                    <TouchableOpacity onPress={() => setShowExamModal(false)}>
                                        <Text style={styles.closeIcon}>✕</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* First Exam */}
                                <View style={styles.examDetailCard}>
                                    <View style={styles.examDetailRow}>
                                        <Text style={styles.detailLabel}>Ders:</Text>
                                        <Text style={styles.detailValue}>{selectedExam.courseName}</Text>
                                    </View>
                                    <View style={styles.examDetailRow}>
                                        <Text style={styles.detailLabel}>Kodu:</Text>
                                        <Text style={styles.detailValue}>{selectedExam.courseCode}</Text>
                                    </View>
                                    <View style={styles.examDetailRow}>
                                        <Text style={styles.detailLabel}>Yer:</Text>
                                        <Text style={styles.detailValue}>{selectedExam.building}</Text>
                                    </View>
                                    <View style={styles.examDetailRow}>
                                        <Text style={styles.detailLabel}>Saat:</Text>
                                        <Text style={styles.detailValue}>{selectedExam.startTime} - {selectedExam.endTime}</Text>
                                    </View>
                                </View>

                                {/* Second Exam (If Conflict) */}
                                {selectedExam.hasConflict && (
                                    <>
                                        <View style={styles.conflictDivider}>
                                            <Text style={styles.conflictDividerText}>⚠️ ÇAKIŞMA ⚠️</Text>
                                        </View>
                                        <View style={[styles.examDetailCard, styles.conflictCard]}>
                                            <View style={styles.examDetailRow}>
                                                <Text style={styles.detailLabel}>Ders:</Text>
                                                <Text style={styles.detailValue}>Matematik I</Text>
                                            </View>
                                            <View style={styles.examDetailRow}>
                                                <Text style={styles.detailLabel}>Kodu:</Text>
                                                <Text style={styles.detailValue}>MAT101</Text>
                                            </View>
                                            <View style={styles.examDetailRow}>
                                                <Text style={styles.detailLabel}>Yer:</Text>
                                                <Text style={styles.detailValue}>Mühendislik Fakültesi</Text>
                                            </View>
                                            <View style={styles.examDetailRow}>
                                                <Text style={styles.detailLabel}>Saat:</Text>
                                                <Text style={styles.detailValue}>09:00 - 10:30</Text>
                                            </View>
                                        </View>
                                    </>
                                )}

                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setShowExamModal(false)}
                                >
                                    <Text style={styles.modalCloseButtonText}>Kapat</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundMain,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    viewToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    viewToggleText: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginRight: spacing.sm,
    },
    toggleIcon: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    viewPickerContainer: {
        backgroundColor: colors.backgroundCard,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    viewOption: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    viewOptionActive: {
        backgroundColor: colors.accent + '10',
    },
    viewOptionText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    viewOptionTextActive: {
        color: colors.accent,
        fontWeight: fontWeight.semibold,
    },
    weekNav: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    navArrow: {
        padding: spacing.sm,
    },
    navArrowText: {
        fontSize: 18,
        color: colors.textPrimary,
        fontWeight: fontWeight.bold,
    },
    weekLabel: {
        fontSize: fontSize.md,
        color: colors.textPrimary,
        fontWeight: fontWeight.medium,
        marginHorizontal: spacing.lg,
    },
    daysHeader: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingLeft: 60,
        marginBottom: spacing.sm,
    },
    dayColumn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    dayColumnSelected: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
    },
    dayName: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        marginBottom: spacing.xs,
    },
    dayNumber: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayNumberSelected: {
        backgroundColor: colors.accent,
    },
    dayNumberText: {
        fontSize: fontSize.md,
        color: colors.textPrimary,
        fontWeight: fontWeight.semibold,
    },
    dayNumberTextSelected: {
        color: colors.textInverse,
    },
    gridContainer: {
        flex: 1,
        paddingHorizontal: spacing.md,
    },
    timeRow: {
        flexDirection: 'row',
        height: 50,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    timeLabel: {
        width: 50,
        justifyContent: 'flex-start',
        paddingTop: spacing.xs,
    },
    timeLabelText: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
    },
    timeCells: {
        flex: 1,
        flexDirection: 'row',
    },
    timeCell: {
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: colors.border,
        padding: 2,
    },
    examBlock: {
        flex: 1,
        backgroundColor: colors.examBlock,
        borderRadius: borderRadius.sm,
        padding: spacing.xs,
        justifyContent: 'center',
        alignItems: 'center',
    },
    examBlockConflict: {
        backgroundColor: colors.conflictBlock,
    },
    conflictBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    conflictIcon: {
        fontSize: 10,
        marginRight: 2,
    },
    conflictText: {
        fontSize: 8,
        color: colors.conflictBlockText,
        fontWeight: fontWeight.bold,
    },
    examCode: {
        fontSize: 10,
        color: colors.examBlockText,
        fontWeight: fontWeight.semibold,
        textAlign: 'center',
    },
    conflictWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.error + '10',
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.error + '40',
    },
    conflictWarningIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    conflictWarningContent: {
        flex: 1,
    },
    conflictWarningTitle: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
    },
    conflictWarningSubtitle: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    conflictActionButton: {
        backgroundColor: colors.error,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    conflictActionText: {
        fontSize: fontSize.sm,
        color: colors.textInverse,
        fontWeight: fontWeight.semibold,
    },
    resolvedMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.success + '20',
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        padding: spacing.md,
        borderRadius: borderRadius.md,
    },
    resolvedIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    resolvedText: {
        fontSize: fontSize.sm,
        color: colors.success,
        fontWeight: fontWeight.medium,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modalContent: {
        backgroundColor: colors.backgroundModal,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        width: '100%',
        maxWidth: 400,
        ...shadows.modal,
    },
    modalTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    modalDescription: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 22,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalOptionIcon: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    modalOptionContent: {
        flex: 1,
    },
    modalOptionTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    modalOptionSubtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    modalOptionCancel: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalCancelText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        width: '100%',
    },
    // Yeni çakışma uyarı modal stilleri
    modalWarningIcon: {
        fontSize: 48,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    conflictExamsList: {
        backgroundColor: colors.backgroundSubtle,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    conflictExamItem: {
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    conflictExamCode: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.accent,
        marginBottom: spacing.xs,
    },
    conflictExamName: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    conflictDivider: {
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    conflictDividerText: {
        fontSize: fontSize.sm,
        color: colors.textMuted,
        fontStyle: 'italic',
    },
    conflictInfoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.warning + '10',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
    },
    conflictInfoIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    conflictInfoText: {
        flex: 1,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    modalCloseButton: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        ...shadows.button,
    },
    modalCloseButtonText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.textInverse,
    },
    examDetailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    examDetailTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    closeIcon: {
        fontSize: fontSize.lg,
        color: colors.textSecondary,
        padding: spacing.xs,
    },
    examDetailCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    examDetailRow: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
    },
    detailLabel: {
        width: 60,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    detailValue: {
        flex: 1,
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        fontWeight: fontWeight.semibold,
    },
    conflictCard: {
        backgroundColor: colors.conflictBlock + '20',
        borderWidth: 1,
        borderColor: colors.conflictBlock,
    },
});
