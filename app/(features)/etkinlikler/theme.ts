/**
 * Etkinlikler Modülü Tema Dosyası
 */

export const colors = {
    backgroundLight: '#F8FAFC', // HomeScreen background
    backgroundDark: '#0F172A',
    cardLight: '#FFFFFF',       // HomeScreen card background
    cardDark: '#1E293B',
    accent: '#0066CC',         // HomeScreen section title color
    primary: '#0066CC',
    textPrimary: '#1E293B',    // HomeScreen text color
    textSecondary: '#64748B',  // HomeScreen gray text
    textWhite: '#FFFFFF',
    border: '#F1F5F9',         // HomeScreen card border
    notificationBlue: '#EBF5FF',
    notificationOrange: '#FEF3C7',
    notificationRed: '#FEE2E2',
    notificationGreen: '#DCFCE7',
    notificationPurple: '#F3E8FF',
    dotTeal: '#14B8A6',
    dotOrange: '#F97316',
    dotPink: '#EC4899',
    dotPurple: '#8B5CF6',
    dotGreen: '#22C55E',
    unreadDot: '#0066CC',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };
export const borderRadius = { sm: 8, md: 12, lg: 16, xl: 20, full: 9999 };
export const fontSize = { xs: 10, sm: 12, md: 14, lg: 16, xl: 18, xxl: 20, title: 18 };
export const fontWeight = { normal: '400' as const, medium: '500' as const, semibold: '600' as const, bold: '700' as const };
export const shadows = {
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4
    }
};
export const notificationTypeColors = { timeChange: colors.accent, dateChange: colors.notificationOrange, cancelled: '#EF4444', newEvent: '#22C55E', locationChange: '#8B5CF6', reminder: colors.accent };
export const eventDotColors = [colors.dotTeal, colors.dotOrange, colors.dotPink, colors.dotPurple, colors.dotGreen];
