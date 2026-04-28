import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { AuthProvider } from '../contexts/AuthContext';
import { AcademicProvider } from '../contexts/AcademicContext';
import { useAuth } from '../contexts/AuthContext';
import AuthOverlay from '../components/AuthOverlay';

const TAB_CONFIG: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap; iconOutline: keyof typeof Ionicons.glyphMap }> = {
    index: { label: 'Ana Sayfa', icon: 'home', iconOutline: 'home-outline' },
    explore: { label: 'Keşfet', icon: 'search', iconOutline: 'search-outline' },
    scan: { label: 'Tara', icon: 'qr-code', iconOutline: 'qr-code-outline' },
    profile: { label: 'Profil', icon: 'person', iconOutline: 'person-outline' },
    settings: { label: 'Ayarlar', icon: 'settings', iconOutline: 'settings-outline' },
};

const MAIN_TABS = ['index', 'explore', 'scan', 'profile', 'settings'];

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const visibleRoutes = state.routes.filter((route) => MAIN_TABS.includes(route.name));

    return (
        <View style={styles.tabBarContainer}>
            <View style={styles.tabBar}>
                {visibleRoutes.map((route) => {
                    const routeIndex = state.routes.indexOf(route);
                    const isFocused = state.index === routeIndex;
                    const config = TAB_CONFIG[route.name];
                    const isScan = route.name === 'scan';

                    if (!config) return null;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    if (isScan) {
                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={onPress}
                                activeOpacity={0.7}
                                style={styles.tabItem}
                            >
                                <View style={styles.scanCircle}>
                                    <Ionicons
                                        name={isFocused ? config.icon : config.iconOutline}
                                        size={28}
                                        color="#0066CC"
                                    />
                                </View>
                                <Text style={[styles.scanLabelText]}>
                                    {config.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            activeOpacity={0.7}
                            style={styles.tabItem}
                        >
                            <Ionicons
                                name={isFocused ? config.icon : config.iconOutline}
                                size={24}
                                color={isFocused ? '#0066CC' : '#94A3B8'}
                            />
                            <Text style={[
                                styles.labelText,
                                { color: isFocused ? '#0066CC' : '#94A3B8' },
                            ]}>
                                {config.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

function AppShell() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066CC" />
                <Text style={styles.loadingText}>Oturum hazırlanıyor...</Text>
            </View>
        );
    }

    return (
        <>
            <Tabs
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="explore" />
                <Tabs.Screen name="scan" />
                <Tabs.Screen name="profile" />
                <Tabs.Screen name="settings" />
                <Tabs.Screen name="(features)" options={{ href: null }} />
            </Tabs>
            <AuthOverlay />
        </>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <AcademicProvider>
                <AppShell />
            </AcademicProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    tabBar: {
        flexDirection: 'row',
        width: '100%',
        height: Platform.OS === 'ios' ? 90 : 70,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E8ECF0',
        paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        paddingTop: 8,
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
            },
            android: {
                elevation: 8,
            },
            web: {
                boxShadow: '0 -3px 6px rgba(0,0,0,0.08)',
            },
            default: {},
        }) as any,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelText: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 4,
        textAlign: 'center',
    },
    scanCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#0066CC',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -30,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            },
            default: {},
        }) as any,
    },
    scanLabelText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#94A3B8',
        marginTop: 4,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748B',
    },
});
