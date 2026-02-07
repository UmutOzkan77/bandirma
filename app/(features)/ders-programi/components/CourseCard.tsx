/**
 * CourseCard Bileşeni
 * Ders kartı - timeline ile entegre
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../theme';
import { Course } from '../types';

interface CourseCardProps {
    course: Course;
    isActive?: boolean;
}

export default function CourseCard({ course, isActive = false }: CourseCardProps) {
    return (
        <View style={styles.container}>
            {/* Timeline Dot */}
            <View style={styles.timelineSection}>
                <View style={[
                    styles.timelineDot,
                    course.hasConflict
                        ? styles.timelineDotConflict
                        : isActive
                            ? styles.timelineDotActive
                            : styles.timelineDotInactive,
                ]} />
                <View style={styles.timelineLine} />
            </View>

            {/* Card Content */}
            <View style={[
                styles.card,
                course.hasConflict && styles.cardConflict,
            ]}>
                {/* Course Name with Conflict Warning */}
                <View style={styles.courseNameRow}>
                    <Text style={[
                        styles.courseName,
                        course.hasConflict && styles.courseNameConflict,
                    ]}>{course.name}</Text>
                    {course.hasConflict && (
                        <View style={styles.warningTriangle}>
                            <Text style={styles.warningExclamation}>!</Text>
                        </View>
                    )}
                </View>

                {/* Instructor */}
                <Text style={styles.instructor}>{course.instructor}</Text>

                {/* Bottom Row - Time and Room */}
                <View style={styles.bottomRow}>
                    {/* Time */}
                    <View style={[
                        styles.timeContainer,
                        isActive && styles.timeContainerActive,
                    ]}>
                        <Text style={[
                            styles.time,
                            isActive && styles.timeActive,
                        ]}>
                            {course.startTime} - {course.endTime}
                        </Text>
                    </View>

                    {/* Room - Sağ Alt Köşe */}
                    <View style={styles.roomContainer}>
                        {/* Online ise sadece badge göster, değilse konum ikonu ve room */}
                        {course.isOnline ? (
                            <View style={styles.onlineBadge}>
                                <Text style={styles.onlineText}>UZAKTAN EĞİTİM</Text>
                            </View>
                        ) : (
                            <>
                                {/* Konum Pin İkonu - Açık Mavi */}
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
        backgroundColor: '#B81414', // Çakışma kırmızısı
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
        borderColor: '#B81414', // Çakışma kırmızısı
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
        color: '#B81414', // Çakışma kırmızısı
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
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderTopWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: colors.accent,
        marginTop: -2,
    },
    room: {
        fontSize: fontSize.sm,
        color: colors.textSecondary, // Gri renk
        fontWeight: fontWeight.medium,
    },
    onlineBadge: {
        marginLeft: spacing.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        backgroundColor: colors.accent,
        borderRadius: borderRadius.sm,
    },
    onlineText: {
        fontSize: fontSize.xs,
        color: colors.textLight,
        fontWeight: fontWeight.medium,
    },
});
