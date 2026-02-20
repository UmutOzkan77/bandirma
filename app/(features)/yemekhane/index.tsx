/**
 * Yemekhane Modülü Ana Ekranı
 * Navigasyon butonları ile ekranlar arası geçiş
 * Bottom tab bar kaldırıldı
 * 
 * Bandırma Onyedi Eylül Üniversitesi - Yemekhane Modülü
 */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './theme';
import MenuScreen from './screens/MenuScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import FeedbackScreen from './screens/FeedbackScreen';

type ScreenName = 'menu' | 'statistics' | 'feedback';

export default function YemekhaneScreen() {
    const [activeScreen, setActiveScreen] = useState<ScreenName>('menu');

    const renderScreen = () => {
        switch (activeScreen) {
            case 'menu':
                return (
                    <MenuScreen
                        onNavigateToStatistics={() => setActiveScreen('statistics')}
                        onNavigateToFeedback={() => setActiveScreen('feedback')}
                    />
                );
            case 'statistics':
                return (
                    <StatisticsScreen
                        onGoBack={() => setActiveScreen('menu')}
                    />
                );
            case 'feedback':
                return (
                    <FeedbackScreen
                        onGoBack={() => setActiveScreen('menu')}
                    />
                );
            default:
                return (
                    <MenuScreen
                        onNavigateToStatistics={() => setActiveScreen('statistics')}
                        onNavigateToFeedback={() => setActiveScreen('feedback')}
                    />
                );
        }
    };

    const containerStyle = [
        styles.container,
        activeScreen === 'statistics' && { backgroundColor: colors.backgroundDark }
    ];

    return (
        <SafeAreaView style={containerStyle} edges={['top']}>
            <View style={styles.content}>
                {renderScreen()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundLight,
    },
    content: {
        flex: 1,
    },
});
