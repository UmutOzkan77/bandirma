import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../theme';
import { Course } from '../types';

interface CourseCardProps {
    course: Course;
    isActive?: boolean;
    onRemove?: (offeringId: string) => void;
}

export default function CourseCard({ course, isActive = false, onRemove }: CourseCardProps) {
    return (
        <View style={styles.container}>
            <View style={styles.timelineSection}>
                <View
                    style={[
                        styles.timelineDot,
                        course.hasConflict
                            ? styles.timelineDotConflict
                            : isActive
                                ? styles.timelineDotActive
                                : styles.timelineDotInactive,
                    ]}
                />
                <View style={styles.timelineLine} />
            </View>

            <View style={[styles.card, course.hasConflict && styles.cardConflict]}>
                <View style={styles.courseNameRow}>
                    <Text style={[styles.courseName, course.hasConflict && styles.courseNameConflict]}>{course.name}</Text>
                    {course.hasConflict && (
                        <View style={styles.warningTriangle}>
                            <Text style={styles.warningExclamation}>!</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.instructor}>{course.instructor}</Text>

                <View style={styles.bottomRow}>
                    <View style={[styles.timeContainer, isActive && styles.timeContainerActive]}>
                        <Text style={[styles.time, isActive && styles.timeActive]}>
                            {course.startTime} - {course.endTime}
                        </Text>
                    </View>

                    <View style={styles.roomContainer}>
                        {course.isOnline ? (
                            <View style={styles.onlineBadge}>
                                <Text style={styles.onlineText}>UZAKTAN EGITIM</Text>
                            </View>
                        ) : (
                            <>
                                <View style={styles.locationPinContainer}>
                                    <View style={styles.locationPin}>
                                        <View style={styles.locationPinInner} />
                                    </View>
                                    <View style={styles.locationPinTip} />
                                </View>
                                <Text style={styles.room}>{course.room}</Text>
                            </>
                        )}
                    </View>
                </View>

                {course.canRemove && onRemove && (
                    <View style={styles.footerRow}>
                        <Text style={styles.codeText}>{course.code}</Text>
                        <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(course.offeringId)}>
                            <Text style={styles.removeText}>Localden Kaldir</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    timelineSection: {
        width: 32,
        alignItems: 'center',
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        zIndex: 1,
    },
    timelineDotActive: {
        backgroundColor: colors.primary,
    },
    timelineDotInactive: {
        backgroundColor: colors.timelineGray,
    },
    timelineDotConflict: {
        backgroundColor: '#B81414',
    },
    timelineLine: {
        flex: 1,
        width: 2,
        backgroundColor: colors.timelineGray,
        marginTop: -1,
    },
    card: {
        flex: 1,
        backgroundColor: colors.cardBackground,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginLeft: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },
    cardConflict: {
        borderColor: '#B81414',
        borderWidth: 1.5,
        backgroundColor: colors.conflictBackground,
    },
    courseNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    warningTriangle: {
        width: 0,
        height: 0,
        marginLeft: spacing.sm,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 14,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#B81414',
        justifyContent: 'center',
        alignItems: 'center',
    },
    warningExclamation: {
        position: 'absolute',
        top: 4,
        fontSize: 10,
        fontWeight: fontWeight.bold,
        color: '#FFFFFF',
    },
    courseName: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    courseNameConflict: {
        color: '#B81414',
    },
    instructor: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeContainer: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.sm,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        backgroundColor: colors.cardBackground,
    },
    timeContainerActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    time: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    timeActive: {
        color: colors.textLight,
    },
    roomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationPinContainer: {
        width: 14,
        height: 18,
        alignItems: 'center',
        marginRight: spacing.xs,
    },
    locationPin: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationPinInner: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.cardBackground,
    },
    locationPinTip: {
        width: 0,
        height: 0,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderTopWidth: 5,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: colors.accent,
        marginTop: -1,
    },
    room: {
        fontSize: fontSize.sm,
        color: colors.accent,
        fontWeight: fontWeight.bold,
    },
    onlineBadge: {
        backgroundColor: colors.onlineBadgeBackground,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: borderRadius.sm,
    },
    onlineText: {
        fontSize: 10,
        color: colors.onlineText,
        fontWeight: fontWeight.bold,
    },
    footerRow: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    codeText: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        fontWeight: fontWeight.bold,
    },
    removeButton: {
        borderRadius: borderRadius.sm,
        backgroundColor: '#FEE2E2',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    removeText: {
        fontSize: fontSize.xs,
        color: '#B91C1C',
        fontWeight: fontWeight.bold,
    },
});
