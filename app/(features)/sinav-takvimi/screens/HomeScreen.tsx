import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import ExamAlertBanner from '../components/ExamAlertBanner';
import ExamCard from '../components/ExamCard';
import { useAcademic } from '../../../../contexts/AcademicContext';
import { useAuth } from '../../../../contexts/AuthContext';

interface HomeScreenProps {
    onNavigateToCalendar: () => void;
}

export default function HomeScreen({ onNavigateToCalendar }: HomeScreenProps) {
    const { profile } = useAuth();
    const { nextExam, todayTimetable, examList, menuPeriod } = useAcademic();
    const campusNews = [
        { id: '1', title: `${menuPeriod?.month ?? 5}/2026 yemekhane menusu guncellendi`, date: 'Bugun' },
        { id: '2', title: `${profile?.departmentName ?? 'Bolum'} ${profile?.classLevel ?? ''}. sinif sinav takvimi yayinda`, date: 'Bugun' },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {(profile?.fullName ?? 'B O').split(' ').map((item) => item[0]).join('').slice(0, 2)}
                        </Text>
                    </View>
                    <View style={styles.welcomeText}>
                        <Text style={styles.greeting}>Hos geldin,</Text>
                        <Text style={styles.userName}>{profile?.fullName ?? 'Bandirma Ogrencisi'}</Text>
                    </View>
                </View>
            </View>

            <ExamAlertBanner examCount={examList.length} nextExamDate={nextExam?.date ?? null} onPress={onNavigateToCalendar} />

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Siradaki Sinav</Text>
                <TouchableOpacity onPress={onNavigateToCalendar}>
                    <Text style={styles.seeAllLink}>Tumunu Gor</Text>
                </TouchableOpacity>
            </View>

            {nextExam ? (
                <ExamCard exam={nextExam} showFullDetails onPress={onNavigateToCalendar} />
            ) : (
                <View style={styles.placeholderCard}>
                    <Text style={styles.placeholderText}>Yayinlanmis sinav bulunmuyor.</Text>
                </View>
            )}

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Bugunku Dersler</Text>
            </View>
            <View style={styles.lessonsContainer}>
                {todayTimetable.length > 0 ? (
                    todayTimetable.map((lesson) => (
                        <View key={lesson.offeringId + '-' + lesson.startTime} style={styles.lessonCard}>
                            <View style={styles.lessonTime}>
                                <Text style={styles.lessonTimeText}>{lesson.startTime}</Text>
                            </View>
                            <View style={styles.lessonInfo}>
                                <Text style={styles.lessonName}>{lesson.courseName}</Text>
                                <Text style={styles.lessonRoom}>{lesson.room}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.placeholderCard}>
                        <Text style={styles.placeholderText}>Bugun icin ders bulunmuyor.</Text>
                    </View>
                )}
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Kampus Haberleri</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.newsContainer}>
                {campusNews.map((news) => (
                    <TouchableOpacity key={news.id} style={styles.newsCard}>
                        <View style={styles.newsImagePlaceholder}>
                            <Text style={styles.newsImageIcon}>📰</Text>
                        </View>
                        <Text style={styles.newsTitle} numberOfLines={2}>{news.title}</Text>
                        <Text style={styles.newsDate}>{news.date}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.bottomSpacing} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundMain,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textInverse,
    },
    welcomeText: {
        justifyContent: 'center',
    },
    greeting: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    userName: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    seeAllLink: {
        fontSize: fontSize.sm,
        color: colors.accent,
        fontWeight: fontWeight.medium,
    },
    lessonsContainer: {
        paddingHorizontal: spacing.lg,
    },
    lessonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },
    lessonTime: {
        backgroundColor: colors.backgroundSubtle,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        marginRight: spacing.md,
    },
    lessonTimeText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.accent,
    },
    lessonInfo: {
        flex: 1,
    },
    lessonName: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    lessonRoom: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    placeholderCard: {
        marginHorizontal: spacing.lg,
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    placeholderText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    newsContainer: {
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
    },
    newsCard: {
        width: 160,
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },
    newsImagePlaceholder: {
        height: 100,
        backgroundColor: colors.backgroundSubtle,
        alignItems: 'center',
        justifyContent: 'center',
    },
    newsImageIcon: {
        fontSize: 32,
    },
    newsTitle: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textPrimary,
        padding: spacing.sm,
        paddingBottom: spacing.xs,
    },
    newsDate: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        paddingHorizontal: spacing.sm,
        paddingBottom: spacing.sm,
    },
    bottomSpacing: {
        height: spacing.xxl,
    },
});
