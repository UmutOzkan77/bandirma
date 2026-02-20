/**
 * VoteSection Component
 * Beğendim/Beğenmedim oylama bölümü
 * Oy sonrası 4 saniyelik toast bildirim gösterir
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';

interface VoteSectionProps {
    likes: number;
    dislikes: number;
    userVote: 'like' | 'dislike' | null;
    onVote: (vote: 'like' | 'dislike') => void;
}

export default function VoteSection({ likes, dislikes, userVote, onVote }: VoteSectionProps) {
    const total = likes + dislikes;
    const likePercentage = total > 0 ? Math.round((likes / total) * 100) : 50;

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'like' | 'dislike'>('like');
    const toastAnim = useRef(new Animated.Value(100)).current;
    const toastOpacity = useRef(new Animated.Value(0)).current;

    const handleVote = (vote: 'like' | 'dislike') => {
        onVote(vote);
        setToastType(vote);
        setShowToast(true);

        // Toast animasyonu - yukarı kayarak gel
        Animated.parallel([
            Animated.timing(toastAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(toastOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // 4 saniye sonra kaybolsun
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(toastAnim, {
                    toValue: 100,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(toastOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowToast(false);
            });
        }, 4000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bugünkü yemeği nasıl buldun?</Text>

            <View style={styles.buttonContainer}>
                {/* Beğendim butonu */}
                <TouchableOpacity
                    style={[
                        styles.voteButton,
                        userVote === 'like' && styles.voteButtonLikeActive,
                    ]}
                    onPress={() => handleVote('like')}
                    activeOpacity={0.7}
                    disabled={userVote !== null}
                >
                    <Text style={[
                        styles.voteIcon,
                        userVote === 'like' && styles.voteIconActive
                    ]}>👍</Text>
                    <Text style={[
                        styles.voteLabel,
                        userVote === 'like' && styles.voteLabelActive
                    ]}>Beğendim</Text>
                </TouchableOpacity>

                {/* Beğenmedim butonu */}
                <TouchableOpacity
                    style={[
                        styles.voteButton,
                        userVote === 'dislike' && styles.voteButtonDislikeActive,
                    ]}
                    onPress={() => handleVote('dislike')}
                    activeOpacity={0.7}
                    disabled={userVote !== null}
                >
                    <Text style={[
                        styles.voteIcon,
                        userVote === 'dislike' && styles.voteIconActive
                    ]}>👎</Text>
                    <Text style={[
                        styles.voteLabel,
                        userVote === 'dislike' && styles.voteLabelActive
                    ]}>Beğenmedim</Text>
                </TouchableOpacity>
            </View>

            {/* Oy yüzdeleri (oy verildikten sonra göster) */}
            {userVote && (
                <View style={styles.resultContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${likePercentage}%` }]} />
                    </View>
                    <View style={styles.resultStats}>
                        <Text style={styles.resultText}>
                            <Text style={styles.resultHighlight}>{likes}</Text> Beğeni
                        </Text>
                        <Text style={styles.resultText}>
                            <Text style={styles.resultHighlightNegative}>{dislikes}</Text> Beğenmeme
                        </Text>
                    </View>
                </View>
            )}

            {/* Toast Bildirim */}
            {showToast && (
                <Animated.View
                    style={[
                        styles.toast,
                        toastType === 'like' ? styles.toastLike : styles.toastDislike,
                        {
                            transform: [{ translateY: toastAnim }],
                            opacity: toastOpacity,
                        },
                    ]}
                >
                    <Text style={styles.toastText}>
                        {toastType === 'like' ? '👍' : '👎'} Oyunuz kaydedildi!
                    </Text>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.cardWhite,
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        position: 'relative',
    },
    title: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.medium,
        color: colors.textDark,
        marginBottom: spacing.lg,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: spacing.xl,
    },
    voteButton: {
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.backgroundLight,
        minWidth: 100,
        ...shadows.button,
    },
    voteButtonLikeActive: {
        backgroundColor: `${colors.success}20`,
        borderWidth: 2,
        borderColor: colors.success,
    },
    voteButtonDislikeActive: {
        backgroundColor: `${colors.error}20`,
        borderWidth: 2,
        borderColor: colors.error,
    },
    voteIcon: {
        fontSize: 28,
        marginBottom: spacing.sm,
        opacity: 0.7,
    },
    voteIconActive: {
        opacity: 1,
    },
    voteLabel: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    voteLabelActive: {
        color: colors.textDark,
        fontWeight: fontWeight.semibold,
    },
    resultContainer: {
        width: '100%',
        marginTop: spacing.xl,
    },
    progressBar: {
        height: 8,
        backgroundColor: `${colors.error}30`,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        marginBottom: spacing.md,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.success,
        borderRadius: borderRadius.full,
    },
    resultStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    resultText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    resultHighlight: {
        fontWeight: fontWeight.bold,
        color: colors.success,
    },
    resultHighlightNegative: {
        fontWeight: fontWeight.bold,
        color: colors.error,
    },
    // Toast styles
    toast: {
        position: 'absolute',
        bottom: 8,
        left: spacing.lg,
        right: spacing.lg,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        ...shadows.card,
    },
    toastLike: {
        backgroundColor: colors.success,
    },
    toastDislike: {
        backgroundColor: colors.error,
    },
    toastText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textLight,
    },
});
