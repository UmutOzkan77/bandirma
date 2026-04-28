/**
 * CalendarView Component
 * Aylık takvim görünümü - memnuniyet haritası
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows, satisfactionColors } from '../theme';
import { CalendarDay } from '../mockData';

interface CalendarViewProps {
    month: string;
    year: number;
    days: CalendarDay[];
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onDayPress?: (day: number) => void;
}

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export default function CalendarView({
    month,
    year,
    days,
    onPreviousMonth,
    onNextMonth,
    onDayPress
}: CalendarViewProps) {

    const getDayColor = (satisfaction: 'positive' | 'neutral' | 'negative' | null) => {
        switch (satisfaction) {
            case 'positive':
                return satisfactionColors.positive;
            case 'neutral':
                return satisfactionColors.neutral;
            case 'negative':
                return satisfactionColors.negative;
            default:
                return 'transparent';
        }
    };

    // Ayın ilk gününün haftanın hangi gününe denk geldiğini hesapla (dummy: 2 = Çarşamba)
    const firstDayOffset = 2;

    return (
        <View style={styles.container}>
            {/* Ay seçici */}
            <View style={styles.monthSelector}>
                <TouchableOpacity onPress={onPreviousMonth} style={styles.arrowButton}>
                    <Text style={styles.arrow}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.monthText}>{month} {year}</Text>
                <TouchableOpacity onPress={onNextMonth} style={styles.arrowButton}>
                    <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
            </View>

            {/* Haftanın günleri başlıkları */}
            <View style={styles.weekdaysRow}>
                {WEEKDAYS.map((day, index) => (
                    <View key={index} style={styles.weekdayCell}>
                        <Text style={styles.weekdayText}>{day}</Text>
                    </View>
                ))}
            </View>

            {/* Takvim günleri */}
            <View style={styles.daysGrid}>
                {/* Boş hücreler (ayın başlangıcı için) */}
                {Array.from({ length: firstDayOffset }).map((_, index) => (
                    <View key={`empty-${index}`} style={styles.dayCell} />
                ))}

                {/* Günler */}
                {days.map((dayData) => (
                    <TouchableOpacity
                        key={dayData.day}
                        style={styles.dayCell}
                        onPress={() => onDayPress?.(dayData.day)}
                        activeOpacity={0.7}
                    >
                        <View style={[
                            styles.dayCircle,
                            dayData.satisfaction && { backgroundColor: getDayColor(dayData.satisfaction) }
                        ]}>
                            <Text style={[
                                styles.dayText,
                                dayData.satisfaction && styles.dayTextWithColor
                            ]}>
                                {dayData.day}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Açıklama */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: satisfactionColors.positive }]} />
                    <Text style={styles.legendText}>Beğenildi</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: satisfactionColors.neutral }]} />
                    <Text style={styles.legendText}>Eşit</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: satisfactionColors.negative }]} />
                    <Text style={styles.legendText}>Beğenilmedi</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.cardWhite,
        borderRadius: borderRadius.xl,
        margin: spacing.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
        paddingHorizontal: spacing.md,
    },
    arrowButton: {
        padding: spacing.sm,
    },
    arrow: {
        fontSize: 28,
        color: colors.textDark,
        fontWeight: fontWeight.bold,
    },
    monthText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.textDark,
    },
    weekdaysRow: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
    },
    weekdayCell: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.xs,
    },
    weekdayText: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%', // 100% / 7 days
        aspectRatio: 1,
        padding: spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayCircle: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.backgroundLight,
        borderWidth: 1,
        borderColor: colors.border,
    },
    dayText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    dayTextWithColor: {
        color: colors.textLight,
        fontWeight: fontWeight.semibold,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.xl,
        marginTop: spacing.xl,
        paddingTop: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: borderRadius.full,
    },
    legendText: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
});
