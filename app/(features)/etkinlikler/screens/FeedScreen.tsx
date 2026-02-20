/**
 * FeedScreen - Ana etkinlik akışı
 */
import React, { useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
import { events, getCommunityById, notifications } from '../mockData';
import Header from '../components/Header';
import EventCard from '../components/EventCard';

interface FeedScreenProps {
    onNotificationsPress: () => void;
    onCalendarPress: () => void;
    onCommunityPress?: (communityId: string) => void;
    followedCommunities?: Set<string>;
    highlightedEventId?: string;
}

export default function FeedScreen({
    onNotificationsPress,
    onCalendarPress,
    onCommunityPress,
    followedCommunities = new Set(),
    highlightedEventId
}: FeedScreenProps) {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const flatListRef = useRef<FlatList>(null);

    // Sort events: followed communities first, then by creation time
    const sortedEvents = [...events].sort((a, b) => {
        const aIsFollowed = followedCommunities.has(a.communityId);
        const bIsFollowed = followedCommunities.has(b.communityId);

        // If one is followed and the other isn't, prioritize the followed one
        if (aIsFollowed && !bIsFollowed) return -1;
        if (!aIsFollowed && bIsFollowed) return 1;

        // Otherwise sort by creation time (newest first)
        return b.createdAt.getTime() - a.createdAt.getTime();
    });

    // Scroll to highlighted event when it changes
    useEffect(() => {
        if (highlightedEventId && flatListRef.current) {
            const index = sortedEvents.findIndex(e => e.id === highlightedEventId);
            if (index !== -1) {
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
                }, 300);
            }
        }
    }, [highlightedEventId]);

    return (
        <View style={styles.container}>
            <Header onNotificationsPress={onNotificationsPress} onCalendarPress={onCalendarPress} unreadCount={unreadCount} />
            <FlatList
                ref={flatListRef}
                data={sortedEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const community = getCommunityById(item.communityId);
                    if (!community) return null;
                    return <EventCard event={item} community={community} onCommunityPress={onCommunityPress} />;
                }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onScrollToIndexFailed={(info) => {
                    setTimeout(() => {
                        flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
                    }, 100);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.backgroundLight },
    listContent: { paddingTop: spacing.md, paddingBottom: spacing.xxl },
});
