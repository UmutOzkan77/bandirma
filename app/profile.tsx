import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DigitalIDModal from '../components/DigitalIDModal';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
    const [isIDVisible, setIsIDVisible] = useState(false);
    const { profile } = useAuth();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.heroCard}>
                    <TouchableOpacity style={styles.avatar} activeOpacity={0.85} onPress={() => setIsIDVisible(true)}>
                        <Ionicons name="person" size={44} color="#1D4ED8" />
                    </TouchableOpacity>
                    <Text style={styles.name}>{profile?.fullName ?? 'Bandirma Ogrencisi'}</Text>
                    <Text style={styles.subtitle}>{profile?.schoolEmail ?? 'E-posta yok'}</Text>
                    <Text style={styles.meta}>
                        {profile?.departmentName ?? 'Bolum bilgisi yok'}
                        {profile?.classLevel ? ` • ${profile.classLevel}. Sinif` : ''}
                    </Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.row}>
                        <View style={styles.rowIcon}>
                            <Ionicons name="school-outline" size={22} color="#1D4ED8" />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={styles.rowTitle}>Akademik Profil</Text>
                            <Text style={styles.rowSubtitle}>
                                {profile?.facultyName ?? 'Fakulte yok'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <View style={styles.rowIcon}>
                            <Ionicons name="call-outline" size={22} color="#1D4ED8" />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={styles.rowTitle}>Telefon</Text>
                            <Text style={styles.rowSubtitle}>{profile?.phone ?? 'Telefon tanimli degil'}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <DigitalIDModal
                visible={isIDVisible}
                onClose={() => setIsIDVisible(false)}
                studentName={profile?.fullName ?? 'Bandırma Öğrencisi'}
                studentID={profile?.studentNumber ?? profile?.id ?? '-'}
                tcLast4={profile?.tcLast4}
                unitName={profile?.facultyName ?? '-'}
                departmentName={profile?.departmentName ?? '-'}
                profilePhotoUri={(profile as any)?.photoUrl ?? (profile as any)?.avatarUrl ?? (profile as any)?.profileImageUrl ?? null}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    heroCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#0F172A',
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 32,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0F172A',
        textAlign: 'center',
    },
    subtitle: {
        marginTop: 6,
        fontSize: 14,
        color: '#475569',
    },
    meta: {
        marginTop: 10,
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 12,
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
    rowIcon: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    rowContent: {
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
});
