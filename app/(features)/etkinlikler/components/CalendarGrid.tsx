/**
 * CalendarGrid Bileşeni - Aylık takvim
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { Event } from '../types';

interface CalendarGridProps {
    currentDate: Date;
    events: Map<string, Event[]>;
    selectedDate: string | null;
    onDateSelect: (date: string) => void;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
}

const DAYS_OF_WEEK = ['PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT', 'PAZ'];
const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

export default function CalendarGrid({ currentDate, events, selectedDate, onDateSelect, onPreviousMonth, onNextMonth }: CalendarGridProps) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    let startDay = firstDayOfMonth.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    const generateCalendarDays = () => {
        const days: (number | null)[] = [];
        for (let i = 0; i < startDay; i++) days.push(null);
        for (let day = 1; day <= daysInMonth; day++) days.push(day);
        return days;
    };

    const formatDate = (day: number): string => {
        const m = (month + 1).toString().padStart(2, '0');
        const d = day.toString().padStart(2, '0');
        return `${year}-${m}-${d}`;
    };

    const calendarDays = generateCalendarDays();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onPreviousMonth} style={styles.navButton}>
                    <Text style={styles.navIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.monthTitle}>{MONTHS_TR[month]} {year}</Text>
                <TouchableOpacity onPress={onNextMonth} style={styles.navButton}>
                    <Text style={styles.navIcon}>›</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.weekDaysRow}>
                {DAYS_OF_WEEK.map((day, index) => (
                    <View key={index} style={styles.weekDayCell}>
                        <Text style={styles.weekDayText}>{day}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.daysGrid}>
                {calendarDays.map((day, index) => {
                    if (day === null) return <View key={`empty-${index}`} style={styles.dayCell} />;
                    const dateStr = formatDate(day);
                    const dayEvents = events.get(dateStr) || [];
                    const isSelected = selectedDate === dateStr;
                    return (
                        <TouchableOpacity key={`day-${day}`} style={styles.dayCell} onPress={() => onDateSelect(dateStr)} activeOpacity={0.7}>
                            <View style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                                <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{day}</Text>
                            </View>
                            {dayEvents.length > 0 && (
                                <View style={styles.dotsContainer}>
                                    {dayEvents.slice(0, 3).map((event) => (
                                        <View key={event.id} style={[styles.dot, { backgroundColor: event.color }]} />
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
            <Text style={styles.footerText}>{MONTHS_TR[month].toUpperCase()} AJANDASI</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: colors.cardLight, borderRadius: borderRadius.xl, padding: spacing.lg, marginHorizontal: spacing.lg, ...shadows.card },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
    navButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
    navIcon: { fontSize: 24, color: colors.textPrimary, fontWeight: fontWeight.bold },
    monthTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.textPrimary },
    weekDaysRow: { flexDirection: 'row', marginBottom: spacing.md },
    weekDayCell: { flex: 1, alignItems: 'center' },
    weekDayText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: fontWeight.medium },
    daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    dayCell: { width: '14.28%', alignItems: 'center', paddingVertical: spacing.sm },
    dayNumber: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', borderRadius: borderRadius.full },
    dayNumberSelected: { backgroundColor: colors.accent },
    dayText: { fontSize: fontSize.md, color: colors.textPrimary, fontWeight: fontWeight.medium },
    dayTextSelected: { color: colors.textWhite },
    dotsContainer: { flexDirection: 'row', marginTop: 2, gap: 2 },
    dot: { width: 5, height: 5, borderRadius: borderRadius.full },
    footerText: { textAlign: 'center', fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.lg, letterSpacing: 1 },
});
