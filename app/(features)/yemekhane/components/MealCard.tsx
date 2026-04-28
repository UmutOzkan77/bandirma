/**
 * MealCard Component
 * Yemek kartı - ikon, isim, açıklama ve badge gösterimi
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';
import { Meal, MealType } from '../mockData';

interface MealCardProps {
    meal: Meal;
}

// Yemek türüne göre ikon ve renk
const getMealIcon = (type: MealType): { icon: string; color: string } => {
    switch (type) {
        case 'soup':
            return { icon: '🍲', color: colors.soup };
        case 'mainDish':
            return { icon: '🍖', color: colors.mainDish };
        case 'sideDish':
            return { icon: '🍚', color: colors.sideDish };
        case 'dessert':
            return { icon: '🍨', color: colors.dessert };
        case 'drink':
            return { icon: '🥤', color: colors.primaryAccent };
        case 'salad':
            return { icon: '🥗', color: colors.success };
        default:
            return { icon: '🍽️', color: colors.textSecondary };
    }
};

// Badge renkleri
const getBadgeStyle = (badge: string) => {
    switch (badge) {
        case 'GF':
            return { backgroundColor: '#FEF3C7', color: '#D97706' }; // Gluten-Free - Amber
        case 'V':
            return { backgroundColor: '#D1FAE5', color: '#059669' }; // Vegetarian - Green
        case 'VG':
            return { backgroundColor: '#DBEAFE', color: '#2563EB' }; // Vegan - Blue
        default:
            return { backgroundColor: colors.border, color: colors.textSecondary };
    }
};

export default function MealCard({ meal }: MealCardProps) {
    const { icon, color } = getMealIcon(meal.type);

    return (
        <View style={styles.container}>
            {/* İkon alanı */}
            <View style={[styles.iconContainer, { backgroundColor: `${color}1A` }]}>
                <Text style={styles.icon}>{icon}</Text>
            </View>

            {/* İçerik alanı */}
            <View style={styles.content}>
                <Text style={styles.name}>{meal.name}</Text>
                {meal.badges && meal.badges.length > 0 && (
                    <View style={styles.badgeContainer}>
                        {meal.badges.map((badge, index) => {
                            const badgeStyle = getBadgeStyle(badge);
                            return (
                                <View
                                    key={index}
                                    style={[styles.badge, { backgroundColor: badgeStyle.backgroundColor }]}
                                >
                                    <Text style={[styles.badgeText, { color: badgeStyle.color }]}>
                                        {badge}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>

            <View style={styles.caloriePill}>
                <Text style={styles.calorieText}>{meal.calories} kcal</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardWhite,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.sm,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    icon: {
        fontSize: 22,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textDark,
        marginBottom: spacing.xs,
    },
    badgeContainer: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    badge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    badgeText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
    },
    caloriePill: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        backgroundColor: colors.backgroundLight,
        borderWidth: 1,
        borderColor: colors.border,
        marginLeft: spacing.sm,
    },
    calorieText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
    },
});
