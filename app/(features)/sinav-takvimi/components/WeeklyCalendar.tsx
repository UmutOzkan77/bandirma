import React, { useMemo, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import type { Exam, WeekDay } from '../utils';
import { Feather } from '@expo/vector-icons';

interface WeeklyCalendarProps {
    weekDays: WeekDay[];
    exams: Exam[];
    selectedDate: string;
    onDayPress: (date: string) => void;
    onExamPress: (exam: Exam) => void;
    onExamLongPress?: (exam: Exam) => void;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    weekLabel: string;
}

const START_HOUR = 8;
const END_HOUR = 18;
const HOUR_HEIGHT = 120;
const DAY_WIDTH = 180; // Kartlarin genis olmasi icin sabit genislik
const TIME_COL_WIDTH = 60;

const timeToMinutes = (time: string) => {
    if (!time) return 0;
    const [h, m] = time.split(':').map(Number);
    return (h * 60) + (m || 0);
};

export default function WeeklyCalendar({
    weekDays,
    exams,
    selectedDate,
    onDayPress,
    onExamPress,
    onExamLongPress,
    onPreviousWeek,
    onNextWeek,
    weekLabel,
}: WeeklyCalendarProps) {
    const [currentTimeMinutes, setCurrentTimeMinutes] = useState(() => {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    });

    const headerScrollRef = useRef<ScrollView>(null);
    
    // Ekrana tam sigmasi icin baslangic zoom seviyesini hesapliyoruz, ama kullanici 
    // bir tik daha buyuk acilmasini istedigi icin + 0.25 ekliyoruz
    const screenWidth = Dimensions.get('window').width;
    const availableWidth = screenWidth - (spacing.md * 2) - TIME_COL_WIDTH;
    const fitToScreenZoom = availableWidth / (Math.max(1, weekDays.length) * DAY_WIDTH);
    const initialZoom = Math.min(4, Math.max(0.25, fitToScreenZoom + 0.25));
    
    const [zoomLevel, setZoomLevel] = useState(initialZoom);

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 4)); // max zoom x4
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.25)); // min zoom x0.25

    const currentHourHeight = Math.round(HOUR_HEIGHT * zoomLevel);
    const currentDayWidth = Math.round(DAY_WIDTH * zoomLevel);

    // Update current time indicator every minute
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Generate hours array [8, 9, 10... 18]
    const hours = useMemo(() => {
        const arr = [];
        for (let i = START_HOUR; i <= END_HOUR; i++) {
            arr.push(i);
        }
        return arr;
    }, []);

    // Group exams by date and find overlaps to determine color theme
    const examsByDate = useMemo(() => {
        const grouped: Record<string, any[]> = {};
        weekDays.forEach(day => {
            grouped[day.date] = [];
        });

        exams.forEach(exam => {
            if (grouped[exam.date]) {
                grouped[exam.date].push(exam);
            }
        });

        Object.keys(grouped).forEach(date => {
            let dayExams = grouped[date];
            // Sort by start time
            dayExams.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

            // Assign themes based on overlap
            let lastEndTime = 0;
            dayExams.forEach((exam, index) => {
                const startMins = timeToMinutes(exam.startTime);
                const endMins = timeToMinutes(exam.endTime) || (startMins + 60);
                
                const isOverlapping = startMins < lastEndTime;
                
                grouped[date][index] = {
                    ...exam,
                    startMins,
                    endMins,
                    theme: isOverlapping ? 'light' : 'dark',
                    offsetLeft: isOverlapping ? 24 : 4,
                    offsetRight: isOverlapping ? 0 : 16,
                    zIndex: isOverlapping ? 10 + index : index,
                };
                
                lastEndTime = Math.max(lastEndTime, endMins);
            });
        });

        return grouped;
    }, [exams, weekDays]);

    const handleGridHorizontalScroll = (e: any) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        headerScrollRef.current?.scrollTo({ x: offsetX, animated: false });
    };

    return (
        <View style={styles.container}>
            {/* Pill Navigator */}
            <View style={styles.navContainer}>
                <View style={styles.navPill}>
                    <TouchableOpacity onPress={onPreviousWeek} style={styles.navArrow}>
                        <Feather name="chevron-left" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.navLabel}>{weekLabel}</Text>
                    <TouchableOpacity onPress={onNextWeek} style={styles.navArrow}>
                        <Feather name="chevron-right" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.calendarBody}>
                {/* Header Row (Fixed Time + Scrollable Days) */}
                <View style={styles.headerRow}>
                    <View style={styles.timeColumnHeader}>
                        <Text style={styles.timeColumnHeaderText}>TIME</Text>
                    </View>
                    <ScrollView 
                        ref={headerScrollRef} 
                        horizontal 
                        scrollEnabled={false} 
                        showsHorizontalScrollIndicator={false}
                        style={styles.daysScrollHeader}
                    >
                        <View style={{ flexDirection: 'row', width: currentDayWidth * weekDays.length }}>
                            {weekDays.map(day => {
                                const isSelected = day.date === selectedDate;
                                return (
                                    <View 
                                        key={day.date} 
                                        style={[styles.dayHeader, { width: currentDayWidth }]}
                                    >
                                        <Text style={[styles.dayName, isSelected && styles.daySelectedText]}>
                                            {day.dayName.substring(0, 3).toUpperCase()}
                                        </Text>
                                        <Text style={[styles.dayNumber, isSelected && styles.daySelectedText]}>
                                            {day.dayNumber}
                                        </Text>
                                        {isSelected && <View style={styles.dayActiveLine} />}
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>

                {/* Vertical Scroll for entire grid (Time + Days) */}
                <ScrollView 
                    style={styles.gridVerticalScroll} 
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.gridInner}>
                        {/* Fixed Time Labels Column */}
                        <View style={styles.timeColumn}>
                            {hours.map(hour => (
                                <View key={hour} style={[styles.timeLabelContainer, { height: currentHourHeight }]}>
                                    <Text style={styles.timeLabelText}>
                                        {hour.toString().padStart(2, '0')}:00
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Horizontal Scroll for Grid content */}
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleGridHorizontalScroll}
                            scrollEventThrottle={16}
                            style={styles.gridHorizontalScroll}
                        >
                            <View style={[styles.daysGrid, { width: currentDayWidth * weekDays.length }]}>
                                {/* Horizontal Grid Lines */}
                                {hours.map((hour, index) => (
                                    <View 
                                        key={`line-${hour}`} 
                                        style={[
                                            styles.gridLine, 
                                            { top: index * currentHourHeight }
                                        ]} 
                                    />
                                ))}

                                {/* Current Time Indicator */}
                                {currentTimeMinutes >= START_HOUR * 60 && currentTimeMinutes <= END_HOUR * 60 && (
                                    <View 
                                        style={[
                                            styles.currentTimeLine,
                                            { top: (currentTimeMinutes / 60 - START_HOUR) * currentHourHeight }
                                        ]}
                                    >
                                        <View style={styles.currentTimeDot} />
                                    </View>
                                )}

                                {/* Vertical Day Columns with Exams */}
                                {weekDays.map((day, dayIdx) => (
                                    <View 
                                        key={day.date} 
                                        style={[
                                            styles.dayGridColumn,
                                            { width: currentDayWidth },
                                            dayIdx > 0 && styles.dayGridColumnBorder
                                        ]}
                                    >
                                        {examsByDate[day.date].map(exam => {
                                            const top = (exam.startMins / 60 - START_HOUR) * currentHourHeight;
                                            const height = ((exam.endMins - exam.startMins) / 60) * currentHourHeight;
                                            
                                            const isDark = exam.theme === 'dark';
                                            
                                            return (
                                                <TouchableOpacity
                                                    key={exam.id}
                                                    style={[
                                                        styles.examBlock,
                                                        { 
                                                            top, 
                                                            height,
                                                            left: exam.offsetLeft,
                                                            right: exam.offsetRight,
                                                            zIndex: exam.zIndex,
                                                            backgroundColor: isDark ? '#0F2C59' : '#FFFFFF',
                                                            borderLeftColor: isDark ? '#3B82F6' : '#94A3B8',
                                                            ...(isDark ? shadows.card : shadows.button)
                                                        }
                                                    ]}
                                                    activeOpacity={0.8}
                                                    onPress={() => onExamPress(exam)}
                                                    onLongPress={() => onExamLongPress && onExamLongPress(exam)}
                                                    delayLongPress={500}
                                                >
                                                    <Text style={[styles.examTimeText, { color: isDark ? '#93C5FD' : '#64748B' }]} numberOfLines={1}>
                                                        {exam.startTime} - {exam.endTime}
                                                    </Text>
                                                    
                                                    <View style={styles.examContentWrapper}>
                                                        <Text style={[styles.examNameText, { color: isDark ? '#FFFFFF' : '#1E293B' }]} numberOfLines={height > 100 ? 2 : 1}>
                                                            {exam.courseName}
                                                        </Text>
                                                        {height > 60 && (
                                                            <Text style={[styles.examCodeText, { color: isDark ? '#CBD5E1' : '#475569' }]} numberOfLines={1}>
                                                                {exam.courseCode}
                                                            </Text>
                                                        )}
                                                    </View>
                                                    
                                                    {height > 80 && (
                                                        <View style={styles.examLocationRow}>
                                                            <Feather name="map-pin" size={10} color={isDark ? '#94A3B8' : '#64748B'} />
                                                            <Text style={[styles.examLocationText, { color: isDark ? '#94A3B8' : '#64748B' }]} numberOfLines={1}>
                                                                {exam.room}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                    <View style={{ height: spacing.xxxl * 2 }} />
                </ScrollView>
            </View>

            {/* Floating Zoom Controls (Bottom Left) */}
            <View style={styles.zoomControls}>
                <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton}>
                    <Feather name="zoom-in" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton}>
                    <Feather name="zoom-out" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundMain,
    },
    navContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    navPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...shadows.card,
    },
    navArrow: {
        padding: spacing.xs,
    },
    navLabel: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginHorizontal: spacing.xl,
    },
    zoomControls: {
        flexDirection: 'column',
        position: 'absolute',
        right: spacing.lg,
        bottom: 95, // Barın biraz üstünde
        zIndex: 100,
    },
    zoomButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...shadows.card,
    },
    calendarBody: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        overflow: 'hidden',
        marginBottom: spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        zIndex: 2,
        backgroundColor: '#FFF',
    },
    timeColumnHeader: {
        width: TIME_COL_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#F1F5F9',
    },
    timeColumnHeaderText: {
        fontSize: 10,
        color: colors.textMuted,
        fontWeight: fontWeight.bold,
    },
    daysScrollHeader: {
        flex: 1,
    },
    dayHeader: {
        width: DAY_WIDTH,
        alignItems: 'center',
        paddingVertical: spacing.md,
        position: 'relative',
    },
    dayName: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    dayNumber: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    daySelectedText: {
        color: '#3B82F6',
        fontWeight: fontWeight.bold,
    },
    dayActiveLine: {
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: 3,
        backgroundColor: '#3B82F6',
        borderRadius: 2,
    },
    gridVerticalScroll: {
        flex: 1,
    },
    gridInner: {
        flexDirection: 'row',
        position: 'relative',
        paddingBottom: 24,
    },
    timeColumn: {
        width: TIME_COL_WIDTH,
        borderRightWidth: 1,
        borderRightColor: '#F1F5F9',
    },
    timeLabelContainer: {
        alignItems: 'center',
        justifyContent: 'center', // Saatleri tam ortaya alir
    },
    timeLabelText: {
        fontSize: 11,
        color: colors.textMuted,
        fontWeight: '500',
    },
    gridHorizontalScroll: {
        flex: 1,
    },
    daysGrid: {
        flexDirection: 'row',
        position: 'relative',
    },
    gridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#F1F5F9',
    },
    dayGridColumn: {
        position: 'relative',
    },
    dayGridColumnBorder: {
        borderLeftWidth: 1,
        borderLeftColor: '#F1F5F9',
    },
    examBlock: {
        position: 'absolute',
        borderRadius: borderRadius.md,
        borderLeftWidth: 4,
        padding: spacing.sm,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    examContentWrapper: {
        flex: 1,
        overflow: 'hidden',
    },
    examTimeText: {
        fontSize: 11,
        marginBottom: 4,
        fontWeight: '600',
    },
    examNameText: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 4,
        lineHeight: 16,
    },
    examCodeText: {
        fontSize: 11,
        marginBottom: 2,
    },
    examLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 'auto',
    },
    examLocationText: {
        fontSize: 11,
        marginLeft: 4,
        fontWeight: '500',
    },
    currentTimeLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#3B82F6',
        zIndex: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    currentTimeDot: {
        position: 'absolute',
        left: -4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3B82F6',
    },
});
