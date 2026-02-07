/**
 * LunchBreak Bileşeni
 * Öğle arası göstergesi
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../theme';

interface LunchBreakProps {
    startTime: string;
    endTime: string;
}

export default function LunchBreak({ startTime, endTime }: LunchBreakProps) {
    return (
        <View style={styles.container}>
            {/* Timeline Section */}
            <View style={styles.timelineSection}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineLine} />
            </View>

            {/* Lunch Break Card */}
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>🍽️</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.title}>ÖĞLE ARASI</Text>
                    <Text style={styles.time}>{startTime} - {endTime}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    timelineSection: {
        width: 32,
        alignItems: 'center',
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.lunchBreak,
        zIndex: 1,
    },
    timelineLine: {
        flex: 1,
        width: 2,
        backgroundColor: colors.timelineGray,
        marginTop: -1,
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lunchBreakBackground,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        paddingVertical: spacing.lg,
        marginLeft: spacing.md,
        borderWidth: 1,
        borderColor: colors.lunchBreak,
    },
    iconContainer: {
        marginRight: spacing.md,
    },
    icon: {
        fontSize: 28,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.lunchBreak,
        marginBottom: 4,
    },
    time: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
});
