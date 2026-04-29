import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Course {
    id: string;
    name: string;
    instructor: string;
    totalHours: number;
    usedHours: number;
    remainingHours: number | string;
    status: 'normal' | 'warning' | 'critical';
}

interface CourseCardProps {
    course: Course;
    onAddAbsence: (id: string) => void;
    onUndo: (id: string) => void;
    undoActive: boolean;
    onDetails: (id: string) => void;
}

export default function CourseCard({ course, onAddAbsence, onUndo, undoActive, onDetails }: CourseCardProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const undoOpacity = useRef(new Animated.Value(0)).current;
    const detailsScale = useRef(new Animated.Value(1)).current;
    const contentHeightAnim = useRef(new Animated.Value(0)).current;
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedContentHeight, setExpandedContentHeight] = useState(0);

    useEffect(() => {
        if (undoActive) {
            Animated.timing(undoOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(undoOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [undoActive, undoOpacity]);

    useEffect(() => {
        Animated.timing(contentHeightAnim, {
            toValue: isExpanded ? expandedContentHeight : 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [contentHeightAnim, expandedContentHeight, isExpanded]);

    const handlePressAddAbsence = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.97,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
        ]).start();

        onAddAbsence(course.id);
    };

    const handlePressDetails = () => {
        Animated.sequence([
            Animated.timing(detailsScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
            Animated.timing(detailsScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
        ]).start();
        onDetails(course.id);
    };

    const numericRemainingHours =
        typeof course.remainingHours === 'number'
            ? course.remainingHours
            : typeof course.remainingHours === 'string'
              ? Number(course.remainingHours)
              : NaN;
    const showWarningIcon =
        course.remainingHours === '-' ||
        course.remainingHours === null ||
        (Number.isFinite(numericRemainingHours) && numericRemainingHours <= 0);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={styles.courseName}>{course.name}</Text>
                    <Text style={styles.instructor}>{course.instructor}</Text>
                </View>

                <View style={styles.headerActions}>
                    {showWarningIcon ? (
                        <View style={styles.iconContainer}>
                            <Ionicons name="alert-circle-outline" size={18} color="#D32F2F" />
                        </View>
                    ) : null}

                    <TouchableOpacity
                        style={styles.chevronButton}
                        onPress={() => setIsExpanded((current) => !current)}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={isExpanded ? 'Kartı daralt' : 'Kartı genişlet'}
                    >
                        <Ionicons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color="#0F172A"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Toplam</Text>
                    <Text style={styles.statValue}>{course.totalHours} saat</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Kullanılan</Text>
                    <Text style={styles.statValue}>{course.usedHours} saat</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Kalan</Text>
                    <Text style={[styles.statValue, course.status !== 'normal' && styles.statValueAlert]}>
                        {course.remainingHours === '-' ? '-' : `${course.remainingHours} saat`}
                    </Text>
                </View>
            </View>

            <Animated.View style={[styles.expandableContent, { maxHeight: contentHeightAnim }]}>
                <View
                    onLayout={(event) => {
                        const nextHeight = event.nativeEvent.layout.height;
                        if (nextHeight !== expandedContentHeight) {
                            setExpandedContentHeight(nextHeight);
                        }
                    }}
                >
                    {course.status === 'critical' && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={16} color="#D32F2F" />
                            <Text style={styles.errorText}>Devamsızlık hakkınız dolmuştur.</Text>
                        </View>
                    )}

                    <View style={styles.actionsContainer}>
                        <View style={styles.leftActions}>
                            <View style={styles.primaryActionBlock}>
                                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                    <TouchableOpacity
                                        style={[styles.addAbsenceButton, course.status === 'critical' && styles.addAbsenceButtonDisabled]}
                                        onPress={handlePressAddAbsence}
                                        disabled={course.status === 'critical'}
                                    >
                                        <Text style={styles.addAbsenceButtonText}>Devamsızlık Ekle</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>

                            {undoActive && (
                                <Animated.View style={{ opacity: undoOpacity, marginLeft: 10 }}>
                                    <TouchableOpacity style={styles.undoButton} onPress={() => onUndo(course.id)}>
                                        <Text style={styles.undoText}>Geri Al</Text>
                                        <Ionicons name="return-up-back" size={16} color="#1D3557" style={{ marginLeft: 4 }} />
                                    </TouchableOpacity>
                                </Animated.View>
                            )}
                        </View>

                        <Animated.View style={{ transform: [{ scale: detailsScale }] }}>
                            <TouchableOpacity style={styles.detailsButton} onPress={handlePressDetails}>
                                <Text style={styles.detailsText}>Detaylar</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 3.84,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    headerText: {
        flex: 1,
        paddingRight: 12,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    courseName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    instructor: {
        fontSize: 14,
        color: '#64748B',
    },
    chevronButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '600',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    statValueAlert: {
        color: '#D32F2F',
    },
    expandableContent: {
        overflow: 'hidden',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#FFEBEE',
        padding: 8,
        borderRadius: 8,
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    primaryActionBlock: {
        alignItems: 'flex-start',
    },
    addAbsenceButton: {
        minWidth: 154,
        paddingHorizontal: 18,
        paddingVertical: 13,
        borderRadius: 16,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addAbsenceButtonDisabled: {
        opacity: 0.5,
    },
    addAbsenceButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    undoButton: {
        flexDirection: 'row',
        backgroundColor: '#E0E7FF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    undoText: {
        color: '#1D3557',
        fontWeight: '700',
        fontSize: 12,
    },
    detailsButton: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    detailsText: {
        color: '#1D3557',
        fontWeight: '700',
        fontSize: 12,
    },
});
