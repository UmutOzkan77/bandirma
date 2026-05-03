import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../theme';
import type { SelectableOffering } from '../../../../lib/domain';

interface AddCourseModalProps {
    visible: boolean;
    onClose: () => void;
    onSearch: (query: string) => Promise<SelectableOffering[]>;
    onSave: (offering: SelectableOffering) => Promise<void> | void;
}

const dayOptions = [
    { label: 'P', value: 0 },
    { label: 'S', value: 1 },
    { label: 'Ç', value: 2 },
    { label: 'P', value: 3 },
    { label: 'C', value: 4 },
    { label: 'C', value: 5 },
    { label: 'P', value: 6 },
];

function formatDisplayTime(time?: string | null) {
    if (!time) {
        return '';
    }

    const [hourValue, minuteValue] = time.split(':');
    const hour = Number(hourValue);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(displayHour).padStart(2, '0')}:${minuteValue ?? '00'} ${period}`;
}

export default function AddCourseModal({ visible, onClose, onSearch, onSave }: AddCourseModalProps) {
    const [courseName, setCourseName] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [startTime, setStartTime] = useState('09:00 AM');
    const [endTime, setEndTime] = useState('10:30 AM');
    const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 3]);
    const [results, setResults] = useState<SelectableOffering[]>([]);
    const [selectedOfferingId, setSelectedOfferingId] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const selectedOffering = useMemo(
        () => results.find((item) => item.id === selectedOfferingId) ?? null,
        [results, selectedOfferingId]
    );

    useEffect(() => {
        if (!visible) {
            setCourseName('');
            setTeacherName('');
            setRoomName('');
            setStartTime('09:00 AM');
            setEndTime('10:30 AM');
            setSelectedDays([0, 1, 3]);
            setResults([]);
            setSelectedOfferingId(null);
            setIsSearching(false);
            return;
        }

        if (courseName.trim().length < 2) {
            setResults([]);
            setSelectedOfferingId(null);
            return;
        }

        const timer = setTimeout(() => {
            void (async () => {
                setIsSearching(true);
                const nextResults = await onSearch(courseName);
                setResults(nextResults);
                setSelectedOfferingId(nextResults[0]?.id ?? null);
                setIsSearching(false);
            })();
        }, 250);

        return () => clearTimeout(timer);
    }, [visible, courseName, onSearch]);

    useEffect(() => {
        if (!selectedOffering) {
            return;
        }

        const firstSlot = selectedOffering.scheduleSlots[0];
        setTeacherName(selectedOffering.instructorName ?? '');
        setRoomName(firstSlot?.room ?? '');
        setStartTime(formatDisplayTime(firstSlot?.startTime) || '09:00 AM');
        setEndTime(formatDisplayTime(firstSlot?.endTime) || '10:30 AM');

        const days = Array.from(new Set(selectedOffering.scheduleSlots.map((slot) => slot.dayOfWeek)));
        if (days.length > 0) {
            setSelectedDays(days);
        }
    }, [selectedOffering]);

    const toggleDay = (dayValue: number) => {
        setSelectedDays((currentDays) =>
            currentDays.includes(dayValue)
                ? currentDays.filter((item) => item !== dayValue)
                : [...currentDays, dayValue]
        );
    };

    const handleSave = async () => {
        if (!selectedOffering) {
            return;
        }

        setIsSaving(true);
        await onSave(selectedOffering);
        setIsSaving(false);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.screen}>
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.iconButton} onPress={onClose} activeOpacity={0.7}>
                            <Ionicons name="close" size={28} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Yeni Ders Ekle</Text>
                        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                            <Text style={styles.cancelText}>İptal</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.formScroll}
                        contentContainerStyle={styles.formContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.sectionTitle}>Genel Bilgiler</Text>

                        <Text style={styles.label}>Ders Adı</Text>
                        <TextInput
                            style={styles.input}
                            value={courseName}
                            onChangeText={setCourseName}
                            placeholder="ör: İleri Matematik"
                            placeholderTextColor={colors.textMuted}
                        />

                        <Text style={styles.label}>Öğretmen</Text>
                        <View style={styles.inputWithIcon}>
                            <TextInput
                                style={styles.inputText}
                                value={teacherName}
                                onChangeText={setTeacherName}
                                placeholder="ör: Dr. Richards"
                                placeholderTextColor={colors.textMuted}
                            />
                            <Ionicons name="person" size={22} color={colors.primary} />
                        </View>

                        <Text style={styles.label}>Sınıf/Oda</Text>
                        <View style={styles.inputWithIcon}>
                            <TextInput
                                style={styles.inputText}
                                value={roomName}
                                onChangeText={setRoomName}
                                placeholder="ör: Fen Laboratuvarı 4B"
                                placeholderTextColor={colors.textMuted}
                            />
                            <Ionicons name="location-sharp" size={24} color={colors.primary} />
                        </View>

                        <View style={styles.programHeader}>
                            <Text style={styles.sectionTitle}>Program</Text>
                            {isSearching && <ActivityIndicator color={colors.primary} />}
                        </View>

                        <Text style={styles.label}>Haftanın Günleri</Text>
                        <View style={styles.dayRow}>
                            {dayOptions.map((day) => {
                                const selected = selectedDays.includes(day.value);
                                return (
                                    <TouchableOpacity
                                        key={`${day.label}-${day.value}`}
                                        style={[styles.dayButton, selected && styles.dayButtonSelected]}
                                        onPress={() => toggleDay(day.value)}
                                        activeOpacity={0.75}
                                    >
                                        <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{day.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={styles.timeGrid}>
                            <View style={styles.timeColumn}>
                                <Text style={styles.label}>Başlangıç Saati</Text>
                                <View style={styles.timeInput}>
                                    <TextInput
                                        style={styles.timeText}
                                        value={startTime}
                                        onChangeText={setStartTime}
                                        placeholder="09:00 AM"
                                        placeholderTextColor={colors.textMuted}
                                    />
                                    <Ionicons name="time-outline" size={22} color={colors.textMuted} />
                                </View>
                            </View>

                            <View style={styles.timeColumn}>
                                <Text style={styles.label}>Bitiş Saati</Text>
                                <View style={styles.timeInput}>
                                    <TextInput
                                        style={styles.timeText}
                                        value={endTime}
                                        onChangeText={setEndTime}
                                        placeholder="10:30 AM"
                                        placeholderTextColor={colors.textMuted}
                                    />
                                    <Ionicons name="time-outline" size={22} color={colors.textMuted} />
                                </View>
                            </View>
                        </View>

                        {courseName.trim().length >= 2 && !selectedOffering && !isSearching && (
                            <Text style={styles.helperText}>Kaydetmek için buluttaki aktif derslerden eşleşen bir ders adı girin.</Text>
                        )}
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.saveButton, (!selectedOffering || isSaving) && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={!selectedOffering || isSaving}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="save" size={24} color={colors.textLight} />
                        <Text style={styles.saveButtonText}>{isSaving ? 'Kaydediliyor' : 'Dersi Kaydet'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xxl,
    },
    sheet: {
        flex: 1,
        maxWidth: 520,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 28,
        backgroundColor: colors.cardBackground,
        overflow: 'hidden',
        ...shadows.card,
    },
    header: {
        height: 78,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingHorizontal: spacing.xl,
    },
    iconButton: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: '#0F172A',
    },
    cancelText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.primary,
    },
    formScroll: {
        flex: 1,
    },
    formContent: {
        paddingHorizontal: spacing.xxl,
        paddingTop: spacing.xxl,
        paddingBottom: 120,
    },
    sectionTitle: {
        fontSize: fontSize.title,
        fontWeight: fontWeight.bold,
        color: '#0F172A',
        marginBottom: spacing.xl,
    },
    label: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: '#111827',
        marginBottom: spacing.sm,
    },
    input: {
        height: 72,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: spacing.xl,
        fontSize: fontSize.xxl,
        color: colors.textPrimary,
        marginBottom: spacing.xxl,
    },
    inputWithIcon: {
        height: 72,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.xxl,
    },
    inputText: {
        flex: 1,
        fontSize: fontSize.xxl,
        color: colors.textPrimary,
        paddingVertical: 0,
    },
    programHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing.sm,
    },
    dayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xxl,
        gap: spacing.sm,
    },
    dayButton: {
        flex: 1,
        maxWidth: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#EEF2F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayButtonSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    dayText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.textMuted,
    },
    dayTextSelected: {
        color: colors.textLight,
    },
    timeGrid: {
        flexDirection: 'row',
        gap: spacing.xl,
    },
    timeColumn: {
        flex: 1,
    },
    timeInput: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: spacing.xl,
    },
    timeText: {
        flex: 1,
        fontSize: fontSize.lg,
        color: '#111827',
        paddingVertical: 0,
    },
    helperText: {
        marginTop: spacing.lg,
        fontSize: fontSize.sm,
        lineHeight: 20,
        color: colors.textSecondary,
    },
    saveButton: {
        position: 'absolute',
        left: spacing.xxl,
        right: spacing.xxl,
        bottom: spacing.xxl,
        height: 72,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        ...shadows.fab,
    },
    saveButtonDisabled: {
        opacity: 0.55,
    },
    saveButtonText: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textLight,
    },
});
