/**
 * Ders Programı Ana Ekranı
 * Bandırma Onyedi Eylül Üniversitesi - Ders Programı Modülü
 */

import React, { useState, useMemo } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, fontWeight } from './theme';
import { Course } from './types';
import {
    allCourses,
    lunchBreak,
    generateWeekDays,
    getMonthName,
} from './mockData';

// Components
import Header from './components/Header';
import DaySelector from './components/DaySelector';
import CourseCard from './components/CourseCard';
import LunchBreak from './components/LunchBreak';
import FloatingActionButton from './components/FloatingActionButton';
import AddCourseModal from './components/AddCourseModal';

export default function DersProgramiScreen() {
    // Selected date state - default to today
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [courses, setCourses] = useState<Course[]>(allCourses);

    // Generate week days for the selector
    const weekDays = useMemo(() => generateWeekDays(selectedDate), [selectedDate]);

    // Get month name for header
    const monthYear = useMemo(() => getMonthName(selectedDate), [selectedDate]);

    // Get day name for the selected date
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const selectedDayName = dayNames[selectedDate.getDay()].toUpperCase();

    // Get courses for selected day
    const selectedDayOfWeek = selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1;
    const coursesForDay = useMemo(() => {
        return courses.filter(course => course.dayOfWeek === selectedDayOfWeek);
    }, [courses, selectedDayOfWeek]);

    // Separate morning and afternoon courses
    const morningCourses = coursesForDay.filter(c => {
        const hour = parseInt(c.startTime.split(':')[0]);
        return hour < 12;
    });

    const afternoonCourses = coursesForDay.filter(c => {
        const hour = parseInt(c.startTime.split(':')[0]);
        return hour >= 12;
    });

    // Current active course (for demo, first course of the day)
    const activeTimeSlot = '08:45';

    const handleDaySelect = (date: Date) => {
        setSelectedDate(date);
    };



    const handleAddCourse = () => {
        setIsModalVisible(true);
    };

    const handleSaveCourse = (newCourse: {
        name: string;
        instructor: string;
        room: string;
        selectedDays: boolean[];
        startTime: string;
        endTime: string;
    }) => {
        // Create new course and add to list
        const course: Course = {
            id: String(courses.length + 1),
            name: newCourse.name.toUpperCase(),
            instructor: newCourse.instructor,
            startTime: newCourse.startTime,
            endTime: newCourse.endTime,
            room: newCourse.room,
            dayOfWeek: selectedDayOfWeek,
        };
        setCourses([...courses, course]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header with month/year */}
            <Header monthYear={monthYear} />

            {/* Day Selector */}
            <DaySelector
                days={weekDays}
                onDaySelect={handleDaySelect}
            />

            {/* Day Name Label */}
            <View style={styles.dayLabelContainer}>
                <Text style={styles.dayLabel}>{selectedDayName}</Text>
            </View>

            {/* Course Timeline */}
            <ScrollView
                style={styles.timeline}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.timelineContent}
            >
                {coursesForDay.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📚</Text>
                        <Text style={styles.emptyTitle}>Bu gün için ders yok</Text>
                        <Text style={styles.emptySubtitle}>
                            Yeni ders eklemek için + butonuna tıklayın
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Morning Courses */}
                        {morningCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isActive={course.startTime === activeTimeSlot}
                            />
                        ))}

                        {/* Lunch Break (if there are afternoon courses) */}
                        {morningCourses.length > 0 && afternoonCourses.length > 0 && (
                            <LunchBreak
                                startTime={lunchBreak.startTime}
                                endTime={lunchBreak.endTime}
                            />
                        )}

                        {/* Afternoon Courses */}
                        {afternoonCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isActive={false}
                            />
                        ))}
                    </>
                )}
            </ScrollView>

            {/* Floating Action Button */}
            <FloatingActionButton onPress={handleAddCourse} />

            {/* Add Course Modal */}
            <AddCourseModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSave={handleSaveCourse}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    dayLabelContainer: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
    },
    dayLabel: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.textSecondary,
        letterSpacing: 1,
    },
    timeline: {
        flex: 1,
    },
    timelineContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 100, // Space for FAB
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    emptySubtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
