import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { useAcademic } from '../../../../contexts/AcademicContext';
import DaySelector from '../components/DaySelector';
import ExamTimelineCard from '../components/ExamTimelineCard';
import AddExamModal from '../components/AddExamModal';
import { Feather } from '@expo/vector-icons';
import type { Exam } from '../utils';

interface ExamListViewProps {
    onExamPress: (exam: Exam) => void;
    onNavigateToCalculator?: () => void;
}

export default function ExamListView({ onExamPress, onNavigateToCalculator }: ExamListViewProps) {
    const { examList, removeExam } = useAcademic();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isFabOpen, setIsFabOpen] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [deleteExamId, setDeleteExamId] = useState<string | null>(null);

    const deleteExamData = useMemo(() => {
        if (!deleteExamId) return null;
        return examList.find(e => e.id === deleteExamId) || null;
    }, [deleteExamId, examList]);

    const monthNamesTr = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const currentMonthYear = `${monthNamesTr[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

    const daysWindow = useMemo(() => {
        const today = new Date();
        const days = [];
        const dayNamesTr = ['PAZ', 'PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT'];
        for (let i = -7; i <= 14; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            days.push({
                date: d,
                dayNumber: d.getDate(),
                dayAbbr: dayNamesTr[d.getDay()],
                isSelected: d.toDateString() === selectedDate.toDateString(),
            });
        }
        return days;
    }, [selectedDate]);

    const fullDayNamesTr = ['PAZAR', 'PAZARTESİ', 'SALI', 'ÇARŞAMBA', 'PERŞEMBE', 'CUMA', 'CUMARTESİ'];
    const selectedDayName = fullDayNamesTr[selectedDate.getDay()];

    const selectedDateStr = selectedDate.toISOString().slice(0, 10);
    const dayExams = useMemo(() => {
        return examList.filter(e => e.date === selectedDateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [examList, selectedDateStr]);

    const toggleFab = () => {
        setIsFabOpen(!isFabOpen);
    };

    const handleLongPressRemove = (examId: string) => {
        setDeleteExamId(examId);
    };

    const confirmDelete = () => {
        if (deleteExamId) {
            removeExam(deleteExamId);
            setDeleteExamId(null);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Area */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{currentMonthYear}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Day Selector */}
                <DaySelector days={daysWindow} onDaySelect={setSelectedDate} />

                {/* Selected Day Label */}
                <View style={styles.selectedDayLabelContainer}>
                    <Text style={styles.selectedDayLabel}>{selectedDayName}</Text>
                </View>

                {/* Timeline and Cards */}
                <View style={styles.timelineContainer}>
                    {dayExams.length > 0 ? (
                        dayExams.map((exam, index) => (
                            <ExamTimelineCard 
                                key={exam.id} 
                                exam={exam} 
                                isActive={index === 0} 
                                onRemove={handleLongPressRemove}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>Bu güne ait sınav bulunmuyor.</Text>
                        </View>
                    )}
                </View>
                
                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* FAB Overlay */}
            {isFabOpen && (
                <TouchableWithoutFeedback onPress={toggleFab}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            {/* FAB Actions */}
            {isFabOpen && (
                <View style={styles.fabActions}>
                    <TouchableOpacity 
                        style={styles.fabActionItem}
                        onPress={() => {
                            toggleFab();
                            setIsAddModalVisible(true);
                        }}
                    >
                        <Text style={styles.fabActionLabel}>Sınav/Quiz Ekle</Text>
                        <View style={styles.fabActionButton}>
                            <Feather name="edit-2" size={20} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.fabActionItem}
                        onPress={() => {
                            toggleFab();
                            if(onNavigateToCalculator) onNavigateToCalculator();
                        }}
                    >
                        <Text style={styles.fabActionLabel}>Final Puanı Hesapla</Text>
                        <View style={[styles.fabActionButton, { backgroundColor: colors.secondary }]}>
                            <Feather name="percent" size={20} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            {/* Main Floating Action Button */}
            <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={toggleFab}>
                <Feather name={isFabOpen ? "x" : "plus"} size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <AddExamModal 
                visible={isAddModalVisible} 
                onClose={() => setIsAddModalVisible(false)} 
            />

            {/* Delete Confirmation Modal */}
            <Modal visible={!!deleteExamId} animationType="fade" transparent onRequestClose={() => setDeleteExamId(null)}>
                <TouchableOpacity 
                    style={styles.deleteOverlay} 
                    activeOpacity={1} 
                    onPress={() => setDeleteExamId(null)}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.deleteCard} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.deleteIconCircle}>
                            <Feather name="trash-2" size={28} color="#EF4444" />
                        </View>
                        <Text style={styles.deleteTitle}>Sınavı Kaldır</Text>
                        <Text style={styles.deleteMessage}>
                            "{deleteExamData?.courseName}" sınavını silmek istediğinize emin misiniz?
                        </Text>
                        <View style={styles.deleteButtons}>
                            <TouchableOpacity style={styles.deleteCancelBtn} onPress={() => setDeleteExamId(null)}>
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
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md, 
        paddingBottom: spacing.sm,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: fontWeight.bold,
        color: colors.primary,
    },
    scrollContent: {
        paddingTop: spacing.sm,
    },
    selectedDayLabelContainer: {
        paddingHorizontal: spacing.lg,
        marginTop: spacing.md,
        marginBottom: spacing.md,
    },
    selectedDayLabel: {
        fontSize: 12,
        fontWeight: fontWeight.bold,
        color: colors.textSecondary,
        letterSpacing: 0.5,
    },
    timelineContainer: {
        paddingHorizontal: spacing.lg,
    },
    emptyState: {
        padding: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    emptyStateText: {
        color: colors.textSecondary,
        fontStyle: 'italic',
    },
    bottomSpacing: {
        height: spacing.xxl * 3,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.85)',
        zIndex: 10,
    },
    fabActions: {
        position: 'absolute',
        bottom: 190, // pushed even higher
        right: spacing.lg,
        alignItems: 'flex-end',
        zIndex: 20,
    },
    fabActionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    fabActionLabel: {
        backgroundColor: colors.backgroundCard,
        color: colors.textPrimary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        marginRight: spacing.sm,
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        borderWidth: 1,
        borderColor: colors.borderLight || '#E2E8F0',
        ...shadows.card,
    },
    fabActionButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.button,
    },
    fab: {
        position: 'absolute',
        bottom: 120,
        right: spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        ...shadows.button,
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
