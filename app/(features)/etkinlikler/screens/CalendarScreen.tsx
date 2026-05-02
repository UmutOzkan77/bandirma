/**
 * CalendarScreen - Aylık takvim modal (Supabase entegrasyonlu)
 */
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { Event } from '../types';
import { fetchEventDates } from '../services/eventService';
import CalendarGrid from '../components/CalendarGrid';

interface CalendarScreenProps {
    onClose: () => void;
    onDateSelect: (date: string) => void;
    participatedEvents: Set<string>;
}

export default function CalendarScreen({ onClose, onDateSelect, participatedEvents }: CalendarScreenProps) {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1));
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [eventDates, setEventDates] = useState<Map<string, Event[]>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEventDates();
    }, []);

    const loadEventDates = async () => {
        setLoading(true);
        try {
            const dates = await fetchEventDates();
            setEventDates(dates);
        } catch (error) {
            console.error('Calendar data load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        if (eventDates.has(date)) onDateSelect(date);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.placeholder} />
                <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                    <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <View style={styles.calendarContainer}>
                    <CalendarGrid
                        currentDate={currentDate}
                        events={eventDates}
                        participatedEvents={participatedEvents}
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        onPreviousMonth={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                        onNextMonth={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.backgroundLight },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
    placeholder: { width: 40 },
    closeButton: { width: 40, height: 40, borderRadius: borderRadius.full, backgroundColor: colors.textSecondary, justifyContent: 'center', alignItems: 'center' },
    closeIcon: { fontSize: fontSize.lg, color: colors.textWhite, fontWeight: fontWeight.bold },
    calendarContainer: { flex: 1, justifyContent: 'center', paddingBottom: 100 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
