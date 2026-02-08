/**
 * FeedScreen - Ana etkinlik akışı
 */
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
import { events, getCommunityById, notifications } from '../mockData';
import Header from '../components/Header';
import EventCard from '../components/EventCard';

interface FeedScreenProps {
    onNotificationsPress: () => void;
    onCalendarPress: () => void;
}

export default function FeedScreen({ onNotificationsPress, onCalendarPress }: FeedScreenProps) {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const sortedEvents = [...events].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return (
        <View style={styles.container}>
            <Header onNotificationsPress={onNotificationsPress} onCalendarPress={onCalendarPress} unreadCount={unreadCount} />
            <FlatList
                data={sortedEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const community = getCommunityById(item.communityId);
                    if (!community) return null;
                    return <EventCard event={item} community={community} />;
                }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.backgroundLight },
    listContent: { paddingTop: spacing.md, paddingBottom: spacing.xxl },
});
