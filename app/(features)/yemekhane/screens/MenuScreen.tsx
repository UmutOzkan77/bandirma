import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { serviceHours, DailyMenu, Meal } from '../mockData';
import DaySelector from '../components/DaySelector';
import MealSection from '../components/MealSection';
import VoteSection from '../components/VoteSection';
import DensityIndicator from '../components/DensityIndicator';
import { useAcademic } from '../../../../contexts/AcademicContext';

interface MenuScreenProps {
    onNavigateToStatistics?: () => void;
    onNavigateToFeedback?: () => void;
}

const dayNames = ['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi'];
const dayShorts = ['Paz', 'Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt'];

type VoteMap = Record<string, { likes: number; dislikes: number }>;

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
    const [votes, setVotes] = useState<VoteMap>({});

    const menuData = useMemo(() => (menuPeriod ? mapMenuData(menuPeriod.days) : []), [menuPeriod]);

    useEffect(() => {
        if (menuData.length > 0 && !selectedDayId) {
            setSelectedDayId(menuData[0].id);
        }
    }, [menuData, selectedDayId]);

    const selectedMenu = useMemo(() => menuData.find((day) => day.id === selectedDayId) || menuData[0], [menuData, selectedDayId]);

    const selectedVotes = selectedMenu ? votes[selectedMenu.id] ?? { likes: selectedMenu.votes.likes, dislikes: selectedMenu.votes.dislikes } : { likes: 0, dislikes: 0 };

    const totalCalories = useMemo(() => {
        if (!selectedMenu) return 0;
        return selectedMenu.meals.reduce((sum, meal) => sum + meal.calories, 0);
    }, [selectedMenu]);

    const currentHour = new Date().getHours();
    const isLunchTime = currentHour >= 11 && currentHour < 14;
    const densityLevel = currentHour < 12 ? 'low' : currentHour < 14 ? 'high' : 'medium';
    const densityPercent = currentHour < 12 ? 35 : currentHour < 14 ? 82 : 58;

    const handleVote = (vote: 'like' | 'dislike') => {
        if (!selectedMenu) return;
        setVotes((current) => {
            const currentVote = current[selectedMenu.id] ?? { likes: 0, dislikes: 0 };
            return {
                ...current,
                [selectedMenu.id]: {
                    likes: currentVote.likes + (vote === 'like' ? 1 : 0),
                    dislikes: currentVote.dislikes + (vote === 'dislike' ? 1 : 0),
                },
            };
        });
        setUserVotes((current) => ({ ...current, [selectedMenu.id]: vote }));
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.textLight} />
                <Text style={styles.loadingText}>Yemekhane menusu yukleniyor...</Text>
            </View>
        );
    }

    if (!selectedMenu) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.loadingText}>Gecerli bir yemekhane periyodu bulunamadi.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Gunun Menusu</Text>
                <TouchableOpacity style={styles.calendarButton} onPress={onNavigateToStatistics}>
                    <Text style={styles.calendarIcon}>📅</Text>
                </TouchableOpacity>
            </View>

            <DaySelector days={menuData} selectedDayId={selectedDayId} onDaySelect={setSelectedDayId} />

            <View style={styles.content}>
                <View style={styles.dateInfo}>
                    <Text style={styles.dateText}>{selectedMenu.date} - {selectedMenu.dayName}</Text>
                    <Text style={styles.calorieText}>Toplam: {totalCalories} kcal</Text>
                </View>

                <DensityIndicator
                    level={densityLevel as any}
                    percentFull={densityPercent}
                    lastUpdated={menuPeriod ? 'Cache aktif' : 'Yeni cekildi'}
                />

                <MealSection
                    mealTime="lunch"
                    timeRange={serviceHours.birinciOgretimOgle}
                    meals={selectedMenu.meals}
                    isOpen={isLunchTime}
                    isAvailable
                />

                <VoteSection
                    likes={selectedVotes.likes}
                    dislikes={selectedVotes.dislikes}
                    userVote={userVotes[selectedDayId] || null}
                    onVote={handleVote}
                />

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
        backgroundColor: colors.primaryDark,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: colors.textLight,
        marginTop: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
    },
    headerTitle: {
        fontSize: fontSize.title,
        fontWeight: fontWeight.bold,
        color: colors.textLight,
    },
    calendarButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.cardWhite,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.button,
    },
    calendarIcon: {
        fontSize: 18,
    },
    content: {
        paddingBottom: spacing.xxxl,
    },
    dateInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    dateText: {
        fontSize: fontSize.md,
        color: colors.textLight,
        fontWeight: fontWeight.medium,
    },
    calorieText: {
        fontSize: fontSize.sm,
        color: colors.textLight,
        opacity: 0.85,
    },
    feedbackButton: {
        backgroundColor: colors.cardWhite,
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
        color: colors.textDark,
    },
    bottomSpacer: {
        height: spacing.xxxl,
    },
});
