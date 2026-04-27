/**
 * DensityIndicator Component
 * Yemekhane yoğunluk durumu göstergesi
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, densityColors } from '../theme';
import { DensityLevel } from '../mockData';

interface DensityIndicatorProps {
    level: DensityLevel;
    percentFull?: number;
    lastUpdated?: string;
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

export default function DensityIndicator({ level, percentFull, lastUpdated }: DensityIndicatorProps) {
    const { label, color, icon } = getDensityInfo(level);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.label}>Şu an yemekhane:</Text>
                <View style={styles.statusContainer}>
                    <View style={[styles.dot, { backgroundColor: color }]} />
                    <Text style={[styles.status, { color }]}>{label}</Text>
                    <Text style={styles.icon}>{icon}</Text>
                </View>

                {percentFull !== undefined && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${percentFull}%`, backgroundColor: color }
                                ]}
                            />
                        </View>
                        <Text style={styles.percentText}>%{percentFull} dolu</Text>
                    </View>
                )}

                {lastUpdated && (
                    <Text style={styles.lastUpdated}>Son güncelleme: {lastUpdated}</Text>
                )}
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
    },
    content: {
        alignItems: 'center',
    },
    label: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    statusContainer: {
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
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
    },
    icon: {
        fontSize: 20,
    },
    progressContainer: {
        width: '100%',
        marginTop: spacing.md,
        alignItems: 'center',
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: colors.border,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        marginBottom: spacing.xs,
    },
    progressFill: {
        height: '100%',
        borderRadius: borderRadius.full,
    },
    percentText: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    lastUpdated: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginTop: spacing.sm,
        fontStyle: 'italic',
    },
});
