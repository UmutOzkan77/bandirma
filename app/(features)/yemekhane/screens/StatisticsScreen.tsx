/**
 * StatisticsScreen
 * İstatistikler ekranı - Tasarım 4
 * Memnuniyet haritası (takvim görünümü) ve ayın favorisi
 * Gün detaylarını gösteren modal eklendi
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { calendarData, monthlyFavorite, turkishMonths, weeklyMenuData, DailyMenu } from '../mockData';
import CalendarView from '../components/CalendarView';

interface StatisticsScreenProps {
    onGoBack?: () => void;
}

export default function StatisticsScreen({ onGoBack }: StatisticsScreenProps) {
    const [currentMonth, setCurrentMonth] = useState(1); // Şubat (0-indexed -> 1)
    const [currentYear, setCurrentYear] = useState(2026);

    // Seçili gün detayı için state
    const [selectedMenu, setSelectedMenu] = useState<DailyMenu | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDayPress = (day: number) => {
        // Seçilen güne ait menüyü bul
        const menu = weeklyMenuData.find(m => m.dayNumber === day);

        if (menu) {
            setSelectedMenu(menu);
            setShowDetailModal(true);
        } else {
            // Eğer o gün için veri yoksa (haftasonu vb.)
            // İsterseniz burada boş bir menü veya uyarı gösterebilirsiniz
            // Şimdilik sadece konsola yazdıralım
            console.log('Bu gün için veri bulunamadı:', day);
        }
    };

    // Beğeni oranı hesapla
    const getApprovalRate = (menu: DailyMenu) => {
        const totalVotes = menu.votes.likes + menu.votes.dislikes;
        if (totalVotes === 0) return 0;
        return Math.round((menu.votes.likes / totalVotes) * 100);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>İstatistikler</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Text style={styles.moreIcon}>⋯</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Başlık */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>Memnuniyet Haritası</Text>
                    <Text style={styles.subtitle}>Detay görmek için bir güne tıklayın</Text>
                </View>

                {/* Takvim */}
                <CalendarView
                    month={turkishMonths[currentMonth]}
                    year={currentYear}
                    days={calendarData}
                    onPreviousMonth={handlePreviousMonth}
                    onNextMonth={handleNextMonth}
                    onDayPress={handleDayPress}
                />

                {/* Ayın favorisi */}
                <View style={styles.favoriteSection}>
                    <View style={styles.favoriteHeader}>
                        <Text style={styles.favoriteLabel}>⭐ AYIN FAVORİSİ</Text>
                    </View>
                    <View style={styles.favoriteContent}>
                        <View style={styles.favoriteInfo}>
                            <Text style={styles.favoriteDate}>{monthlyFavorite.date} Menüsü</Text>
                            <Text style={styles.favoriteMeals}>{monthlyFavorite.meals}</Text>
                            <View style={styles.favoriteProgress}>
                                <View style={[styles.favoriteProgressBar, { width: `${monthlyFavorite.approvalRate}%` }]} />
                            </View>
                            <Text style={styles.favoriteRate}>%{monthlyFavorite.approvalRate}</Text>
                        </View>
                        <Image
                            source={{ uri: monthlyFavorite.image }}
                            style={styles.favoriteImage}
                            resizeMode="cover"
                        />
                    </View>
                </View>

                {/* Alt boşluk */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Gün Detay Modalı */}
            {selectedMenu && (
                <Modal
                    visible={showDetailModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowDetailModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <View>
                                    <Text style={styles.modalDate}>{selectedMenu.date}</Text>
                                    <Text style={styles.modalDay}>{selectedMenu.dayName}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setShowDetailModal(false)}
                                >
                                    <Text style={styles.closeIcon}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Beğeni Oranı */}
                            <View style={styles.ratingCard}>
                                <Text style={styles.ratingLabel}>Beğeni Oranı</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={[
                                        styles.ratingValue,
                                        { color: getApprovalRate(selectedMenu) >= 70 ? colors.success : colors.warning }
                                    ]}>
                                        %{getApprovalRate(selectedMenu)}
                                    </Text>
                                    <View style={styles.voteCountBadge}>
                                        <Text style={styles.voteCountText}>
                                            {selectedMenu.votes.likes + selectedMenu.votes.dislikes} Oy
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.ratingBarBg}>
                                    <View
                                        style={[
                                            styles.ratingBarFill,
                                            {
                                                width: `${getApprovalRate(selectedMenu)}%`,
                                                backgroundColor: getApprovalRate(selectedMenu) >= 70 ? colors.success : colors.warning
                                            }
                                        ]}
                                    />
                                </View>
                            </View>

                            {/* Menü Listesi */}
                            <Text style={styles.menuTitle}>Günün Menüsü</Text>
                            <ScrollView style={styles.menuList}>
                                {selectedMenu.meals.map((meal, index) => (
                                    <View key={index} style={styles.menuItem}>
                                        <View style={styles.menuItemBullet} />
                                        <Text style={styles.menuItemName}>{meal.name}</Text>
                                        <Text style={styles.menuItemCal}>{meal.calories} kcal</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundDark,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: colors.textLight,
    },
    headerTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.textLight,
    },
    moreButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreIcon: {
        fontSize: 24,
        color: colors.textLight,
    },
    content: {
        flex: 1,
    },
    titleSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    title: {
        fontSize: fontSize.title,
        fontWeight: fontWeight.bold,
        color: colors.textLight,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    favoriteSection: {
        backgroundColor: colors.backgroundDark,
        marginHorizontal: spacing.lg,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: `${colors.textSecondary}30`,
    },
    favoriteHeader: {
        padding: spacing.md,
    },
    favoriteLabel: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
        color: colors.warning,
        letterSpacing: 1,
    },
    favoriteContent: {
        flexDirection: 'row',
        padding: spacing.md,
        paddingTop: 0,
    },
    favoriteInfo: {
        flex: 1,
    },
    favoriteDate: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textLight,
        marginBottom: spacing.xs,
    },
    favoriteMeals: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    favoriteProgress: {
        height: 6,
        backgroundColor: `${colors.textSecondary}30`,
        borderRadius: borderRadius.full,
        marginBottom: spacing.xs,
        width: '80%',
    },
    favoriteProgressBar: {
        height: '100%',
        backgroundColor: colors.success,
        borderRadius: borderRadius.full,
    },
    favoriteRate: {
        fontSize: fontSize.sm,
        color: colors.success,
        fontWeight: fontWeight.semibold,
    },
    favoriteImage: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.md,
    },
    bottomSpacer: {
        height: spacing.xxxl,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.cardWhite,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.xl,
        minHeight: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    modalDate: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textDark,
    },
    modalDay: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.backgroundLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        fontSize: 18,
        color: colors.textDark,
    },
    ratingCard: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.xl,
    },
    ratingLabel: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        gap: spacing.md,
    },
    ratingValue: {
        fontSize: 32,
        fontWeight: fontWeight.bold,
    },
    voteCountBadge: {
        backgroundColor: colors.cardWhite,
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
    },
    voteCountText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
    },
    ratingBarBg: {
        height: 8,
        backgroundColor: colors.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    ratingBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    menuTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textDark,
        marginBottom: spacing.md,
    },
    menuList: {
        maxHeight: 250,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuItemBullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primaryAccent,
        marginRight: spacing.md,
    },
    menuItemName: {
        flex: 1,
        fontSize: fontSize.md,
        color: colors.textDark,
    },
    menuItemCal: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
    },
});
