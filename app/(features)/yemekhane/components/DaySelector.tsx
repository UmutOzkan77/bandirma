/**
 * DaySelector Component
 * Yatay scrollable gün seçici - Stitch tasarımına göre
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';
import { DailyMenu, turkishMonths } from '../mockData';

interface DaySelectorProps {
    days: DailyMenu[];
    selectedDayId: string;
    onDaySelect: (dayId: string) => void;
}

export default function DaySelector({ days, selectedDayId, onDaySelect }: DaySelectorProps) {
    const formatLabel = (day: DailyMenu) => {
        let dateObj: Date | null = null;
        if (day.date.includes('.')) {
            const [dd, mm, yyyy] = day.date.split('.').map((part) => Number(part));
            if (!Number.isNaN(dd) && !Number.isNaN(mm) && !Number.isNaN(yyyy)) {
                dateObj = new Date(yyyy, mm - 1, dd);
            }
        } else {
            const parsed = new Date(`${day.date}T12:00:00`);
            if (!Number.isNaN(parsed.getTime())) {
                dateObj = parsed;
            }
        }

        if (!dateObj) {
            return `${day.dayNumber} ${day.dayName}`;
        }

        const monthName = turkishMonths[dateObj.getMonth()] || '';
        return `${dateObj.getDate()} ${monthName} ${day.dayName}`.trim();
    };

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
                        <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                            {formatLabel(day)}
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
