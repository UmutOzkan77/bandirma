import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createFallbackDataset } from '../lib/fallbackData';
import type { Department } from '../lib/domain';
import { useAuth } from '../contexts/AuthContext';

const CLASS_LEVELS = [1, 2, 3, 4];
const PROTOTYPE_DEPARTMENTS = createFallbackDataset().departments;

function InputField({
    label,
    value,
    onChangeText,
    placeholder,
}: {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
}) {
    return (
        <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#94A3B8"
                autoCapitalize="words"
                style={styles.input}
            />
        </View>
    );
}

export default function AuthOverlay() {
    const {
        isLoggedIn,
        isLoading,
        shouldShowAuth,
        enterPrototypeStudent,
    } = useAuth();

    const [departments, setDepartments] = useState<Department[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [fullName, setFullName] = useState('');
    const [classLevel, setClassLevel] = useState(1);
    const [selectedDepartmentCode, setSelectedDepartmentCode] = useState('YBS');

    useEffect(() => {
        setDepartments(PROTOTYPE_DEPARTMENTS);
        setSelectedDepartmentCode(PROTOTYPE_DEPARTMENTS[0]?.code ?? 'YBS');
    }, []);

    const handleContinue = async () => {
        setSubmitting(true);
        setMessage(null);
        const result = await enterPrototypeStudent({
            fullName,
            departmentCode: selectedDepartmentCode,
            classLevel,
        });
        setSubmitting(false);
        setMessage(result.error ?? null);
    };

    if (!shouldShowAuth && !isLoading) {
        return null;
    }

    return (
        <Modal visible={shouldShowAuth || isLoading} animationType="fade" transparent={false}>
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <KeyboardAvoidingView
                    style={styles.flex}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                        <View style={styles.shell}>
                            <View style={styles.hero}>
                                <Text style={styles.heroEyebrow}>Bandırma Onyedi Eylül Üniversitesi</Text>
                                <Text style={styles.heroTitle}>Öğrenci Bilgileri</Text>
                                <Text style={styles.heroSubtitle}>
                                    Prototip deneyimi için adınızı, bölümünüzü ve sınıfınızı seçin.
                                </Text>
                            </View>

                            <View style={styles.card}>
                                {isLoading && !isLoggedIn ? (
                                    <View style={styles.loadingState}>
                                        <ActivityIndicator size="large" color="#0F172A" />
                                        <Text style={styles.loadingText}>Oturum hazırlanıyor...</Text>
                                    </View>
                                ) : (
                                    <>
                                        <InputField
                                            label="Ad Soyad"
                                            value={fullName}
                                            onChangeText={setFullName}
                                            placeholder="Örn. Ayşe Yılmaz"
                                        />

                                        <View style={styles.fieldGroup}>
                                            <Text style={styles.fieldLabel}>Bölüm</Text>
                                            <View style={styles.optionStack}>
                                                {departments.map((department) => (
                                                    <TouchableOpacity
                                                        key={department.code}
                                                        style={[
                                                            styles.optionButton,
                                                            selectedDepartmentCode === department.code && styles.optionButtonActive,
                                                        ]}
                                                        onPress={() => setSelectedDepartmentCode(department.code)}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.optionTitle,
                                                                selectedDepartmentCode === department.code && styles.optionTitleActive,
                                                            ]}
                                                        >
                                                            {department.departmentName}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.optionSubtitle,
                                                                selectedDepartmentCode === department.code && styles.optionSubtitleActive,
                                                            ]}
                                                        >
                                                            {department.facultyName}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>

                                        <View style={styles.fieldGroup}>
                                            <Text style={styles.fieldLabel}>Sınıf</Text>
                                            <View style={styles.classRow}>
                                                {CLASS_LEVELS.map((level) => (
                                                    <TouchableOpacity
                                                        key={level}
                                                        style={[
                                                            styles.classButton,
                                                            classLevel === level && styles.classButtonActive,
                                                        ]}
                                                        onPress={() => setClassLevel(level)}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.classButtonText,
                                                                classLevel === level && styles.classButtonTextActive,
                                                            ]}
                                                        >
                                                            {level}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                                            onPress={handleContinue}
                                            disabled={submitting}
                                        >
                                            <Text style={styles.submitButtonText}>
                                                {submitting ? 'Hazırlanıyor...' : 'Devam Et'}
                                            </Text>
                                        </TouchableOpacity>

                                        {message && (
                                            <View style={styles.messageBox}>
                                                <Text style={styles.messageText}>{message}</Text>
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#EAF0F7',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 22,
        backgroundColor: '#EAF0F7',
        alignItems: 'center',
    },
    shell: {
        width: '100%',
        maxWidth: 540,
    },
    hero: {
        marginBottom: 20,
    },
    heroEyebrow: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1D4ED8',
        textTransform: 'uppercase',
        letterSpacing: 0,
        marginBottom: 8,
    },
    heroTitle: {
        fontSize: 34,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 15,
        lineHeight: 22,
        color: '#475569',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 18,
        shadowColor: '#0F172A',
        shadowOpacity: 0.12,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
        elevation: 10,
    },
    loadingState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
    },
    loadingText: {
        marginTop: 12,
        color: '#475569',
        fontSize: 14,
    },
    fieldGroup: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#334155',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        fontSize: 15,
    },
    optionStack: {
        gap: 10,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 8,
        padding: 14,
        backgroundColor: '#F8FAFC',
    },
    optionButtonActive: {
        borderColor: '#1D4ED8',
        backgroundColor: '#EFF6FF',
    },
    optionTitle: {
        color: '#0F172A',
        fontSize: 15,
        fontWeight: '800',
    },
    optionTitleActive: {
        color: '#1D4ED8',
    },
    optionSubtitle: {
        marginTop: 4,
        color: '#64748B',
        fontSize: 12,
        lineHeight: 16,
    },
    optionSubtitleActive: {
        color: '#1E40AF',
    },
    classRow: {
        flexDirection: 'row',
        gap: 10,
    },
    classButton: {
        flex: 1,
        minHeight: 46,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
    },
    classButtonActive: {
        backgroundColor: '#0F172A',
        borderColor: '#0F172A',
    },
    classButtonText: {
        color: '#334155',
        fontSize: 16,
        fontWeight: '900',
    },
    classButtonTextActive: {
        color: '#FFFFFF',
    },
    submitButton: {
        marginTop: 4,
        backgroundColor: '#0F172A',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
    },
    messageBox: {
        marginTop: 14,
        padding: 14,
        borderRadius: 8,
        backgroundColor: '#FEF2F2',
    },
    messageText: {
        color: '#991B1B',
        fontSize: 13,
        lineHeight: 18,
    },
});
