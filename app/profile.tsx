import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DigitalIDModal from '../components/DigitalIDModal';

const STUDENT_DATA = {
    name: 'Ahmet Yılmaz',
    id: 'BAN-123456',
    role: 'ÖĞRENCİ',
};

export default function ProfileScreen() {
    const [isIDVisible, setIsIDVisible] = useState(false);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={48} color="#0066CC" />
                    </View>
                    <Text style={styles.title}>{STUDENT_DATA.name}</Text>
                    <Text style={styles.subtitle}>{STUDENT_DATA.role}</Text>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setIsIDVisible(true)}
                    >
                        <View style={styles.actionIconContainer}>
                            <Ionicons name="qr-code" size={24} color="#0066CC" />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Dijital Kimliğim</Text>
                            <Text style={styles.actionSubtitle}>QR kod ile hızlı geçiş</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionIconContainer}>
                            <Ionicons name="school-outline" size={24} color="#0066CC" />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Öğrenci Bilgileri</Text>
                            <Text style={styles.actionSubtitle}>Fakülte, Bölüm, Sınıf</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <DigitalIDModal
                visible={isIDVisible}
                onClose={() => setIsIDVisible(false)}
                studentName={STUDENT_DATA.name}
                studentID={STUDENT_DATA.id}
                role={STUDENT_DATA.role}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    scrollContent: { padding: 20 },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 20,
    },
    avatar: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#EBF5FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16,
        borderWidth: 4, borderColor: '#FFFFFF',
    },
    title: { fontSize: 24, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#64748B', fontWeight: '500' },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    actionIconContainer: {
        width: 48, height: 48, borderRadius: 12,
        backgroundColor: '#EBF5FF', justifyContent: 'center', alignItems: 'center', marginRight: 16,
    },
    actionTextContainer: { flex: 1 },
    actionTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
    actionSubtitle: { fontSize: 13, color: '#64748B' },
});
