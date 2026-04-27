/**
 * DailyProgramScreen - Seçilen günün etkinlikleri (Supabase entegrasyonlu)
 */
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { Event } from '../types';
import { fetchEventsByDate, fetchEventDates } from '../services/eventService';
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
    const [dayEvents, setDayEvents] = useState<Event[]>([]);
    const [eventDatesSet, setEventDatesSet] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [eventsForDay, allEventDates] = await Promise.all([
                fetchEventsByDate(selectedDate),
                fetchEventDates(),
            ]);
            setDayEvents(eventsForDay);
            setEventDatesSet(new Set(allEventDates.keys()));
        } catch (error) {
            console.error('DailyProgram data load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const days = useMemo(() => {
        const result = [];
        const baseDate = new Date(selectedDate);
        for (let i = -3; i <= 10; i++) {
            const date = new Date(baseDate);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            result.push({ date: dateStr, dayOfWeek: DAYS_SHORT[date.getDay()], dayNumber: date.getDate(), hasEvents: eventDatesSet.has(dateStr) });
        }
        return result;
    }, [selectedDate, eventDatesSet]);

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
                {loading ? (
                    <View style={styles.emptyContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : dayEvents.length === 0 ? (
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.primary
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeIcon: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: 'bold'
    },
    eventsContainer: { flex: 1, paddingTop: 16 },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 1.2,
        marginHorizontal: 18,
        marginBottom: 16
    },
    listContent: { paddingBottom: 40 },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500'
    },
});
