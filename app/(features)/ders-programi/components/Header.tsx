/**
 * Header Bileşeni
 * Ders Programı başlığı
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '../theme';

interface HeaderProps {
    monthYear: string;
}

export default function Header({ monthYear }: HeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>DERS PROGRAMI</Text>
            <Text style={styles.monthYear}>{monthYear}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        backgroundColor: colors.background,
    },
    label: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
        letterSpacing: 1,
        marginBottom: spacing.xs,
    },
    monthYear: {
        fontSize: fontSize.title,
        fontWeight: fontWeight.bold,
        color: '#000000',
    },
});
