/**
 * Ders Programı Modülü Tema Dosyası
 * Tasarım spesifikasyonlarına göre renk paleti ve stil sabitleri
 */

export const colors = {
    // Primary Colors
    primary: '#004A99',           // Koyu mavi - ana renk
    accent: '#00AEEF',            // Açık mavi - vurgu rengi

    // Background Colors
    background: '#FFFFFF',        // Beyaz arka plan
    cardBackground: '#FFFFFF',    // Kart arka planı

    // Text Colors
    textPrimary: '#1E293B',       // Ana metin rengi
    textSecondary: '#64748B',     // İkincil metin (gri ton)
    textLight: '#FFFFFF',         // Açık metin (koyu arka plan üzerinde)
    textMuted: '#94A3B8',         // Soluk metin

    // Status Colors
    conflict: '#F87171',          // Çakışma uyarısı (kırmızımsı)
    conflictBackground: '#FEF2F2',
    success: '#22C55E',

    // Additional Colors
    lunchBreak: '#FB923C',        // Öğle arası turuncu
    lunchBreakBackground: '#FFF7ED',
    border: '#E2E8F0',
    shadow: 'rgba(0, 0, 0, 0.08)',
    timelineGray: '#CBD5E1',
    roomIcon: '#2DD4BF',          // Teal renk - konum ikonu
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
};

export const fontSize = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    title: 28,
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    fab: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
};

// Gün kısaltmaları
export const dayAbbreviations: { [key: string]: string } = {
    'Pazartesi': 'PZT',
    'Salı': 'SAL',
    'Çarşamba': 'ÇAR',
    'Perşembe': 'PER',
    'Cuma': 'CUM',
    'Cumartesi': 'CMT',
    'Pazar': 'PAZ',
};
