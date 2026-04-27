import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
    Animated,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DigitalIDModal from '../components/DigitalIDModal';
import { useAcademic } from '../contexts/AcademicContext';
import { useAuth } from '../contexts/AuthContext';

const QUICK_ACTIONS = [
    { id: 'etkinlikler', icon: 'calendar-outline' as const, label: 'Etkinlikler', route: '/(features)/etkinlikler' },
    { id: 'sinav-takvimi', icon: 'time-outline' as const, label: 'Sınav Takvimi', route: '/(features)/sinav-takvimi' },
    { id: 'devamsizlik', icon: 'bar-chart-outline' as const, label: 'Devamsızlık', route: '/(features)/devamsizlik' },
    { id: 'ders-programi', icon: 'grid-outline' as const, label: 'Ders Programı', route: '/(features)/ders-programi' },
];

const cardShadow = Platform.select({
    ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
    },
    android: {
        elevation: 5,
    },
    web: {
        boxShadow: '0 10px 24px rgba(15,23,42,0.08)',
    },
    default: {},
}) as any;

function AnimatedCard({
    children,
    delay = 0,
}: {
    children: React.ReactNode;
    delay?: number;
}) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 420,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 420,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, [delay, opacity, translateY]);

    return (
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
            {children}
        </Animated.View>
    );
}

function getTurkishDay(date = new Date()) {
    return ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][date.getDay()];
}

export default function HomeScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { profile } = useAuth();
    const { nextExam, todayTimetable, todaysMenu, loading } = useAcademic();
    const [isIDVisible, setIsIDVisible] = useState(false);
    const contentWidth = Math.min(width, 720);
    const horizontalPadding = width < 380 ? 14 : 20;
    const gridGap = 14;
    const quickCardWidth = contentWidth - horizontalPadding * 2 < 420
        ? '100%'
        : (contentWidth - horizontalPadding * 2 - gridGap) / 2;

    const activeTime = useMemo(() => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }, []);

    const announcement = nextExam
        ? `${nextExam.courseCode} ${nextExam.examType.toUpperCase()} sınavı ${nextExam.date} ${nextExam.startTime}`
        : 'Güncel sınav duyurusu bulunmuyor.';

    const menuItems = todaysMenu?.items.slice(0, 4) ?? [];
    const menuBadge = todaysMenu ? 'Önbellek Hazır' : 'Menü Bekleniyor';

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingHorizontal: horizontalPadding },
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.contentShell, { maxWidth: contentWidth }]}>
                <AnimatedCard>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity style={styles.avatar} activeOpacity={0.8} onPress={() => setIsIDVisible(true)}>
                                <Ionicons name="person" size={22} color="#FFFFFF" />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.eyebrow}>ÖĞRENCİ</Text>
                                <Text style={styles.studentName}>{profile?.fullName ?? 'Bandırma Öğrencisi'}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(features)/sinav-takvimi')}>
                            <Ionicons name="notifications-outline" size={22} color="#0F172A" />
                        </TouchableOpacity>
                    </View>
                </AnimatedCard>

                <AnimatedCard delay={80}>
                    <TouchableOpacity
                        style={styles.announcementBanner}
                        activeOpacity={0.85}
                        onPress={() => router.push('/(features)/sinav-takvimi')}
                    >
                        <View style={styles.announcementIcon}>
                            <Ionicons name="megaphone-outline" size={18} color="#1D4ED8" />
                        </View>
                        <View style={styles.announcementContent}>
                            <Text style={styles.announcementLabel}>DUYURU</Text>
                            <Text style={styles.announcementText}>{announcement}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#64748B" />
                    </TouchableOpacity>
                </AnimatedCard>

                <AnimatedCard delay={160}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Günün Menüsü</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{menuBadge}</Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        {menuItems.length > 0 ? (
                            menuItems.map((item) => (
                                <View key={item.id} style={styles.listRow}>
                                    <View>
                                        <Text style={styles.listRowTitle}>{item.itemName}</Text>
                                        <Text style={styles.listRowMeta}>{item.itemType ?? 'günün yemeği'}</Text>
                                    </View>
                                    <Text style={styles.listRowValue}>{item.calories ? `${item.calories} kcal` : ''}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>Bugün için menü verisi bulunamadı.</Text>
                        )}

                        <TouchableOpacity style={styles.cardButton} onPress={() => router.push('/(features)/yemekhane')}>
                            <Text style={styles.cardButtonText}>Tüm menüyü aç</Text>
                        </TouchableOpacity>
                    </View>
                </AnimatedCard>

                <AnimatedCard delay={240}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Bugünün Dersleri</Text>
                        <Text style={styles.sectionMeta}>{getTurkishDay()}</Text>
                    </View>

                    <View style={styles.card}>
                        {todayTimetable.length > 0 ? (
                            todayTimetable.map((course) => {
                                const isActive = activeTime >= course.startTime && activeTime <= course.endTime;
                                return (
                                    <View key={`${course.offeringId}-${course.startTime}`} style={[styles.lessonRow, isActive && styles.lessonRowActive]}>
                                        <View>
                                            <Text style={[styles.lessonTitle, isActive && styles.lessonTitleActive]}>{course.courseName}</Text>
                                            <Text style={[styles.lessonMeta, isActive && styles.lessonMetaActive]}>
                                                {course.room} {course.building ? `• ${course.building}` : ''}
                                            </Text>
                                        </View>
                                        <Text style={[styles.lessonTime, isActive && styles.lessonTimeActive]}>
                                            {course.startTime}
                                        </Text>
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={styles.emptyText}>
                                {loading ? 'Dersler yükleniyor...' : 'Bugün için aktif ders bulunmuyor.'}
                            </Text>
                        )}

                        <TouchableOpacity style={styles.cardButton} onPress={() => router.push('/(features)/ders-programi')}>
                            <Text style={styles.cardButtonText}>Haftalık programa git</Text>
                        </TouchableOpacity>
                    </View>
                </AnimatedCard>

                <AnimatedCard delay={320}>
                    <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
                    <View style={[styles.quickGrid, { gap: gridGap }]}>
                        {QUICK_ACTIONS.map((action) => (
                            <TouchableOpacity
                                key={action.id}
                                style={[styles.quickCard, { width: quickCardWidth }]}
                                onPress={() => router.push(action.route as any)}
                            >
                                <View style={styles.quickIcon}>
                                    <Ionicons name={action.icon} size={24} color="#1D4ED8" />
                                </View>
                                <Text style={styles.quickLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </AnimatedCard>
                </View>
            </ScrollView>

            <DigitalIDModal
                visible={isIDVisible}
                onClose={() => setIsIDVisible(false)}
                studentName={profile?.fullName ?? 'Bandırma Öğrencisi'}
                studentID={profile?.studentNumber ?? profile?.id ?? 'N/A'}
                role="ÖĞRENCİ"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingTop: 18,
        paddingBottom: 120,
        alignItems: 'center',
    },
    contentShell: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1D4ED8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    eyebrow: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        color: '#64748B',
    },
    studentName: {
        fontSize: 21,
        fontWeight: '800',
        color: '#0F172A',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    announcementBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#DBEAFE',
        borderRadius: 18,
        padding: 16,
        marginBottom: 24,
    },
    announcementIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    announcementContent: {
        flex: 1,
    },
    announcementLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        color: '#1D4ED8',
        marginBottom: 4,
    },
    announcementText: {
        fontSize: 14,
        color: '#0F172A',
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 10,
    },
    sectionMeta: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: '#DCFCE7',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#166534',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        marginBottom: 24,
        ...cardShadow,
    },
    listRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    listRowTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
    listRowMeta: {
        marginTop: 4,
        fontSize: 12,
        color: '#64748B',
        textTransform: 'capitalize',
    },
    listRowValue: {
        fontSize: 12,
        color: '#334155',
        fontWeight: '600',
    },
    cardButton: {
        marginTop: 16,
        backgroundColor: '#EFF6FF',
        borderRadius: 14,
        paddingVertical: 13,
        alignItems: 'center',
    },
    cardButtonText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1D4ED8',
    },
    lessonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 14,
        marginBottom: 8,
    },
    lessonRowActive: {
        backgroundColor: '#EFF6FF',
    },
    lessonTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
    lessonTitleActive: {
        color: '#1D4ED8',
    },
    lessonMeta: {
        marginTop: 4,
        fontSize: 12,
        color: '#64748B',
    },
    lessonMetaActive: {
        color: '#2563EB',
    },
    lessonTime: {
        fontSize: 15,
        fontWeight: '700',
        color: '#334155',
    },
    lessonTimeActive: {
        color: '#1D4ED8',
    },
    emptyText: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
    },
    quickGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        ...cardShadow,
    },
    quickIcon: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    quickLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
});
