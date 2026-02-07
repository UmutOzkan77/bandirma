/**
 * Ders Programı Modülü Mock Data
 * Tasarımdaki örnek dersler
 */

import { Course, LunchBreakInfo } from './types';

// Çarşamba günü dersleri (dayOfWeek: 2)
export const wednesdayCourses: Course[] = [
    {
        id: '1',
        name: 'VERİ YAPILARI',
        instructor: 'Dr. Öğr. Ü. Alican DOĞAN',
        startTime: '08:45',
        endTime: '09:30',
        room: 'G 201',
        dayOfWeek: 2,
    },
    {
        id: '2',
        name: 'VERİ YAPILARI',
        instructor: 'Dr. Öğr. Ü. Alican DOĞAN',
        startTime: '09:35',
        endTime: '10:20',
        room: 'G 201',
        dayOfWeek: 2,
    },
    {
        id: '3',
        name: 'YAPAY ZEKA GİRİŞ',
        instructor: 'Dr. Öğr. Ü. Fatma ŞAHİN',
        startTime: '10:25',
        endTime: '11:10',
        room: 'G 104',
        dayOfWeek: 2,
    },
    {
        id: '4',
        name: 'TÜRK DİLİ',
        instructor: 'Öğr. Gör. Dr. Önder POTUR',
        startTime: '11:15',
        endTime: '12:00',
        room: 'UZAKTAN EĞİTİM',
        dayOfWeek: 2,
        isOnline: true,
    },
    {
        id: '5',
        name: 'MATEMATİK',
        instructor: 'Dr. Öğr. Ü. Muhammet KUTLU',
        startTime: '14:30',
        endTime: '15:15',
        room: 'G 205',
        dayOfWeek: 2,
    },
    {
        id: '6',
        name: 'MATEMATİK',
        instructor: 'Dr. Öğr. Ü. Muhammet KUTLU',
        startTime: '15:20',
        endTime: '16:05',
        room: 'G 205',
        dayOfWeek: 2,
    },
];

// Perşembe günü dersleri (dayOfWeek: 3)
export const thursdayCourses: Course[] = [
    {
        id: '7',
        name: 'OFİS PROGRAMLARI',
        instructor: 'Dr. Öğr. Ü. Ahmet YILMAZ',
        startTime: '08:45',
        endTime: '09:30',
        room: 'G 201',
        dayOfWeek: 3,
        hasConflict: true,
    },
    {
        id: '8',
        name: 'İŞLETME MATEMATİĞİ',
        instructor: 'Dr. Öğr. Ü. Ayşe KAYA',
        startTime: '08:45',
        endTime: '09:30',
        room: 'G 102',
        dayOfWeek: 3,
        hasConflict: true,
    },
    {
        id: '9',
        name: 'OFİS PROGRAMLARI',
        instructor: 'Dr. Öğr. Ü. Ahmet YILMAZ',
        startTime: '09:35',
        endTime: '10:20',
        room: 'G 201',
        dayOfWeek: 3,
    },
    {
        id: '10',
        name: 'İŞLETME MATEMATİĞİ',
        instructor: 'Dr. Öğr. Ü. Ayşe KAYA',
        startTime: '09:35',
        endTime: '10:20',
        room: 'G 102',
        dayOfWeek: 3,
    },
    {
        id: '11',
        name: 'OFİS PROGRAMLARI',
        instructor: 'Dr. Öğr. Ü. Ahmet YILMAZ',
        startTime: '10:25',
        endTime: '11:10',
        room: 'G 201',
        dayOfWeek: 3,
    },
    {
        id: '12',
        name: 'İŞLETME MATEMATİĞİ',
        instructor: 'Dr. Öğr. Ü. Ayşe KAYA',
        startTime: '10:25',
        endTime: '11:10',
        room: 'G 102',
        dayOfWeek: 3,
    },
    {
        id: '13',
        name: 'YÖNETİM ORGANİZASYONU',
        instructor: 'Prof. Dr. Mehmet CAN',
        startTime: '14:30',
        endTime: '15:15',
        room: 'G 208',
        dayOfWeek: 3,
    },
    {
        id: '14',
        name: 'YÖNETİM ORGANİZASYONU',
        instructor: 'Prof. Dr. Mehmet CAN',
        startTime: '15:20',
        endTime: '16:05',
        room: 'G 208',
        dayOfWeek: 3,
    },
    {
        id: '15',
        name: 'YÖNETİM ORGANİZASYONU',
        instructor: 'Prof. Dr. Mehmet CAN',
        startTime: '16:10',
        endTime: '16:55',
        room: 'G 208',
        dayOfWeek: 3,
    },
];

// Tüm dersler
export const allCourses: Course[] = [...wednesdayCourses, ...thursdayCourses];

// Öğle arası bilgisi
export const lunchBreak: LunchBreakInfo = {
    startTime: '12:05',
    endTime: '12:50',
};

// Gösterilecek günleri hesaplayan yardımcı fonksiyon
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

    // Haftanın pazartesisinden başla
    const startOfWeek = new Date(selectedDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Pazartesi = 0
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

// Belirli bir gün için dersleri getir
export function getCoursesForDay(dayOfWeek: number): Course[] {
    return allCourses.filter(course => course.dayOfWeek === dayOfWeek);
}

// Ay adlarını Türkçe olarak al
export function getMonthName(date: Date): string {
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}
