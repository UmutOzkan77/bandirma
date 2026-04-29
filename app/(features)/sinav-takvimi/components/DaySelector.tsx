import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../theme';

interface DayInfo {
    dayNumber: number;
    dayAbbr: string;
    date: Date;
    isSelected: boolean;
}

interface DaySelectorProps {
    days: DayInfo[];
    onDaySelect: (date: Date) => void;
}

export default function DaySelector({ days, onDaySelect }: DaySelectorProps) {
    const scrollViewRef = useRef<ScrollView>(null);

    // Scroll to the selected day when the component mounts or days change
    useEffect(() => {
        const selectedIndex = days.findIndex(d => d.isSelected);
        if (selectedIndex !== -1 && scrollViewRef.current) {
            // Rough estimate of item width + gap to center the selected item
            const itemWidth = 60;
            const xOffset = Math.max(0, (selectedIndex * itemWidth) - 100);
            scrollViewRef.current.scrollTo({ x: xOffset, animated: true });
        }
    }, [days]);

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {days.map((day, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dayItem,
                            day.isSelected && styles.dayItemSelected,
                        ]}
                        onPress={() => onDaySelect(day.date)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.dayAbbr,
                                day.isSelected && styles.dayAbbrSelected,
                            ]}
                        >
                            {day.dayAbbr.toUpperCase()}
                        </Text>
                        <Text
                            style={[
                                styles.dayNumber,
                                day.isSelected && styles.dayNumberSelected,
                            ]}
                        >
                            {day.dayNumber}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.md,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
    },
    dayItem: {
        width: 56,
        height: 72,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.lg,
        backgroundColor: colors.backgroundCard,
        ...shadows.card,
    },
    dayItemSelected: {
        backgroundColor: colors.primary,
    },
    dayAbbr: {
        fontSize: 10,
        fontWeight: fontWeight.bold,
        color: colors.textMuted,
        marginBottom: spacing.xs,
        letterSpacing: 0.5,
    },
    dayAbbrSelected: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    dayNumber: {
        fontSize: 18,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    dayNumberSelected: {
        color: '#FFFFFF',
    },
});
