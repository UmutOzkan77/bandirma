/**
 * DaySelector Bileşeni
 * Yatay kaydırılabilir gün seçici
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../theme';

interface DayInfo {
    dayNumber: number;
    dayAbbr: string;
    date: Date;
    isSelected: boolean;
}

interface DaySelectorProps {
    days: DayInfo[];
    onDaySelect: (date: Date) => void;
}

export default function DaySelector({ days, onDaySelect }: DaySelectorProps) {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {days.map((day, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dayItem,
                            day.isSelected && styles.dayItemSelected,
                        ]}
                        onPress={() => onDaySelect(day.date)}
                    >
                        <Text
                            style={[
                                styles.dayAbbr,
                                day.isSelected && styles.dayAbbrSelected,
                            ]}
                        >
                            {day.dayAbbr}
                        </Text>
                        <Text
                            style={[
                                styles.dayNumber,
                                day.isSelected && styles.dayNumberSelected,
                            ]}
                        >
                            {day.dayNumber}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        paddingVertical: spacing.sm,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
    },
    dayItem: {
        width: 48,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.md,
        backgroundColor: 'transparent',
    },
    dayItemSelected: {
        backgroundColor: colors.primary,
    },
    dayAbbr: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    dayAbbrSelected: {
        color: colors.textLight,
    },
    dayNumber: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    dayNumberSelected: {
        color: colors.textLight,
    },
});
