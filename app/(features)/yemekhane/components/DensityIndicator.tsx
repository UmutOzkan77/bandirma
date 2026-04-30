/**
 * DensityIndicator Component
 * Yemekhane yoğunluk durumu göstergesi
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, densityColors, shadows } from '../theme';
import { DensityLevel } from '../mockData';

interface DensityIndicatorProps {
    level: DensityLevel;
    percentFull?: number;
    waitTime?: string;
}

const getDensityInfo = (level: DensityLevel) => {
    switch (level) {
        case 'low':
            return {
                label: 'Az Yoğun',
                color: densityColors.low,
                icon: '😊'
            };
        case 'medium':
            return {
                label: 'Orta Yoğun',
                color: densityColors.medium,
                icon: '😐'
            };
        case 'high':
            return {
                label: 'Çok Yoğun',
                color: densityColors.high,
                icon: '😓'
            };
    }
};

export default function DensityIndicator({ level, percentFull, waitTime }: DensityIndicatorProps) {
    const { label, color } = getDensityInfo(level);
    const percentLabel = `${percentFull ?? 0}%`;

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <Text style={styles.title}>ANLIK DOLULUK</Text>
                <View style={styles.statusRow}>
                    <View style={[styles.dot, { backgroundColor: color }]} />
                    <Text style={[styles.status, { color }]}>{label}</Text>
                </View>
                <Text style={styles.waitText}>{waitTime || 'Bekleme süresi ~5 dk'}</Text>
            </View>

            <View style={styles.right}>
                <View style={[styles.ring, { borderColor: `${color}30` }]}> 
                    <View style={[styles.ringFill, { borderColor: color }]} />
                    <Text style={[styles.percentText, { color }]}>{percentLabel}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.cardWhite,
        borderRadius: borderRadius.lg,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...shadows.card,
    },
    left: {
        flex: 1,
        paddingRight: spacing.md,
    },
    right: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        letterSpacing: 0.8,
        marginBottom: spacing.sm,
        fontWeight: fontWeight.semibold,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: borderRadius.full,
    },
    status: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
    },
    percentText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
    },
    waitText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },
    ring: {
        width: 58,
        height: 58,
        borderRadius: borderRadius.full,
        borderWidth: 6,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    ringFill: {
        position: 'absolute',
        top: 6,
        bottom: 6,
        left: 6,
        right: 6,
        borderRadius: borderRadius.full,
        borderWidth: 4,
        borderColor: colors.primaryAccent,
    },
});
