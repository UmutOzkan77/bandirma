import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './theme';
import { ScreenType, Event, Community } from './types';
import FeedScreen from './screens/FeedScreen';
import CalendarScreen from './screens/CalendarScreen';
import DailyProgramScreen from './screens/DailyProgramScreen';
import CommunityDetailScreen from './screens/CommunityDetailScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import { fetchCommunityById, fetchEventById, fetchEventsByDate } from './services/eventService';

export default function EtkinliklerScreen() {
    const [activeScreen, setActiveScreen] = useState<ScreenType>('feed');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [selectedEventCommunity, setSelectedEventCommunity] = useState<Community | null>(null);
    const [followedCommunities, setFollowedCommunities] = useState<Set<string>>(new Set());
    const [participatedEvents, setParticipatedEvents] = useState<Set<string>>(new Set());
    const [highlightedEventId] = useState<string>('');

    const handleNotificationsPress = () => {
        // Bildirimler ana sayfada toplanacak.
    };

    const handleCalendarPress = () => setActiveScreen('calendar');

    const handleDateSelect = async (date: string) => {
        setSelectedDate(date);

        const eventsForDay = await fetchEventsByDate(date);
        if (eventsForDay.length === 0) {
            setActiveScreen('dailyProgram');
            return;
        }

        const selected = eventsForDay[0];
        const community = await fetchCommunityById(selected.communityId);
        if (!community) {
            setActiveScreen('dailyProgram');
            return;
        }

        handleEventPress(selected, community);
    };

    const handleCommunityPress = (communityId: string) => {
        setSelectedCommunityId(communityId);
        setActiveScreen('communityDetail');
    };

    const handleEventPress = (event: Event, community: Community) => {
        setSelectedEvent(event);
        setSelectedEventCommunity(community);
        setActiveScreen('eventDetail');
    };

    const handleFollowToggle = () => {
        setFollowedCommunities(prev => {
            const next = new Set(prev);
            if (next.has(selectedCommunityId)) {
                next.delete(selectedCommunityId);
            } else {
                next.add(selectedCommunityId);
            }
            return next;
        });
    };

    const handleParticipationToggle = (participate: boolean) => {
        if (!selectedEvent) return;
        setParticipatedEvents(prev => {
            const next = new Set(prev);
            if (participate) {
                next.add(selectedEvent.id);
            } else {
                next.delete(selectedEvent.id);
            }
            return next;
        });
    };

    const handleEventDetailsPress = async (eventId: string) => {
        const event = await fetchEventById(eventId);
        if (!event) return;

        const community = await fetchCommunityById(event.communityId);
        if (!community) return;

        handleEventPress(event, community);
    };

    const handleClose = () => setActiveScreen('feed');

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.feedContainer}>
                <FeedScreen
                    onNotificationsPress={handleNotificationsPress}
                    onCalendarPress={handleCalendarPress}
                    onCommunityPress={handleCommunityPress}
                    onEventPress={handleEventPress}
                    followedCommunities={followedCommunities}
                    highlightedEventId={highlightedEventId}
                />
            </View>

            <Modal visible={activeScreen === 'calendar'} animationType="slide" transparent={false} onRequestClose={handleClose}>
                <SafeAreaView style={styles.modalContainer} edges={['top']}>
                    <CalendarScreen
                        onClose={handleClose}
                        onDateSelect={handleDateSelect}
                        participatedEvents={participatedEvents}
                    />
                </SafeAreaView>
            </Modal>

            <Modal visible={activeScreen === 'dailyProgram'} animationType="slide" transparent={false} onRequestClose={handleClose}>
                <SafeAreaView style={styles.modalContainer} edges={['top']}>
                    <DailyProgramScreen
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        onEventDetailsPress={handleEventDetailsPress}
                        onClose={handleClose}
                    />
                </SafeAreaView>
            </Modal>

            <Modal visible={activeScreen === 'communityDetail'} animationType="slide" transparent={false} onRequestClose={handleClose}>
                <SafeAreaView style={styles.modalContainer} edges={['top']}>
                    <CommunityDetailScreen
                        communityId={selectedCommunityId}
                        isFollowing={followedCommunities.has(selectedCommunityId)}
                        onFollowToggle={handleFollowToggle}
                        onClose={handleClose}
                    />
                </SafeAreaView>
            </Modal>

            <Modal visible={activeScreen === 'eventDetail'} animationType="slide" transparent={false} onRequestClose={handleClose}>
                <SafeAreaView style={styles.modalContainer} edges={['top']}>
                    {selectedEvent && selectedEventCommunity && (
                        <EventDetailScreen
                            event={selectedEvent}
                            community={selectedEventCommunity}
                            isParticipated={participatedEvents.has(selectedEvent.id)}
                            onParticipationToggle={handleParticipationToggle}
                            onOpenCalendar={handleCalendarPress}
                            onClose={handleClose}
                        />
                    )}
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.backgroundLight },
    feedContainer: { flex: 1 },
    modalContainer: { flex: 1, backgroundColor: colors.backgroundLight },
});
