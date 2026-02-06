/**
 * GradeInput Component
 * Not hesaplama için input satırları
 */
import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

interface GradeInputProps {
    label: string;
    icon: string;
    score: string;
    weight: string;
    onScoreChange: (value: string) => void;
    onWeightChange: (value: string) => void;
}

export default function GradeInput({
    label,
    icon,
    score,
    weight,
    onScoreChange,
    onWeightChange,
}: GradeInputProps) {
    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={styles.inputsContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Puan</Text>
                    <TextInput
                        style={styles.input}
                        value={score}
                        onChangeText={onScoreChange}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={colors.textMuted}
                        maxLength={3}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Ağırlık (%)</Text>
                    <TextInput
                        style={styles.input}
                        value={weight}
                        onChangeText={onWeightChange}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={colors.textMuted}
                        maxLength={3}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
        paddingVertical: spacing.sm,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    label: {
        fontSize: fontSize.md,
        color: colors.textPrimary,
        fontWeight: fontWeight.semibold,
    },
    inputsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    inputGroup: {
        alignItems: 'center',
    },
    inputLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: colors.backgroundInput,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        fontSize: fontSize.lg,
        color: colors.textPrimary,
        fontWeight: fontWeight.bold,
        textAlign: 'center',
        minWidth: 60,
        borderWidth: 1,
        borderColor: colors.border,
    },
});
