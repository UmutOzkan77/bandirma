/**
 * BottomTabBar Component
 * Alt navigasyon çubuğu - ekranlar arası geçiş
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';

export type TabName = 'menu' | 'analytics' | 'statistics' | 'feedback';

interface TabItem {
    key: TabName;
    label: string;
    icon: string;
}

interface BottomTabBarProps {
    activeTab: TabName;
    onTabPress: (tab: TabName) => void;
}

const TABS: TabItem[] = [
    { key: 'menu', label: 'Menü', icon: '🍽️' },
    { key: 'analytics', label: 'Analiz', icon: '📊' },
    { key: 'statistics', label: 'İstatistik', icon: '📅' },
    { key: 'feedback', label: 'Yorumlar', icon: '💬' },
];

export default function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
    return (
        <View style={styles.container}>
            {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <TouchableOpacity
                        key={tab.key}
                        style={styles.tabItem}
                        onPress={() => onTabPress(tab.key)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.icon, isActive && styles.iconActive]}>
                            {tab.icon}
                        </Text>
                        <Text style={[styles.label, isActive && styles.labelActive]}>
                            {tab.label}
                        </Text>
                        {isActive && <View style={styles.activeIndicator} />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.cardWhite,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: spacing.sm,
        paddingTop: spacing.sm,
        ...shadows.card,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        position: 'relative',
    },
    icon: {
        fontSize: 22,
        marginBottom: spacing.xs,
        opacity: 0.5,
    },
    iconActive: {
        opacity: 1,
    },
    label: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    labelActive: {
        color: colors.primaryDark,
        fontWeight: fontWeight.semibold,
    },
    activeIndicator: {
        position: 'absolute',
        top: 0,
        left: '30%',
        right: '30%',
        height: 3,
        backgroundColor: colors.primaryAccent,
        borderRadius: borderRadius.full,
    },
});
