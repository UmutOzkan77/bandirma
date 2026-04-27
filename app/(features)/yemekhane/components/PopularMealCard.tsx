/**
 * PopularMealCard Component
 * Popüler yemek kartı - resim, rating ve oy sayısı
 */
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { PopularMeal } from '../mockData';

interface PopularMealCardProps {
    meal: PopularMeal;
}

export default function PopularMealCard({ meal }: PopularMealCardProps) {
    // Yıldız rating render
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <Text style={styles.stars}>
                {'★'.repeat(fullStars)}
                {hasHalfStar && '☆'}
                {'☆'.repeat(emptyStars)}
            </Text>
        );
    };

    return (
        <View style={styles.container}>
            {/* Yemek görseli */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: meal.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            {/* İçerik */}
            <View style={styles.content}>
                <Text style={styles.name}>{meal.name}</Text>
                <View style={styles.ratingContainer}>
                    {renderStars(meal.rating)}
                    <Text style={styles.ratingText}>{meal.rating}</Text>
                </View>
                <Text style={styles.voteCount}>{meal.voteCount} Oy</Text>
            </View>

            {/* Onay oranı badge */}
            <View style={styles.approvalContainer}>
                <Text style={styles.approvalText}>%{meal.approvalRate}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardWhite,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        ...shadows.card,
    },
    imageContainer: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        marginRight: spacing.md,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.textDark,
        marginBottom: spacing.xs,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.xs,
    },
    stars: {
        fontSize: fontSize.sm,
        color: colors.warning,
    },
    ratingText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    voteCount: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    approvalContainer: {
        backgroundColor: `${colors.primaryDark}10`,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    approvalText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.primaryDark,
    },
});
