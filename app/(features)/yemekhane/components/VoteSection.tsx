/**
 * VoteSection Component
 * Beğendim/Beğenmedim oylama bölümü
 * Oy sonrası 4 saniyelik toast bildirim gösterir
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';

interface VoteSectionProps {
    userVote: 'like' | 'dislike' | null;
    onVote: (vote: 'like' | 'dislike') => void;
}

export default function VoteSection({ userVote, onVote }: VoteSectionProps) {
    const handleVote = (vote: 'like' | 'dislike') => {
        onVote(vote);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MENÜYÜ DEĞERLENDİR</Text>

            <View style={styles.buttonContainer}>
                {/* Beğendim butonu */}
                <TouchableOpacity
                    style={[
                        styles.voteButton,
                        userVote === 'like' && styles.voteButtonLikeActive,
                    ]}
                    onPress={() => handleVote('like')}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        styles.voteIcon,
                        userVote === 'like' && styles.voteIconActive
                    ]}>👍</Text>
                    <Text style={styles.voteLabel}>Beğendim</Text>
                </TouchableOpacity>

                {/* Beğenmedim butonu */}
                <TouchableOpacity
                    style={[
                        styles.voteButton,
                        userVote === 'dislike' && styles.voteButtonDislikeActive,
                    ]}
                    onPress={() => handleVote('dislike')}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        styles.voteIcon,
                        userVote === 'dislike' && styles.voteIconActive
                    ]}>👎</Text>
                    <Text style={styles.voteLabel}>Beğenmedim</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.cardWhite,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.border,
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        ...shadows.card,
    },
    title: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
        color: colors.textDark,
        marginBottom: spacing.md,
        letterSpacing: 0.8,
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
        minWidth: 110,
    },
    voteButtonLikeActive: {
        backgroundColor: `${colors.success}15`,
        borderWidth: 1,
        borderColor: colors.success,
    },
    voteButtonDislikeActive: {
        backgroundColor: `${colors.error}12`,
        borderWidth: 1,
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
});
