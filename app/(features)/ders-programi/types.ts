import type { SelectableOffering } from '../../../lib/domain';

export interface Course {
    id: string;
    offeringId: string;
    code: string;
    name: string;
    instructor: string;
    startTime: string;
    endTime: string;
    room: string;
    building?: string;
    dayOfWeek: number;
    hasConflict?: boolean;
    isOnline?: boolean;
    canRemove?: boolean;
}

export interface DayInfo {
    date: Date;
    dayNumber: number;
    dayName: string;
    dayAbbr: string;
    isSelected: boolean;
    isToday: boolean;
}

export interface LunchBreakInfo {
    startTime: string;
    endTime: string;
}

export interface AddCourseSelection {
    offering: SelectableOffering;
}
