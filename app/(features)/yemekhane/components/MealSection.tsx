/**
 * MealSection Component
 * Öğle/Akşam yemeği bölümü wrapper'ı
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { Meal, MealTime } from '../mockData';
import MealCard from './MealCard';

interface MealSectionProps {
    mealTime: MealTime;
    timeRange: string;
    meals: Meal[];
    isOpen?: boolean;
    isAvailable?: boolean;
    availableMessage?: string;
}

export default function MealSection({
    mealTime,
    timeRange,
    meals,
    isOpen = false,
    isAvailable = true,
    availableMessage
}: MealSectionProps) {
    const title = mealTime === 'lunch' ? 'Öğle Yemeği' : 'Akşam Yemeği';
    const icon = mealTime === 'lunch' ? '☀️' : '🌙';

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.icon}>{icon}</Text>
                    <View>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.timeRange}>{timeRange}</Text>
                    </View>
                </View>

                {isOpen && (
                    <View style={styles.openBadge}>
                        <Text style={styles.openBadgeText}>Şimdi Açık</Text>
                    </View>
                )}
            </View>

            {/* Menü içeriği veya mesaj */}
            {isAvailable ? (
                <View style={styles.mealsContainer}>
                    {meals.map((meal) => (
                        <MealCard key={meal.id} meal={meal} />
                    ))}
                </View>
            ) : (
                <View style={styles.unavailableContainer}>
                    <Text style={styles.unavailableIcon}>🔒</Text>
                    <Text style={styles.unavailableText}>
                        {availableMessage || 'Menü henüz açıklanmadı'}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.cardWhite,
        borderRadius: borderRadius.xl,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        overflow: 'hidden',
        ...shadows.card,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    icon: {
        fontSize: 24,
    },
    title: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textDark,
    },
    timeRange: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    openBadge: {
        backgroundColor: `${colors.primaryAccent}20`,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.primaryAccent,
    },
    openBadgeText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
        color: colors.primaryAccent,
    },
    mealsContainer: {
        backgroundColor: colors.cardWhite,
    },
    unavailableContainer: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.backgroundLight,
    },
    unavailableIcon: {
        fontSize: 24,
        marginBottom: spacing.sm,
    },
    unavailableText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
