/**
 * EventDetailScreen - Etkinlik detaylarını ve katılım butonlarını gösteren ekran
 */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { Event, Community } from '../types';
import { formatDateTurkish } from '../mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EventDetailScreenProps {
    event: Event;
    community: Community;
    isParticipated: boolean;
    onParticipationToggle: (participate: boolean) => void;
    onClose: () => void;
}

export default function EventDetailScreen({
    event,
    community,
    isParticipated,
    onParticipationToggle,
    onClose
}: EventDetailScreenProps) {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header / Hero */}
                <View style={styles.heroContainer}>
                    <Image source={{ uri: event.image }} style={styles.heroImage} resizeMode="cover" />
                    <View style={styles.overlay} />
                    <TouchableOpacity style={styles.closeFloatButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {/* Community Info */}
                    <View style={styles.communityRow}>
                        <Image source={{ uri: community.logo }} style={styles.communityLogo} />
                        <View style={styles.communityTextInfo}>
                            <Text style={styles.communityName}>{community.name}</Text>
                            <Text style={styles.communityStatus}>Resmi Topluluk</Text>
                        </View>
                    </View>

                    {/* Event Title */}
                    <Text style={styles.eventTitle}>{event.title}</Text>

                    {/* Details Grid */}
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.detailLabel}>Tarih</Text>
                                <Text style={styles.detailValue}>{formatDateTurkish(event.date)}</Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="time-outline" size={20} color={colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.detailLabel}>Saat</Text>
                                <Text style={styles.detailValue}>{event.time}</Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="location-outline" size={20} color={colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.detailLabel}>Mekan</Text>
                                <Text style={styles.detailValue}>{event.location}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Etkinlik Hakkında</Text>
                        <Text style={styles.description}>{event.description}</Text>
                    </View>

                    {/* Call to Action Buttons */}
                    <View style={styles.actionSection}>
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                isParticipated ? styles.participatedButton : styles.participateButton
                            ]}
                            onPress={() => onParticipationToggle(true)}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={isParticipated ? "checkmark-circle" : "add-circle-outline"}
                                size={22}
                                color="#FFF"
                            />
                            <Text style={styles.actionButtonText}>Katılacağım</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                !isParticipated ? styles.notParticipatedButton : styles.notParticipateButton
                            ]}
                            onPress={() => onParticipationToggle(false)}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={!isParticipated ? "close-circle" : "close-circle-outline"}
                                size={22}
                                color={!isParticipated ? "#FFF" : "#64748B"}
                            />
                            <Text style={[
                                styles.actionButtonText,
                                isParticipated && { color: "#64748B" }
                            ]}>Katılmayacağım</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundLight,
    },
    heroContainer: {
        height: 250, // Slightly reduced
        width: '100%',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    closeFloatButton: {
        position: 'absolute',
        top: 20,
        right: 20, // Changed from left to right for close icon feel
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flex: 1,
        backgroundColor: colors.backgroundLight,
    },
    content: {
        padding: 24,
        marginTop: -20,
        backgroundColor: colors.backgroundLight,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    communityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    communityLogo: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.border,
    },
    communityTextInfo: {
        marginLeft: 16,
    },
    communityName: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    communityStatus: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
    },
    eventTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 24,
        lineHeight: 32,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32,
    },
    detailItem: {
        width: '47%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailLabel: {
        fontSize: 10,
        color: colors.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 13,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: colors.textSecondary,
    },
    actionSection: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 40,
    },
    actionButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    participateButton: {
        backgroundColor: colors.primary,
    },
    participatedButton: {
        backgroundColor: '#22C55E', // Green
    },
    notParticipateButton: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: colors.border,
    },
    notParticipatedButton: {
        backgroundColor: '#EF4444', // Red
    },
    actionButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
    },
});
