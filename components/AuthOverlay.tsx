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
import { fetchDepartments } from '../lib/academicService';
import type { Department } from '../lib/domain';
import { useAuth } from '../contexts/AuthContext';

type ScreenMode = 'login' | 'register' | 'changePassword';

function InputField({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
}: {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
}) {
    return (
        <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#94A3B8"
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
                keyboardType={keyboardType}
                style={styles.input}
            />
        </View>
    );
}

export default function AuthOverlay() {
    const {
        isLoggedIn,
        isLoading,
        mustChangePassword,
        shouldShowAuth,
        isDemoSignupEnabled,
        isSupabaseEnabled,
        login,
        registerDemo,
        enterFallbackDemo,
        changePassword,
    } = useAuth();

    const [mode, setMode] = useState<ScreenMode>('login');
    const [departments, setDepartments] = useState<Department[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [tcKimlik, setTcKimlik] = useState('');
    const [phone, setPhone] = useState('');
    const [classLevel, setClassLevel] = useState('1');
    const [selectedDepartmentCode, setSelectedDepartmentCode] = useState('CENG');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        void (async () => {
            const nextDepartments = await fetchDepartments();
            setDepartments(nextDepartments);
            if (nextDepartments.length > 0 && !selectedDepartmentCode) {
                setSelectedDepartmentCode(nextDepartments[0].code);
            }
        })();
    }, []);

    useEffect(() => {
        if (mustChangePassword) {
            setMode('changePassword');
            setMessage('İlk girişte şifrenizi değiştirmeniz gerekiyor.');
            return;
        }

        if (!isLoggedIn) {
            setMode((current) => (current === 'register' ? current : 'login'));
        }
    }, [isLoggedIn, mustChangePassword]);

    const clearFormMessages = () => setMessage(null);

    const handleLogin = async () => {
        setSubmitting(true);
        clearFormMessages();
        const result = await login(email, password);
        setSubmitting(false);
        setMessage(result.error ?? result.message ?? null);
        if (result.success) {
            setPassword('');
        }
    };

    const handleRegister = async () => {
        setSubmitting(true);
        clearFormMessages();
        const result = await registerDemo({
            schoolEmail: email,
            fullName,
            tcKimlik,
            phone,
            password,
            departmentCode: selectedDepartmentCode,
            classLevel: Number(classLevel) || 1,
        });
        setSubmitting(false);
        setMessage(result.error ?? result.message ?? null);
        if (result.success && !mustChangePassword && !shouldShowAuth) {
            setPassword('');
        } else if (result.success) {
            setMode('login');
        }
    };

    const handleChangePassword = async () => {
        setSubmitting(true);
        clearFormMessages();
        const result = await changePassword(newPassword);
        setSubmitting(false);
        setMessage(result.error ?? result.message ?? 'Şifre güncellendi.');
        if (result.success) {
            setNewPassword('');
        }
    };

    const handleFallbackDemo = async () => {
        setSubmitting(true);
        clearFormMessages();
        const result = await enterFallbackDemo();
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
                            <Text style={styles.heroEyebrow}>Bandırma Supabase Demo</Text>
                            <Text style={styles.heroTitle}>
                                {mustChangePassword ? 'Şifrenizi Yenileyin' : 'Öğrenci Girişi'}
                            </Text>
                            <Text style={styles.heroSubtitle}>
                                {mustChangePassword
                                    ? 'TC ile yapılan ilk giriş sonrasında yeni bir şifre belirlenir.'
                                    : 'İthal edilen öğrenciler okul e-postası ve geçici şifre olarak TC ile giriş yapar.'}
                            </Text>
                            {!isSupabaseEnabled && (
                                <Text style={styles.environmentBadge}>
                                    Supabase env yok. Fallback demo için ogrenci@bandirma.edu.tr / 12345678901 kullanabilirsiniz.
                                </Text>
                            )}
                        </View>

                        <View style={styles.card}>
                            {isLoading ? (
                                <View style={styles.loadingState}>
                                    <ActivityIndicator size="large" color="#0F172A" />
                                    <Text style={styles.loadingText}>Oturum kontrol ediliyor...</Text>
                                </View>
                            ) : (
                                <>
                                    {!mustChangePassword && (
                                        <View style={styles.modeRow}>
                                            <TouchableOpacity
                                                style={[styles.modeButton, mode === 'login' && styles.modeButtonActive]}
                                                onPress={() => setMode('login')}
                                            >
                                                <Text style={[styles.modeButtonText, mode === 'login' && styles.modeButtonTextActive]}>Giriş</Text>
                                            </TouchableOpacity>
                                            {isDemoSignupEnabled && (
                                                <TouchableOpacity
                                                    style={[styles.modeButton, mode === 'register' && styles.modeButtonActive]}
                                                    onPress={() => setMode('register')}
                                                >
                                                    <Text style={[styles.modeButtonText, mode === 'register' && styles.modeButtonTextActive]}>Hesap Oluştur</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}

                                    {!isSupabaseEnabled && !mustChangePassword && (
                                        <TouchableOpacity
                                            style={[styles.demoButton, submitting && styles.submitButtonDisabled]}
                                            onPress={handleFallbackDemo}
                                            disabled={submitting}
                                        >
                                            <Text style={styles.demoButtonText}>Giriş yapmadan ürünü test et</Text>
                                        </TouchableOpacity>
                                    )}

                                    {(mode === 'login' || mode === 'register') && (
                                        <>
                                            <InputField
                                                label="Okul E-postası"
                                                value={email}
                                                onChangeText={setEmail}
                                                placeholder="ogrenci@bandirma.edu.tr"
                                                keyboardType="email-address"
                                            />

                                            {mode === 'register' && (
                                                <>
                                                    <InputField
                                                        label="Ad Soyad"
                                                        value={fullName}
                                                        onChangeText={setFullName}
                                                        placeholder="Ad Soyad"
                                                    />
                                                    <InputField
                                                        label="TC Kimlik"
                                                        value={tcKimlik}
                                                        onChangeText={setTcKimlik}
                                                        placeholder="11 haneli TC"
                                                        keyboardType="number-pad"
                                                    />
                                                    <InputField
                                                        label="Telefon"
                                                        value={phone}
                                                        onChangeText={setPhone}
                                                        placeholder="0555..."
                                                        keyboardType="phone-pad"
                                                    />

                                                    <View style={styles.fieldGroup}>
                                                        <Text style={styles.fieldLabel}>Bölüm</Text>
                                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.departmentList}>
                                                            {departments.map((department) => (
                                                                <TouchableOpacity
                                                                    key={department.code}
                                                                    style={[
                                                                        styles.departmentChip,
                                                                        selectedDepartmentCode === department.code && styles.departmentChipActive,
                                                                    ]}
                                                                    onPress={() => setSelectedDepartmentCode(department.code)}
                                                                >
                                                                    <Text
                                                                        style={[
                                                                            styles.departmentChipText,
                                                                            selectedDepartmentCode === department.code && styles.departmentChipTextActive,
                                                                        ]}
                                                                    >
                                                                        {department.departmentName}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                        </ScrollView>
                                                    </View>

                                                    <InputField
                                                        label="Sınıf"
                                                        value={classLevel}
                                                        onChangeText={setClassLevel}
                                                        placeholder="1, 2, 3..."
                                                        keyboardType="number-pad"
                                                    />
                                                </>
                                            )}

                                            <InputField
                                                label={mode === 'register' ? 'Şifre' : 'Şifre / Geçici TC'}
                                                value={password}
                                                onChangeText={setPassword}
                                                placeholder={mode === 'register' ? 'Yeni şifre' : 'TC kimlik veya şifre'}
                                                secureTextEntry
                                            />

                                            <TouchableOpacity
                                                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                                                onPress={mode === 'register' ? handleRegister : handleLogin}
                                                disabled={submitting}
                                            >
                                                <Text style={styles.submitButtonText}>
                                                    {submitting
                                                        ? 'İşleniyor...'
                                                        : mode === 'register'
                                                            ? 'Demo Hesap Oluştur'
                                                            : 'Giriş Yap'}
                                                </Text>
                                            </TouchableOpacity>
                                        </>
                                    )}

                                    {mode === 'changePassword' && (
                                        <>
                                            <InputField
                                                label="Yeni Şifre"
                                                value={newPassword}
                                                onChangeText={setNewPassword}
                                                placeholder="En az 6 karakter"
                                                secureTextEntry
                                            />
                                            <TouchableOpacity
                                                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                                                onPress={handleChangePassword}
                                                disabled={submitting}
                                            >
                                                <Text style={styles.submitButtonText}>
                                                    {submitting ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                                                </Text>
                                            </TouchableOpacity>
                                        </>
                                    )}

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
        backgroundColor: '#E2E8F0',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
    },
    shell: {
        width: '100%',
        maxWidth: 520,
    },
    hero: {
        marginBottom: 20,
    },
    heroEyebrow: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 15,
        lineHeight: 22,
        color: '#475569',
    },
    environmentBadge: {
        marginTop: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: '#FEF3C7',
        color: '#92400E',
        fontSize: 13,
        lineHeight: 18,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 20,
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
    modeRow: {
        flexDirection: 'row',
        marginBottom: 18,
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        padding: 4,
    },
    modeButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    modeButtonActive: {
        backgroundColor: '#0F172A',
    },
    modeButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
    },
    modeButtonTextActive: {
        color: '#FFFFFF',
    },
    fieldGroup: {
        marginBottom: 14,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        fontSize: 15,
    },
    departmentList: {
        gap: 10,
        paddingVertical: 4,
    },
    departmentChip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: '#E2E8F0',
    },
    departmentChipActive: {
        backgroundColor: '#0F172A',
    },
    departmentChipText: {
        color: '#334155',
        fontSize: 13,
        fontWeight: '600',
    },
    departmentChipTextActive: {
        color: '#FFFFFF',
    },
    submitButton: {
        marginTop: 8,
        backgroundColor: '#0F172A',
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
    },
    demoButton: {
        marginBottom: 18,
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
    },
    demoButtonText: {
        color: '#1D4ED8',
        fontSize: 14,
        fontWeight: '800',
    },
    messageBox: {
        marginTop: 16,
        padding: 14,
        borderRadius: 16,
        backgroundColor: '#EFF6FF',
    },
    messageText: {
        color: '#1E3A8A',
        fontSize: 13,
        lineHeight: 19,
    },
});
