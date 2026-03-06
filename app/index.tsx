/**
 * Ana Sayfa - Bandırma Onyedi Eylül Üniversitesi
 * Tasarım mockup'ına göre oluşturulmuş ana ekran
 */
import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Platform,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DigitalIDModal from '../components/DigitalIDModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Demo Data ──────────────────────────────────────────────────
const STUDENT = {
    name: 'Ahmet Yılmaz',
    id: 'BAN-123456',
    role: 'ÖĞRENCİ',
};

const ANNOUNCEMENT = {
    label: 'DUYURU',
    text: 'Sınav Takvimi Yayınlandı!',
};

const DAILY_MENU = {
    density: 'Orta Yoğun',
    timeRange: '12:00 - 14:00',
    items: [
        { icon: '🍲', name: 'Domates Çorbası', category: 'soup' },
        { icon: '🍗', name: 'Bezelyeli Tavuk', category: 'main' },
        { icon: '🍚', name: 'Pirinç Pilavı', category: 'side' },
    ],
};

const DAILY_COURSES = {
    day: 'Çarşamba',
    items: [
        { name: 'Yazılım Mühendisliği', room: 'A-101', time: '09:00', active: false },
        { name: 'Algoritma Analizi', room: 'B-204', time: '11:00', active: true },
        { name: 'Veri Tabanı Sistemleri', room: 'C-305', time: '13:00', active: false },
    ],
};

const QUICK_ACTIONS = [
    { id: 'etkinlikler', icon: 'calendar-outline' as const, label: 'Etkinlikler', badge: '2 Yeni', route: '/(features)/etkinlikler' },
    { id: 'sinav-takvimi', icon: 'time-outline' as const, label: 'Sınav Takvimi', badge: null, route: '/(features)/sinav-takvimi' },
    { id: 'devamsizlik', icon: 'bar-chart-outline' as const, label: 'Devamsızlık', badge: null, route: '/(features)/devamsizlik' },
    { id: 'ders-programi', icon: 'grid-outline' as const, label: 'Ders Programı', badge: null, route: '/(features)/ders-programi' },
];

// ─── Shadow helper (works on iOS, Android & Web) ────────────────
const cardShadow = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
    },
    android: {
        elevation: 4,
    },
    web: {
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    },
    default: {},
}) as any;

// ─── Animated Card Component ────────────────────────────────────
function AnimatedCard({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[style, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {children}
        </Animated.View>
    );
}

// ─── Main Screen ────────────────────────────────────────────────
export default function HomeScreen() {
    const router = useRouter();
    const [isIDVisible, setIsIDVisible] = React.useState(false);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ──────────────────────────────── */}
                <AnimatedCard delay={0} style={styles.header}>
                    {/* Sol taraf: Profil fotoğrafı + İsim */}
                    <View style={styles.headerLeft}>
                        <TouchableOpacity
                            style={styles.avatarContainer}
                            activeOpacity={0.7}
                            onPress={() => setIsIDVisible(true)}
                        >
                            <Ionicons name="person" size={22} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.roleLabel}>{STUDENT.role}</Text>
                            <Text style={styles.studentName}>{STUDENT.name}</Text>
                        </View>
                    </View>
                    {/* Sağ taraf: Bildirim butonu */}
                    <TouchableOpacity
                        style={styles.notificationButton}
                        activeOpacity={0.7}
                        onPress={() => { }}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#1E293B" />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </AnimatedCard>

                {/* ── Announcement Banner ─────────────────── */}
                <AnimatedCard delay={100}>
                    <TouchableOpacity
                        style={styles.announcementBanner}
                        activeOpacity={0.85}
                        onPress={() => router.push('/(features)/sinav-takvimi')}
                    >
                        <View style={styles.announcementLeft}>
                            <View style={styles.megaphoneIcon}>
                                <Ionicons name="megaphone" size={18} color="#0066CC" />
                            </View>
                            <View>
                                <Text style={styles.announcementLabel}>{ANNOUNCEMENT.label}</Text>
                                <Text style={styles.announcementText}>{ANNOUNCEMENT.text}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#64748B" />
                    </TouchableOpacity>
                </AnimatedCard>

                {/* ── Günün Menüsü ────────────────────────── */}
                <AnimatedCard delay={200}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Günün Menüsü</Text>
                        <View style={styles.densityBadge}>
                            <Text style={styles.densityText}>{DAILY_MENU.density}</Text>
                        </View>
                    </View>
                    <View style={styles.card}>
                        {DAILY_MENU.items.map((item, index) => (
                            <View key={index} style={index === 0 ? styles.menuItemFirst : styles.menuItem}>
                                <View style={styles.menuItemLeft}>
                                    <Text style={styles.menuItemIcon}>{item.icon}</Text>
                                    <Text style={styles.menuItemName}>{item.name}</Text>
                                </View>
                                {index === 0 && (
                                    <Text style={styles.menuTimeRange}>{DAILY_MENU.timeRange}</Text>
                                )}
                            </View>
                        ))}
                        <TouchableOpacity
                            style={styles.cardButton}
                            activeOpacity={0.7}
                            onPress={() => router.push('/(features)/yemekhane')}
                        >
                            <Text style={styles.cardButtonText}>Tüm Menüyü Gör {'>'}</Text>
                        </TouchableOpacity>
                    </View>
                </AnimatedCard>

                {/* ── Günün Dersleri ──────────────────────── */}
                <AnimatedCard delay={300}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Günün Dersleri</Text>
                        <Text style={styles.dayLabel}>{DAILY_COURSES.day}</Text>
                    </View>
                    <View style={styles.card}>
                        {DAILY_COURSES.items.map((course, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.courseItem,
                                    course.active && styles.courseItemActive,
                                    index === DAILY_COURSES.items.length - 1 && { borderBottomWidth: 0 }
                                ]}
                            >
                                <View>
                                    <Text style={[
                                        styles.courseName,
                                        course.active && styles.courseNameActive,
                                    ]}>
                                        {course.name}
                                    </Text>
                                    <Text style={[
                                        styles.courseRoom,
                                        course.active && styles.courseRoomActive,
                                    ]}>
                                        {course.room}
                                    </Text>
                                </View>
                                <Text style={[
                                    styles.courseTime,
                                    course.active && styles.courseTimeActive,
                                ]}>
                                    {course.time}
                                </Text>
                            </View>
                        ))}
                        <TouchableOpacity
                            style={styles.cardButton}
                            activeOpacity={0.7}
                            onPress={() => router.push('/(features)/ders-programi')}
                        >
                            <Text style={styles.cardButtonText}>Haftalık Programı Gör {'>'}</Text>
                        </TouchableOpacity>
                    </View>
                </AnimatedCard>

                {/* ── Diğer İşlemler ──────────────────────── */}
                <AnimatedCard delay={400}>
                    <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Diğer İşlemler</Text>
                    <View style={styles.quickActionsGrid}>
                        {QUICK_ACTIONS.map((action) => (
                            <TouchableOpacity
                                key={action.id}
                                style={styles.quickActionCard}
                                activeOpacity={0.7}
                                onPress={() => router.push(action.route as any)}
                            >
                                {action.badge && (
                                    <View style={styles.quickActionBadge}>
                                        <Text style={styles.quickActionBadgeText}>{action.badge}</Text>
                                    </View>
                                )}
                                <View style={styles.quickActionIconContainer}>
                                    <Ionicons name={action.icon} size={24} color="#0066CC" />
                                </View>
                                <Text style={styles.quickActionLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </AnimatedCard>

                {/* Bottom space */}
                <View style={{ height: 24 }} />
            </ScrollView>

            <DigitalIDModal
                visible={isIDVisible}
                onClose={() => setIsIDVisible(false)}
                studentName={STUDENT.name}
                studentID={STUDENT.id}
                role={STUDENT.role}
            />
        </SafeAreaView>
    );
}

// ─── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 120,
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTextContainer: {
        justifyContent: 'center',
    },
    avatarContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#0066CC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#EF4444',
        borderWidth: 2,
        borderColor: '#F1F5F9',
    },
    roleLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
        letterSpacing: 1,
        marginBottom: 2,
    },
    studentName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },

    // Announcement
    announcementBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#EBF5FF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    announcementLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    megaphoneIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    announcementLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#0066CC',
        letterSpacing: 0.5,
        marginBottom: 1,
    },
    announcementText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },

    // Section Headers
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0066CC',
    },
    dayLabel: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    densityBadge: {
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    densityText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#D97706',
    },

    // Card – with cross-platform shadow
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 18,
        paddingBottom: 18,
        paddingTop: 18,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...cardShadow,
    },

    // Menu items
    menuTimeRange: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
        textAlign: 'right',
    },
    menuItemFirst: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        gap: 12,
    },
    menuItemIcon: {
        fontSize: 22,
    },
    menuItemName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1E293B',
    },

    // Course items
    courseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    courseItemActive: {
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
    },
    courseName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1E293B',
        marginBottom: 2,
    },
    courseNameActive: {
        color: '#0066CC',
        fontWeight: '700',
    },
    courseRoom: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
    courseRoomActive: {
        color: '#3B82F6',
    },
    courseTime: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748B',
    },
    courseTimeActive: {
        color: '#0066CC',
        fontWeight: '800',
        fontSize: 18,
    },

    // Card Button
    cardButton: {
        backgroundColor: '#EBF5FF',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    cardButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0066CC',
    },

    // Quick Actions
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 12,
    },
    quickActionCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...cardShadow,
    },
    quickActionBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#EBF5FF',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    quickActionBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#0066CC',
    },
    quickActionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    quickActionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
});
