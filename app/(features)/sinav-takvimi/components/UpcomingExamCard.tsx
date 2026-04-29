import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import type { Exam } from '../utils';

interface UpcomingExamCardProps {
    exam: Exam;
    onPress?: () => void;
}

export default function UpcomingExamCard({ exam, onPress }: UpcomingExamCardProps) {
    const examDate = new Date(exam.date + 'T12:00:00');
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    
    const monthAbbr = monthNames[examDate.getMonth()];
    const dayNumber = examDate.getDate();
    const dayName = dayNames[examDate.getDay()];

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.dateBlock}>
                <Text style={styles.monthText}>{monthAbbr}</Text>
                <Text style={styles.dayNumberText}>{dayNumber}</Text>
            </View>
            <View style={styles.infoBlock}>
                <Text style={styles.dayNameText}>{dayName}</Text>
                <Text style={styles.courseNameText} numberOfLines={1}>{exam.courseName}</Text>
            </View>
            <View style={styles.chevronContainer}>
                <Text style={styles.chevron}>›</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.borderLight,
        ...shadows.card,
    },
    dateBlock: {
        width: 48,
        height: 48,
        backgroundColor: colors.backgroundSubtle,
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
        marginBottom: spacing.xs,
        letterSpacing: 0.5,
    },
    courseNameText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    chevronContainer: {
        paddingLeft: spacing.md,
    },
    chevron: {
        fontSize: 24,
        color: colors.textMuted,
        lineHeight: 24,
    },
});
