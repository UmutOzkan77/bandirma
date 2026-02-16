/**
 * BottomTabBar Component
 * Alt navigasyon çubuğu - Ana Sayfa, Takvim, Notlar, Profil
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSize, fontWeight, shadows } from '../theme';

export type TabName = 'home' | 'calendar' | 'calculator';

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
    { key: 'home', label: 'Ana Sayfa', icon: '🏠' },
    { key: 'calendar', label: 'Takvim', icon: '📅' },
    { key: 'calculator', label: 'Notlar', icon: '📊' },
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
                        <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                            <Text style={[styles.icon, isActive && styles.iconActive]}>
                                {tab.icon}
                            </Text>
                        </View>
                        <Text style={[styles.label, isActive && styles.labelActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.backgroundCard,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: spacing.md,
        paddingTop: spacing.sm,
        ...shadows.card,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xs,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs,
    },
    iconContainerActive: {
        backgroundColor: colors.tabActive,
    },
    icon: {
        fontSize: 20,
        opacity: 0.6,
    },
    iconActive: {
        opacity: 1,
    },
    label: {
        fontSize: fontSize.xs,
        color: colors.tabInactive,
        fontWeight: fontWeight.medium,
    },
    labelActive: {
        color: colors.tabActive,
        fontWeight: fontWeight.semibold,
    },
});
