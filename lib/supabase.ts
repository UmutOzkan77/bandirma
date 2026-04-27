import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const isDemoSignupEnabled = __DEV__ || process.env.EXPO_PUBLIC_ENABLE_DEMO_SIGNUP === 'true';

export const supabase: SupabaseClient<any> | null = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            storage: AsyncStorage as any,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    })
    : null;

export default supabase;
