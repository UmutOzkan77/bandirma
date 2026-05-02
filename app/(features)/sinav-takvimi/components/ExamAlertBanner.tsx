/**
 * ExamAlertBanner Component
 * Sınav haftası uyarı banner'ı - "Sınav Takvimi Yayında"
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

interface ExamAlertBannerProps {
    examCount: number;
    nextExamDate: string | null;
    onPress: () => void;
}

function formatShortDate(date: string | null) {
    if (!date) {
        return 'Takvim hazirlaniyor';
    }

    return new Date(date + 'T12:00:00').toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
    });
}

export default function ExamAlertBanner({ examCount, nextExamDate, onPress }: ExamAlertBannerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>📅</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{examCount > 0 ? `${examCount} SINAV` : 'SINAV TAKVIMI'}</Text>
                </View>
                <Text style={styles.title}>Sınav Takvimi Yayında</Text>
                <Text style={styles.subtitle}>Sıradaki sınav: {formatShortDate(nextExamDate)}</Text>
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>İncele</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: spacing.lg,
        marginVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: colors.backgroundSubtle,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    icon: {
        fontSize: 24,
    },
    content: {
        flex: 1,
    },
    badge: {
        backgroundColor: colors.accent + '20',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        alignSelf: 'flex-start',
        marginBottom: spacing.xs,
    },
    badgeText: {
        fontSize: fontSize.xs,
        color: colors.accent,
        fontWeight: fontWeight.bold,
    },
    title: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    button: {
        backgroundColor: colors.accent,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        marginLeft: spacing.sm,
    },
    buttonText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.textInverse,
    },
});
