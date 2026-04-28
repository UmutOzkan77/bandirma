export const colors = {
    primary: '#004A99',
    accent: '#00AEEF',
    backgroundLight: '#FFFFFF',
    backgroundDark: '#0F172A',
    cardLight: '#FFFFFF',
    cardDark: '#1E293B',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textWhite: '#FFFFFF',
    border: '#E2E8F0',
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
    unreadDot: '#004A99',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };
export const borderRadius = { sm: 8, md: 12, lg: 16, xl: 20, full: 9999 };
export const fontSize = { xs: 10, sm: 12, md: 14, lg: 16, xl: 18, xxl: 20, title: 18 };
export const fontWeight = { normal: '400' as const, medium: '500' as const, semibold: '600' as const, bold: '700' as const };
export const shadows = {
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    }
};
export const notificationTypeColors = {
    timeChange: colors.accent,
    dateChange: colors.notificationOrange,
    cancelled: '#EF4444',
    newEvent: '#22C55E',
    locationChange: '#8B5CF6',
    reminder: colors.accent
};
export const eventDotColors = [colors.dotTeal, colors.dotOrange, colors.dotPink, colors.dotPurple, colors.dotGreen];
