import type { ExamViewModel } from '../../../lib/domain';

export interface WeekDay {
    date: string;
    dayName: string;
    dayNumber: number;
}

export const timeSlots = ['09:00', '11:00', '13:00', '15:00', '17:00'];

export function getWeekDays(startDate: Date): WeekDay[] {
    const days: WeekDay[] = [];
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt'];

    for (let i = 0; i < 7; i += 1) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        days.push({
            date: date.toISOString().slice(0, 10),
            dayName: dayNames[date.getDay()],
            dayNumber: date.getDate(),
        });
    }

    return days;
}

export function formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T12:00:00');
    const months = [
        'Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran',
        'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik',
    ];

    return String(date.getDate()) + ' ' + months[date.getMonth()] + ' ' + String(date.getFullYear());
}

export function getCountdown(examDate: string, examTime: string) {
    const now = new Date();
    const exam = new Date(examDate + 'T' + examTime + ':00');
    const diff = exam.getTime() - now.getTime();

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
}

export function calculateRequiredFinal(currentAverage: number, currentWeight: number, targetGrade: number) {
    const finalWeight = 100 - currentWeight;
    const required = (targetGrade - (currentAverage * currentWeight / 100)) / (finalWeight / 100);
    return Math.max(0, Math.min(100, required));
}

export function getWeekStart(baseDate = new Date()) {
    const start = new Date(baseDate);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
}

export type Exam = ExamViewModel;
