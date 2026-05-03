import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    PanResponder,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DigitalIDModalProps {
    visible: boolean;
    onClose: () => void;
    studentName: string;
    studentID: string;
    tcLast4?: string | null;
    unitName?: string | null;
    departmentName?: string | null;
    profilePhotoUri?: string | null;
}

const FRONT_CARD_IMAGE = require('../assets/id-front-user-hd.jpg');
const BACK_CARD_IMAGE = require('../assets/id-back-img8902-hd-clean3.jpg');
const CARD_WIDTH = 851;
const CARD_HEIGHT = 550;
const CARD_ASPECT = CARD_WIDTH / CARD_HEIGHT;
const CARD_TRIM_SIDE = 8;
const CARD_TRIM_TOP = 8;
const CARD_TRIM_BOTTOM = 8;
const MAX_TILT_DEG = 16;

const cardShadow = Platform.select({
    ios: {
        shadowColor: '#001834',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.28,
        shadowRadius: 24,
    },
    android: {
        elevation: 14,
    },
    web: {
        boxShadow: '0 18px 40px rgba(0, 24, 52, 0.32)',
    },
    default: {},
}) as object;

const webNoFocusRing = Platform.OS === 'web'
    ? ({
        outlineStyle: 'none',
        outlineWidth: 0,
        outlineColor: 'transparent',
        WebkitTapHighlightColor: 'transparent',
    } as any)
    : null;

export default function DigitalIDModal({
    visible,
    onClose,
    studentName,
    studentID,
    tcLast4,
    unitName,
    departmentName,
    profilePhotoUri,
}: DigitalIDModalProps) {
    const { width, height } = useWindowDimensions();
    const [isBack, setIsBack] = useState(false);
    const tiltY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setIsBack(false);
        }
    }, [visible]);

    const maxCardWidthByScreen = Math.max(220, width - 40);
    const maxCardHeightByScreen = Math.max(170, height - 210);
    const maxCardWidthByHeight = maxCardHeightByScreen * CARD_ASPECT;
    const webCardMaxWidth = Platform.OS === 'web' ? 620 : CARD_WIDTH;
    const cardWidth = Math.max(200, Math.min(webCardMaxWidth, maxCardWidthByScreen, maxCardWidthByHeight));
    const cardHeight = cardWidth / CARD_ASPECT;
    const surfaceMinHeight = Math.min(height - 8, cardHeight + 280);
    const scale = cardWidth / CARD_WIDTH;
    const trimSide = CARD_TRIM_SIDE * scale;
    const trimTop = CARD_TRIM_TOP * scale;
    const trimBottom = CARD_TRIM_BOTTOM * scale;

    const valueFontSize = Math.max(9.8, Math.min(16, 14.4 * scale));
    const valueSmallFontSize = Math.max(8.8, Math.min(14, 12.8 * scale));
    const backgroundResizeMode = isBack ? 'contain' : 'cover';
    const backBleed = Math.max(2, scale * 2.4);
    const backgroundLayoutStyle = isBack
        ? {
            width: cardWidth + backBleed * 2,
            height: cardHeight + backBleed * 2,
            left: -backBleed,
            top: -backBleed,
        }
        : {
            width: cardWidth + trimSide * 2,
            height: cardHeight + trimTop + trimBottom,
            left: -trimSide,
            top: -trimTop,
        };

    const rotateY = tiltY.interpolate({
        inputRange: [-MAX_TILT_DEG, MAX_TILT_DEG],
        outputRange: [`-${MAX_TILT_DEG}deg`, `${MAX_TILT_DEG}deg`],
    });

    const tcValue = tcLast4 ? `*******${tcLast4}` : '-';
    const fullName = studentName || '-';
    const studentNo = studentID || '-';
    const unitValue = unitName || '-';
    const departmentValue = departmentName || '-';

    const photoSource = useMemo(() => {
        if (profilePhotoUri && profilePhotoUri.trim().length > 0) {
            return { uri: profilePhotoUri };
        }
        return null;
    }, [profilePhotoUri]);

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => false,
                onMoveShouldSetPanResponder: (_, gestureState) =>
                    Math.abs(gestureState.dx) > 4 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
                onPanResponderMove: (_, gestureState) => {
                    const nextTilt = Math.max(
                        -MAX_TILT_DEG,
                        Math.min(MAX_TILT_DEG, (gestureState.dx / cardWidth) * 30)
                    );
                    tiltY.setValue(nextTilt);
                },
                onPanResponderRelease: () => {
                    Animated.spring(tiltY, {
                        toValue: 0,
                        damping: 16,
                        stiffness: 170,
                        mass: 0.9,
                        useNativeDriver: true,
                    }).start();
                },
                onPanResponderTerminate: () => {
                    Animated.spring(tiltY, {
                        toValue: 0,
                        damping: 16,
                        stiffness: 170,
                        mass: 0.9,
                        useNativeDriver: true,
                    }).start();
                },
            }),
        [cardWidth, tiltY]
    );

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
            <View style={styles.backdrop}>
                <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

                <View
                    style={[
                        styles.surface,
                        {
                            width: Math.min(1500, width - 4),
                            maxHeight: height - 2,
                            minHeight: surfaceMinHeight,
                        },
                    ]}
                >
                    <View style={styles.headerRow}>
                        <Text style={styles.headerText}>ÖĞRENCİ KİMLİK KARTI</Text>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={20} color="#0F172A" />
                        </Pressable>
                    </View>

                    <Animated.View
                        style={[
                            styles.cardTiltWrap,
                            { width: cardWidth, height: cardHeight },
                            cardShadow,
                            {
                                transform: [{ perspective: 1400 }, { rotateY }],
                            },
                        ]}
                        {...panResponder.panHandlers}
                    >
                        <Pressable style={[styles.cardFrame, webNoFocusRing]} onPress={() => setIsBack((prev) => !prev)}>
                            <Image
                                source={isBack ? BACK_CARD_IMAGE : FRONT_CARD_IMAGE}
                                style={[
                                    styles.cardBackground,
                                    backgroundLayoutStyle,
                                ]}
                                resizeMode={backgroundResizeMode}
                            />

                            {!isBack ? (
                                <>
                                    <View style={styles.valuesBox}>
                                        <Text style={[styles.valueText, { fontSize: valueFontSize }]} numberOfLines={1}>
                                            {tcValue}
                                        </Text>
                                        <Text style={[styles.valueText, { fontSize: valueFontSize }]} numberOfLines={1}>
                                            {fullName}
                                        </Text>
                                        <Text style={[styles.valueText, { fontSize: valueFontSize }]} numberOfLines={1}>
                                            {studentNo}
                                        </Text>
                                        <Text style={[styles.valueText, { fontSize: valueSmallFontSize }]} numberOfLines={2}>
                                            {unitValue}
                                        </Text>
                                        <Text style={[styles.valueText, { fontSize: valueSmallFontSize }]} numberOfLines={2}>
                                            {departmentValue}
                                        </Text>
                                    </View>

                                    <View style={styles.photoBox}>
                                        {photoSource ? (
                                            <Image source={photoSource} style={styles.profilePhoto} resizeMode="cover" />
                                        ) : (
                                            <View style={styles.photoPlaceholder}>
                                                <Ionicons name="person" size={48} color="#6B7280" />
                                            </View>
                                        )}
                                    </View>
                                </>
                            ) : null}
                        </Pressable>
                    </Animated.View>

                    <Text style={styles.flipHint}>Kartı çevirmek için karta dokun</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(15,23,42,0.62)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    surface: {
        borderRadius: 24,
        backgroundColor: '#1B3F8B',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingTop: 42,
        paddingBottom: 58,
        overflow: 'hidden',
    },
    headerRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: -125,
        marginBottom: 50,
    },
    headerText: {
        color: '#E2EDFF',
        fontSize: 12,
        letterSpacing: 1.5,
        fontWeight: '800',
        marginTop: 6,
        marginLeft: -16,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EAF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginRight: -14,
    },
    cardFrame: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#FFFFFF',
    },
    cardTiltWrap: {
        overflow: 'visible',
        marginTop: 34,
    },
    cardBackground: {
        position: 'absolute',
    },
    valuesBox: {
        position: 'absolute',
        left: '33.2%',
        top: '38.1%',
        width: '28%',
        height: '53%',
        justifyContent: 'space-between',
    },
    valueText: {
        color: '#20263D',
        fontWeight: '600',
    },
    photoBox: {
        position: 'absolute',
        left: '65.7%',
        top: '34.9%',
        width: '27.6%',
        height: '47.9%',
        borderRadius: 2,
        overflow: 'hidden',
    },
    profilePhoto: {
        width: '100%',
        height: '100%',
    },
    photoPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipHint: {
        marginTop: 10,
        color: '#D2E5FF',
        fontSize: 12,
        fontWeight: '600',
    },
});
