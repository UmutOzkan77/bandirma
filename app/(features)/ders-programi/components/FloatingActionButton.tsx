/**
 * FloatingActionButton Bileşeni
 * Sağ alt köşede "+" butonu
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, shadows, borderRadius } from '../theme';

interface FloatingActionButtonProps {
    onPress: () => void;
}

export default function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.icon}>+</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.fab,
    },
    icon: {
        fontSize: 32,
        fontWeight: fontWeight.normal,
        color: colors.textLight,
        marginTop: -2,
    },
});
