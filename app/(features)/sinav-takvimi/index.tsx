/**
 * Sınav Takvimi Modülü Ana Ekranı
 * Tab navigasyonu ile tüm alt ekranları birleştirir
 * 
 * Bandırma Onyedi Eylül Üniversitesi - Sınav Takvimi Modülü
 */
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './theme';
import BottomTabBar, { TabName } from './components/BottomTabBar';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import CalculatorScreen from './screens/CalculatorScreen';

export default function SinavTakvimiScreen() {
    // Aktif tab state'i
    const [activeTab, setActiveTab] = useState<TabName>('home');

    // Takvime geçiş fonksiyonu (HomeScreen'den çağrılır)
    const navigateToCalendar = () => {
        setActiveTab('calendar');
    };

    // Calculator'a geçiş fonksiyonu (ExamDetailModal'dan çağrılır)
    const navigateToCalculator = () => {
        setActiveTab('calculator');
    };

    // Aktif ekranı render et
    const renderScreen = () => {
        switch (activeTab) {
            case 'home':
                return <HomeScreen onNavigateToCalendar={navigateToCalendar} />;
            case 'calendar':
                return <CalendarScreen onNavigateToCalculator={navigateToCalculator} />;
            case 'calculator':
                return <CalculatorScreen />;
            case 'profile':
                return (
                    <View style={styles.placeholderScreen}>
                        <Text style={styles.placeholderIcon}>👤</Text>
                        <Text style={styles.placeholderTitle}>Profil</Text>
                        <Text style={styles.placeholderText}>
                            Bu sayfa yakında eklenecek
                        </Text>
                    </View>
                );
            default:
                return <HomeScreen onNavigateToCalendar={navigateToCalendar} />;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Ana içerik */}
            <View style={styles.content}>
                {renderScreen()}
            </View>

            {/* Alt navigasyon çubuğu */}
            <BottomTabBar
                activeTab={activeTab}
                onTabPress={setActiveTab}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundDark,
    },
    content: {
        flex: 1,
    },
    placeholderScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundDark,
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
