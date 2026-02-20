/**
 * MenuScreen
 * Günün Menüsü ekranı - Tasarım 1
 * Tüm sayfa kayar (header dahil)
 * 
 * Bandırma Onyedi Eylül Üniversitesi - Şubat 2026
 */
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { weeklyMenuData, densityData, serviceHours, DailyMenu } from '../mockData';
import DaySelector from '../components/DaySelector';
import MealSection from '../components/MealSection';
import VoteSection from '../components/VoteSection';
import DensityIndicator from '../components/DensityIndicator';

interface MenuScreenProps {
    onNavigateToStatistics?: () => void;
    onNavigateToFeedback?: () => void;
}

// Bugünden itibaren sonraki 5 iş gününü (hafta içi) getiren fonksiyon
const getNext5Weekdays = (): DailyMenu[] => {
    const today = new Date();
    const todayDate = today.getDate();
    const weekdays: DailyMenu[] = [];

    // Bugünden başlayarak 5 hafta içi gün bul
    let checkDate = todayDate;
    let daysChecked = 0;

    while (weekdays.length < 5 && daysChecked < 30) {
        // Bu tarihe ait menü var mı kontrol et
        const menu = weeklyMenuData.find(m => m.dayNumber === checkDate);

        if (menu) {
            // Hafta sonu değilse ekle (Cumartesi=6, Pazar=0)
            const isWeekend = menu.dayName === 'Cumartesi' || menu.dayName === 'Pazar';
            if (!isWeekend) {
                weekdays.push(menu);
            }
        }

        checkDate++;
        daysChecked++;

        // Ay sonunu geçtiyse aya göre ayarla
        if (checkDate > 28) {
            break;
        }
    }

    // Eğer yeterli gün bulunamadıysa, mevcut verilerden ilk 5 hafta içi günü al
    if (weekdays.length < 5) {
        return weeklyMenuData
            .filter(m => m.dayName !== 'Cumartesi' && m.dayName !== 'Pazar')
            .slice(0, 5);
    }

    return weekdays;
};

export default function MenuScreen({ onNavigateToStatistics, onNavigateToFeedback }: MenuScreenProps) {
    // Önümüzdeki 5 iş günü
    const displayMenuData = useMemo(() => getNext5Weekdays(), []);

    // Seçili gün state'i (varsayılan: ilk gün)
    const [selectedDayId, setSelectedDayId] = useState<string>(displayMenuData[0]?.id || '3');

    // Kullanıcı oyları state'i (gün ID'sine göre)
    const [userVotes, setUserVotes] = useState<Record<string, 'like' | 'dislike' | null>>({});

    // Seçili günün menüsü
    const selectedMenu = useMemo(() => {
        return weeklyMenuData.find(day => day.id === selectedDayId) || displayMenuData[0];
    }, [selectedDayId, displayMenuData]);

    // Toplam kalori hesapla
    const totalCalories = useMemo(() => {
        return selectedMenu.meals.reduce((sum, meal) => sum + meal.calories, 0);
    }, [selectedMenu]);

    // Şu anki saat kontrolü
    const currentHour = new Date().getHours();
    const isLunchTime = currentHour >= 11 && currentHour < 14;

    // Oy verme işlemi
    const handleVote = (vote: 'like' | 'dislike') => {
        setUserVotes(prev => ({
            ...prev,
            [selectedDayId]: vote
        }));
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            bounces={true}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Günün Menüsü</Text>
                <TouchableOpacity
                    style={styles.calendarButton}
                    onPress={onNavigateToStatistics}
                >
                    <Text style={styles.calendarIcon}>📅</Text>
                </TouchableOpacity>
            </View>

            {/* Gün seçici - Sadece hafta içi günler */}
            <DaySelector
                days={displayMenuData}
                selectedDayId={selectedDayId}
                onDaySelect={setSelectedDayId}
            />

            {/* İçerik alanı */}
            <View style={styles.content}>
                {/* Tarih ve toplam kalori */}
                <View style={styles.dateInfo}>
                    <Text style={styles.dateText}>
                        {selectedMenu.date} - {selectedMenu.dayName}
                    </Text>
                    <Text style={styles.calorieText}>
                        Toplam: {totalCalories} kcal
                    </Text>
                </View>

                {/* Yoğunluk göstergesi */}
                <DensityIndicator
                    level={densityData.current}
                    percentFull={densityData.percentFull}
                    lastUpdated={densityData.lastUpdated}
                />

                {/* Günün Menüsü */}
                <MealSection
                    mealTime="lunch"
                    timeRange={serviceHours.birinciOgretimOgle}
                    meals={selectedMenu.meals}
                    isOpen={isLunchTime}
                    isAvailable={true}
                />

                {/* Oylama bölümü */}
                <VoteSection
                    likes={selectedMenu.votes.likes}
                    dislikes={selectedMenu.votes.dislikes}
                    userVote={userVotes[selectedDayId] || null}
                    onVote={handleVote}
                />

                {/* Yorum Yap Butonu */}
                <TouchableOpacity
                    style={styles.feedbackButton}
                    activeOpacity={0.8}
                    onPress={onNavigateToFeedback}
                >
                    <Text style={styles.feedbackButtonIcon}>💬</Text>
                    <Text style={styles.feedbackButtonText}>Yorum Yap</Text>
                </TouchableOpacity>

                {/* Alt boşluk */}
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
        backgroundColor: `${colors.textLight}20`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarIcon: {
        fontSize: 20,
    },
    content: {
        backgroundColor: colors.backgroundLight,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        marginTop: spacing.md,
        minHeight: 600,
    },
    dateInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
    },
    dateText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textDark,
    },
    calorieText: {
        fontSize: fontSize.sm,
        color: colors.primaryAccent,
        fontWeight: fontWeight.semibold,
    },
    feedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primaryDark,
        marginHorizontal: spacing.lg,
        marginTop: spacing.lg,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
        ...shadows.card,
    },
    feedbackButtonIcon: {
        fontSize: 20,
    },
    feedbackButtonText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textLight,
    },
    bottomSpacer: {
        height: spacing.xxxl,
    },
});
