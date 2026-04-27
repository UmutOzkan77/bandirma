import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import type { Exam, WeekDay } from '../utils';
import { timeSlots } from '../utils';

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

function findExamForSlot(exams: Exam[], date: string, time: string) {
    return exams.find((exam) => exam.date === date && exam.startTime === time) ?? null;
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
    const conflicts = exams.filter((exam) => exam.hasConflict);

    return (
        <View style={styles.container}>
            <View style={styles.weekNav}>
                <TouchableOpacity onPress={onPreviousWeek} style={styles.navArrow}>
                    <Text style={styles.navArrowText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.weekLabel}>{weekLabel}</Text>
                <TouchableOpacity onPress={onNextWeek} style={styles.navArrow}>
                    <Text style={styles.navArrowText}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.daysHeader}>
                {weekDays.map((day) => (
                    <TouchableOpacity
                        key={day.date}
                        style={[styles.dayColumn, day.date === selectedDate && styles.dayColumnSelected]}
                        onPress={() => onDayPress(day.date)}
                    >
                        <Text style={styles.dayName}>{day.dayName}</Text>
                        <View style={[styles.dayNumber, day.date === selectedDate && styles.dayNumberSelected]}>
                            <Text style={[styles.dayNumberText, day.date === selectedDate && styles.dayNumberTextSelected]}>
                                {day.dayNumber}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.gridContainer} showsVerticalScrollIndicator={false}>
                {timeSlots.map((time) => (
                    <View key={time} style={styles.timeRow}>
                        <View style={styles.timeLabel}>
                            <Text style={styles.timeLabelText}>{time}</Text>
                        </View>

                        <View style={styles.timeCells}>
                            {weekDays.map((day) => {
                                const exam = findExamForSlot(exams, day.date, time);
                                return (
                                    <View key={day.date + '-' + time} style={styles.timeCell}>
                                        {exam && (
                                            <TouchableOpacity
                                                style={[styles.examBlock, exam.hasConflict && styles.examBlockConflict]}
                                                onPress={() => onExamPress(exam)}
                                            >
                                                <Text style={styles.examCode}>{exam.courseCode}</Text>
                                                <Text style={styles.examName} numberOfLines={2}>
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

            {conflicts.length > 0 && (
                <View style={styles.conflictWarning}>
                    <Text style={styles.conflictWarningTitle}>Sinav cakismasi var</Text>
                    <Text style={styles.conflictWarningSubtitle}>
                        {conflicts[0].courseCode} ile {conflicts[0].conflictWith} ayni saat araliginda gorunuyor.
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacing.md,
    },
    weekNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    navArrow: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navArrowText: {
        fontSize: fontSize.xl,
        color: colors.textPrimary,
    },
    weekLabel: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    daysHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    dayColumn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    dayColumnSelected: {
        backgroundColor: colors.backgroundCard,
    },
    dayName: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    dayNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayNumberSelected: {
        backgroundColor: colors.accent,
    },
    dayNumberText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    dayNumberTextSelected: {
        color: colors.textInverse,
    },
    gridContainer: {
        flex: 1,
    },
    timeRow: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
        minHeight: 66,
    },
    timeLabel: {
        width: 54,
        justifyContent: 'flex-start',
        paddingTop: spacing.sm,
    },
    timeLabelText: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        fontWeight: fontWeight.bold,
    },
    timeCells: {
        flex: 1,
        flexDirection: 'row',
    },
    timeCell: {
        flex: 1,
        paddingHorizontal: 2,
    },
    examBlock: {
        minHeight: 58,
        backgroundColor: colors.examBlock,
        borderRadius: borderRadius.md,
        padding: spacing.sm,
        ...shadows.card,
    },
    examBlockConflict: {
        backgroundColor: colors.conflictBlock,
    },
    examCode: {
        fontSize: 10,
        fontWeight: fontWeight.bold,
        color: colors.examBlockText,
        marginBottom: 2,
    },
    examName: {
        fontSize: 10,
        color: colors.textPrimary,
        lineHeight: 13,
    },
    conflictWarning: {
        marginTop: spacing.md,
        backgroundColor: colors.conflictBlock,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
    },
    conflictWarningTitle: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.conflictBlockText,
        marginBottom: spacing.xs,
    },
    conflictWarningSubtitle: {
        fontSize: fontSize.sm,
        color: colors.conflictBlockText,
    },
});
