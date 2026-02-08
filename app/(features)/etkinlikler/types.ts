/**
 * Etkinlikler Modülü Type Tanımlamaları
 */

export interface Community {
    id: string;
    name: string;
    logo: string;
    isVerified: boolean;
}

export interface Event {
    id: string;
    communityId: string;
    title: string;
    description: string;
    image: string;
    date: string;
    time: string;
    endTime?: string;
    location: string;
    createdAt: Date;
    color: string;
}

export type NotificationType = 'timeChange' | 'dateChange' | 'cancelled' | 'newEvent' | 'locationChange' | 'reminder';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    eventId?: string;
    createdAt: Date;
    isRead: boolean;
}

export type ScreenType = 'feed' | 'calendar' | 'dailyProgram' | 'notifications';
