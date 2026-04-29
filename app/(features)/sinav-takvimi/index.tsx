/**
 * Sınav Takvimi Modülü Ana Ekranı
 * Tab navigasyonu ile tüm alt ekranları birleştirir
 * 
 * Bandırma Onyedi Eylül Üniversitesi - Sınav Takvimi Modülü
 */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './theme';
import CalendarScreen from './screens/CalendarScreen';
import CalculatorScreen from './screens/CalculatorScreen';

type ScreenName = 'calendar' | 'calculator';

export default function SinavTakvimiScreen() {
    // Aktif ekran state'i
    const [activeScreen, setActiveScreen] = useState<ScreenName>('calendar');

    // Calculator'a geçiş fonksiyonu
    const navigateToCalculator = () => {
        setActiveScreen('calculator');
    };

    // Takvime geri dönüş fonksiyonu
    const navigateToCalendar = () => {
        setActiveScreen('calendar');
    };

    // Aktif ekranı render et
    const renderScreen = () => {
        switch (activeScreen) {
            case 'calendar':
                return <CalendarScreen onNavigateToCalculator={navigateToCalculator} />;
            case 'calculator':
                return <CalculatorScreen onNavigateBack={navigateToCalendar} />;
            default:
                return <CalendarScreen onNavigateToCalculator={navigateToCalculator} />;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.content}>
                {renderScreen()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundMain,
    },
    content: {
        flex: 1,
    },
    placeholderScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundMain,
        padding: 32,
    },
    placeholderIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    placeholderTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    placeholderText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
