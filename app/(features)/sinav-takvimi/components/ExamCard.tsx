import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import type { Exam } from '../utils';
import { getCountdown } from '../utils';

interface ExamCardProps {
    exam: Exam;
    onPress?: () => void;
    showFullDetails?: boolean;
}

export default function ExamCard({ exam, onPress, showFullDetails = false }: ExamCardProps) {
    const [countdown, setCountdown] = useState(getCountdown(exam.date, exam.startTime));

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(getCountdown(exam.date, exam.startTime));
        }, 1000);

        return () => clearInterval(timer);
    }, [exam.date, exam.startTime]);

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
            <View style={styles.header}>
                <View style={styles.titleSection}>
                    <Text style={styles.title}>{exam.courseCode}</Text>
                    <Text style={styles.subtitle}>{exam.courseName}</Text>
                </View>
                {showFullDetails && <Text style={styles.examType}>{exam.examType.toUpperCase()}</Text>}
            </View>

            <View style={styles.locationRow}>
                <Text style={styles.locationText}>{exam.room} • {exam.building}</Text>
                {exam.hasConflict && <Text style={styles.conflictTag}>CAKISMA</Text>}
            </View>

            <View style={styles.countdownContainer}>
                {[
                    ['GUN', countdown.days],
                    ['SAAT', countdown.hours],
                    ['DK', countdown.minutes],
                    ['SN', countdown.seconds],
                ].map(([label, value]) => (
                    <View key={String(label)} style={styles.countdownItem}>
                        <View style={styles.countdownBox}>
                            <Text style={styles.countdownNumber}>{formatNumber(Number(value))}</Text>
                        </View>
                        <Text style={styles.countdownLabel}>{label}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginHorizontal: spacing.lg,
        marginVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    titleSection: {
        flex: 1,
        marginRight: spacing.md,
    },
    title: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    subtitle: {
        marginTop: spacing.xs,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    examType: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        color: colors.accent,
    },
    locationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    locationText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        flex: 1,
    },
    conflictTag: {
        fontSize: fontSize.xs,
        color: colors.error,
        fontWeight: fontWeight.bold,
    },
    countdownContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    countdownItem: {
        flex: 1,
        alignItems: 'center',
    },
    countdownBox: {
        backgroundColor: colors.backgroundSubtle,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    countdownNumber: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    countdownLabel: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        marginTop: spacing.xs,
        fontWeight: fontWeight.medium,
    },
});
