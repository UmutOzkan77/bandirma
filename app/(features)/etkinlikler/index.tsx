/**
 * Etkinlikler Modülü Ana Ekranı
 * Tüm ekranları koordine eden ana bileşen
 */
import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './theme';
import { ScreenType } from './types';
import FeedScreen from './screens/FeedScreen';
import CalendarScreen from './screens/CalendarScreen';
import DailyProgramScreen from './screens/DailyProgramScreen';
import CommunityDetailScreen from './screens/CommunityDetailScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import { Event, Community } from './types';
import { getEventById, getCommunityById } from './mockData';

export default function EtkinliklerScreen() {
    const [activeScreen, setActiveScreen] = useState<ScreenType>('feed');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [followedCommunities, setFollowedCommunities] = useState<Set<string>>(new Set());
    const [participatedEvents, setParticipatedEvents] = useState<Set<string>>(new Set());
    const [highlightedEventId, setHighlightedEventId] = useState<string>('');

    const handleNotificationsPress = () => {
        // Modül içi bildirim iptal edildi, anasayfaya yönlendirme yapılabilir veya boş bırakılabilir.
        // User requested: "anasayfadaki bildirimler kısmında toplanacak"
    };

    const handleCalendarPress = () => setActiveScreen('calendar');

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setActiveScreen('dailyProgram');
    };

    const handleCommunityPress = (communityId: string) => {
        setSelectedCommunityId(communityId);
        setActiveScreen('communityDetail');
    };

    const handleEventPress = (event: Event) => {
        setSelectedEventId(event.id);
        setActiveScreen('eventDetail');
    };

    const handleFollowToggle = () => {
        setFollowedCommunities(prev => {
            const newSet = new Set(prev);
            if (newSet.has(selectedCommunityId)) {
                newSet.delete(selectedCommunityId);
            } else {
                newSet.add(selectedCommunityId);
            }
            return newSet;
        });
    };

    const handleParticipationToggle = (participate: boolean) => {
        setParticipatedEvents(prev => {
            const newSet = new Set(prev);
            if (participate) {
                newSet.add(selectedEventId);
            } else {
                newSet.delete(selectedEventId);
            }
            return newSet;
        });
    };

    const handleEventDetailsPress = (eventId: string) => {
        const event = getEventById(eventId);
        if (event) {
            handleEventPress(event);
        }
    };

    const handleClose = () => setActiveScreen('feed');

    const renderModals = () => {
        const selectedEvent = getEventById(selectedEventId);
        const eventCommunity = selectedEvent ? getCommunityById(selectedEvent.communityId) : null;

        return (
            <>
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
                        <DailyProgramScreen selectedDate={selectedDate} onDateChange={setSelectedDate} onEventDetailsPress={handleEventDetailsPress} onClose={handleClose} />
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
                        {selectedEvent && eventCommunity && (
                            <EventDetailScreen
                                event={selectedEvent}
                                community={eventCommunity}
                                isParticipated={participatedEvents.has(selectedEventId)}
                                onParticipationToggle={handleParticipationToggle}
                                onClose={handleClose}
                            />
                        )}
                    </SafeAreaView>
                </Modal>
            </>
        );
    };

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
            {renderModals()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.backgroundLight },
    feedContainer: { flex: 1 },
    modalContainer: { flex: 1, backgroundColor: colors.backgroundLight },
});
