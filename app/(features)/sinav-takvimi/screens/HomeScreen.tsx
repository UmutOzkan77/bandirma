/**
 * HomeScreen - Ana Sayfa
 * Sınav haftası uyarısı, sıradaki sınav, bugünkü dersler
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';
import { currentStudent, upcomingExams, todayLessons, campusNews } from '../mockData';
import ExamAlertBanner from '../components/ExamAlertBanner';
import ExamCard from '../components/ExamCard';

interface HomeScreenProps {
    onNavigateToCalendar: () => void;
}

export default function HomeScreen({ onNavigateToCalendar }: HomeScreenProps) {
    const nextExam = upcomingExams[0];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {currentStudent.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                    </View>
                    <View style={styles.welcomeText}>
                        <Text style={styles.greeting}>Hoş geldin,</Text>
                        <Text style={styles.userName}>{currentStudent.name}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <Text style={styles.notificationIcon}>🔔</Text>
                </TouchableOpacity>
            </View>

            {/* Exam Alert Banner */}
            <ExamAlertBanner onPress={onNavigateToCalendar} />

            {/* Next Exam Section */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Sıradaki Sınav</Text>
                <TouchableOpacity onPress={onNavigateToCalendar}>
                    <Text style={styles.seeAllLink}>Tümünü Gör</Text>
                </TouchableOpacity>
            </View>
            <ExamCard exam={nextExam} showFullDetails onPress={onNavigateToCalendar} />

            {/* Today's Lessons */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Bugünkü Dersler</Text>
            </View>
            <View style={styles.lessonsContainer}>
                {todayLessons.map((lesson) => (
                    <View key={lesson.id} style={styles.lessonCard}>
                        <View style={styles.lessonTime}>
                            <Text style={styles.lessonTimeText}>{lesson.time}</Text>
                        </View>
                        <View style={styles.lessonInfo}>
                            <Text style={styles.lessonName}>{lesson.courseName}</Text>
                            <Text style={styles.lessonRoom}>📍 {lesson.room}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Campus News */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Kampüs Haberleri</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.newsContainer}
            >
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

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
        </ScrollView>
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
        backgroundColor: colors.primaryAccent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.primaryDark,
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
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationIcon: {
        fontSize: 20,
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
        color: colors.primaryAccent,
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
    },
    lessonTime: {
        backgroundColor: colors.backgroundLight,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        marginRight: spacing.md,
    },
    lessonTimeText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.primaryAccent,
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
    },
    newsImagePlaceholder: {
        height: 100,
        backgroundColor: colors.backgroundLight,
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
