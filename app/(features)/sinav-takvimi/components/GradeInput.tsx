/**
 * GradeInput Component
 * Resimdeki tasarıma uygun - Beyaz kart, mavi sol border, başlık + x butonu, PUAN ve AĞIRLIK inputları
 */
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { Feather } from '@expo/vector-icons';

interface GradeInputProps {
    label: string;
    score: string;
    weight: string;
    onScoreChange: (value: string) => void;
    onWeightChange: (value: string) => void;
    onLabelChange?: (value: string) => void;
    onRemove?: () => void;
    showRemove?: boolean;
}

export default function GradeInput({
    label,
    score,
    weight,
    onScoreChange,
    onWeightChange,
    onLabelChange,
    onRemove,
    showRemove = true,
}: GradeInputProps) {
    return (
        <View style={styles.card}>
            {/* Top Row: Title + Close */}
            <View style={styles.headerRow}>
                <TextInput
                    style={styles.labelInput}
                    value={label}
                    onChangeText={onLabelChange}
                    placeholder="Değerlendirme adı"
                    placeholderTextColor={colors.textMuted}
                />
                {showRemove && onRemove && (
                    <TouchableOpacity onPress={onRemove} style={styles.closeButton}>
                        <Feather name="x" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Bottom Row: POINT + WEIGHT */}
            <View style={styles.inputsRow}>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>PUAN</Text>
                    <TextInput
                        style={styles.input}
                        value={score}
                        onChangeText={onScoreChange}
                        keyboardType="numeric"
                        placeholder="0-100"
                        placeholderTextColor={colors.textMuted}
                        maxLength={3}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>AĞIRLIK (%)</Text>
                    <TextInput
                        style={styles.input}
                        value={weight}
                        onChangeText={onWeightChange}
                        keyboardType="numeric"
                        placeholder="40"
                        placeholderTextColor={colors.textMuted}
                        maxLength={3}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: borderRadius.lg,
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6',
        padding: spacing.xl,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...shadows.card,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    labelInput: {
        flex: 1,
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: '#0F2C59',
        padding: 0,
    },
    closeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputsRow: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    inputGroup: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 10,
        fontWeight: fontWeight.bold,
        color: colors.textMuted,
        letterSpacing: 0.8,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md + 2,
        fontSize: fontSize.md,
        color: colors.textPrimary,
        fontWeight: fontWeight.semibold,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
});
