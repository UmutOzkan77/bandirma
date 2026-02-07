import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mock data for the specific course in the image
// In a real app, this would be fetched based on the 'id'
const COURSE_DETAILS = {
    id: '5', // Veritabanı Yönetimi from previous list
    name: 'Veri Tabanı Yönetimi',
    code: 'BIL-301',
    instructor: 'Dr. Öğr. Üyesi Ahmet Yılmaz',
    totalHours: 10,
    usedHours: 4,
    remainingHours: 6,
    absences: [
        { id: '1', date: '12 Mart 2025', day: 'Çarşamba', status: 'DEVAMSIZ' },
        { id: '2', date: '5 Mart 2025', day: 'Çarşamba', status: 'DEVAMSIZ' },
        { id: '3', date: '26 Şubat 2025', day: 'Çarşamba', status: 'DEVAMSIZ' },
        { id: '4', date: '19 Şubat 2025', day: 'Çarşamba', status: 'DEVAMSIZ' },
    ]
};

export default function AbsenceDetailsScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();

    // Merge static mock data with dynamic params from navigation
    const course = {
        ...COURSE_DETAILS,
        name: params.name as string || COURSE_DETAILS.name,
        instructor: params.instructor as string || COURSE_DETAILS.instructor,
        // Parse numbers safely
        totalHours: params.totalHours ? Number(params.totalHours) : COURSE_DETAILS.totalHours,
        usedHours: params.usedHours ? Number(params.usedHours) : COURSE_DETAILS.usedHours,
        remainingHours: params.remainingHours ? (params.remainingHours === '-' ? '-' : Number(params.remainingHours)) : COURSE_DETAILS.remainingHours,
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="white" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Devamsızlık Detayları</Text>
                    <Text style={styles.headerSubtitle}>{course.name}</Text>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Course Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.courseTitle}>{course.name}</Text>
                    <Text style={styles.courseSubtitle}>{`Ders Kodu: ${course.code} • ${course.instructor}`}</Text>
                </View>

                <Text style={styles.sectionHeader}>Geçmiş Devamsızlık Tarihleri</Text>

                {/* Timeline Section */}
                <View style={styles.timelineContainer}>
                    {/* Vertical Line */}
                    <View style={styles.timelineLine} />

                    {course.absences.map((absence, index) => (
                        <View key={absence.id} style={styles.timelineItem}>
                            {/* Circle Indicator */}
                            <View style={styles.indicatorContainer}>
                                <View style={styles.outerCircle}>
                                    <View style={styles.innerCircle} />
                                </View>
                            </View>

                            {/* Card Content */}
                            <View style={styles.cardContainer}>
                                <Text style={styles.dateText}>{absence.date}</Text>
                                <Text style={styles.dayText}>{absence.day}</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>{absence.status}</Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    {/* Bottom Padding for scroll */}
                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            {/* Bottom Summary Card */}
            <View style={styles.bottomCardContainer}>
                <View style={styles.bottomCard}>
                    <View style={styles.bottomCardHeader}>
                        <Text style={styles.bottomCardTitle}>Toplam Devamsızlık: <Text style={{ color: '#D32F2F', fontWeight: 'bold' }}>{course.usedHours} / {course.totalHours}</Text></Text>

                        {/* Circular Progress Placeholder - simple version */}
                        <View style={styles.percentageCircle}>
                            <Text style={styles.percentageText}>%{Math.round((course.usedHours / course.totalHours) * 100)}</Text>
                        </View>
                    </View>

                    <Text style={styles.bottomCardSubtitle}>Kalan hak: <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>{course.remainingHours} saat</Text>. Sınıra yaklaşıyorsunuz.</Text>

                    {/* Linear Progress Bar */}
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: `${(course.usedHours / course.totalHours) * 100}%` }]} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: '#1D3557',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#94A3B8',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    titleSection: {
        marginBottom: 24,
    },
    courseTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1D3557',
        marginBottom: 4,
    },
    courseSubtitle: {
        fontSize: 14,
        color: '#64748B',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 16,
    },
    timelineContainer: {
        position: 'relative',
        paddingLeft: 10, // Space for indicators
    },
    timelineLine: {
        position: 'absolute',
        left: 21, // Center of circle
        top: 20,
        bottom: 0,
        width: 2,
        backgroundColor: '#CBD5E1', // Light grey line
        zIndex: -1,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 24,
        alignItems: 'flex-start',
    },
    indicatorContainer: {
        width: 42,
        alignItems: 'center',
        marginRight: 16,
        paddingTop: 10, // Align with card top
    },
    outerCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F43F5E', // Red
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    cardContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 2,
    },
    dayText: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 12,
    },
    statusBadge: {
        backgroundColor: '#FFF1F2', // Light red bg
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#FECDD3',
    },
    statusText: {
        color: '#E11D48', // Red text
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    bottomCardContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    bottomCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    bottomCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    bottomCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1D3557',
    },
    bottomCardSubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 16,
    },
    percentageCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E2E8F0', // Simplified circle
    },
    percentageText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#F43F5E', // Red for used hours
        borderRadius: 4,
    },
});
