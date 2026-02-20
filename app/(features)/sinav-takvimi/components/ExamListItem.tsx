/**
 * ExamListItem Component
 * Sınav listesi görünümü için tekil sınav öğesi
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { Exam } from '../mockData';

interface ExamListItemProps {
    exam: Exam;
    onPress: (exam: Exam) => void;
}

export default function ExamListItem({ exam, onPress }: ExamListItemProps) {
    // Tarihi formatla: "10 Şubat 2026"
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const months = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    // Gün adını al: "Pazartesi"
    const getDayName = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
        return days[date.getDay()];
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(exam)}
            activeOpacity={0.7}
        >
            {/* Sol Taraf: Tarih Kutusu */}
            <View style={styles.dateBox}>
                <Text style={styles.dayNumber}>{new Date(exam.date).getDate()}</Text>
                <Text style={styles.monthName}>
                    {new Date(exam.date).toLocaleString('tr-TR', { month: 'short' }).toUpperCase()}
                </Text>
            </View>

            {/* Orta Kısım: Sınav Bilgileri */}
            <View style={styles.details}>
                <View style={styles.headerRow}>
                    <Text style={styles.courseName} numberOfLines={1}>{exam.courseName}</Text>
                    {exam.hasConflict && (
                        <View style={styles.conflictBadge}>
                            <Text style={styles.conflictText}>!</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.courseCode}>{exam.courseCode}</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoText}>🕒 {exam.startTime} - {exam.endTime}</Text>
                    <Text style={styles.separator}>•</Text>
                    <Text style={styles.infoText}>📍 {exam.room}</Text>
                </View>
            </View>

            {/* Sağ Taraf: Ok ikonu */}
            <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>›</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },
    dateBox: {
        backgroundColor: colors.backgroundSubtle,
        borderRadius: borderRadius.md,
        padding: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        marginRight: spacing.md,
    },
    dayNumber: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.primary,
    },
    monthName: {
        fontSize: 10,
        color: colors.textSecondary,
        fontWeight: fontWeight.bold,
    },
    details: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    courseName: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        flex: 1,
    },
    conflictBadge: {
        backgroundColor: colors.error,
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.xs,
    },
    conflictText: {
        color: colors.textInverse,
        fontSize: 10,
        fontWeight: 'bold',
    },
    courseCode: {
        fontSize: fontSize.sm,
        color: colors.textMuted,
        marginBottom: spacing.xs,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    separator: {
        marginHorizontal: spacing.xs,
        color: colors.textMuted,
        fontSize: fontSize.xs,
    },
    arrowContainer: {
        paddingLeft: spacing.sm,
    },
    arrow: {
        fontSize: 20,
        color: colors.textMuted,
        fontWeight: 'bold',
    },
});
