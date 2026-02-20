/**
 * Etkinlikler Modülü Tema Dosyası
 */

export const colors = {
    backgroundLight: '#FFFFFF',
    backgroundDark: '#0F172A',
    cardLight: '#F8F7F7',
    cardDark: '#1E293B',
    accent: '#26ABE2',
    primary: '#26ABE2',
    textPrimary: '#0A0A0A',
    textSecondary: '#B0B0B0',
    textWhite: '#FFFFFF',
    notificationBlue: '#26ABE2',
    notificationOrange: '#F59E0B',
    notificationRed: '#EF4444',
    notificationGreen: '#22C55E',
    notificationPurple: '#8B5CF6',
    dotTeal: '#14B8A6',
    dotOrange: '#F97316',
    dotPink: '#EC4899',
    dotPurple: '#8B5CF6',
    dotGreen: '#22C55E',
    border: '#E5E7EB',
    unreadDot: '#26ABE2',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };
export const borderRadius = { sm: 8, md: 12, lg: 16, xl: 20, full: 9999 };
export const fontSize = { xs: 10, sm: 12, md: 14, lg: 16, xl: 18, xxl: 20, title: 18 };
export const fontWeight = { normal: '400' as const, medium: '500' as const, semibold: '600' as const, bold: '700' as const };
export const shadows = { card: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 } };
export const notificationTypeColors = { timeChange: colors.notificationBlue, dateChange: colors.notificationOrange, cancelled: colors.notificationRed, newEvent: colors.notificationGreen, locationChange: colors.notificationPurple, reminder: colors.accent };
export const eventDotColors = [colors.dotTeal, colors.dotOrange, colors.dotPink, colors.dotPurple, colors.dotGreen];
