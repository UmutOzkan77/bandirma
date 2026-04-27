export type StudentSource = 'imported' | 'demo_signup';
export type ExamType = 'vize' | 'final' | 'bütünleme' | 'quiz';

export interface Department {
    id: string;
    facultyName: string;
    departmentName: string;
    code: string;
    isActive: boolean;
}

export interface AcademicTerm {
    id: string;
    year: number;
    termName: string;
    startsAt: string;
    endsAt: string;
    isActive: boolean;
}

export interface StudentProfile {
    id: string;
    schoolEmail: string;
    fullName: string;
    phone: string | null;
    facultyName: string;
    departmentId: string | null;
    departmentCode: string | null;
    departmentName: string | null;
    classLevel: number | null;
    studentNumber: string | null;
    isActive: boolean;
    source: StudentSource;
    mustChangePassword: boolean;
    passwordChangedAt: string | null;
    tcLast4: string | null;
}

export interface CourseCatalogItem {
    id: string;
    courseCode: string;
    courseName: string;
    credits: number | null;
    isActive: boolean;
}

export interface ScheduleSlot {
    id: string;
    offeringId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room: string | null;
    building: string | null;
    deliveryType: string | null;
}

export interface ExamSession {
    id: string;
    offeringId: string;
    examType: ExamType;
    examDate: string;
    startTime: string;
    endTime: string;
    building: string | null;
    room: string | null;
    notes: string | null;
    isPublished: boolean;
}

export interface CourseOffering {
    id: string;
    courseId: string;
    termId: string;
    departmentId: string;
    classLevel: number;
    section: string | null;
    instructorName: string | null;
    isActive: boolean;
    weeklyHours: number | null;
    allowedAbsenceHours: number | null;
    course: CourseCatalogItem;
    scheduleSlots: ScheduleSlot[];
    examSessions: ExamSession[];
}

export interface LocalCourseOverride {
    addedOfferingIds: string[];
    removedOfferingIds: string[];
}

export interface LocalAbsenceEvent {
    id: string;
    date: string;
    dayLabel: string;
    createdAt: string;
}

export interface LocalAbsenceEntry {
    usedHours: number;
    events: LocalAbsenceEvent[];
}

export type LocalAbsenceState = Record<string, LocalAbsenceEntry>;

export interface CafeteriaMenuItem {
    id: string;
    menuDayId: string;
    itemName: string;
    itemType: string | null;
    sortOrder: number;
    calories: number | null;
}

export interface CafeteriaMenuDay {
    id: string;
    periodId: string;
    serviceDate: string;
    mealSession: string;
    items: CafeteriaMenuItem[];
}

export interface CafeteriaMenuPeriod {
    id: string;
    year: number;
    month: number;
    validFrom: string;
    validTo: string;
    version: number;
    isPublished: boolean;
    days: CafeteriaMenuDay[];
}

export interface SelectableOffering extends CourseOffering {
    department?: Department | null;
}

export interface TimetableEntry {
    offeringId: string;
    courseCode: string;
    courseName: string;
    instructor: string;
    startTime: string;
    endTime: string;
    room: string;
    building: string;
    dayOfWeek: number;
    isOnline: boolean;
}

export interface ExamViewModel {
    id: string;
    offeringId: string;
    courseCode: string;
    courseName: string;
    examType: ExamType;
    date: string;
    startTime: string;
    endTime: string;
    building: string;
    room: string;
    hasConflict: boolean;
    conflictWith: string | null;
}

export interface AbsenceCardData {
    id: string;
    code: string;
    name: string;
    instructor: string;
    totalHours: number;
    usedHours: number;
    remainingHours: number | string;
    status: 'normal' | 'warning' | 'critical';
}

export interface DemoSignupInput {
    schoolEmail: string;
    fullName: string;
    tcKimlik: string;
    phone: string;
    password: string;
    departmentCode: string;
    classLevel: number;
}
