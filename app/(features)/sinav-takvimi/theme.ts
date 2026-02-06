/**
 * Sınav Takvimi Modülü Tema Dosyası
 * Dark navy temalı tasarım - Sınav takvimi UI için özelleştirilmiş
 */

export const colors = {
    // Primary Colors - Dark Navy Theme
    primaryDark: '#0A1628',       // Ana arka plan - koyu lacivert
    primaryNavy: '#0F2744',       // Kart arka planları
    primaryAccent: '#2DD4BF',     // Teal vurgu rengi
    accentBlue: '#3B82F6',        // Mavi vurgu

    // Status Colors
    success: '#22C55E',           // Başarılı durumlar
    error: '#EF4444',             // Hata, çakışma uyarıları
    warning: '#F59E0B',           // Uyarı rengi

    // Background Colors
    backgroundDark: '#0A1628',    // Ana arka plan
    backgroundCard: '#0F2744',    // Kart arka planları
    backgroundLight: '#1A365D',   // Açık kart arka planları
    backgroundInput: '#1E3A5F',   // Input arka planları

    // Text Colors
    textPrimary: '#FFFFFF',       // Ana metin
    textSecondary: '#94A3B8',     // İkincil metin
    textMuted: '#64748B',         // Soluk metin
    textAccent: '#2DD4BF',        // Vurgulu metin

    // Border & Shadow
    border: '#1E3A5F',            // Sınır rengi
    borderLight: '#2D4A6F',       // Açık sınır
    shadow: 'rgba(0, 0, 0, 0.3)', // Gölge rengi

    // Calendar specific
    calendarBg: '#0F2744',        // Takvim arka plan
    examBlock: '#3B82F6',         // Sınav bloğu rengi
    conflictBlock: '#EF4444',     // Çakışma bloğu rengi

    // Tab colors
    tabActive: '#2DD4BF',         // Aktif tab
    tabInactive: '#64748B',       // Pasif tab
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    button: {
        shadowColor: '#2DD4BF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    modal: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
};

// Countdown timer için renk gradyanları
export const countdownColors = {
    days: colors.primaryAccent,
    hours: colors.accentBlue,
    minutes: colors.warning,
    seconds: colors.error,
};
