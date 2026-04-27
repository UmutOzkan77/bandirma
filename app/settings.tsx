import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useAcademic } from '../contexts/AcademicContext';

export default function SettingsScreen() {
    const { logout, isSupabaseEnabled, profile } = useAuth();
    const { activeTerm } = useAcademic();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.content}>
                <Text style={styles.title}>Ayarlar</Text>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <Ionicons name="server-outline" size={20} color="#1D4ED8" />
                        <View style={styles.rowContent}>
                            <Text style={styles.rowTitle}>Baglanti</Text>
                            <Text style={styles.rowSubtitle}>
                                {isSupabaseEnabled ? 'Supabase bagli' : 'Fallback demo modu'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Ionicons name="calendar-outline" size={20} color="#1D4ED8" />
                        <View style={styles.rowContent}>
                            <Text style={styles.rowTitle}>Aktif Donem</Text>
                            <Text style={styles.rowSubtitle}>
                                {activeTerm ? `${activeTerm.year} ${activeTerm.termName}` : 'Donem bulunamadi'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Ionicons name="mail-outline" size={20} color="#1D4ED8" />
                        <View style={styles.rowContent}>
                            <Text style={styles.rowTitle}>Hesap</Text>
                            <Text style={styles.rowSubtitle}>{profile?.schoolEmail ?? 'Oturum yok'}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={() => void logout()}>
                    <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.logoutText}>Cikis Yap</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 18,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 14,
        paddingVertical: 8,
        shadowColor: '#0F172A',
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    rowContent: {
        marginLeft: 14,
        flex: 1,
    },
    rowTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
    rowSubtitle: {
        marginTop: 4,
        fontSize: 13,
        color: '#64748B',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 14,
    },
    logoutButton: {
        marginTop: 24,
        backgroundColor: '#0F172A',
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
    },
});
