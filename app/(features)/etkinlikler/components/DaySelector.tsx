/**
 * DaySelector Bileşeni - Günler arası geçiş
 */
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';

interface DayInfo {
    date: string;
    dayOfWeek: string;
    dayNumber: number;
    hasEvents: boolean;
}

interface DaySelectorProps {
    days: DayInfo[];
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

export default function DaySelector({ days, selectedDate, onDateSelect }: DaySelectorProps) {
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const selectedIndex = days.findIndex(d => d.date === selectedDate);
        if (selectedIndex !== -1 && scrollViewRef.current) {
            const scrollX = Math.max(0, selectedIndex * 70 - 100);
            scrollViewRef.current.scrollTo({ x: scrollX, animated: true });
        }
    }, [selectedDate, days]);

    return (
        <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} style={styles.container} contentContainerStyle={styles.contentContainer}>
            {days.map((day) => {
                const isSelected = day.date === selectedDate;
                return (
                    <TouchableOpacity key={day.date} style={styles.dayItem} onPress={() => onDateSelect(day.date)} activeOpacity={0.7}>
                        <Text style={[styles.dayOfWeek, isSelected && styles.dayOfWeekSelected]}>{day.dayOfWeek}</Text>
                        <View style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}>
                            <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>{day.dayNumber}</Text>
                        </View>
                        {day.hasEvents && <View style={styles.eventDot} />}
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { maxHeight: 100 },
    contentContainer: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.md },
    dayItem: { alignItems: 'center', width: 55 },
    dayOfWeek: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xs },
    dayOfWeekSelected: { color: colors.accent, fontWeight: fontWeight.medium },
    dayCircle: { width: 44, height: 44, borderRadius: borderRadius.full, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
    dayCircleSelected: { backgroundColor: colors.accent },
    dayNumber: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.textPrimary },
    dayNumberSelected: { color: colors.textWhite },
    eventDot: { width: 5, height: 5, borderRadius: borderRadius.full, backgroundColor: colors.accent, marginTop: spacing.xs },
});
