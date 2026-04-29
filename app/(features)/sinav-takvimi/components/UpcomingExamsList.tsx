import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import type { Exam } from '../utils';
import { Feather } from '@expo/vector-icons';

interface UpcomingExamsListProps {
    exams: Exam[];
    onExamPress?: (exam: Exam) => void;
}

export default function UpcomingExamsList({ exams, onExamPress }: UpcomingExamsListProps) {
    if (exams.length === 0) return null;

    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    return (
        <View style={styles.container}>
            {exams.map((exam, index) => {
                const examDate = new Date(exam.date + 'T12:00:00');
                const monthAbbr = monthNames[examDate.getMonth()];
                const dayNumber = examDate.getDate();
                const dayName = dayNames[examDate.getDay()];
                const isLast = index === exams.length - 1;

                return (
                    <View key={`${exam.courseCode}-${index}`}>
                        <TouchableOpacity 
                            style={styles.row} 
                            onPress={() => onExamPress?.(exam)} 
                            activeOpacity={0.7}
                        >
                            <View style={styles.dateBlock}>
                                <Text style={styles.monthText}>{monthAbbr}</Text>
                                <Text style={styles.dayNumberText}>{dayNumber}</Text>
                            </View>
                            <View style={styles.infoBlock}>
                                <Text style={styles.dayNameText}>{dayName}</Text>
                                <Text style={styles.courseNameText} numberOfLines={1}>{exam.courseName}</Text>
                            </View>
                            <View style={styles.chevronContainer}>
                                <Feather name="chevron-right" size={20} color={colors.textMuted} />
                            </View>
                        </TouchableOpacity>
                        {!isLast && <View style={styles.divider} />}
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.xl,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        paddingVertical: spacing.sm,
        ...shadows.card,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    dateBlock: {
        width: 48,
        height: 48,
        backgroundColor: colors.backgroundMain,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.lg,
    },
    monthText: {
        fontSize: 10,
        fontWeight: fontWeight.bold,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    dayNumberText: {
        fontSize: 16,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    infoBlock: {
        flex: 1,
        justifyContent: 'center',
    },
    dayNameText: {
        fontSize: 10,
        fontWeight: fontWeight.bold,
        color: colors.textMuted,
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    courseNameText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.primary,
    },
    chevronContainer: {
        paddingLeft: spacing.md,
    },
    divider: {
        height: 1,
        backgroundColor: colors.borderLight,
        marginHorizontal: spacing.lg,
    },
});
