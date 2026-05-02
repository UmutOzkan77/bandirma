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
    const { loading, menuPeriod, todaysMenu } = useAcademic();
    const [selectedDayId, setSelectedDayId] = useState('');
    const [userVotes, setUserVotes] = useState<Record<string, 'like' | 'dislike' | null>>({});
    const [votes, setVotes] = useState<Record<string, { likes: number; dislikes: number }>>({});

    const menuData = useMemo(() => (menuPeriod ? mapMenuData(menuPeriod.days).sort((a, b) => a.date.localeCompare(b.date)) : []), [menuPeriod]);

    useEffect(() => {
        if (menuData.length > 0 && !selectedDayId) {
            setSelectedDayId(todaysMenu?.id ?? menuData[0].id);
        }
    }, [menuData, selectedDayId, todaysMenu?.id]);

    const selectedMenu = useMemo(() => menuData.find((day) => day.id === selectedDayId) || menuData[0], [menuData, selectedDayId]);
    const selectedVotes = selectedMenu
        ? votes[selectedMenu.id] ?? { likes: selectedMenu.votes.likes, dislikes: selectedMenu.votes.dislikes }
        : { likes: 0, dislikes: 0 };


    const totalCalories = useMemo(() => {
        if (!selectedMenu) return 0;
        return selectedMenu.meals.reduce((sum, meal) => sum + meal.calories, 0);
    }, [selectedMenu]);

    const currentHour = new Date().getHours();
    const densityLevel = currentHour < 12 ? 'low' : currentHour < 14 ? 'high' : 'medium';
    const densityPercent = currentHour < 12 ? 35 : currentHour < 14 ? 82 : 58;

    const handleVote = (vote: 'like' | 'dislike') => {
        if (!selectedMenu) return;
        if (userVotes[selectedMenu.id]) return;
        setVotes((current) => {
            const currentVote = current[selectedMenu.id] ?? { likes: selectedMenu.votes.likes, dislikes: selectedMenu.votes.dislikes };
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
                <Text style={styles.headerTitle}>Kampüs Yemekhanesi</Text>
            </View>

            <DaySelector days={menuData} selectedDayId={selectedDayId} onDaySelect={setSelectedDayId} />

            <View style={styles.content}>
                <DensityIndicator
                    level={densityLevel as any}
                    percentFull={densityPercent}
                    waitTime="Bekleme süresi ~5 dk"
                />

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionHeaderLeft}>
                        <Text style={styles.sectionTitle}>Günün Menüsü</Text>
                        <Text style={styles.sectionMeta}>Toplam {totalCalories} kcal</Text>
                    </View>
                    <TouchableOpacity style={styles.sectionHeaderButton} onPress={onNavigateToStatistics}>
                        <Text style={styles.sectionHeaderIcon}>➜</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.menuCards}>
                    {selectedMenu.meals.map((meal) => (
                        <MealCard key={meal.id} meal={meal} />
                    ))}
                </View>

                <VoteSection
                    likes={selectedVotes.likes}
                    dislikes={selectedVotes.dislikes}
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
        fontWeight: fontWeight.semibold,
        color: colors.textDark,
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
    sectionHeaderLeft: {
        flex: 1,
        paddingRight: spacing.md,
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.textDark,
    },
    sectionMeta: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    sectionHeaderButton: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cardWhite,
        borderWidth: 1,
        borderColor: colors.border,
    },
    sectionHeaderIcon: {
        fontSize: 16,
        color: colors.textDark,
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
