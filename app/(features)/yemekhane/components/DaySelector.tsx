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
    const weekdayOrder = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
    const fallbackDay = days[0] || null;
    const weekdayDays = weekdayOrder.map((name) => ({
        name,
        day: days.find((day) => day.dayName === name) || fallbackDay,
    }));

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {weekdayDays.map(({ name, day }) => {
                const isSelected = day?.id === selectedDayId;
                return (
                    <TouchableOpacity
                        key={day?.id ?? `weekday-${name}`}
                        style={[styles.dayItem, isSelected && styles.dayItemSelected]}
                        onPress={() => day && onDaySelect(day.id)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                            {name}
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
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.cardWhite,
        borderWidth: 1,
        borderColor: colors.border,
    },
    dayItemSelected: {
        backgroundColor: colors.primaryDark,
        borderColor: colors.primaryDark,
    },
    dayLabel: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
    },
    dayLabelSelected: {
        color: colors.textLight,
    },
});
