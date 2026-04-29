import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, type DimensionValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
        ];
        const date = new Date(dateStr + 'T12:00:00');
        return String(date.getDate()) + ' ' + months[date.getMonth()] + ' ' + String(date.getFullYear());
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Devamsızlık Detayları</Text>
                <View style={styles.headerSpacer} />
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

                <Text style={styles.sectionHeader}>Devamsızlık Kayıtları</Text>

                {absences.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-circle" size={48} color="#2E7D32" />
                        <Text style={styles.emptyTitle}>Kayıt bulunmuyor</Text>
                        <Text style={styles.emptySubtitle}>Bu ders için henüz devamsızlık kaydı eklenmemiş.</Text>
                    </View>
                ) : (
                    <View style={styles.timelineContainer}>
                        <View style={styles.timelineLine} />
                        {absences.map((absence) => (
                            <View key={absence.id} style={styles.timelineItem}>
                                <View style={styles.indicatorContainer}>
                                    <View style={styles.timelineDot} />
                                </View>

                                <View style={styles.cardContainer}>
                                    <Text style={styles.dateText}>{formatDate(absence.date)}</Text>
                                    <Text style={styles.dayText}>{absence.dayLabel}</Text>
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>Devamsız</Text>
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
                            Toplam Devamsızlık: <Text style={styles.bottomCardHighlight}>{card?.usedHours ?? 0} / {card?.totalHours ?? 0}</Text>
                        </Text>
                        <View style={styles.percentageCircle}>
                            <Text style={styles.percentageText}>
                                %{card && card.totalHours > 0 ? Math.round((card.usedHours / card.totalHours) * 100) : 0}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.bottomCardSubtitle}>
                        Kalan hak: <Text style={styles.bottomCardValue}>{typeof card?.remainingHours === 'number' ? card.remainingHours + ' saat' : card?.remainingHours ?? '-'}</Text>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: '#F8FAFC',
        paddingTop: 12,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0F172A',
    },
    headerSpacer: {
        width: 40,
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
        textAlign: 'center',
    },
    timelineContainer: {
        position: 'relative',
    },
    timelineLine: {
        position: 'absolute',
        left: 11,
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: '#CBD5E1',
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    indicatorContainer: {
        width: 24,
        alignItems: 'center',
        paddingTop: 20,
    },
    timelineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#94A3B8',
    },
    cardContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
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
        backgroundColor: '#F1F5F9',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    statusText: {
        fontSize: 11,
        color: '#475569',
        fontWeight: '700',
    },
    bottomCardContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 20,
    },
    bottomCard: {
        backgroundColor: '#FFFFFF',
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
        flex: 1,
        paddingRight: 12,
    },
    bottomCardHighlight: {
        color: '#D32F2F',
        fontWeight: '700',
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
    bottomCardValue: {
        fontWeight: '700',
        color: '#0F172A',
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
