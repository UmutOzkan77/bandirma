import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import type { Exam } from '../utils';
import { Feather } from '@expo/vector-icons';

interface TodayExamCardProps {
    exam: Exam;
    onPress?: () => void;
}

export default function TodayExamCard({ exam, onPress }: TodayExamCardProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.courseName} numberOfLines={1}>{exam.courseName}</Text>
                    <View style={styles.examTypeBadge}>
                        <Text style={styles.examTypeText}>{exam.examType.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.instructorRow}>
                    <Feather name="user" size={12} color={colors.textSecondary} style={styles.instructorIcon} />
                    <Text style={styles.instructorText} numberOfLines={1}>
                        {exam.instructor || 'Öğretim Görevlisi Atanmadı'}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.footerRow}>
                    <View style={styles.infoItem}>
                        <Feather name="clock" size={14} color={colors.textSecondary} style={styles.iconText} />
                        <Text style={styles.infoText}>{exam.startTime} - {exam.endTime}</Text>
                    </View>
                    
                    <View style={styles.infoItem}>
                        <Feather name="map-pin" size={14} color={colors.textSecondary} style={styles.iconText} />
                        <Text style={styles.infoText}>{exam.room}</Text>
                    </View>

                    <View style={styles.chevronContainer}>
                        <Feather name="chevron-right" size={20} color={colors.textMuted} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        ...shadows.card,
    },
    contentContainer: {
        padding: spacing.xl,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    courseName: {
        flex: 1,
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.primary,
        marginRight: spacing.sm,
    },
    examTypeBadge: {
        backgroundColor: colors.examBlock,
        paddingHorizontal: spacing.lg,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
    },
    examTypeText: {
        fontSize: 10,
        fontWeight: fontWeight.bold,
        color: colors.primary,
        letterSpacing: 0.5,
    },
    instructorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    instructorIcon: {
        marginRight: spacing.xs,
    },
    instructorText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: colors.borderLight,
        marginBottom: spacing.md,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.lg,
    },
    iconText: {
        marginRight: spacing.xs,
    },
    infoText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
    },
    chevronContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
});
