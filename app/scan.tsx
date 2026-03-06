import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ScanScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="qr-code-outline" size={64} color="#0066CC" />
                </View>
                <Text style={styles.title}>QR Kod Tara</Text>
                <Text style={styles.subtitle}>Yemekhane girişi veya etkinlik katılımı için QR kodunuzu taratın</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    iconContainer: {
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: '#EBF5FF', justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    },
    title: { fontSize: 24, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20 },
});
