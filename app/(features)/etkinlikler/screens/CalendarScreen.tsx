/**
 * CalendarScreen - Aylık takvim modal
 */
import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { getEventDates } from '../mockData';
import CalendarGrid from '../components/CalendarGrid';

interface CalendarScreenProps {
    onClose: () => void;
    onDateSelect: (date: string) => void;
}

export default function CalendarScreen({ onClose, onDateSelect }: CalendarScreenProps) {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1));
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const eventDates = useMemo(() => getEventDates(), []);

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
            <View style={styles.calendarContainer}>
                <CalendarGrid
                    currentDate={currentDate}
                    events={eventDates}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onPreviousMonth={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                    onNextMonth={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                />
            </View>
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
});
