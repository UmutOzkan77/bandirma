import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { serviceHours, DailyMenu, Meal, feedbackData } from '../mockData';
import DaySelector from '../components/DaySelector';
import VoteSection from '../components/VoteSection';
import DensityIndicator from '../components/DensityIndicator';
import FeedbackCard from '../components/FeedbackCard';
import MealCard from '../components/MealCard';
import { useAcademic } from '../../../../contexts/AcademicContext';

interface MenuScreenProps {
    onNavigateToStatistics?: () => void;
    onNavigateToFeedback?: () => void;
}

const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const dayShorts = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];


function mapMenuData(menuPeriodDays: NonNullable<ReturnType<typeof useAcademic>['menuPeriod']>['days']): DailyMenu[] {
    return menuPeriodDays.map((day) => {
        const dateObj = new Date(day.serviceDate + 'T12:00:00');
        const meals: Meal[] = day.items
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item) => ({
                id: item.id,
                name: item.itemName,
                type: (item.itemType as any) || 'mainDish',
                calories: item.calories || 0,
            }));

        return {
            id: day.id,
            date: day.serviceDate,
            dayName: dayNames[dateObj.getDay()],
            dayShort: dayShorts[dateObj.getDay()],
            dayNumber: dateObj.getDate(),
            lunchTime: serviceHours.birinciOgretimOgle,
            dinnerTime: serviceHours.ikinciOgretimAksam,
            meals,
            votes: {
                likes: 0,
                dislikes: 0,
            },
        };
    });
}

export default function MenuScreen({ onNavigateToStatistics, onNavigateToFeedback }: MenuScreenProps) {
    const { loading, menuPeriod } = useAcademic();
    const [selectedDayId, setSelectedDayId] = useState('');
    const [userVotes, setUserVotes] = useState<Record<string, 'like' | 'dislike' | null>>({});

    const menuData = useMemo(() => (menuPeriod ? mapMenuData(menuPeriod.days) : []), [menuPeriod]);

    useEffect(() => {
        if (menuData.length > 0 && !selectedDayId) {
            setSelectedDayId(menuData[0].id);
        }
    }, [menuData, selectedDayId]);

    const selectedMenu = useMemo(() => menuData.find((day) => day.id === selectedDayId) || menuData[0], [menuData, selectedDayId]);


    const totalCalories = useMemo(() => {
        if (!selectedMenu) return 0;
        return selectedMenu.meals.reduce((sum, meal) => sum + meal.calories, 0);
    }, [selectedMenu]);

    const currentHour = new Date().getHours();
    const densityLevel = currentHour < 12 ? 'low' : currentHour < 14 ? 'high' : 'medium';
    const densityPercent = currentHour < 12 ? 35 : currentHour < 14 ? 82 : 58;

    const handleVote = (vote: 'like' | 'dislike') => {
        if (!selectedMenu) return;
        setUserVotes((current) => ({ ...current, [selectedMenu.id]: vote }));
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primaryAccent} />
                <Text style={styles.loadingText}>Yemekhane menüsü yükleniyor...</Text>
            </View>
        );
    }

    if (!selectedMenu) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.loadingText}>Geçerli bir yemekhane periyodu bulunamadı.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerIconButton} onPress={onNavigateToStatistics}>
                    <Text style={styles.headerIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Kampüs Yemekhanesi</Text>
                <TouchableOpacity style={styles.headerAvatar}>
                    <Text style={styles.headerAvatarText}>AE</Text>
                </TouchableOpacity>
            </View>

            <DaySelector days={menuData} selectedDayId={selectedDayId} onDaySelect={setSelectedDayId} />

            <View style={styles.content}>
                <DensityIndicator
                    level={densityLevel as any}
                    percentFull={densityPercent}
                    waitTime="Bekleme süresi ~5 dk"
                />

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Günün Menüsü</Text>
                    <Text style={styles.sectionMeta}>Toplam {totalCalories} kcal</Text>
                </View>

                <View style={styles.menuCards}>
                    {selectedMenu.meals.map((meal) => (
                        <MealCard key={meal.id} meal={meal} />
                    ))}
                </View>

                <VoteSection
                    userVote={userVotes[selectedDayId] || null}
                    onVote={handleVote}
                />

                <View style={styles.communityHeader}>
                    <Text style={styles.communityTitle}>Topluluk Geri Bildirimi</Text>
                </View>

                {feedbackData.slice(0, 2).map((feedback) => (
                    <FeedbackCard key={feedback.id} feedback={feedback} variant="compact" />
                ))}

                <TouchableOpacity style={styles.feedbackButton} activeOpacity={0.8} onPress={onNavigateToFeedback}>
                    <Text style={styles.feedbackButtonIcon}>💬</Text>
                    <Text style={styles.feedbackButtonText}>Yorum Yap</Text>
                </TouchableOpacity>

                <View style={styles.bottomSpacer} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundLight,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: colors.textSecondary,
        marginTop: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textDark,
    },
    headerIconButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cardWhite,
        borderWidth: 1,
        borderColor: colors.border,
    },
    headerIcon: {
        fontSize: 18,
        color: colors.textDark,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerAvatarText: {
        color: colors.textLight,
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
    },
    content: {
        paddingBottom: spacing.xxxl,
    },
    feedbackButton: {
        backgroundColor: colors.primaryDark,
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        ...shadows.button,
    },
    feedbackButtonIcon: {
        fontSize: 18,
    },
    feedbackButtonText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.textLight,
    },
    bottomSpacer: {
        height: spacing.xxxl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.textDark,
    },
    sectionMeta: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    menuCards: {
        paddingHorizontal: spacing.lg,
    },
    communityHeader: {
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.lg,
    },
    communityTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.textDark,
    },
});
