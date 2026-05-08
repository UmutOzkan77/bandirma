import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const normalizeMealType = (itemType: string | null | undefined, itemName: string) => {
    if (!itemType) {
        return 'mainDish';
    }

    switch (itemType) {
        case 'soup':
            return 'soup';
        case 'dessert':
            return 'dessert';
        case 'drink':
            return 'drink';
        case 'salad':
            return 'salad';
        case 'side':
            return 'sideDish';
        case 'main':
            return 'mainDish';
        case 'holiday':
            return 'mainDish';
        default:
            return 'mainDish';
    }
};


function mapMenuData(menuPeriodDays: NonNullable<ReturnType<typeof useAcademic>['menuPeriod']>['days']): DailyMenu[] {
    return menuPeriodDays.map((day) => {
        const dateObj = new Date(day.serviceDate + 'T12:00:00');
        const meals: Meal[] = day.items
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item) => ({
                id: item.id,
                name: item.itemName,
                type: normalizeMealType(item.itemType, item.itemName) as any,
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
    const insets = useSafeAreaInsets();
    const [selectedDayId, setSelectedDayId] = useState('');
    const [userVotes, setUserVotes] = useState<Record<string, 'like' | 'dislike' | null>>({});
    const [votes, setVotes] = useState<Record<string, { likes: number; dislikes: number }>>({});

    const menuData = useMemo(() => (menuPeriod ? mapMenuData(menuPeriod.days) : []), [menuPeriod]);

    useEffect(() => {
        if (menuData.length === 0 || selectedDayId) {
            return;
        }

        const todayIso = new Date().toISOString().slice(0, 10);
        const todayMenu = menuData.find((day) => day.date === todayIso);
        setSelectedDayId(todayMenu?.id ?? menuData[0].id);
    }, [menuData, selectedDayId]);

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
        <ScrollView
            style={styles.container}
            contentContainerStyle={[
                styles.contentContainer,
                { paddingBottom: spacing.xxxl + Math.max(insets.bottom, spacing.xl) },
            ]}
            showsVerticalScrollIndicator={false}
            bounces
        >
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
                    {selectedMenu.meals.length > 0 ? (
                        selectedMenu.meals.map((meal) => (
                            <MealCard key={meal.id} meal={meal} />
                        ))
                    ) : (
                        <View style={styles.emptyMenuCard}>
                            <Text style={styles.emptyMenuTitle}>Bugün menü bulunmuyor.</Text>
                            <Text style={styles.emptyMenuSubtitle}>Resmi tatil veya menü açıklanmadı.</Text>
                        </View>
                    )}
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
    contentContainer: {
        paddingBottom: 0,
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
    emptyMenuCard: {
        backgroundColor: colors.cardWhite,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        alignItems: 'center',
        ...shadows.card,
    },
    emptyMenuTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textDark,
        marginBottom: spacing.xs,
    },
    emptyMenuSubtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
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
