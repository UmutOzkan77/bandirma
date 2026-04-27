/**
 * Ders Programı Modülü - Veri Katmanı
 * Veriler Supabase'den çekilir, yardımcı fonksiyonlar burada tanımlanır
 */

import { Course, LunchBreakInfo } from './types';
import { isSupabaseConfigured, supabase } from '../../../lib/supabaseClient';

// ─── Supabase'den Veri Çekme ─────────────────────────────────────

export async function fetchAllCourses(studentId: string): Promise<Course[]> {
    if (!studentId || !isSupabaseConfigured || !supabase) {
        return allCourses;
    }

    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('student_id', studentId)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

    if (error) {
        console.error('Error fetching courses:', error);
        return allCourses;
    }

    return (data || []).map((row: any) => ({
        id: row.id,
        offeringId: row.offering_id ?? row.id,
        code: row.code ?? row.course_code ?? 'BILINMEYEN',
        name: row.name,
        instructor: row.instructor,
        startTime: row.start_time,
        endTime: row.end_time,
        room: row.room,
        dayOfWeek: row.day_of_week,
        isOnline: row.is_online,
        hasConflict: row.has_conflict,
    }));
}

export const allCourses: Course[] = [
    {
        id: 'course-1',
        offeringId: 'course-1',
        code: 'BM101',
        name: 'Yazilim Muhendisligi',
        instructor: 'Dr. Ogr. Uyesi Ahmet Yilmaz',
        startTime: '09:00',
        endTime: '10:45',
        room: 'A-101',
        dayOfWeek: 0,
    },
    {
        id: 'course-2',
        offeringId: 'course-2',
        code: 'BM203',
        name: 'Algoritma Analizi',
        instructor: 'Doc. Dr. Elif Demir',
        startTime: '11:00',
        endTime: '12:00',
        room: 'B-204',
        dayOfWeek: 0,
    },
    {
        id: 'course-3',
        offeringId: 'course-3',
        code: 'BM305',
        name: 'Veri Tabani Sistemleri',
        instructor: 'Prof. Dr. Mehmet Can',
        startTime: '13:15',
        endTime: '15:00',
        room: 'C-305',
        dayOfWeek: 2,
        hasConflict: false,
    },
    {
        id: 'course-4',
        offeringId: 'course-4',
        code: 'BM407',
        name: 'Mobil Programlama',
        instructor: 'Ogr. Gor. Ali Veli',
        startTime: '15:15',
        endTime: '17:00',
        room: 'D-110',
        dayOfWeek: 4,
        isOnline: true,
    },
];

// ─── Sabit Veriler ────────────────────────────────────────────────

export const lunchBreak: LunchBreakInfo = {
    startTime: '12:05',
    endTime: '12:50',
};

// ─── Yardımcı Fonksiyonlar (değişmez) ────────────────────────────

export function generateWeekDays(selectedDate: Date): {
    dayNumber: number;
    dayName: string;
    dayAbbr: string;
    date: Date;
    isSelected: boolean;
}[] {
    const days = [];
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const dayAbbrs = ['PAZ', 'PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT'];

    const startOfWeek = new Date(selectedDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diff);

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);

        days.push({
            dayNumber: currentDate.getDate(),
            dayName: dayNames[currentDate.getDay()],
            dayAbbr: dayAbbrs[currentDate.getDay()],
            date: currentDate,
            isSelected: currentDate.toDateString() === selectedDate.toDateString(),
        });
    }

    return days;
}

export function getCoursesForDay(courses: Course[], dayOfWeek: number): Course[] {
    return courses.filter(course => course.dayOfWeek === dayOfWeek);
}

export function getMonthName(date: Date): string {
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}
