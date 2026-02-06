/**
 * Sınav Takvimi Modülü - Mock Data
 * Örnek veriler ve TypeScript tipleri
 */

// TypeScript Types
export interface Student {
    id: string;
    name: string;
    department: string;
    faculty: string;
    avatarUrl?: string;
}

export interface Exam {
    id: string;
    courseCode: string;
    courseName: string;
    examType: 'vize' | 'final' | 'bütünleme' | 'quiz';
    date: string;         // YYYY-MM-DD
    startTime: string;    // HH:mm
    endTime: string;      // HH:mm
    building: string;
    room: string;
    floor?: string;
    hasConflict?: boolean;
    conflictWith?: string;
}

export interface Lesson {
    id: string;
    courseCode: string;
    courseName: string;
    time: string;
    room: string;
    instructor?: string;
}

export interface Grade {
    id: string;
    type: 'vize' | 'quiz' | 'proje' | 'ödev' | 'final';
    label: string;
    score: number | null;
    weight: number;       // Yüzde olarak (örn: 40)
}

export interface NewsItem {
    id: string;
    title: string;
    date: string;
    imageUrl?: string;
}

export interface WeekDay {
    date: string;         // YYYY-MM-DD
    dayName: string;      // Pzt, Sal, vb.
    dayNumber: number;
}

// Mock Data

export const currentStudent: Student = {
    id: '1',
    name: 'Ahmet Yılmaz',
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
};

export const upcomingExams: Exam[] = [
    {
        id: '1',
        courseCode: 'MAT101',
        courseName: 'Matematik I',
        examType: 'vize',
        date: '2026-02-10',
        startTime: '09:00',
        endTime: '10:30',
        building: 'Mühendislik Fakültesi',
        room: 'Amfi 4',
        floor: 'Zemin Kat',
    },
    {
        id: '2',
        courseCode: 'BIL102',
        courseName: 'Programlama I',
        examType: 'vize',
        date: '2026-02-10',
        startTime: '11:00',
        endTime: '12:30',
        building: 'Mühendislik B Blok',
        room: '302 Nolu Derslik',
        floor: 'Kat 3',
    },
    {
        id: '3',
        courseCode: 'FIZ101',
        courseName: 'Fizik I',
        examType: 'vize',
        date: '2026-02-10',
        startTime: '14:00',
        endTime: '15:30',
        building: 'Fen Fakültesi',
        room: 'Lab 2 - B Blok',
    },
    {
        id: '4',
        courseCode: 'BIL201',
        courseName: 'Veri Yapıları',
        examType: 'vize',
        date: '2026-02-11',
        startTime: '09:00',
        endTime: '10:30',
        building: 'Mühendislik Fakültesi',
        room: 'Derslik 104',
    },
    {
        id: '5',
        courseCode: 'KIM101',
        courseName: 'Kimya I',
        examType: 'vize',
        date: '2026-02-11',
        startTime: '13:00',
        endTime: '14:30',
        building: 'Fen Fakültesi',
        room: 'Amfi 2',
    },
    {
        id: '6',
        courseCode: 'YZK201',
        courseName: 'Algoritma',
        examType: 'vize',
        date: '2026-02-12',
        startTime: '10:00',
        endTime: '11:30',
        building: 'Mühendislik A Blok',
        room: 'Lab 1',
    },
    {
        id: '7',
        courseCode: 'ELE101',
        courseName: 'Elektrik',
        examType: 'vize',
        date: '2026-02-12',
        startTime: '15:00',
        endTime: '16:30',
        building: 'Mühendislik B Blok',
        room: 'Amfi 3',
    },
    {
        id: '8',
        courseCode: 'HUK201',
        courseName: 'Ceza Hukuku',
        examType: 'vize',
        date: '2026-02-10',
        startTime: '09:00',
        endTime: '10:30',
        building: 'Hukuk Fakültesi',
        room: 'Derslik 201',
        hasConflict: true,
        conflictWith: 'MAT101',
    },
];

export const todayLessons: Lesson[] = [
    {
        id: '1',
        courseCode: 'YZK101',
        courseName: 'Yapay Zeka Giriş',
        time: '09:00',
        room: 'Lab 2 - B Blok',
    },
    {
        id: '2',
        courseCode: 'VYP201',
        courseName: 'Veri Yapıları',
        time: '13:00',
        room: 'Derslik 104',
    },
];

export const campusNews: NewsItem[] = [
    {
        id: '1',
        title: 'Bahar Şenliği Tarihleri Açıklandı!',
        date: '2 saat önce',
    },
    {
        id: '2',
        title: 'Kütüphane Çalışma Saatleri Güncellendi',
        date: 'Dün',
    },
];

// Not hesaplama için varsayılan değerler
export const defaultGrades: Grade[] = [
    { id: '1', type: 'vize', label: 'Vize Notu', score: 85, weight: 40 },
    { id: '2', type: 'quiz', label: 'Quiz Notu', score: 90, weight: 10 },
    { id: '3', type: 'proje', label: 'Proje Notu', score: 75, weight: 10 },
];

// Haftalık takvim için günler
export const getWeekDays = (startDate: Date): WeekDay[] => {
    const days: WeekDay[] = [];
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        days.push({
            date: date.toISOString().split('T')[0],
            dayName: dayNames[date.getDay()],
            dayNumber: date.getDate(),
        });
    }

    return days;
};

// Saat dilimleri (takvim için) - ekrana sığacak şekilde
export const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00'
];

// Yardımcı fonksiyonlar
export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const getCountdown = (examDate: string, examTime: string): { days: number; hours: number; minutes: number; seconds: number } => {
    const now = new Date();
    const exam = new Date(`${examDate}T${examTime}:00`);
    const diff = exam.getTime() - now.getTime();

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
};

// Hedef not için gerekli final puanı hesaplama
export const calculateRequiredFinal = (
    currentAverage: number,
    currentWeight: number,
    targetGrade: number
): number => {
    const finalWeight = 100 - currentWeight;
    const required = (targetGrade - (currentAverage * currentWeight / 100)) / (finalWeight / 100);
    return Math.max(0, Math.min(100, required));
};
