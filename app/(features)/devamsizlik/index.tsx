import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CourseCard from '../../../components/CourseCard';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface Course {
    id: string;
    name: string;
    instructor: string;
    totalHours: number;
    usedHours: number;
    remainingHours: number | string;
    status: 'normal' | 'warning' | 'critical';
}

const INITIAL_COURSES: Course[] = [
    {
        id: '1',
        name: 'Veri Yapıları ve Algoritmalar',
        instructor: 'Dr. Öğr. Üyesi Ahmet Yılmaz',
        totalHours: 12,
        usedHours: 4,
        remainingHours: 8,
        status: 'normal',
    },
    {
        id: '2',
        name: 'Nesne Yönelimli Programlama',
        instructor: 'Doç. Dr. Elif Demir',
        totalHours: 10,
        usedHours: 8,
        remainingHours: 2,
        status: 'warning',
    },
    {
        id: '3',
        name: 'Yapay Zeka Temelleri',
        instructor: 'Prof. Dr. Mehmet Can',
        totalHours: 8,
        usedHours: 9,
        remainingHours: 0,
        status: 'critical',
    },
    {
        id: '4',
        name: 'Mobil Programlama',
        instructor: 'Öğr. Gör. Ali Veli',
        totalHours: 14,
        usedHours: 2,
        remainingHours: 12,
        status: 'normal',
    },
    {
        id: '5',
        name: 'Veritabanı Yönetimi',
        instructor: 'Dr. Ayşe Fatma',
        totalHours: 10,
        usedHours: 5,
        remainingHours: 5,
        status: 'normal',
    },
];

export default function DevamsizlikScreen() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
    const [undoState, setUndoState] = useState<{ id: string | null; timer: NodeJS.Timeout | null }>({ id: null, timer: null });
    const [showAll, setShowAll] = useState(false);

    const displayedCourses = showAll ? courses : courses.slice(0, 3);

    const handleMinus = (id: string) => {
        // Clear existing timer if any
        if (undoState.timer) clearTimeout(undoState.timer);

        setCourses(prevCourses => prevCourses.map(course => {
            if (course.id === id) {
                // Determine new status based on remaining hours
                // Simple logic for demo: < 4 warning, < 0 critical
                // NOTE: 'remainingHours' can be string '-', handle parsing carefully
                let currentRemaining = typeof course.remainingHours === 'string' ? 0 : course.remainingHours;
                let newRemaining = currentRemaining - 1;
                let newUsed = course.usedHours + 1;

                let newStatus: Course['status'] = 'normal';

                if (newRemaining < 0) {
                    newStatus = 'critical';
                } else if (newRemaining <= 3) {
                    newStatus = 'warning';
                }

                return {
                    ...course,
                    usedHours: newUsed,
                    remainingHours: newRemaining < 0 ? '-' : newRemaining, // Keep it simple for demo
                    status: newStatus
                };
            }
            return course;
        }));

        // Set undo timer
        const timer = setTimeout(() => {
            setUndoState({ id: null, timer: null });
        }, 3000);

        setUndoState({ id, timer });
    };

    const handleUndo = (id: string) => {
        if (undoState.timer) clearTimeout(undoState.timer);
        setUndoState({ id: null, timer: null });

        // Revert logic would ideally need history, but here we can just reverse the operation 
        // since we know exactly what handleMinus did ( +1 used, -1 remaining)
        // In a real app, you might store the 'previous state' of the course.
        setCourses(prevCourses => prevCourses.map(course => {
            if (course.id === id) {
                // We need to fetch the ORIGINAL state or reverse calculation
                // Reverse calculation:
                let currentUsed = course.usedHours;
                // Warning: if it was critical and we go back, we need to know what it was before.
                // For this simple demo, we will just reverse the numbers and re-calc status

                let newUsed = currentUsed - 1;
                // If it was '-', we assume it was -1 (so 0 in UI logic terms for calc), +1 = -1 + 1 = 0? 
                // Actually this reverse logic is tricky without history. 
                // Let's simplified assumption: finding the course in INITIAL_COURSES is not enough because we might have clicked multiple times? 
                // The prompt says "Minus button clicked... undo clicked... return to PREVIOUS state".
                // So standard undo pattern: Snapshoting previous state is safer.
                return course; // Placeholder, proper logic below
            }
            return course;
        }));

        // BETTER UNDO LOGIC: 
        // When handleMinus is called, save a snapshot of the modified course to `undoData`.
    };

    // Refined State Approach for Undo
    const [undoData, setUndoData] = useState<Course | null>(null);

    const handleMinusRefined = (id: string) => {
        // Clear timer
        if (undoState.timer) clearTimeout(undoState.timer);

        const courseToUpdate = courses.find(c => c.id === id);
        if (!courseToUpdate) return;

        // Save for undo
        setUndoData({ ...courseToUpdate });

        setCourses(prev => prev.map(c => {
            if (c.id === id) {
                let rem = typeof c.remainingHours === 'number' ? c.remainingHours : -1;
                let newRem = rem - 1;
                let newStatus: Course['status'] = c.status;

                // Simple status logic for demo
                if (newRem <= 0) newStatus = 'critical'; // Assume critical at 0 for visual impact
                else if (newRem <= 3) newStatus = 'warning';

                return {
                    ...c,
                    usedHours: c.usedHours + 1,
                    remainingHours: newRem < 0 ? '-' : newRem,
                    status: newStatus
                };
            }
            return c;
        }));

        const timer = setTimeout(() => {
            setUndoState({ id: null, timer: null });
            setUndoData(null);
        }, 3000);

        setUndoState({ id, timer });
    }

    const handleUndoRefined = (id: string) => {
        if (undoData && undoData.id === id) {
            setCourses(prev => prev.map(c => c.id === id ? undoData : c));
            setUndoState({ id: null, timer: null });
            setUndoData(null);
        }
    }

    const toggleShowAll = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowAll(!showAll);
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header Section */}
            <View style={styles.headerContainer}>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Devamsızlık Takibi</Text>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.subHeader}>Bandırma Onyedi Eylül Üniversitesi</Text>
                <Text style={styles.termText}>2023-2024 Güz Dönemi</Text>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>DERS</Text>
                    <Text style={styles.summaryValue}>{courses.length}</Text>
                </View>
                <View style={[styles.summaryCard, styles.criticalCard]}>
                    <View style={styles.redLine} />
                    <View>
                        <Text style={[styles.summaryLabel, { color: '#D32F2F' }]}>KRİTİK</Text>
                        <Text style={[styles.summaryValue, { color: '#D32F2F' }]}>
                            {courses.filter(c => c.status === 'warning' || c.status === 'critical').length}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Main Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Ders Listesi</Text>
                    <TouchableOpacity onPress={toggleShowAll}>
                        <Text style={[styles.seeAllText, showAll && { color: '#1D3557' }]}>Tümü Gör</Text>
                    </TouchableOpacity>
                </View>

                {displayedCourses.map(course => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        onMinus={handleMinusRefined}
                        onUndo={handleUndoRefined}
                        undoActive={undoState.id === course.id}
                        onDetails={(id) => router.push({
                            pathname: `/(features)/devamsizlik/${id}`,
                            params: {
                                name: course.name,
                                instructor: course.instructor,
                                code: 'BIL-301', // Mock code
                                totalHours: course.totalHours,
                                usedHours: course.usedHours,
                                remainingHours: course.remainingHours,
                            }
                        })}
                    />
                ))}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    headerContainer: {
        backgroundColor: '#1D3557',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    subHeader: {
        fontSize: 14,
        color: '#E2E8F0',
        marginBottom: 4,
    },
    termText: {
        fontSize: 12,
        color: '#94A3B8',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: -30,
        paddingHorizontal: 20,
    },
    summaryCard: {
        backgroundColor: 'white',
        width: '45%',
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        height: 80,
        justifyContent: 'center'
    },
    criticalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    redLine: {
        width: 4,
        height: '100%',
        backgroundColor: '#D32F2F',
        position: 'absolute',
        left: 0,
        top: 0,
    },
    summaryLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: 'bold',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1D3557',
    },
    content: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 10,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    seeAllText: {
        fontSize: 14,
        color: '#457B9D',
        fontWeight: 'bold',
    },
});

