/**
 * CalculatorScreen - Puan Hesaplama
 * Not hesaplama ve final puanı hesaplayıcı
 */
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { calculateRequiredFinal } from '../utils';
import GradeInput from '../components/GradeInput';

interface GradeItem {
    id: string;
    label: string;
    icon: string;
    score: string;
    weight: string;
}

export default function CalculatorScreen() {
    const [grades, setGrades] = useState<GradeItem[]>([
        { id: '1', label: 'Vize Notu', icon: '📝', score: '', weight: '40' },
    ]);
    const [targetGrade, setTargetGrade] = useState(90);
    const [showResult, setShowResult] = useState(false);
    const [resultMessage, setResultMessage] = useState('');

    const updateGrade = (id: string, field: 'score' | 'weight', value: string) => {
        setGrades(prev => prev.map(grade =>
            grade.id === id ? { ...grade, [field]: value } : grade
        ));
        setShowResult(false); // Reset result when values change
    };

    const addGrade = () => {
        const newId = (grades.length + 1).toString();
        const gradeTypes = [
            { label: 'Ödev Notu', icon: '📚' },
            { label: 'Lab Notu', icon: '🔬' },
            { label: 'Sunum Notu', icon: '📊' },
            { label: 'Katılım Notu', icon: '✋' },
        ];
        const typeIndex = (grades.length - 3) % gradeTypes.length;
        const newGrade = gradeTypes[typeIndex >= 0 ? typeIndex : 0];

        setGrades(prev => [...prev, {
            id: newId,
            label: newGrade.label,
            icon: newGrade.icon,
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
        const parseNum = (str: string) => parseFloat(str) || 0;

        let totalWeight = 0;
        let weightedSum = 0;

        grades.forEach(grade => {
            const score = parseNum(grade.score);
            const weight = parseNum(grade.weight);
            totalWeight += weight;
            weightedSum += score * weight;
        });

        const currentAverage = totalWeight > 0 ? weightedSum / totalWeight : 0;
        const requiredFinal = calculateRequiredFinal(currentAverage, totalWeight, targetGrade);

        return {
            totalWeight,
            currentAverage: currentAverage.toFixed(1),
            requiredFinal: requiredFinal.toFixed(1),
            weightedSum: weightedSum.toFixed(1),
        };
    }, [grades, targetGrade]);

    const handleCalculate = () => {
        const totalWeight = calculations.totalWeight;

        // Ağırlık kontrolü: Diğer notlar toplam %40 olmalı, Final %60 sabit
        if (totalWeight === 0) {
            setResultMessage('⚠️ Lütfen en az bir not girişi yapın!');
            setShowResult(true);
            return;
        }

        if (totalWeight > 40) {
            setResultMessage(`⚠️ Toplam ağırlık %40'ı aşıyor (%${totalWeight})!\n\nFinal ağırlığı %60 sabit olduğundan, diğer notların toplam ağırlığı en fazla %40 olabilir.\n\nLütfen ağırlıkları düzeltin.`);
            setShowResult(true);
            return;
        }

        // Ağırlıklı toplam hesapla (diğer notlar)
        const weightedSum = parseFloat(calculations.weightedSum);

        // Dersi geçmek için gereken minimum final notu
        // Formül: (weightedSum + finalNote * 60) / 100 >= 50
        // finalNote >= (50 * 100 - weightedSum) / 60
        // Ayrıca: Final notu 50'nin altıysa otomatik kalır!
        const calculatedMinFinal = ((50 * 100) - weightedSum) / 60;
        const minFinalToPass = Math.max(50, calculatedMinFinal); // Final en az 50 olmalı

        let message = '';
        if (minFinalToPass > 100) {
            message = `❌ Dersi Geçemezsiniz!\n\nMaalesef mevcut notlarınızla finalden 100 alsanız bile dersi geçemezsiniz.`;
        } else {
            message = `🎯 Dersi geçmek için finalden\nminimum ${minFinalToPass.toFixed(1)} almanız gerekiyor.\n\n⚠️ Final notu 50'nin altıysa otomatik kalırsınız!`;
        }

        setResultMessage(message);
        setShowResult(true);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            {/* Header Removed */}<View style={{ marginTop: 20 }} />

            {/* Description */}
            <View style={styles.descriptionCard}>
                <Text style={styles.cardTitle}>Puan Hesaplama</Text>
                <Text style={styles.cardDescription}>
                    Mevcut notlarınızı ve ağırlıklarını girerek ortalamanızı hesaplayın.
                </Text>


            </View>

            {/* Grade Inputs */}
            <View style={styles.gradesCard}>
                {grades.map((grade, index) => (
                    <View key={grade.id} style={styles.gradeRow}>
                        <View style={styles.gradeInputWrapper}>
                            <GradeInput
                                label={grade.label}
                                icon={grade.icon}
                                score={grade.score}
                                weight={grade.weight}
                                onScoreChange={(v) => updateGrade(grade.id, 'score', v)}
                                onWeightChange={(v) => updateGrade(grade.id, 'weight', v)}
                            />
                        </View>
                        {grades.length > 1 && (
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeGrade(grade.id)}
                            >
                                <Text style={styles.removeIcon}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                <TouchableOpacity style={styles.addButton} onPress={addGrade}>
                    <Text style={styles.addIcon}>+</Text>
                    <Text style={styles.addText}>Değerlendirme Ekle</Text>
                </TouchableOpacity>
            </View>

            {/* Final Score Settings */}
            <View style={styles.finalCard}>
                <View style={styles.finalHeader}>
                    <Text style={styles.finalIcon}>🎯</Text>
                    <Text style={styles.finalTitle}>Final Sınavı Ayarları</Text>
                </View>
                <Text style={styles.finalSubtitle}>
                    FİNAL AĞIRLIĞI: %60 (Sabit)
                </Text>

                <View style={styles.resultContainer}>
                    <View style={styles.averageCircle}>
                        <Text style={styles.averageNumber}>{calculations.currentAverage}</Text>
                        <Text style={styles.averageLabel}>ORT</Text>
                    </View>
                    <View style={styles.requiredInfo}>
                        <Text style={styles.requiredText}>
                            Dersi geçebilmek için:
                        </Text>
                        <Text style={styles.requiredValue}>
                            <Text style={styles.requiredHighlight}>{calculations.requiredFinal}</Text> final notu gerekli
                        </Text>
                    </View>
                </View>
            </View>

            {/* Result Message */}
            {showResult && (
                <View style={styles.resultCard}>
                    <Text style={styles.resultTitle}>📋 Hesaplama Sonucu</Text>
                    <Text style={styles.resultMessage}>{resultMessage}</Text>
                </View>
            )}

            {/* Calculate Button - sadece hesaplama yapılmamışsa göster */}
            {!showResult && (
                <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                    <Text style={styles.calculateIcon}>🧮</Text>
                    <Text style={styles.calculateText}>Puanı Hesapla</Text>
                </TouchableOpacity>
            )}

            <View style={styles.bottomSpacing} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundMain,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    placeholder: {
        width: 40,
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    descriptionCard: {
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    cardTitle: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    cardDescription: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        lineHeight: 16,
        marginBottom: spacing.md,
    },
    progressContainer: {
        marginTop: spacing.sm,
    },
    progressBar: {
        height: 8,
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        marginBottom: spacing.sm,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: borderRadius.full,
    },
    progressText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'right',
    },
    gradesCard: {
        backgroundColor: colors.backgroundCard,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    gradeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gradeInputWrapper: {
        flex: 1,
    },
    removeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.error + '30',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.sm,
        marginBottom: spacing.lg,
    },
    removeIcon: {
        fontSize: 14,
        color: colors.error,
        fontWeight: fontWeight.bold,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        marginTop: spacing.sm,
        borderWidth: 1,
        borderColor: colors.accent,
        borderRadius: borderRadius.md,
        borderStyle: 'dashed',
        backgroundColor: colors.accent + '10',
    },
    addIcon: {
        fontSize: fontSize.lg,
        color: colors.accent,
        marginRight: spacing.sm,
    },
    addText: {
        fontSize: fontSize.sm,
        color: colors.accent,
        fontWeight: fontWeight.medium,
    },
    finalCard: {
        backgroundColor: colors.backgroundCard,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    finalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    finalIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    finalTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    finalSubtitle: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        marginBottom: spacing.lg,
        letterSpacing: 0.5,
    },
    resultContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    averageCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    averageNumber: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    averageLabel: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
    },
    requiredInfo: {
        flex: 1,
    },
    requiredText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    requiredValue: {
        fontSize: fontSize.md,
        color: colors.textPrimary,
    },
    requiredHighlight: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.accent,
    },
    resultCard: {
        backgroundColor: colors.accent + '20',
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.accent + '50',
    },
    resultTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.accent,
        marginBottom: spacing.md,
    },
    resultMessage: {
        fontSize: fontSize.md,
        color: colors.textPrimary,
        lineHeight: 24,
    },
    calculateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.accent,
        marginHorizontal: spacing.lg,
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        ...shadows.button,
    },
    calculateIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    calculateText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textInverse,
    },
    bottomSpacing: {
        height: spacing.xxxl,
    },
});
