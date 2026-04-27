/**
 * SatisfactionMeter Component
 * Modern dairesel memnuniyet göstergesi - Yemek Analizleri ekranı için
 * Gradient efekti ve animasyonlu tasarım
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';

interface SatisfactionMeterProps {
    percentage: number;
    totalVotes: number;
}

export default function SatisfactionMeter({ percentage, totalVotes }: SatisfactionMeterProps) {
    // Renk hesaplama (yüzdeye göre)
    const getColor = () => {
        if (percentage >= 70) return colors.primaryAccent;
        if (percentage >= 50) return colors.warning;
        return colors.error;
    };

    const getStatusText = () => {
        if (percentage >= 80) return 'Mükemmel';
        if (percentage >= 70) return 'Çok İyi';
        if (percentage >= 60) return 'İyi';
        if (percentage >= 50) return 'Orta';
        return 'Düşük';
    };

    const getEmoji = () => {
        if (percentage >= 80) return '🎉';
        if (percentage >= 70) return '😊';
        if (percentage >= 60) return '🙂';
        if (percentage >= 50) return '😐';
        return '😕';
    };

    // Daire progress hesaplama
    const circumference = 2 * Math.PI * 70; // radius = 70
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.header}>GÜNLÜK MEMNUNİYET</Text>
                <View style={styles.liveBadge}>
                    <View style={styles.liveIndicator} />
                    <Text style={styles.liveText}>Canlı</Text>
                </View>
            </View>

            {/* Modern Dairesel Gösterge */}
            <View style={styles.meterContainer}>
                {/* SVG benzeri daire - View tabanlı */}
                <View style={styles.circleOuter}>
                    <View style={[styles.circleProgress, { borderColor: getColor() }]}>
                        <View style={styles.circleInner}>
                            <Text style={styles.emoji}>{getEmoji()}</Text>
                            <Text style={[styles.percentage, { color: getColor() }]}>
                                %{percentage}
                            </Text>
                            <Text style={[styles.statusText, { color: getColor() }]}>
                                {getStatusText()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Dekoratif noktalar */}
                <View style={[styles.decorDot, styles.dotTop]} />
                <View style={[styles.decorDot, styles.dotRight]} />
                <View style={[styles.decorDot, styles.dotBottom]} />
                <View style={[styles.decorDot, styles.dotLeft]} />
            </View>

            {/* İstatistikler */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{totalVotes}</Text>
                    <Text style={styles.statLabel}>Toplam Oy</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{Math.round(totalVotes * percentage / 100)}</Text>
                    <Text style={styles.statLabel}>Beğeni</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{Math.round(totalVotes * (100 - percentage) / 100)}</Text>
                    <Text style={styles.statLabel}>Beğenmeme</Text>
                </View>
            </View>

            {/* Alt bilgi */}
            <Text style={styles.subtitle}>Gerçek zamanlı öğrenci değerlendirmelerine göre</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.cardWhite,
        borderRadius: borderRadius.xl,
        margin: spacing.lg,
        padding: spacing.xl,
        alignItems: 'center',
        ...shadows.card,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: spacing.lg,
    },
    header: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.textDark,
        letterSpacing: 1,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    liveIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.success,
        marginRight: spacing.xs,
    },
    liveText: {
        fontSize: fontSize.xs,
        color: colors.success,
        fontWeight: fontWeight.semibold,
    },
    meterContainer: {
        width: 200,
        height: 200,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    circleOuter: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: colors.backgroundLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleProgress: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 8,
        backgroundColor: colors.cardWhite,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleInner: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 32,
        marginBottom: spacing.xs,
    },
    percentage: {
        fontSize: 42,
        fontWeight: fontWeight.bold,
    },
    statusText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        marginTop: spacing.xs,
    },
    decorDot: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primaryAccent,
        opacity: 0.3,
    },
    dotTop: { top: 0, left: '50%', marginLeft: -6 },
    dotRight: { right: 0, top: '50%', marginTop: -6 },
    dotBottom: { bottom: 0, left: '50%', marginLeft: -6 },
    dotLeft: { left: 0, top: '50%', marginTop: -6 },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        marginBottom: spacing.md,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textDark,
    },
    statLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border,
    },
    subtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
