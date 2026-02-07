/**
 * Ders Programı Modülü Tip Tanımlamaları
 */

export interface Course {
    id: string;
    name: string;
    instructor: string;
    startTime: string;      // "08:45" formatında
    endTime: string;        // "09:30" formatında
    room: string;           // "G 201" gibi
    dayOfWeek: number;      // 0 = Pazartesi, 1 = Salı, ...
    hasConflict?: boolean;  // Çakışma var mı?
    isOnline?: boolean;     // Uzaktan eğitim mi?
}

export interface DayInfo {
    date: Date;
    dayNumber: number;      // Ayın günü (1-31)
    dayName: string;        // "Pazartesi", "Salı", vb.
    dayAbbr: string;        // "PZT", "SAL", vb.
    isSelected: boolean;
    isToday: boolean;
}

export interface LunchBreakInfo {
    startTime: string;
    endTime: string;
}

export type DayOfWeek = 'P' | 'S' | 'Ç' | 'Per' | 'C' | 'Ct' | 'Pz';

export interface NewCourseForm {
    name: string;
    instructor: string;
    room: string;
    selectedDays: boolean[]; // [P, S, Ç, P, C, C, P] - 7 gün
    startTime: string;
    endTime: string;
}
