import React, { useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, fontWeight } from './theme';
import { Course } from './types';
import { generateWeekDays, getMonthName, lunchBreak } from './mockData';
import { useAcademic } from '../../../contexts/AcademicContext';
import type { SelectableOffering } from '../../../lib/domain';
import Header from './components/Header';
import DaySelector from './components/DaySelector';
import CourseCard from './components/CourseCard';
import LunchBreak from './components/LunchBreak';
import FloatingActionButton from './components/FloatingActionButton';
import AddCourseModal from './components/AddCourseModal';

export default function DersProgramiScreen() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const swipeStartX = useRef(0);
    const swipeStartY = useRef(0);
    const swipeCurrentX = useRef(0);
    const swipeCurrentY = useRef(0);
    const {
        loading,
        timetableEntries,
        examList,
        searchAvailableOfferings,
        addLocalOffering,
        removeOffering,
    } = useAcademic();

    const weekDays = useMemo(() => generateWeekDays(selectedDate), [selectedDate]);
    const monthYear = useMemo(() => getMonthName(selectedDate), [selectedDate]);
    const dayNames = ['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi'];
    const selectedDayName = dayNames[selectedDate.getDay()].toUpperCase();
    const selectedDayOfWeek = selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1;

    const courses = useMemo<Course[]>(() => {
        return timetableEntries.map((entry) => {
            const hasConflict = examList.some((exam) => exam.offeringId === entry.offeringId && exam.hasConflict);
            return {
                id: `${entry.offeringId}-${entry.startTime}`,
                offeringId: entry.offeringId,
                code: entry.courseCode,
                name: entry.courseName,
                instructor: entry.instructor,
                startTime: entry.startTime,
                endTime: entry.endTime,
                room: entry.room,
                building: entry.building,
                dayOfWeek: entry.dayOfWeek,
                isOnline: entry.isOnline,
                hasConflict,
                canRemove: true,
            };
        });
    }, [examList, timetableEntries]);

    const coursesForDay = useMemo(
        () => courses.filter((course) => course.dayOfWeek === selectedDayOfWeek),
        [courses, selectedDayOfWeek]
    );

    const morningCourses = coursesForDay.filter((course) => Number(course.startTime.split(':')[0]) < 12);
    const afternoonCourses = coursesForDay.filter((course) => Number(course.startTime.split(':')[0]) >= 12);

    const activeTimeSlot = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;

    const shiftSelectedDate = (dayOffset: number) => {
        setSelectedDate((currentDate) => {
            const nextDate = new Date(currentDate);
            nextDate.setDate(currentDate.getDate() + dayOffset);
            return nextDate;
        });
    };

    const handleSwipeRelease = () => {
        const deltaX = swipeCurrentX.current - swipeStartX.current;
        const deltaY = swipeCurrentY.current - swipeStartY.current;

        if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) {
            return;
        }

        if (deltaX < 0) {
            shiftSelectedDate(1);
        } else {
            shiftSelectedDate(-1);
        }
    };

    const handleSaveCourse = async (offering: SelectableOffering) => {
        await addLocalOffering(offering);
    };

    const handleRemoveCourse = (offeringId: string) => {
        Alert.alert(
            'Dersi kaldir',
            'Bu islem yalnizca bu cihazdaki ders programi, sinav takvimi ve devamsizliga yansir.',
            [
                { text: 'Vazgec', style: 'cancel' },
                {
                    text: 'Kaldir',
                    style: 'destructive',
                    onPress: () => {
                        void removeOffering(offeringId);
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header monthYear={monthYear} />

            <DaySelector days={weekDays} onDaySelect={setSelectedDate} />

            <View
                style={styles.contentArea}
                onStartShouldSetResponder={() => false}
                onStartShouldSetResponderCapture={(event) => {
                    swipeStartX.current = event.nativeEvent.pageX;
                    swipeStartY.current = event.nativeEvent.pageY;
                    swipeCurrentX.current = event.nativeEvent.pageX;
                    swipeCurrentY.current = event.nativeEvent.pageY;
                    return false;
                }}
                onMoveShouldSetResponderCapture={(event) => {
                    const { pageX, pageY } = event.nativeEvent;
                    const deltaX = pageX - swipeStartX.current;
                    const deltaY = pageY - swipeStartY.current;
                    return Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY);
                }}
                onResponderGrant={(event) => {
                    swipeStartX.current = event.nativeEvent.pageX;
                    swipeStartY.current = event.nativeEvent.pageY;
                    swipeCurrentX.current = event.nativeEvent.pageX;
                    swipeCurrentY.current = event.nativeEvent.pageY;
                }}
                onResponderMove={(event) => {
                    swipeCurrentX.current = event.nativeEvent.pageX;
                    swipeCurrentY.current = event.nativeEvent.pageY;
                }}
                onResponderRelease={handleSwipeRelease}
                onResponderTerminate={handleSwipeRelease}
            >
                <View style={styles.dayLabelContainer}>
                    <Text style={styles.dayLabel}>{selectedDayName}</Text>
                </View>

                <ScrollView style={styles.timeline} showsVerticalScrollIndicator={false} contentContainerStyle={styles.timelineContent}>
                    {loading ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>⏳</Text>
                            <Text style={styles.emptyTitle}>Program yukleniyor</Text>
                            <Text style={styles.emptySubtitle}>Aktif donem ve local override verileri hazirlaniyor.</Text>
                        </View>
                    ) : coursesForDay.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>📚</Text>
                            <Text style={styles.emptyTitle}>Bu gun icin ders yok</Text>
                            <Text style={styles.emptySubtitle}>Buluttaki ders acilislarindan local olarak ekleme yapabilirsiniz.</Text>
                        </View>
                    ) : (
                        <>
                            {morningCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    isActive={activeTimeSlot >= course.startTime && activeTimeSlot <= course.endTime}
                                    onRemove={handleRemoveCourse}
                                />
                            ))}

                            {morningCourses.length > 0 && afternoonCourses.length > 0 && (
                                <LunchBreak startTime={lunchBreak.startTime} endTime={lunchBreak.endTime} />
                            )}

                            {afternoonCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    isActive={activeTimeSlot >= course.startTime && activeTimeSlot <= course.endTime}
                                    onRemove={handleRemoveCourse}
                                />
                            ))}
                        </>
                    )}
                </ScrollView>
            </View>

            <View pointerEvents="box-none" style={styles.fabLayer}>
                <FloatingActionButton onPress={() => setIsModalVisible(true)} />
            </View>

            <AddCourseModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSearch={searchAvailableOfferings}
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
    contentArea: {
        flex: 1,
    },
    fabLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
        elevation: 100,
        pointerEvents: 'box-none',
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
        paddingBottom: 100,
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
        lineHeight: 22,
    },
});
