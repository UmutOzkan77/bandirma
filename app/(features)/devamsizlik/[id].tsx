import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, type DimensionValue } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAcademic } from '../../../contexts/AcademicContext';

export default function AbsenceDetailsScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { getOfferingById, getAbsenceEvents, getAbsenceCard } = useAcademic();

    const courseId = String(params.id || '');
    const card = getAbsenceCard(courseId);
    const offering = getOfferingById(courseId);
    const absences = getAbsenceEvents(courseId);

    const formatDate = (dateStr: string) => {
        const months = [
            'Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran',
            'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik',
        ];
        const date = new Date(dateStr + 'T12:00:00');
        return String(date.getDate()) + ' ' + months[date.getMonth()] + ' ' + String(date.getFullYear());
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="white" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Devamsizlik Detaylari</Text>
                    <Text style={styles.headerSubtitle} numberOfLines={1}>{offering?.course.courseName ?? String(params.name || '')}</Text>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.titleSection}>
                    <Text style={styles.courseTitle}>{offering?.course.courseName ?? String(params.name || '')}</Text>
                    <Text style={styles.courseSubtitle}>
                        Ders Kodu: {offering?.course.courseCode ?? String(params.code || '')}
                        {' • '}
                        {offering?.instructorName ?? String(params.instructor || '')}
                    </Text>
                </View>

                <Text style={styles.sectionHeader}>Local Devamsizlik Kayitlari</Text>

                {absences.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-circle" size={48} color="#2E7D32" />
                        <Text style={styles.emptyTitle}>Kayit bulunmuyor</Text>
                        <Text style={styles.emptySubtitle}>Bu ders icin local devamsizlik eklenmemis.</Text>
                    </View>
                ) : (
                    <View style={styles.timelineContainer}>
                        <View style={styles.timelineLine} />
                        {absences.map((absence) => (
                            <View key={absence.id} style={styles.timelineItem}>
                                <View style={styles.indicatorContainer}>
                                    <View style={styles.outerCircle}>
                                        <View style={styles.innerCircle} />
                                    </View>
                                </View>

                                <View style={styles.cardContainer}>
                                    <Text style={styles.dateText}>{formatDate(absence.date)}</Text>
                                    <Text style={styles.dayText}>{absence.dayLabel}</Text>
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>DEVAMSIZ</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View style={{ height: 160 }} />
            </ScrollView>

            <View style={styles.bottomCardContainer}>
                <View style={styles.bottomCard}>
                    <View style={styles.bottomCardHeader}>
                        <Text style={styles.bottomCardTitle}>
                            Toplam Devamsizlik: <Text style={{ color: '#D32F2F', fontWeight: 'bold' }}>{card?.usedHours ?? 0} / {card?.totalHours ?? 0}</Text>
                        </Text>
                        <View style={styles.percentageCircle}>
                            <Text style={styles.percentageText}>
                                %{card && card.totalHours > 0 ? Math.round((card.usedHours / card.totalHours) * 100) : 0}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.bottomCardSubtitle}>
                        Kalan hak: <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>{typeof card?.remainingHours === 'number' ? card.remainingHours + ' saat' : card?.remainingHours ?? '-'}</Text>
                    </Text>

                    <View style={styles.progressBarBackground}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${card && card.totalHours > 0 ? Math.min((card.usedHours / card.totalHours) * 100, 100) : 0}%` as DimensionValue },
                            ]}
                        />
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
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        marginTop: 12,
        color: '#2E7D32',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptySubtitle: {
        color: '#64748B',
        marginTop: 4,
    },
    timelineContainer: {
        paddingLeft: 10,
    },
    timelineLine: {
        position: 'absolute',
        left: 17,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: '#CBD5E1',
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    indicatorContainer: {
        width: 34,
        alignItems: 'center',
    },
    outerCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#BFDBFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    innerCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#1D4ED8',
    },
    cardContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
    },
    dateText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
    dayText: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
        marginBottom: 8,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FEE2E2',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    statusText: {
        fontSize: 11,
        color: '#B91C1C',
        fontWeight: '700',
    },
    bottomCardContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 20,
    },
    bottomCard: {
        backgroundColor: 'white',
        borderRadius: 18,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
    bottomCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    bottomCardTitle: {
        fontSize: 15,
        color: '#0F172A',
    },
    percentageCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentageText: {
        color: '#1D4ED8',
        fontWeight: '700',
    },
    bottomCardSubtitle: {
        fontSize: 14,
        color: '#475569',
        marginBottom: 10,
    },
    progressBarBackground: {
        height: 8,
        borderRadius: 999,
        backgroundColor: '#E2E8F0',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#1D4ED8',
        borderRadius: 999,
    },
});
