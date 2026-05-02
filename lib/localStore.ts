import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LocalAbsenceState, LocalCourseOverride, StudentProfile } from './domain';

const STORAGE_PREFIX = 'bandirma:v2';
const FALLBACK_AUTH_KEY = `${STORAGE_PREFIX}:fallback-auth`;
const FALLBACK_ACCOUNTS_KEY = `${STORAGE_PREFIX}:fallback-accounts`;
const MENU_CACHE_KEY = `${STORAGE_PREFIX}:menu-cache:may-2026-v3`;

export interface FallbackAuthRecord {
    email: string;
    password: string;
    profile: StudentProfile;
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? (JSON.parse(value) as T) : fallback;
    } catch {
        return fallback;
    }
}

async function writeJson<T>(key: string, value: T) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
}

export function getOverridesKey(userId: string, termId: string) {
    return `${STORAGE_PREFIX}:overrides:${userId}:${termId}`;
}

export function getAbsenceKey(userId: string, termId: string) {
    return `${STORAGE_PREFIX}:absences:${userId}:${termId}`;
}

export async function loadCourseOverrides(userId: string, termId: string): Promise<LocalCourseOverride> {
    return readJson<LocalCourseOverride>(getOverridesKey(userId, termId), {
        addedOfferingIds: [],
        removedOfferingIds: [],
    });
}

export async function saveCourseOverrides(userId: string, termId: string, value: LocalCourseOverride) {
    await writeJson(getOverridesKey(userId, termId), value);
}

export async function loadAbsenceState(userId: string, termId: string): Promise<LocalAbsenceState> {
    return readJson<LocalAbsenceState>(getAbsenceKey(userId, termId), {});
}

export async function saveAbsenceState(userId: string, termId: string, value: LocalAbsenceState) {
    await writeJson(getAbsenceKey(userId, termId), value);
}

export async function loadMenuCache<T>() {
    return readJson<T | null>(MENU_CACHE_KEY, null);
}

export async function saveMenuCache<T>(value: T) {
    await writeJson(MENU_CACHE_KEY, value);
}

export async function clearMenuCache() {
    await AsyncStorage.removeItem(MENU_CACHE_KEY);
}

export async function loadFallbackAuth() {
    return readJson<FallbackAuthRecord | null>(FALLBACK_AUTH_KEY, null);
}

export async function saveFallbackAuth(record: FallbackAuthRecord | null) {
    if (!record) {
        await AsyncStorage.removeItem(FALLBACK_AUTH_KEY);
        return;
    }

    await writeJson(FALLBACK_AUTH_KEY, record);
}

export async function loadFallbackAccounts() {
    return readJson<FallbackAuthRecord[]>(FALLBACK_ACCOUNTS_KEY, []);
}

export async function saveFallbackAccounts(accounts: FallbackAuthRecord[]) {
    await writeJson(FALLBACK_ACCOUNTS_KEY, accounts);
}
