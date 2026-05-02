import React, { useEffect, useMemo, useRef } from 'react';
import {
    Animated,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DigitalIDModalProps {
    visible: boolean;
    onClose: () => void;
    studentName: string;
    studentID: string;
    role: string;
}

const cardShadow = Platform.select({
    ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
    },
    android: {
        elevation: 12,
    },
    web: {
        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.18)',
    },
    default: {},
}) as object;

function QRPlaceholder() {
    const blocks = useMemo(
        () => [
            [1, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 1, 0, 1, 1],
            [1, 1, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, 1, 1, 0],
            [1, 0, 1, 1, 0, 1, 1],
            [0, 1, 0, 0, 1, 0, 1],
            [1, 1, 1, 0, 1, 1, 1],
        ],
        []
    );

    return (
        <View style={styles.qrWrapper}>
            {blocks.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.qrRow}>
                    {row.map((value, colIndex) => (
                        <View
                            key={`cell-${rowIndex}-${colIndex}`}
                            style={[styles.qrCell, value === 1 ? styles.qrCellFilled : styles.qrCellEmpty]}
                        />
                    ))}
                </View>
            ))}
            <View style={styles.qrCenterIcon}>
                <Ionicons name="school" size={20} color="#0066CC" />
            </View>
        </View>
    );
}

export default function DigitalIDModal({
    visible,
    onClose,
    studentName,
    studentID,
    role,
}: DigitalIDModalProps) {
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const cardTranslateY = useRef(new Animated.Value(24)).current;

    useEffect(() => {
        if (!visible) {
            return;
        }

        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: 220,
                useNativeDriver: true,
            }),
            Animated.spring(cardTranslateY, {
                toValue: 0,
                damping: 18,
                stiffness: 170,
                mass: 0.9,
                useNativeDriver: true,
            }),
        ]).start();
    }, [backdropOpacity, cardTranslateY, visible]);

    useEffect(() => {
        if (visible) {
            return;
        }

        backdropOpacity.setValue(0);
        cardTranslateY.setValue(24);
    }, [backdropOpacity, cardTranslateY, visible]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

                <Animated.View
                    style={[
                        styles.card,
                        cardShadow,
                        { transform: [{ translateY: cardTranslateY }] },
                    ]}
                >
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerEyebrow}>Dijital Kimlik</Text>
                            <Text style={styles.headerTitle}>Bandirma Onyedi Eylul</Text>
                            <Text style={styles.headerSubtitle}>Universitesi</Text>
                        </View>

                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={20} color="#334155" />
                        </Pressable>
                    </View>

                    <View style={styles.profileRow}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={34} color="#0066CC" />
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.roleBadge}>{role}</Text>
                            <Text style={styles.name}>{studentName}</Text>
                            <Text style={styles.idLabel}>Ogrenci No</Text>
                            <Text style={styles.idValue}>{studentID}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.qrSection}>
                        <QRPlaceholder />
                        <Text style={styles.qrTitle}>Kampus girisi icin hazir</Text>
                        <Text style={styles.qrHint}>
                            Gorevlilere bu QR kodu gostererek hizli gecis yapabilirsiniz.
                        </Text>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.58)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    card: {
        borderRadius: 28,
        backgroundColor: '#FFFFFF',
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    headerEyebrow: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.2,
        color: '#0066CC',
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
    },
    headerSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#334155',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 84,
        height: 84,
        borderRadius: 24,
        backgroundColor: '#E0F2FE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    roleBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#DBEAFE',
        color: '#1D4ED8',
        fontSize: 11,
        fontWeight: '700',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        marginBottom: 10,
        overflow: 'hidden',
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
    },
    idLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    idValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        letterSpacing: 0.4,
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 24,
    },
    qrSection: {
        alignItems: 'center',
    },
    qrWrapper: {
        width: 170,
        height: 170,
        borderRadius: 24,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
        position: 'relative',
    },
    qrRow: {
        flexDirection: 'row',
    },
    qrCell: {
        width: 16,
        height: 16,
        margin: 1,
        borderRadius: 3,
    },
    qrCellFilled: {
        backgroundColor: '#0F172A',
    },
    qrCellEmpty: {
        backgroundColor: '#FFFFFF',
    },
    qrCenterIcon: {
        position: 'absolute',
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    qrTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 6,
    },
    qrHint: {
        fontSize: 14,
        lineHeight: 20,
        color: '#64748B',
        textAlign: 'center',
    },
});
