import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { Feather } from '@expo/vector-icons';
import { useAcademic } from '../../../../contexts/AcademicContext';

interface AddExamModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function AddExamModal({ visible, onClose }: AddExamModalProps) {
    const { addExam } = useAcademic();
    
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [instructor, setInstructor] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:30');
    const [room, setRoom] = useState('');

    const handleSave = () => {
        if (!courseName || !date || !startTime) {
            alert('Lütfen ders adı, tarih ve saat alanlarını doldurun.');
            return;
        }

        addExam({
            courseName,
            courseCode: courseCode || 'KOD YOK',
            instructor,
            date,
            startTime,
            endTime,
            room: room || 'Bilinmiyor',
        });
        
        // Reset form and close
        setCourseName('');
        setCourseCode('');
        setInstructor('');
        setRoom('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    {/* Handle Bar */}
                    <View style={styles.handleBar} />

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Yeni Sınav / Quiz Ekle</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Feather name="x" size={22} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
                        
                        {/* Ders Adı */}
                        <Text style={styles.label}>Ders Adı</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Veri Yapıları"
                                value={courseName}
                                onChangeText={setCourseName}
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>

                        {/* Ders Kodu */}
                        <Text style={styles.label}>Ders Kodu</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="CENG201"
                                value={courseCode}
                                onChangeText={setCourseCode}
                                placeholderTextColor={colors.textMuted}
                                autoCapitalize="characters"
                            />
                        </View>

                        {/* Eğitmen */}
                        <Text style={styles.label}>Eğitmen</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Dr. Öğretim Üyesi Elif Demir"
                                value={instructor}
                                onChangeText={setInstructor}
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>

                        {/* Tarih */}
                        <Text style={styles.label}>Tarih</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-AA-GG"
                                value={date}
                                onChangeText={setDate}
                                placeholderTextColor={colors.textMuted}
                            />
                            <Feather name="calendar" size={18} color={colors.textMuted} style={styles.inputIcon} />
                        </View>

                        {/* Derslik */}
                        <Text style={styles.label}>Derslik</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="A-101"
                                value={room}
                                onChangeText={setRoom}
                                placeholderTextColor={colors.textMuted}
                            />
                            <Feather name="map-pin" size={18} color={colors.textMuted} style={styles.inputIcon} />
                        </View>

                        {/* Saat Row */}
                        <View style={styles.timeRow}>
                            <View style={styles.timeCol}>
                                <Text style={styles.label}>Başlangıç Saati</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="09:00"
                                        value={startTime}
                                        onChangeText={setStartTime}
                                        placeholderTextColor={colors.textMuted}
                                    />
                                    <Feather name="clock" size={18} color={colors.textMuted} style={styles.inputIcon} />
                                </View>
                            </View>
                            <View style={styles.timeSpacer} />
                            <View style={styles.timeCol}>
                                <Text style={styles.label}>Bitiş Saati</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="10:30"
                                        value={endTime}
                                        onChangeText={setEndTime}
                                        placeholderTextColor={colors.textMuted}
                                    />
                                    <Feather name="clock" size={18} color={colors.textMuted} style={styles.inputIcon} />
                                </View>
                            </View>
                        </View>

                    </ScrollView>

                    {/* Footer Buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>İptal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveText}>Kaydet</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 44, 89, 0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: borderRadius.xxl,
        borderTopRightRadius: borderRadius.xxl,
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxxl,
        maxHeight: '92%',
    },
    handleBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#CBD5E1',
        alignSelf: 'center',
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xxl,
        paddingTop: spacing.sm,
    },
    title: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: '#0F2C59',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        paddingBottom: spacing.lg,
    },
    label: {
        fontSize: fontSize.sm,
        color: '#475569',
        fontWeight: fontWeight.semibold,
        marginBottom: spacing.sm,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        fontSize: fontSize.md,
        color: colors.textPrimary,
    },
    inputIcon: {
        paddingRight: spacing.xl,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    timeCol: {
        flex: 1,
    },
    timeSpacer: {
        width: spacing.lg,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        gap: spacing.lg,
    },
    cancelButton: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xxxl,
        borderRadius: borderRadius.full,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    cancelText: {
        fontSize: fontSize.md,
        color: '#475569',
        fontWeight: fontWeight.bold,
    },
    saveButton: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xxxl * 2,
        borderRadius: borderRadius.full,
        backgroundColor: '#0F2C59',
        ...shadows.button,
    },
    saveText: {
        fontSize: fontSize.md,
        color: '#FFFFFF',
        fontWeight: fontWeight.bold,
    },
});
