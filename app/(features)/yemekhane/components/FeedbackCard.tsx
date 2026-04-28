/**
 * FeedbackCard Component
 * Öğrenci yorum kartı - kategori, yorum, like/dislike
 * Beğeni/beğenmeme oyları Supabase'e kaydedilir
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { Feedback } from '../mockData';
import { voteFeedback } from '../api';

interface FeedbackCardProps {
    feedback: Feedback;
    variant?: 'compact' | 'full';
}

const nameMap: Record<string, string> = {
    user1: 'Ahmet Y.',
    user2: 'Merve K.',
    user3: 'Berk A.',
    user4: 'Selin T.',
};

const getInitials = (name: string) => {
    const parts = name.replace('.', '').split(' ').filter(Boolean);
    if (parts.length === 0) return 'Ö';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export default function FeedbackCard({ feedback, variant = 'full' }: FeedbackCardProps) {
    const [likes, setLikes] = useState(feedback.likes);
    const [dislikes, setDislikes] = useState(feedback.dislikes);
    const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);

    const displayName = nameMap[feedback.userId] || 'Öğrenci';
    const initials = getInitials(displayName);

    const handleLike = async () => {
        if (userVote === null) {
            setLikes(likes + 1);
            setUserVote('like');
            // Supabase'e gönder
            try {
                await voteFeedback(feedback.id, 'like');
            } catch (err) {
                console.log('⚠️ Beğeni Supabase\'e gönderilemedi');
            }
        }
    };

    const handleDislike = async () => {
        if (userVote === null) {
            setDislikes(dislikes + 1);
            setUserVote('dislike');
            // Supabase'e gönder
            try {
                await voteFeedback(feedback.id, 'dislike');
            } catch (err) {
                console.log('⚠️ Beğenmeme Supabase\'e gönderilemedi');
            }
        }
    };

    return (
        <View style={[styles.container, variant === 'compact' && styles.containerCompact]}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{displayName}</Text>
                    <Text style={styles.timeAgo}>{feedback.timeAgo}</Text>
                </View>
                {variant === 'full' && (
                    <Text style={styles.mealName}>{feedback.mealName}</Text>
                )}
                <Text style={styles.comment}>{feedback.comment}</Text>

                {variant === 'full' && (
                    <View style={styles.footer}>
                        <View style={styles.reactions}>
                            <TouchableOpacity
                                style={styles.reactionButton}
                                onPress={handleLike}
                                disabled={userVote !== null}
                            >
                                <Text style={styles.reactionIcon}>👍</Text>
                                <Text style={[
                                    styles.reactionCount,
                                    userVote === 'like' && styles.reactionCountActive
                                ]}>{likes}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.reactionButton}
                                onPress={handleDislike}
                                disabled={userVote !== null}
                            >
                                <Text style={styles.reactionIcon}>👎</Text>
                                <Text style={[
                                    styles.reactionCount,
                                    userVote === 'dislike' && styles.reactionCountActiveNegative
                                ]}>{dislikes}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.replyButton}>
                            <Text style={styles.replyText}>Yanıtla</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.cardWhite,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.full,
        backgroundColor: colors.backgroundLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.textDark,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    name: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.textDark,
    },
    timeAgo: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    mealName: {
        fontSize: fontSize.sm,
        color: colors.textDark,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    comment: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        lineHeight: 20,
        marginBottom: spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reactions: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    reactionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    reactionIcon: {
        fontSize: 16,
    },
    reactionCount: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    reactionCountActive: {
        color: colors.success,
        fontWeight: fontWeight.bold,
    },
    reactionCountActiveNegative: {
        color: colors.error,
        fontWeight: fontWeight.bold,
    },
    replyButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    replyText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    containerCompact: {
        paddingVertical: spacing.md,
    },
});
