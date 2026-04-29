import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { Feather } from '@expo/vector-icons';
import WeeklyCalendar from '../components/WeeklyCalendar';
import ExamDetailModal from '../components/ExamDetailModal';
import ExamListView from '../components/ExamListView';
import { useAcademic } from '../../../../contexts/AcademicContext';
import type { Exam } from '../utils';
import { formatDate, getWeekDays, getWeekStart } from '../utils';

interface CalendarScreenProps {
    onNavigateToCalculator?: () => void;
}

export default function CalendarScreen({ onNavigateToCalculator }: CalendarScreenProps) {
    const router = useRouter();
    const { examList, removeExam } = useAcademic();
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [weekOffset, setWeekOffset] = useState(0);
    const [deleteExam, setDeleteExam] = useState<Exam | null>(null);

    useEffect(() => {
        if (examList.length > 0) {
            setSelectedDate((current) => current || examList[0].date);
        }
    }, [examList]);

    const weekStart = useMemo(() => {
        const base = getWeekStart();
        base.setDate(base.getDate() + weekOffset * 7);
        return base;
    }, [weekOffset]);

    const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

    const weekLabel = useMemo(() => {
        const startDay = weekDays[0];
        const endDay = weekDays[4] ?? weekDays[weekDays.length - 1];
        return formatDate(startDay.date) + ' - ' + formatDate(endDay.date);
    }, [weekDays]);

    const filteredExams = useMemo(() => {
        if (viewMode === 'calendar') {
            const visibleDates = new Set(weekDays.map((day) => day.date));
            return examList.filter((exam) => visibleDates.has(exam.date));
        }
        return examList;
    }, [examList, viewMode, weekDays]);

    const handleExamPress = (exam: Exam) => {
        setSelectedExam(exam);
        setModalVisible(true);
    };

    const handleExamLongPress = (exam: Exam) => {
        if (!exam.id.startsWith('manual-')) return;
        setDeleteExam(exam);
    };

    const confirmDelete = () => {
        if (deleteExam) {
            removeExam(deleteExam.id);
            setDeleteExam(null);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="chevron-left" size={24} color={colors.primary} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerMainTitle}>SINAV TAKVİMİ</Text>
                </View>
                <TouchableOpacity style={styles.menuButton} onPress={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}>
                    <Feather name={viewMode === 'list' ? 'calendar' : 'list'} size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {viewMode === 'calendar' ? (
                <WeeklyCalendar
                    weekDays={weekDays}
                    exams={filteredExams}
                    selectedDate={selectedDate}
                    onDayPress={setSelectedDate}
                    onExamPress={handleExamPress}
                    onExamLongPress={handleExamLongPress}
                    onPreviousWeek={() => setWeekOffset((prev) => prev - 1)}
                    onNextWeek={() => setWeekOffset((prev) => prev + 1)}
                    weekLabel={weekLabel}
                />
            ) : (
                <ExamListView 
                    onExamPress={handleExamPress} 
                    onNavigateToCalculator={onNavigateToCalculator}
                />
            )}

            <ExamDetailModal
                visible={modalVisible}
                exam={selectedExam}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedExam(null);
                }}
                onNavigateToCalculator={onNavigateToCalculator}
            />

            {/* Delete Confirmation Modal */}
            <Modal visible={!!deleteExam} animationType="fade" transparent onRequestClose={() => setDeleteExam(null)}>
                <TouchableOpacity 
                    style={styles.deleteOverlay} 
                    activeOpacity={1} 
                    onPress={() => setDeleteExam(null)}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.deleteCard} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.deleteIconCircle}>
                            <Feather name="trash-2" size={28} color="#EF4444" />
                        </View>
                        <Text style={styles.deleteTitle}>Sınavı Kaldır</Text>
                        <Text style={styles.deleteMessage}>
                            "{deleteExam?.courseName}" sınavını silmek istediğinize emin misiniz?
                        </Text>
                        <View style={styles.deleteButtons}>
                            <TouchableOpacity style={styles.deleteCancelBtn} onPress={() => setDeleteExam(null)}>
                                <Text style={styles.deleteCancelText}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteConfirmBtn} onPress={confirmDelete}>
                                <Text style={styles.deleteConfirmText}>Sil</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
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
        paddingVertical: spacing.md,
        backgroundColor: colors.backgroundCard,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight || colors.border,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.backgroundMain,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight || '#E2E8F0',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerMainTitle: {
        fontSize: 14,
        fontWeight: fontWeight.bold,
        color: colors.textSecondary,
        letterSpacing: 1,
    },
    menuButton: {
        padding: spacing.xs,
        width: 40,
        alignItems: 'flex-end',
    },
    // Delete Confirmation Modal
    deleteOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 44, 89, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    deleteCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: borderRadius.xl,
        padding: spacing.xxxl,
        alignItems: 'center',
        ...shadows.modal,
    },
    deleteIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FEF2F2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    deleteTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: '#0F2C59',
        marginBottom: spacing.md,
    },
    deleteMessage: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: spacing.xxl,
    },
    deleteButtons: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    deleteCancelBtn: {
        paddingVertical: spacing.md + 2,
        paddingHorizontal: spacing.xxxl,
        borderRadius: borderRadius.full,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    deleteCancelText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: '#475569',
    },
    deleteConfirmBtn: {
        paddingVertical: spacing.md + 2,
        paddingHorizontal: spacing.xxxl + spacing.lg,
        borderRadius: borderRadius.full,
        backgroundColor: '#EF4444',
        ...shadows.button,
    },
    deleteConfirmText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: '#FFFFFF',
    },
});

