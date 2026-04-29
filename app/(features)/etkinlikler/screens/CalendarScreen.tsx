import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { Event } from '../types';
import { fetchEventDates } from '../services/eventService';
import CalendarGrid from '../components/CalendarGrid';

interface CalendarScreenProps {
    onClose: () => void;
    onDateSelect: (date: string) => void;
    participatedEvents: Set<string>;
}

export default function CalendarScreen({ onClose, onDateSelect }: CalendarScreenProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [eventDates, setEventDates] = useState<Map<string, Event[]>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEventDates = async () => {
            setLoading(true);
            try {
                const dates = await fetchEventDates();
                setEventDates(dates);

                const firstDate = Array.from(dates.keys()).sort()[0];
                if (firstDate) {
                    setCurrentDate(new Date(`${firstDate}T00:00:00`));
                }
            } catch (error) {
                console.error('Calendar data load error:', error);
            } finally {
                setLoading(false);
            }
        };

        void loadEventDates();
    }, []);

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        if (eventDates.has(date)) {
            onDateSelect(date);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerLabel}>ETKİNLİK TAKVİMİ</Text>
                    <Text style={styles.headerTitle}>Takvim</Text>
                </View>
                <View style={styles.placeholder} />
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
                        participatedEvents={new Set<string>()}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cardLight,
    },
    headerLabel: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
        letterSpacing: 1,
        textAlign: 'center',
    },
    headerTitle: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    placeholder: { width: 36 },
    calendarContainer: { flex: 1, justifyContent: 'center', paddingBottom: 40 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
