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
}

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
    const [likes, setLikes] = useState(feedback.likes);
    const [dislikes, setDislikes] = useState(feedback.dislikes);
    const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);

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


    const categoryColor = feedback.mealTime === 'lunch' ? colors.primaryAccent : colors.primaryDark;

    return (
        <View style={styles.container}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarIcon}>👤</Text>
                </View>
                {/* Kategori renk çizgisi */}
                <View style={[styles.categoryLine, { backgroundColor: categoryColor }]} />
            </View>

            {/* İçerik */}
            <View style={styles.content}>
                {/* Üst kısım - kategori ve süre */}
                <View style={styles.header}>
                    <Text style={[styles.category, { color: categoryColor }]}>
                        {feedback.mealTime === 'lunch' ? 'ÖĞLE' : 'AKŞAM'} • {feedback.category}
                    </Text>
                    <Text style={styles.timeAgo}>{feedback.timeAgo}</Text>
                </View>

                {/* Yemek adı */}
                <Text style={styles.mealName}>{feedback.mealName}</Text>

                {/* Yorum */}
                <Text style={styles.comment}>{feedback.comment}</Text>

                {/* Alt kısım - like/dislike ve yanıtla */}
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
        ...shadows.card,
    },
    avatarContainer: {
        alignItems: 'center',
        marginRight: spacing.md,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primaryAccent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarIcon: {
        fontSize: 20,
    },
    categoryLine: {
        width: 3,
        flex: 1,
        marginTop: spacing.sm,
        borderRadius: borderRadius.full,
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
    category: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
        letterSpacing: 0.5,
    },
    timeAgo: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    mealName: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.textDark,
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
});
