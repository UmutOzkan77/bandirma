/**
 * Yemekhane Modülü Tema Dosyası
 * Stitch UI tasarımlarından çıkarılan renk paleti ve stil sabitleri
 */

export const colors = {
    // Primary Colors
    primaryDark: '#0B2E6D',      // Header, navbar arka planı
    primaryAccent: '#0B5ED7',    // Seçili elemanlar, vurgu rengi

    // Status Colors
    success: '#22C55E',          // Beğeni, olumlu durumlar
    error: '#EF4444',            // Beğenmeme, olumsuz durumlar
    warning: '#F59E0B',          // Orta yoğunluk, uyarı

    // Background Colors
    backgroundLight: '#F4F6FB',  // Ana arka plan
    backgroundDark: '#0B1F3A',   // Dark mode arka plan
    cardWhite: '#FFFFFF',        // Kart arka planları

    // Text Colors
    textDark: '#0B1F3A',         // Başlıklar
    textSecondary: '#6B7280',    // Alt metinler
    textLight: '#FFFFFF',        // Açık metin (koyu arka plan üzerinde)

    // Additional Colors
    border: '#E5E9F2',           // Kart sınırları
    shadow: 'rgba(15, 23, 42, 0.08)', // Gölge rengi
    overlay: 'rgba(0, 0, 0, 0.5)', // Overlay

    // Category Colors (for meal icons)
    soup: '#F97316',             // Çorba - turuncu
    mainDish: '#EF4444',         // Ana yemek - kırmızı
    sideDish: '#EAB308',         // Yardımcı yemek - sarı
    dessert: '#A855F7',          // Tatlı - mor
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
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    button: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
};

// Yoğunluk durumu renkleri
export const densityColors = {
    low: colors.success,      // Az Yoğun - Yeşil
    medium: colors.warning,   // Orta - Sarı
    high: colors.error,       // Çok Yoğun - Kırmızı
};

// Memnuniyet durumu renkleri (takvim için)
export const satisfactionColors = {
    positive: colors.success,   // Beğenildi
    neutral: '#94A3B8',         // Eşit
    negative: colors.error,     // Beğenilmedi
};

export default function Theme() {
    return null;
}
