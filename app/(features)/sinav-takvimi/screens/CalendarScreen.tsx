import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';
import { Feather } from '@expo/vector-icons';
import WeeklyCalendar from '../components/WeeklyCalendar';
import ExamDetailModal from '../components/ExamDetailModal';
import ExamListItem from '../components/ExamListItem';
import { useAcademic } from '../../../../contexts/AcademicContext';
import type { Exam } from '../utils';
import { formatDate, getWeekDays, getWeekStart } from '../utils';

interface CalendarScreenProps {
    onNavigateToCalculator?: () => void;
}

export default function CalendarScreen({ onNavigateToCalculator }: CalendarScreenProps) {
    const { examList } = useAcademic();
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [weekOffset, setWeekOffset] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(!showMenu)}>
                    <Feather name="more-horizontal" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

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
                        <Text style={[styles.menuItemText, viewMode === 'calendar' && styles.menuItemTextActive]}>Takvim Gorunumu</Text>
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
                        <Text style={[styles.menuItemText, viewMode === 'list' && styles.menuItemTextActive]}>Liste Gorunumu</Text>
                    </TouchableOpacity>
                </View>
            )}

            {viewMode === 'calendar' ? (
                <WeeklyCalendar
                    weekDays={weekDays}
                    exams={filteredExams}
                    selectedDate={selectedDate}
                    onDayPress={setSelectedDate}
                    onExamPress={handleExamPress}
                    onPreviousWeek={() => setWeekOffset((prev) => prev - 1)}
                    onNextWeek={() => setWeekOffset((prev) => prev + 1)}
                    weekLabel={weekLabel}
                />
            ) : (
                <FlatList
                    data={filteredExams}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ExamListItem exam={item} onPress={handleExamPress} />}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>Aktif sinav takvimi bulunmuyor.</Text>}
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
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
    emptyText: {
        padding: spacing.lg,
        color: colors.textSecondary,
    },
});
