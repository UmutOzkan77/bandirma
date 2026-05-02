import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
    fetchDepartments,
    fetchStudentProfile,
} from '../lib/academicService';
import type { DemoSignupInput, StudentProfile } from '../lib/domain';
import { createFallbackDataset } from '../lib/fallbackData';
import {
    type FallbackAuthRecord,
    loadFallbackAccounts,
    loadFallbackAuth,
    saveFallbackAccounts,
    saveFallbackAuth,
} from '../lib/localStore';
import { isDemoSignupEnabled, isSupabaseConfigured, supabase } from '../lib/supabase';

interface AuthResult {
    success: boolean;
    error?: string;
    message?: string;
}

interface PrototypeStudentInput {
    fullName: string;
    departmentCode: string;
    classLevel: number;
}

interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    userEmail: string | null;
    studentId: string | null;
    profile: StudentProfile | null;
    session: Session | null;
    isSupabaseEnabled: boolean;
    isDemoSignupEnabled: boolean;
    mustChangePassword: boolean;
    shouldShowAuth: boolean;
    login: (email: string, password: string) => Promise<AuthResult>;
    registerDemo: (input: DemoSignupInput) => Promise<AuthResult>;
    enterPrototypeStudent: (input: PrototypeStudentInput) => Promise<AuthResult>;
    enterFallbackDemo: () => Promise<AuthResult>;
    changePassword: (newPassword: string) => Promise<AuthResult>;
    refreshProfile: () => Promise<void>;
    logout: () => Promise<void>;
}

const fallbackDataset = createFallbackDataset();
const FALLBACK_SAMPLE_ACCOUNT: FallbackAuthRecord = {
    email: fallbackDataset.studentProfile.schoolEmail.toLowerCase(),
    password: '12345678901',
    profile: fallbackDataset.studentProfile,
};

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    isLoading: true,
    userEmail: null,
    studentId: null,
    profile: null,
    session: null,
    isSupabaseEnabled: isSupabaseConfigured,
    isDemoSignupEnabled,
    mustChangePassword: false,
    shouldShowAuth: false,
    login: async () => ({ success: false, error: 'Auth context hazır değil.' }),
    registerDemo: async () => ({ success: false, error: 'Auth context hazır değil.' }),
    enterPrototypeStudent: async () => ({ success: false, error: 'Auth context hazır değil.' }),
    enterFallbackDemo: async () => ({ success: false, error: 'Auth context hazır değil.' }),
    changePassword: async () => ({ success: false, error: 'Auth context hazır değil.' }),
    refreshProfile: async () => {},
    logout: async () => {},
});

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadMergedFallbackAccounts() {
    const storedAccounts = await loadFallbackAccounts();
    const hasSample = storedAccounts.some((account) => account.email === FALLBACK_SAMPLE_ACCOUNT.email);
    return hasSample ? storedAccounts : [FALLBACK_SAMPLE_ACCOUNT, ...storedAccounts];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<StudentProfile | null>(null);

    const refreshProfile = async () => {
        if (!isSupabaseConfigured || !supabase) {
            const fallbackAuth = await loadFallbackAuth();
            setProfile(fallbackAuth?.profile ?? null);
            return;
        }

        const userId = session?.user.id;
        if (!userId) {
            setProfile(null);
            return;
        }

        const nextProfile = await fetchStudentProfile(userId);
        setProfile(nextProfile);
    };

    useEffect(() => {
        let mounted = true;

        async function bootstrap() {
            if (!isSupabaseConfigured || !supabase) {
                const fallbackAuth = await loadFallbackAuth();
                if (mounted) {
                    setProfile(fallbackAuth?.profile ?? null);
                    setSession(null);
                    setIsLoading(false);
                }
                return;
            }

            const { data } = await supabase.auth.getSession();
            if (!mounted) {
                return;
            }

            setSession(data.session ?? null);
            if (data.session?.user.id) {
                const nextProfile = await fetchStudentProfile(data.session.user.id);
                if (mounted) {
                    setProfile(nextProfile);
                }
            } else {
                setProfile(null);
            }

            setIsLoading(false);
        }

        void bootstrap();

        if (!isSupabaseConfigured || !supabase) {
            return () => {
                mounted = false;
            };
        }

        const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
            if (!nextSession?.user.id) {
                setProfile(null);
                setIsLoading(false);
                return;
            }

            void (async () => {
                const nextProfile = await fetchStudentProfile(nextSession.user.id);
                if (mounted) {
                    setProfile(nextProfile);
                    setIsLoading(false);
                }
            })();
        });

        return () => {
            mounted = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    const waitForProfile = async (userId: string) => {
        for (let attempt = 0; attempt < 6; attempt += 1) {
            const nextProfile = await fetchStudentProfile(userId);
            if (nextProfile) {
                setProfile(nextProfile);
                return nextProfile;
            }
            await sleep(400);
        }

        return null;
    };

    const login = async (email: string, password: string): Promise<AuthResult> => {
        const normalizedEmail = normalizeEmail(email);
        if (!normalizedEmail || !password.trim()) {
            return { success: false, error: 'E-posta ve şifre zorunludur.' };
        }

        if (!isSupabaseConfigured || !supabase) {
            const accounts = await loadMergedFallbackAccounts();
            const account = accounts.find((candidate) =>
                candidate.email === normalizedEmail && candidate.password === password
            );

            if (!account) {
                return {
                    success: false,
                    error: 'Geçersiz giriş. Fallback demo için ogrenci@bandirma.edu.tr / 12345678901 kullanabilirsiniz.',
                };
            }

            await saveFallbackAuth(account);
            setProfile(account.profile);
            setSession(null);
            return { success: true };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        setSession(data.session ?? null);
        if (data.user?.id) {
            const nextProfile = await waitForProfile(data.user.id);
            if (!nextProfile) {
                return {
                    success: false,
                    error: 'Öğrenci profili bulunamadı. Students tablosu ve trigger kurulumu kontrol edilmeli.',
                };
            }
        }

        return { success: true };
    };

    const registerDemo = async (input: DemoSignupInput): Promise<AuthResult> => {
        const schoolEmail = normalizeEmail(input.schoolEmail);
        const password = input.password.trim();
        const tcKimlik = input.tcKimlik.trim();

        if (!isDemoSignupEnabled) {
            return { success: false, error: 'Demo hesap oluşturma bu ortamda kapalı.' };
        }

        if (!schoolEmail || !password || !input.fullName.trim() || !tcKimlik || !input.departmentCode.trim()) {
            return { success: false, error: 'Tüm demo kayıt alanlarını doldurun.' };
        }

        if (!isSupabaseConfigured || !supabase) {
            const departments = await fetchDepartments();
            const department = departments.find((item) => item.code === input.departmentCode);
            const accounts = await loadMergedFallbackAccounts();

            if (accounts.some((account) => account.email === schoolEmail)) {
                return { success: false, error: 'Bu e-posta ile bir demo hesabı zaten var.' };
            }

            const profileRecord: StudentProfile = {
                id: `local-${Date.now()}`,
                schoolEmail,
                fullName: input.fullName.trim(),
                phone: input.phone.trim() || null,
                facultyName: department?.facultyName ?? 'Demo Fakültesi',
                departmentId: department?.id ?? null,
                departmentCode: department?.code ?? input.departmentCode,
                departmentName: department?.departmentName ?? null,
                classLevel: input.classLevel,
                studentNumber: null,
                isActive: true,
                source: 'demo_signup',
                mustChangePassword: false,
                passwordChangedAt: new Date().toISOString(),
                tcLast4: tcKimlik.slice(-4),
            };

            const nextAccount: FallbackAuthRecord = {
                email: schoolEmail,
                password,
                profile: profileRecord,
            };

            const nextAccounts = [...accounts.filter((account) => account.email !== FALLBACK_SAMPLE_ACCOUNT.email), FALLBACK_SAMPLE_ACCOUNT, nextAccount];
            await saveFallbackAccounts(nextAccounts);
            await saveFallbackAuth(nextAccount);
            setProfile(profileRecord);
            setSession(null);
            return { success: true, message: 'Fallback demo hesabı oluşturuldu.' };
        }

        const departments = await fetchDepartments();
        const department = departments.find((item) => item.code === input.departmentCode);

        const { data, error } = await supabase.auth.signUp({
            email: schoolEmail,
            password,
            options: {
                data: {
                    full_name: input.fullName.trim(),
                    phone: input.phone.trim(),
                    department_code: input.departmentCode,
                    faculty_name: department?.facultyName ?? '',
                    class_level: String(input.classLevel),
                    source: 'demo_signup',
                    tc_last4: tcKimlik.slice(-4),
                    must_change_password: 'false',
                },
            },
        });

        if (error) {
            return { success: false, error: error.message };
        }

        if (!data.user) {
            return { success: false, error: 'Kullanıcı oluşturulamadı.' };
        }

        if (!data.session) {
            return {
                success: true,
                message: 'Demo hesap oluşturuldu. E-posta doğrulaması açıksa önce doğrulama yapmanız gerekir.',
            };
        }

        setSession(data.session);
        const nextProfile = await waitForProfile(data.user.id);
        if (!nextProfile) {
            return {
                success: false,
                error: 'Kullanıcı auth tarafında oluştu ancak students profili bulunamadı. Trigger kurulumu kontrol edilmeli.',
            };
        }

        return { success: true, message: 'Demo hesap hazır.' };
    };

    const enterFallbackDemo = async (): Promise<AuthResult> => {
        if (isSupabaseConfigured || supabase) {
            return { success: false, error: 'Hızlı demo geçişi yalnızca fallback ortamında kullanılabilir.' };
        }

        const demoAccount: FallbackAuthRecord = {
            ...FALLBACK_SAMPLE_ACCOUNT,
            profile: {
                ...FALLBACK_SAMPLE_ACCOUNT.profile,
                mustChangePassword: false,
                passwordChangedAt: new Date().toISOString(),
            },
        };

        const accounts = await loadMergedFallbackAccounts();
        const nextAccounts = [
            demoAccount,
            ...accounts.filter((account) => account.email !== demoAccount.email),
        ];

        await saveFallbackAccounts(nextAccounts);
        await saveFallbackAuth(demoAccount);
        setProfile(demoAccount.profile);
        setSession(null);

        return { success: true };
    };

    const enterPrototypeStudent = async (input: PrototypeStudentInput): Promise<AuthResult> => {
        const fullName = input.fullName.trim();
        if (!fullName) {
            return { success: false, error: 'Ad soyad alanı zorunludur.' };
        }

        const departments = fallbackDataset.departments;
        const department = departments.find((item) => item.code === input.departmentCode) ?? departments[0];
        if (!department) {
            return { success: false, error: 'Bölüm verisi bulunamadı.' };
        }

        const safeClassLevel = Math.min(Math.max(Number(input.classLevel) || 1, 1), 4);
        const slugName = fullName
            .toLocaleLowerCase('tr-TR')
            .replace(/[^a-z0-9ığüşöç\s-]/gi, '')
            .trim()
            .replace(/\s+/g, '.');
        const profileRecord: StudentProfile = {
            id: `prototype-${department.code.toLowerCase()}-${safeClassLevel}-${Date.now()}`,
            schoolEmail: `${slugName || 'ogrenci'}@ogrenci.bandirma.edu.tr`,
            fullName,
            phone: null,
            facultyName: department.facultyName,
            departmentId: department.id,
            departmentCode: department.code,
            departmentName: department.departmentName,
            classLevel: safeClassLevel,
            studentNumber: `PROTO-${department.code}-${safeClassLevel}`,
            isActive: true,
            source: 'demo_signup',
            mustChangePassword: false,
            passwordChangedAt: new Date().toISOString(),
            tcLast4: null,
        };

        const account: FallbackAuthRecord = {
            email: profileRecord.schoolEmail.toLowerCase(),
            password: 'prototype',
            profile: profileRecord,
        };

        const accounts = await loadMergedFallbackAccounts();
        const nextAccounts = [
            account,
            ...accounts.filter((candidate) => candidate.email !== account.email),
        ];

        await saveFallbackAccounts(nextAccounts);
        await saveFallbackAuth(account);
        setProfile(profileRecord);
        setSession(null);

        return { success: true };
    };

    const changePassword = async (newPassword: string): Promise<AuthResult> => {
        const password = newPassword.trim();
        if (password.length < 6) {
            return { success: false, error: 'Yeni şifre en az 6 karakter olmalı.' };
        }

        if (!profile) {
            return { success: false, error: 'Profil bulunamadı.' };
        }

        if (!isSupabaseConfigured || !supabase) {
            const accounts = await loadMergedFallbackAccounts();
            const nextAccounts = accounts.map((account) => {
                if (account.email !== profile.schoolEmail.toLowerCase()) {
                    return account;
                }

                return {
                    ...account,
                    password,
                    profile: {
                        ...account.profile,
                        mustChangePassword: false,
                        passwordChangedAt: new Date().toISOString(),
                    },
                };
            });

            await saveFallbackAccounts(nextAccounts);
            const updated = nextAccounts.find((account) => account.email === profile.schoolEmail.toLowerCase()) ?? null;
            if (updated) {
                await saveFallbackAuth(updated);
                setProfile(updated.profile);
            }

            return { success: true };
        }

        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            return { success: false, error: error.message };
        }

        await supabase
            .from('students')
            .update({
                must_change_password: false,
                password_changed_at: new Date().toISOString(),
            })
            .eq('id', profile.id);

        await refreshProfile();
        return { success: true };
    };

    const logout = async () => {
        if (!isSupabaseConfigured || !supabase) {
            await saveFallbackAuth(null);
            setProfile(null);
            setSession(null);
            return;
        }

        await supabase.auth.signOut();
        setProfile(null);
        setSession(null);
    };

    const isLoggedIn = Boolean(profile);
    const shouldShowAuth = !isLoading && (!isLoggedIn || Boolean(profile?.mustChangePassword));

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                isLoading,
                userEmail: profile?.schoolEmail ?? session?.user.email ?? null,
                studentId: profile?.id ?? session?.user.id ?? null,
                profile,
                session,
                isSupabaseEnabled: isSupabaseConfigured,
                isDemoSignupEnabled,
                mustChangePassword: Boolean(profile?.mustChangePassword),
                shouldShowAuth,
                login,
                registerDemo,
                enterPrototypeStudent,
                enterFallbackDemo,
                changePassword,
                refreshProfile,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
