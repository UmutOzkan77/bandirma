/**
 * DailyProgramScreen - Seçilen günün etkinlikleri
 */
import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { getEventsByDate, getEventDates } from '../mockData';
import DaySelector from '../components/DaySelector';
import EventMiniCard from '../components/EventMiniCard';

interface DailyProgramScreenProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    onEventDetailsPress: (eventId: string) => void;
    onClose: () => void;
}

const DAYS_SHORT = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export default function DailyProgramScreen({ selectedDate, onDateChange, onEventDetailsPress, onClose }: DailyProgramScreenProps) {
    const dayEvents = useMemo(() => getEventsByDate(selectedDate), [selectedDate]);

    const days = useMemo(() => {
        const eventDates = getEventDates();
        const result = [];
        const baseDate = new Date(selectedDate);
        for (let i = -3; i <= 10; i++) {
            const date = new Date(baseDate);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            result.push({ date: dateStr, dayOfWeek: DAYS_SHORT[date.getDay()], dayNumber: date.getDate(), hasEvents: eventDates.has(dateStr) });
        }
        return result;
    }, [selectedDate]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Günlük Program</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                    <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
            </View>
            <DaySelector days={days} selectedDate={selectedDate} onDateSelect={onDateChange} />
            <View style={styles.eventsContainer}>
                <Text style={styles.sectionTitle}>BUGÜNKÜ ETKİNLİKLER</Text>
                {dayEvents.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Bu gün için etkinlik bulunmuyor.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={dayEvents}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <EventMiniCard event={item} onDetailsPress={onEventDetailsPress} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.backgroundLight },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
    title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.textPrimary },
    closeButton: { width: 32, height: 32, borderRadius: borderRadius.full, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
    closeIcon: { fontSize: fontSize.md, color: colors.textSecondary },
    eventsContainer: { flex: 1, paddingTop: spacing.md },
    sectionTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textSecondary, letterSpacing: 1, marginHorizontal: spacing.lg, marginBottom: spacing.md },
    listContent: { paddingBottom: spacing.xxl },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxxl },
    emptyText: { fontSize: fontSize.md, color: colors.textSecondary },
});
