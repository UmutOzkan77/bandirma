/**
 * AddCourseModal Bileşeni
 * Yeni ders ekleme modalı
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../theme';

interface AddCourseModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (course: {
        name: string;
        instructor: string;
        room: string;
        selectedDays: boolean[];
        startTime: string;
        endTime: string;
    }) => void;
}

const dayLabels = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

export default function AddCourseModal({ visible, onClose, onSave }: AddCourseModalProps) {
    const [name, setName] = useState('');
    const [instructor, setInstructor] = useState('');
    const [room, setRoom] = useState('');
    const [selectedDays, setSelectedDays] = useState([false, false, false, false, false, false, false]);
    const [startTime, setStartTime] = useState('09:00 AM');
    const [endTime, setEndTime] = useState('10:30 AM');

    const toggleDay = (index: number) => {
        const newDays = [...selectedDays];
        newDays[index] = !newDays[index];
        setSelectedDays(newDays);
    };

    const handleSave = () => {
        onSave({
            name,
            instructor,
            room,
            selectedDays,
            startTime,
            endTime,
        });
        // Reset form
        setName('');
        setInstructor('');
        setRoom('');
        setSelectedDays([false, false, false, false, false, false, false]);
        setStartTime('09:00 AM');
        setEndTime('10:30 AM');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeButton}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Yeni Ders Ekle</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelButton}>İptal</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Genel Bilgiler Section */}
                    <Text style={styles.sectionTitle}>Genel Bilgiler</Text>

                    {/* Ders Adı */}
                    <Text style={styles.label}>Ders Adı</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="ör: İleri Matematik"
                            placeholderTextColor={colors.textMuted}
                        />
                    </View>

                    {/* Öğretmen */}
                    <Text style={styles.label}>Öğretmen</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={instructor}
                            onChangeText={setInstructor}
                            placeholder="ör: Dr. Richards"
                            placeholderTextColor={colors.textMuted}
                        />
                        <Text style={[styles.inputIcon, { color: colors.accent }]}>👤</Text>
                    </View>

                    {/* Sınıf/Oda */}
                    <Text style={styles.label}>Sınıf/Oda</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={room}
                            onChangeText={setRoom}
                            placeholder="ör: Fen Laboratuvarı 4B"
                            placeholderTextColor={colors.textMuted}
                        />
                        <Text style={[styles.inputIcon, { color: colors.roomIcon }]}>📍</Text>
                    </View>

                    {/* Program Section */}
                    <Text style={styles.sectionTitle}>Program</Text>

                    {/* Haftanın Günleri */}
                    <Text style={styles.label}>Haftanın Günleri</Text>
                    <View style={styles.daysContainer}>
                        {dayLabels.map((day, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayButton,
                                    selectedDays[index] && styles.dayButtonSelected,
                                ]}
                                onPress={() => toggleDay(index)}
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        selectedDays[index] && styles.dayTextSelected,
                                    ]}
                                >
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Time Pickers */}
                    <View style={styles.timeRow}>
                        <View style={styles.timeColumn}>
                            <Text style={styles.label}>Başlangıç Saati</Text>
                            <View style={styles.timeInputContainer}>
                                <TextInput
                                    style={styles.timeInput}
                                    value={startTime}
                                    onChangeText={setStartTime}
                                    placeholder="09:00 AM"
                                    placeholderTextColor={colors.textMuted}
                                />
                                <Text style={[styles.timeIcon, { color: colors.accent }]}>🕐</Text>
                            </View>
                        </View>
                        <View style={styles.timeColumn}>
                            <Text style={styles.label}>Bitiş Saati</Text>
                            <View style={styles.timeInputContainer}>
                                <TextInput
                                    style={styles.timeInput}
                                    value={endTime}
                                    onChangeText={setEndTime}
                                    placeholder="10:30 AM"
                                    placeholderTextColor={colors.textMuted}
                                />
                                <Text style={[styles.timeIcon, { color: colors.accent }]}>🕐</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Save Button */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveIcon}>💾</Text>
                        <Text style={styles.saveButtonText}>Dersi Kaydet</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    closeButton: {
        fontSize: fontSize.xl,
        color: colors.textSecondary,
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    cancelButton: {
        fontSize: fontSize.md,
        color: colors.accent,
        fontWeight: fontWeight.medium,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
    },
    sectionTitle: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.lg,
        marginTop: spacing.md,
    },
    label: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        marginBottom: spacing.lg,
        backgroundColor: colors.cardBackground,
    },
    input: {
        flex: 1,
        fontSize: fontSize.md,
        color: colors.textPrimary,
    },
    inputIcon: {
        fontSize: fontSize.lg,
        marginLeft: spacing.sm,
    },
    daysContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    dayButtonSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    dayText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
    },
    dayTextSelected: {
        color: colors.textLight,
    },
    timeRow: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    timeColumn: {
        flex: 1,
    },
    timeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.cardBackground,
    },
    timeInput: {
        flex: 1,
        fontSize: fontSize.md,
        color: colors.textPrimary,
    },
    timeIcon: {
        fontSize: fontSize.lg,
        marginLeft: spacing.sm,
    },
    footer: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xl,
        paddingBottom: spacing.xxxl,
    },
    saveButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
        ...shadows.fab,
    },
    saveIcon: {
        fontSize: fontSize.lg,
        marginRight: spacing.sm,
    },
    saveButtonText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textLight,
    },
});
