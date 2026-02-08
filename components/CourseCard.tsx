import React, { useRef, useEffect } from 'react';
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
    onMinus: (id: string) => void;
    onUndo: (id: string) => void;
    undoActive: boolean;
    onDetails: (id: string) => void;
}

export default function CourseCard({ course, onMinus, onUndo, undoActive, onDetails }: CourseCardProps) {
    // Animations
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const undoOpacity = useRef(new Animated.Value(0)).current;
    const detailsScale = useRef(new Animated.Value(1)).current;

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
    }, [undoActive]);

    const handlePressMinus = () => {
        // Animation for minus button
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.8,
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

        onMinus(course.id);
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
    }

    const getBorderColor = () => {
        switch (course.status) {
            case 'warning': return '#D32F2F'; // Red for warning
            case 'critical': return '#757575'; // Grey for critical/ended
            default: return '#2E7D32'; // Green for normal
        }
    };

    const getStatusIcon = () => {
        switch (course.status) {
            case 'warning': return <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}><Ionicons name="warning" size={24} color="#D32F2F" /></View>;
            case 'critical': return <View style={[styles.iconContainer, { backgroundColor: '#ECEFF1' }]}><Ionicons name="alert-circle" size={24} color="#757575" /></View>;
            default: return <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}><Ionicons name="code-slash" size={24} color="#2E7D32" /></View>; // Default icon
        }
    }

    return (
        <View style={[styles.card, { borderColor: getBorderColor() }]}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.courseName}>{course.name}</Text>
                    <Text style={styles.instructor}>{course.instructor}</Text>
                </View>
                {getStatusIcon()}
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>TOPLAM</Text>
                    <Text style={styles.statValue}>{course.totalHours} Saat</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>KULLANILAN</Text>
                    <Text style={styles.statValue}>{course.usedHours} Saat</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>KALAN</Text>
                    <Text style={[styles.statValue, { color: course.status === 'warning' ? '#D32F2F' : (course.status === 'critical' ? '#D32F2F' : '#2E7D32') }]}>
                        {course.remainingHours === '-' ? '-' : `${course.remainingHours} Saat`}
                    </Text>
                </View>
            </View>

            {course.status === 'critical' && (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#D32F2F" />
                    <Text style={styles.errorText}> Devamsızlık hakkınız bitmiştir</Text>
                </View>
            )}

            <View style={styles.actionsContainer}>
                <View style={styles.leftActions}>
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <TouchableOpacity style={styles.minusButton} onPress={handlePressMinus} disabled={course.status === 'critical'}>
                            <Ionicons name="remove" size={24} color="white" />
                        </TouchableOpacity>
                    </Animated.View>

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
                        <Text style={styles.detailsText}>DETAYLAR</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    courseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 4,
    },
    instructor: {
        fontSize: 14,
        color: '#64748B',
    },
    iconContainer: {
        padding: 8,
        borderRadius: 8,
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
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#FFEBEE',
        padding: 8,
        borderRadius: 8
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4
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
    minusButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1D3557', // Dark blue from previous convo
        justifyContent: 'center',
        alignItems: 'center',
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
        fontWeight: 'bold',
        fontSize: 12,
    },
    detailsButton: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    detailsText: {
        color: '#1D3557',
        fontWeight: 'bold',
        fontSize: 12,
    },
});
