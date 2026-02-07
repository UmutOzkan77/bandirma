/**
 * Header Bileşeni
 * Ders Programı başlığı ve ayar ikonu
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '../theme';

interface HeaderProps {
    monthYear: string;
    onSettingsPress?: () => void;
}

export default function Header({ monthYear, onSettingsPress }: HeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <Text style={styles.label}>DERS PROGRAMI</Text>
                <Text style={styles.monthYear}>{monthYear}</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
                <View style={styles.settingsIcon}>
                    <View style={styles.gear} />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        backgroundColor: colors.background,
    },
    leftSection: {
        flex: 1,
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
        color: '#000000', // Siyah
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gear: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2.5,
        borderColor: colors.textLight,
        position: 'relative',
    },
});
