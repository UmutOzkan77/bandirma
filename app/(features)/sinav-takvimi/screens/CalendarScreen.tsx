/**
 * CalendarScreen - Sınav Takvimi
 * Haftalık sınav takvimi görünümü
 */
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';
import { upcomingExams, getWeekDays, Exam } from '../mockData';
import WeeklyCalendar from '../components/WeeklyCalendar';
import ExamDetailModal from '../components/ExamDetailModal';
import ExamListItem from '../components/ExamListItem';

import { Feather } from '@expo/vector-icons';

interface CalendarScreenProps {
    onNavigateToCalculator?: () => void;
}

export default function CalendarScreen({ onNavigateToCalculator }: CalendarScreenProps) {
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [selectedDate, setSelectedDate] = useState<string>('2026-02-10');
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [weekOffset, setWeekOffset] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

    // Haftanın günlerini hesapla
    const getWeekStart = () => {
        const today = new Date('2026-02-09'); // Mock starting date (Monday)
        today.setDate(today.getDate() + (weekOffset * 7));
        return today;
    };

    const weekDays = getWeekDays(getWeekStart());

    // Hafta label'ı
    const getWeekLabel = () => {
        const startDay = weekDays[0];
        const endDay = weekDays[4]; // Cuma
        const months = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        const startDate = new Date(startDay.date);
        const endDate = new Date(endDay.date);
        return `${startDate.getDate()} - ${endDate.getDate()} ${months[startDate.getMonth()]} ${startDate.getFullYear()}`;
    };

    const handleExamPress = (exam: Exam) => {
        setSelectedExam(exam);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedExam(null);
    };

    const handleNavigateToCalculator = () => {
        handleCloseModal();
        if (onNavigateToCalculator) {
            onNavigateToCalculator();
        }
    };

    return (
        <View style={styles.container}>
            {/* Header with Menu */}
            <View style={styles.header}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => setShowMenu(!showMenu)}
                >
                    <Feather name="more-horizontal" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Dropdown Menu */}
            {showMenu && (
                <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                        style={[styles.menuItem, viewMode === 'calendar' && styles.menuItemActive]}
                        onPress={() => {
                            setViewMode('calendar');
                            setShowMenu(false);
                        }}
                    >
                        <Feather name="calendar" size={18} color={viewMode === 'calendar' ? colors.accent : colors.textPrimary} />
                        <Text style={[styles.menuItemText, viewMode === 'calendar' && styles.menuItemTextActive]}>Takvim Görünümü</Text>
                    </TouchableOpacity>
                    <View style={styles.menuDivider} />
                    <TouchableOpacity
                        style={[styles.menuItem, viewMode === 'list' && styles.menuItemActive]}
                        onPress={() => {
                            setViewMode('list');
                            setShowMenu(false);
                        }}
                    >
                        <Feather name="list" size={18} color={viewMode === 'list' ? colors.accent : colors.textPrimary} />
                        <Text style={[styles.menuItemText, viewMode === 'list' && styles.menuItemTextActive]}>Liste Görünümü</Text>
                    </TouchableOpacity>
                </View>
            )}

            {viewMode === 'calendar' ? (
                <WeeklyCalendar
                    weekDays={weekDays}
                    exams={upcomingExams}
                    selectedDate={selectedDate}
                    onDayPress={setSelectedDate}
                    onExamPress={handleExamPress}
                    onPreviousWeek={() => setWeekOffset(prev => prev - 1)}
                    onNextWeek={() => setWeekOffset(prev => prev + 1)}
                    weekLabel={getWeekLabel()}
                />
            ) : (
                <FlatList
                    data={upcomingExams}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ExamListItem
                            exam={item}
                            onPress={handleExamPress}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <ExamDetailModal
                visible={modalVisible}
                exam={selectedExam}
                onClose={handleCloseModal}
                onNavigateToCalculator={handleNavigateToCalculator}
            />
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.backgroundCard,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        zIndex: 10,
    },
    menuButton: {
        padding: spacing.xs,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 60,
        right: spacing.lg,
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
        padding: spacing.xs,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 20,
        minWidth: 180,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.sm,
    },
    menuItemActive: {
        backgroundColor: colors.backgroundSubtle,
    },
    menuItemText: {
        marginLeft: spacing.md,
        fontSize: fontSize.sm,
        color: colors.textPrimary,
    },
    menuItemTextActive: {
        color: colors.accent,
        fontWeight: fontWeight.bold,
    },
    menuDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: spacing.sm,
    },
    listContainer: {
        padding: spacing.md,
    },
});
