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
    const toIsoDate = (value: string) => {
        if (value.includes('.')) {
            const [dd, mm, yyyy] = value.split('.').map((part) => Number(part));
            if (!Number.isNaN(dd) && !Number.isNaN(mm) && !Number.isNaN(yyyy)) {
                const month = String(mm).padStart(2, '0');
                const day = String(dd).padStart(2, '0');
                return `${yyyy}-${month}-${day}`;
            }
        }

        if (value.includes('-')) {
            return value.slice(0, 10);
        }

        return '';
    };

    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek);

    const menuByDate = new Map(days.map((day) => [toIsoDate(day.date), day]));
    const weekdayDays = Array.from({ length: 5 }, (_, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        const iso = date.toISOString().slice(0, 10);
        return menuByDate.get(iso);
    }).filter(Boolean) as DailyMenu[];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {weekdayDays.map((day) => {
                const isSelected = day.id === selectedDayId;
                return (
                    <TouchableOpacity
                        key={day.id}
                        style={[styles.dayItem, isSelected && styles.dayItemSelected]}
                        onPress={() => onDaySelect(day.id)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                            {day.dayName}
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
