/**
 * DaySelector Component
 * Yatay scrollable gün seçici - Stitch tasarımına göre
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';
import { DailyMenu } from '../mockData';

interface DaySelectorProps {
    days: DailyMenu[];
    selectedDayId: string;
    onDaySelect: (dayId: string) => void;
}

export default function DaySelector({ days, selectedDayId, onDaySelect }: DaySelectorProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {days.map((day) => {
                const isSelected = day.id === selectedDayId;
                return (
                    <TouchableOpacity
                        key={day.id}
                        style={[styles.dayItem, isSelected && styles.dayItemSelected]}
                        onPress={() => onDaySelect(day.id)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.dayShort, isSelected && styles.dayShortSelected]}>
                            {day.dayShort}
                        </Text>
                        <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                            {day.dayNumber}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.sm,
    },
    dayItem: {
        width: 56,
        height: 72,
        borderRadius: borderRadius.lg,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
    },
    dayItemSelected: {
        backgroundColor: colors.primaryAccent,
    },
    dayShort: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textLight,
        opacity: 0.7,
        marginBottom: spacing.xs,
    },
    dayShortSelected: {
        opacity: 1,
        color: colors.textDark,
    },
    dayNumber: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textLight,
    },
    dayNumberSelected: {
        color: colors.textDark,
    },
});
