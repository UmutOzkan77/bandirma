/**
 * CalendarScreen - Sınav Takvimi
 * Haftalık sınav takvimi görünümü
 */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { upcomingExams, getWeekDays, Exam } from '../mockData';
import WeeklyCalendar from '../components/WeeklyCalendar';
import ExamDetailModal from '../components/ExamDetailModal';

interface CalendarScreenProps {
    onNavigateToCalculator?: () => void;
}

export default function CalendarScreen({ onNavigateToCalculator }: CalendarScreenProps) {
    const [selectedDate, setSelectedDate] = useState<string>('2026-02-10');
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [weekOffset, setWeekOffset] = useState(0);

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
        backgroundColor: colors.backgroundDark,
    },
});
