import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../theme';
import type { Exam } from '../utils';

interface ExamTimelineCardProps {
    exam: Exam;
    isActive?: boolean;
    onRemove?: (examId: string) => void;
}

export default function ExamTimelineCard({ exam, isActive = false, onRemove }: ExamTimelineCardProps) {
    const isManual = exam.id.startsWith('manual-');

    return (
        <View style={styles.container}>
            <View style={styles.timelineSection}>
                <View
                    style={[
                        styles.timelineDot,
                        isActive
                            ? styles.timelineDotActive
                            : styles.timelineDotInactive,
                    ]}
                />
                <View style={styles.timelineLine} />
            </View>

            <TouchableOpacity 
                style={styles.card} 
                activeOpacity={0.8}
                onLongPress={isManual && onRemove ? () => onRemove(exam.id) : undefined}
                delayLongPress={500}
            >
                <View style={styles.courseNameRow}>
                    <Text style={styles.courseName}>{exam.courseName}</Text>
                </View>

                <Text style={styles.instructor}>
                    {exam.instructor || 'Öğretim Görevlisi Atanmadı'}
                </Text>

                <View style={styles.bottomRow}>
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>
                            {exam.startTime} - {exam.endTime}
                        </Text>
                    </View>

                    <View style={styles.roomContainer}>
                        <View style={styles.locationPinContainer}>
                            <View style={styles.locationPin}>
                                <View style={styles.locationPinInner} />
                            </View>
                            <View style={styles.locationPinTip} />
                        </View>
                        <Text style={styles.room}>{exam.room}</Text>
                    </View>
                </View>

                <View style={styles.footerRow}>
                    <Text style={styles.codeText}>{exam.courseCode}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 24, // increased to space cards out more
        marginTop: 8, // slight margin top so cards are a bit lower
    },
    timelineSection: {
        width: 24, // reduced from 32 so cards are more to the left
        alignItems: 'center',
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        zIndex: 2,
        marginTop: 28, // align with title
        backgroundColor: '#E2E8F0', // exactly same as timelineLine
    },
    timelineDotActive: {
        backgroundColor: '#E2E8F0',
    },
    timelineDotInactive: {
        backgroundColor: '#E2E8F0',
    },
    timelineLine: {
        position: 'absolute',
        top: 0,
        bottom: -32, // extend line to the next card across the margin
        width: 2,
        backgroundColor: '#E2E8F0', // solid gray line
        zIndex: 1,
    },
    card: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 20,
        marginLeft: 4, // reduced from 8 so card is more to the left

        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    courseNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4, // reduced from 6
    },
    courseName: {
        fontSize: 17, // reduced from 18
        fontWeight: fontWeight.bold,
        color: '#0F2C59',
    },
    instructor: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 16, // reduced from 24
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeContainer: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: borderRadius.full,
        paddingVertical: 4, // reduced from 6
        paddingHorizontal: 8, // reduced from 12
        backgroundColor: '#FFFFFF',
    },
    time: {
        fontSize: 12, // reduced from 13
        color: '#475569',
        fontWeight: fontWeight.medium,
    },
    roomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationPinContainer: {
        width: 14,
        height: 18,
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    locationPin: {
        width: 12, // reduced from 14
        height: 12, // reduced from 14
        borderRadius: 6, // reduced from 7
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationPinInner: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.backgroundCard,
    },
    locationPinTip: {
        width: 0,
        height: 0,
        borderLeftWidth: 3, // reduced from 4
        borderRightWidth: 3, // reduced from 4
        borderTopWidth: 5, // reduced from 6
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#3B82F6',
        marginTop: -1,
    },
    room: {
        fontSize: 13, // reduced from 14
        color: '#3B82F6',
        fontWeight: fontWeight.bold,
    },
    footerRow: {
        marginTop: 16, // reduced from 24
        paddingTop: 16, // reduced from 24
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    codeText: {
        fontSize: 12, // reduced from 13
        color: colors.textSecondary,
        fontWeight: fontWeight.bold,
    },
    removeButton: {
        borderRadius: borderRadius.md,
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 12, // reduced from 16
        paddingVertical: 6, // reduced from 8
    },
    removeText: {
        fontSize: 11, // reduced from 12
        color: '#B91C1C',
        fontWeight: fontWeight.bold,
    },
});
