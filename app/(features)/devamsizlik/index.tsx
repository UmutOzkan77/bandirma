import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CourseCard from '../../../components/CourseCard';
import { useAcademic } from '../../../contexts/AcademicContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type UICourse = {
    id: string;
    name: string;
    instructor: string;
    totalHours: number;
    usedHours: number;
    remainingHours: number | string;
    status: 'normal' | 'warning' | 'critical';
    code: string;
};

export default function DevamsizlikScreen() {
    const router = useRouter();
    const {
        loading,
        error,
        effectiveOfferings,
        getAbsenceCard,
        recordAbsence,
        undoLastAbsence,
    } = useAcademic();
    const [showAll, setShowAll] = useState(false);
    const [undoId, setUndoId] = useState<string | null>(null);
    const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const courses = useMemo<UICourse[]>(() => {
        return effectiveOfferings
            .map((offering) => getAbsenceCard(offering.id))
            .filter((item): item is UICourse => Boolean(item));
    }, [effectiveOfferings, getAbsenceCard]);

    useEffect(() => {
        return () => {
            if (undoTimerRef.current) {
                clearTimeout(undoTimerRef.current);
            }
        };
    }, []);

    const displayedCourses = showAll ? courses : courses.slice(0, 3);

    const handleMinus = async (id: string) => {
        if (undoTimerRef.current) {
            clearTimeout(undoTimerRef.current);
        }
        await recordAbsence(id);
        setUndoId(id);
        undoTimerRef.current = setTimeout(() => setUndoId(null), 3000);
    };

    const handleUndo = async (id: string) => {
        await undoLastAbsence(id);
        if (undoTimerRef.current) {
            clearTimeout(undoTimerRef.current);
        }
        setUndoId(null);
    };

    const handleDetails = (id: string) => {
        const course = courses.find((item) => item.id === id);
        if (!course) {
            return;
        }

        router.push({
            pathname: '/(features)/devamsizlik/[id]',
            params: {
                id,
                name: course.name,
                instructor: course.instructor,
                code: course.code,
                totalHours: String(course.totalHours),
                usedHours: String(course.usedHours),
                remainingHours: String(course.remainingHours),
            },
        });
    };

    const toggleShowAll = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowAll((current) => current === false);
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.centered]} edges={['top']}>
                <ActivityIndicator size="large" color="#1D3557" />
                <Text style={styles.infoText}>Devamsızlık verileri yükleniyor...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.headerContainer}>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#0F172A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Devamsızlık Takibi</Text>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {error ? (
                    <View style={styles.messageCard}>
                        <Text style={styles.messageError}>{error}</Text>
                    </View>
                ) : null}

                {displayedCourses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        onAddAbsence={handleMinus}
                        onUndo={handleUndo}
                        undoActive={undoId === course.id}
                        onDetails={handleDetails}
                    />
                ))}

                {courses.length === 0 ? (
                    <View style={styles.messageCard}>
                        <Text style={styles.infoText}>Etkin ders bulunmuyor. Ders ekleme veya kaldırma işlemlerini ders programı ekranından yapabilirsiniz.</Text>
                    </View>
                ) : null}

                {courses.length > 3 ? (
                    <TouchableOpacity style={styles.showAllButton} onPress={toggleShowAll}>
                        <Text style={styles.showAllButtonText}>{showAll ? 'Daha Az Göster' : 'Tüm Dersleri Göster'}</Text>
                    </TouchableOpacity>
                ) : null}

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        backgroundColor: '#F8FAFC',
        paddingTop: 12,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginRight: 12,
    },
    headerTitle: {
        flex: 1,
        fontSize: 24,
        fontWeight: '700',
        color: '#0F172A',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    messageCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    infoText: {
        marginTop: 12,
        color: '#64748B',
        textAlign: 'center',
    },
    messageError: {
        color: '#D32F2F',
        textAlign: 'center',
        fontWeight: '700',
    },
    showAllButton: {
        backgroundColor: '#E0F2FE',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 4,
    },
    showAllButtonText: {
        color: '#1D4ED8',
        fontWeight: '700',
    },
});
