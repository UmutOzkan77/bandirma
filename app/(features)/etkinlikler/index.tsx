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
import NotificationsScreen from './screens/NotificationsScreen';

export default function EtkinliklerScreen() {
    const [activeScreen, setActiveScreen] = useState<ScreenType>('feed');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const handleNotificationsPress = () => setActiveScreen('notifications');
    const handleCalendarPress = () => setActiveScreen('calendar');

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setActiveScreen('dailyProgram');
    };

    const handleEventDetailsPress = (eventId: string) => setActiveScreen('feed');
    const handleClose = () => setActiveScreen('feed');
    const handleBack = () => setActiveScreen('feed');

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.feedContainer}>
                <FeedScreen onNotificationsPress={handleNotificationsPress} onCalendarPress={handleCalendarPress} />
            </View>

            <Modal visible={activeScreen === 'calendar'} animationType="slide" transparent={false} onRequestClose={handleClose}>
                <SafeAreaView style={styles.modalContainer} edges={['top']}>
                    <CalendarScreen onClose={handleClose} onDateSelect={handleDateSelect} />
                </SafeAreaView>
            </Modal>

            <Modal visible={activeScreen === 'dailyProgram'} animationType="slide" transparent={false} onRequestClose={handleClose}>
                <SafeAreaView style={styles.modalContainer} edges={['top']}>
                    <DailyProgramScreen selectedDate={selectedDate} onDateChange={setSelectedDate} onEventDetailsPress={handleEventDetailsPress} onClose={handleClose} />
                </SafeAreaView>
            </Modal>

            <Modal visible={activeScreen === 'notifications'} animationType="slide" transparent={false} onRequestClose={handleClose}>
                <SafeAreaView style={styles.modalContainer} edges={['top']}>
                    <NotificationsScreen onClose={handleClose} onBack={handleBack} />
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
