/**
 * ExamCard Component
 * Sıradaki sınav kartı - geri sayım timer'ı ile
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { Exam, getCountdown } from '../mockData';

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
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{exam.courseCode} - {exam.courseName}</Text>
                {showFullDetails && (
                    <TouchableOpacity style={styles.seeAllButton}>
                        <Text style={styles.seeAllText}>Tümünü Gör</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>
                    {exam.room} - {exam.building}
                </Text>
            </View>

            <View style={styles.countdownContainer}>
                <View style={styles.countdownItem}>
                    <View style={styles.countdownBox}>
                        <Text style={styles.countdownNumber}>{formatNumber(countdown.days)}</Text>
                    </View>
                    <Text style={styles.countdownLabel}>GÜN</Text>
                </View>
                <View style={styles.countdownItem}>
                    <View style={styles.countdownBox}>
                        <Text style={styles.countdownNumber}>{formatNumber(countdown.hours)}</Text>
                    </View>
                    <Text style={styles.countdownLabel}>SAAT</Text>
                </View>
                <View style={styles.countdownItem}>
                    <View style={styles.countdownBox}>
                        <Text style={styles.countdownNumber}>{formatNumber(countdown.minutes)}</Text>
                    </View>
                    <Text style={styles.countdownLabel}>DAKİKA</Text>
                </View>
                <View style={styles.countdownItem}>
                    <View style={styles.countdownBox}>
                        <Text style={styles.countdownNumber}>{formatNumber(countdown.seconds)}</Text>
                    </View>
                    <Text style={styles.countdownLabel}>SANİYE</Text>
                </View>
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
    title: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        flex: 1,
    },
    seeAllButton: {
        marginLeft: spacing.sm,
    },
    seeAllText: {
        fontSize: fontSize.sm,
        color: colors.accent,
        fontWeight: fontWeight.medium,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    locationIcon: {
        fontSize: 14,
        marginRight: spacing.xs,
    },
    locationText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
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
        paddingHorizontal: spacing.sm,
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
