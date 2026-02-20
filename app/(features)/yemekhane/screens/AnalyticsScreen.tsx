/**
 * AnalyticsScreen
 * Yemek Analizleri ekranı - Tasarım 2
 * Sadece günlük memnuniyet göstergesi
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '../theme';
import { dailySatisfactionData } from '../mockData';
import SatisfactionMeter from '../components/SatisfactionMeter';

interface AnalyticsScreenProps {
    // Props eklenebilir
}

export default function AnalyticsScreen({ }: AnalyticsScreenProps) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Yemek Analizleri</Text>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Memnuniyet göstergesi */}
                <SatisfactionMeter
                    percentage={dailySatisfactionData.percentage}
                    totalVotes={dailySatisfactionData.totalVotes}
                />

                {/* Alt boşluk */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
        backgroundColor: colors.cardWhite,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textDark,
    },
    content: {
        flex: 1,
    },
    bottomSpacer: {
        height: spacing.xxxl,
    },
});
