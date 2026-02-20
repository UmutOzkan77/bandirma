/**
 * Sınav Takvimi Modülü Tema Dosyası
 * Light Theme (Aydınlık Tema) - Yemekhane modülü ile uyumlu
 */

export const colors = {
    // Primary Colors
    primary: '#004A99',          // Ana renk (Standart Mavi)
    secondary: '#2DD4BF',        // İkincil renk (Teal/Yeşil - Ayrıntılar için)
    accent: '#004A99',           // Vurgu rengi (Standart Mavi)

    // Status Colors
    success: '#22C55E',          // Başarılı
    error: '#EF4444',            // Hata
    warning: '#F59E0B',          // Uyarı
    info: '#3B82F6',             // Bilgi

    // Background Colors
    backgroundMain: '#F8FAFC',   // Ana arka plan (Açık Gri)
    backgroundCard: '#FFFFFF',   // Kart arka plan (Beyaz)
    backgroundInput: '#F1F5F9',  // Input alanları
    backgroundModal: '#FFFFFF',  // Modal arka plan
    backgroundSubtle: '#F1F5F9', // Hafif arka plan vurguları

    // Text Colors
    textPrimary: '#1E293B',      // Ana metin (Koyu Slate)
    textSecondary: '#64748B',    // İkincil metin (Slate)
    textMuted: '#94A3B8',        // Silik metin
    textInverse: '#FFFFFF',      // Koyu zemin üstü açık metin
    textAccent: '#004A99',       // Vurgulu metin (Standart Mavi)
    textHighlight: '#2DD4BF',    // Yeşil detay metni

    // Borders
    border: '#E2E8F0',           // Standart kenarlık
    borderLight: '#F1F5F9',      // Hafif kenarlık

    // Feature Specific
    calendarBg: '#FFFFFF',       // Takvim zemin
    examBlock: '#E0F2FE',        // Sınav kutusu zemin (Açık Mavi)
    examBlockText: '#0369A1',    // Sınav kutusu metin (Koyu Mavi)
    conflictBlock: '#FEE2E2',    // Çakışma kutusu zemin (Açık Kırmızı)
    conflictBlockText: '#B91C1C',// Çakışma kutusu metin (Koyu Kırmızı)

    // Tab Colors
    tabActive: '#004A99', // Standart Mavi
    tabInactive: '#64748B',

    // Shadows
    shadow: 'rgba(0, 0, 0, 0.05)',
};

export const spacing = {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    xxxl: 24,
};

export const borderRadius = {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 9999,
};

export const fontSize = {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    title: 32,
    hero: 40,
};

export const fontWeight = {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
};

export const shadows = {
    card: {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    button: {
        shadowColor: '#004A99', // Mavi Shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    modal: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
    },
};

// Countdown timer için renk gradyanları
export const countdownColors = {
    days: colors.secondary,
    hours: colors.accent,
    minutes: colors.warning,
    seconds: colors.error,
};

export default function Theme() {
    return null;
}
