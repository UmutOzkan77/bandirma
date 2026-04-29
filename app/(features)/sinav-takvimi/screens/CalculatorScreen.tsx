/**
 * CalculatorScreen - Puan Hesaplama
 * Resimdeki tasarıma birebir uygun Grade Calculator
 */
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import GradeInput from '../components/GradeInput';
import { Feather } from '@expo/vector-icons';

interface GradeItem {
    id: string;
    label: string;
    score: string;
    weight: string;
}

interface CalculatorScreenProps {
    onNavigateBack?: () => void;
}

const FINAL_WEIGHT = 60;       // Final ağırlığı %60 (sabit)
const MAX_OTHER_WEIGHT = 40;   // Diğer notların toplam ağırlığı en fazla %40
const PASSING_GRADE = 50;      // Dersi geçme notu 50

export default function CalculatorScreen({ onNavigateBack }: CalculatorScreenProps) {
    const [grades, setGrades] = useState<GradeItem[]>([
        { id: '1', label: 'Vize', score: '', weight: '40' },
    ]);
    const [targetFinalScore, setTargetFinalScore] = useState('');
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultData, setResultData] = useState<{
        requiredFinal: number;
        isPossible: boolean;
        currentWeightedSum: number;
        totalOtherWeight: number;
    } | null>(null);

    const updateGrade = (id: string, field: 'score' | 'weight' | 'label', value: string) => {
        setGrades(prev => prev.map(grade =>
            grade.id === id ? { ...grade, [field]: value } : grade
        ));
    };

    const addGrade = () => {
        const newId = Date.now().toString();
        
        setGrades(prev => [...prev, {
            id: newId,
            label: '',
            score: '',
            weight: ''
        }]);
    };

    const removeGrade = (id: string) => {
        if (grades.length > 1) {
            setGrades(prev => prev.filter(grade => grade.id !== id));
        }
    };

    // Hesaplamalar
    const calculations = useMemo(() => {
        let totalOtherWeight = 0;
        let weightedSum = 0;

        grades.forEach(grade => {
            const score = parseFloat(grade.score) || 0;
            const weight = parseFloat(grade.weight) || 0;
            totalOtherWeight += weight;
            weightedSum += score * weight;
        });

        const remainingFromOther = MAX_OTHER_WEIGHT - totalOtherWeight;

        return {
            totalOtherWeight,
            weightedSum,
            remainingFromOther: Math.max(0, remainingFromOther),
        };
    }, [grades]);

    const handleCalculate = () => {
        const { totalOtherWeight, weightedSum } = calculations;

        if (totalOtherWeight === 0) {
            setResultData({
                requiredFinal: 0,
                isPossible: false,
                currentWeightedSum: 0,
                totalOtherWeight: 0,
            });
            setShowResultModal(true);
            return;
        }

        if (totalOtherWeight > MAX_OTHER_WEIGHT) {
            setResultData({
                requiredFinal: 0,
                isPossible: false,
                currentWeightedSum: weightedSum,
                totalOtherWeight,
            });
            setShowResultModal(true);
            return;
        }

        // Formül: (weightedSum + finalNote * 60) / 100 >= 50
        // finalNote >= (5000 - weightedSum) / 60
        // Ama finalden 50 altı alırsa otomatik kalır!
        const rawRequired = Math.ceil((PASSING_GRADE * 100 - weightedSum) / FINAL_WEIGHT);
        const requiredFinal = Math.max(50, rawRequired); // Final en az 50 olmalı
        const isPossible = requiredFinal <= 100;

        setResultData({
            requiredFinal: Math.max(0, requiredFinal),
            isPossible,
            currentWeightedSum: weightedSum,
            totalOtherWeight,
        });
        setShowResultModal(true);
    };

    return (
        <View style={styles.container}>
            {/* Header - CalendarScreen ile aynı stil */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
                    <Feather name="chevron-left" size={24} color={colors.primary} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>FİNAL NOTU HESAPLA</Text>
                </View>
                <View style={styles.headerRight} />
            </View>

            <ScrollView 
                style={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {/* Section: Mevcut Notlar */}
                <Text style={styles.sectionTitle}>Mevcut Notlar</Text>

                {/* Grade Input Cards */}
                {grades.map((grade) => (
                    <GradeInput
                        key={grade.id}
                        label={grade.label}
                        score={grade.score}
                        weight={grade.weight}
                        onScoreChange={(v) => updateGrade(grade.id, 'score', v)}
                        onWeightChange={(v) => updateGrade(grade.id, 'weight', v)}
                        onLabelChange={(v) => updateGrade(grade.id, 'label', v)}
                        onRemove={() => removeGrade(grade.id)}
                        showRemove={grades.length > 1}
                    />
                ))}

                {/* Add Assessment Button */}
                <TouchableOpacity style={styles.addButton} onPress={addGrade}>
                    <Feather name="plus" size={16} color={colors.accent} />
                    <Text style={styles.addText}>Değerlendirme Ekle</Text>
                </TouchableOpacity>

                {/* Calculate Button */}
                <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                    <Text style={styles.calculateText}>Final Notunu Hesapla</Text>
                </TouchableOpacity>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Result Modal (Popup) */}
            <Modal visible={showResultModal} animationType="fade" transparent onRequestClose={() => setShowResultModal(false)}>
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={() => setShowResultModal(false)}
                >
                    <TouchableOpacity 
                        activeOpacity={1} 
                        style={styles.modalCard}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <TouchableOpacity 
                            onPress={() => setShowResultModal(false)} 
                            style={styles.modalClose}
                        >
                            <Feather name="x" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>

                        {resultData && (
                            <>
                                {/* Icon */}
                                <View style={[
                                    styles.modalIconCircle, 
                                    { backgroundColor: resultData.isPossible ? '#EFF6FF' : '#FEF2F2' }
                                ]}>
                                    <Feather 
                                        name={resultData.isPossible ? 'target' : 'alert-circle'} 
                                        size={32} 
                                        color={resultData.isPossible ? '#3B82F6' : '#EF4444'} 
                                    />
                                </View>

                                {/* Title */}
                                <Text style={styles.modalTitle}>
                                    {resultData.isPossible ? 'Hesaplama Sonucu' : 'Dersi Geçemezsiniz!'}
                                </Text>

                                {resultData.totalOtherWeight > MAX_OTHER_WEIGHT ? (
                                    <Text style={styles.modalMessage}>
                                        Toplam ağırlık %{MAX_OTHER_WEIGHT}'ı aştı (%{resultData.totalOtherWeight}).{"\n"}Lütfen ağırlıkları kontrol edin.
                                    </Text>
                                ) : resultData.isPossible ? (
                                    <>
                                        <Text style={styles.modalMessage}>
                                            Dersi geçmek için finalden minimum almanız gereken not:
                                        </Text>
                                        <View style={styles.modalScoreBox}>
                                            <Text style={styles.modalScoreText}>
                                                {resultData.requiredFinal}
                                            </Text>
                                        </View>
                                        <Text style={styles.modalFootnote}>
                                            Final ağırlığı: %{FINAL_WEIGHT} · Geçme notu: {PASSING_GRADE}
                                        </Text>

                                    </>
                                ) : (
                                    <Text style={styles.modalMessage}>
                                        Mevcut notlarınızla finalden 100 alsanız bile dersi geçemezsiniz.
                                    </Text>
                                )}

                                {/* Dismiss */}
                                <TouchableOpacity 
                                    style={styles.modalDismissButton} 
                                    onPress={() => setShowResultModal(false)}
                                >
                                    <Text style={styles.modalDismissText}>Tamam</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundMain,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.backgroundCard,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight || colors.border,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.backgroundMain,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight || '#E2E8F0',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: fontWeight.bold,
        color: colors.accent,
        letterSpacing: 0.5,
    },
    headerRight: {
        width: 40,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xxl,
    },
    sectionTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: '#0F2C59',
        marginBottom: spacing.lg,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.lg,
        borderWidth: 1.5,
        borderColor: '#CBD5E1',
        borderRadius: borderRadius.lg,
        borderStyle: 'dashed',
        backgroundColor: '#FFFFFF',
        gap: spacing.sm,
    },
    addText: {
        fontSize: fontSize.sm,
        color: colors.accent,
        fontWeight: fontWeight.semibold,
    },
    finalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...shadows.card,
    },
    finalWeightInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    finalWeightLabel: {
        fontSize: 10,
        fontWeight: fontWeight.bold,
        color: colors.textMuted,
        letterSpacing: 0.8,
    },
    finalWeightValue: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: '#0F2C59',
    },
    finalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    finalLabelCol: {
        flex: 1,
    },
    finalLabel: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: '#0F2C59',
    },
    finalSubLabel: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        marginTop: 2,
    },
    remainingWeightBox: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    remainingWeightText: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: '#3B82F6',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: spacing.lg,
    },
    targetLabel: {
        fontSize: 10,
        fontWeight: fontWeight.bold,
        color: colors.textMuted,
        letterSpacing: 0.8,
        marginBottom: spacing.sm,
    },
    targetInput: {
        backgroundColor: '#F8FAFC',
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md + 2,
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    calculateButton: {
        backgroundColor: colors.accent,
        borderRadius: borderRadius.full,
        paddingVertical: spacing.lg + 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xxl,
        ...shadows.button,
    },
    calculateText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textInverse,
        letterSpacing: 0.3,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 44, 89, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: borderRadius.xl,
        padding: spacing.xxxl,
        alignItems: 'center',
        ...shadows.modal,
    },
    modalClose: {
        position: 'absolute',
        top: spacing.lg,
        right: spacing.lg,
        padding: 4,
    },
    modalIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    modalTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: '#0F2C59',
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: spacing.lg,
    },
    modalScoreBox: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: spacing.xxxl,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        marginBottom: spacing.lg,
    },
    modalScoreText: {
        fontSize: 36,
        fontWeight: fontWeight.bold,
        color: '#3B82F6',
        textAlign: 'center',
    },
    modalFootnote: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    modalWarning: {
        fontSize: fontSize.xs,
        color: '#DC2626',
        fontWeight: fontWeight.semibold,
        textAlign: 'center',
        marginBottom: spacing.xxl,
    },
    modalDismissButton: {
        backgroundColor: colors.accent,
        borderRadius: borderRadius.full,
        paddingVertical: spacing.md + 2,
        paddingHorizontal: spacing.xxxl * 2,
        ...shadows.button,
    },
    modalDismissText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.textInverse,
    },
});
