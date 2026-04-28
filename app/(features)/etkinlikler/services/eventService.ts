/**
 * Supabase Veri Erişim Katmanı - Etkinlikler Modülü
 */
import { isSupabaseConfigured, supabase } from '../../../../lib/supabaseClient';
import {
    communities as mockCommunities,
    events as mockEvents,
    notifications as mockNotifications,
    getCommunityById as getMockCommunityById,
    getEventsByCommunityId,
    getEventsByDate,
    getEventDates as getMockEventDates,
} from '../mockData';
import { Comment, Community, Event, Notification } from '../types';
import { eventDotColors } from '../theme';

function canUseBackend() {
    return Boolean(isSupabaseConfigured && supabase);
}

function fallbackCommunities(): Community[] {
    return mockCommunities;
}

function fallbackEvents(): Event[] {
    return mockEvents;
}

function fallbackNotifications(): Notification[] {
    return mockNotifications;
}

// ========== Community İşlemleri ==========

export async function fetchCommunities(): Promise<Community[]> {
    if (!canUseBackend()) {
        return fallbackCommunities();
    }

    const { data, error } = await supabase!
        .from('communities')
        .select('*')
        .order('name');

    if (error) {
        console.error('Communities fetch error:', error.message);
        return fallbackCommunities();
    }

    return (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        logo: row.logo,
        isVerified: row.is_verified,
        description: row.description,
        memberCount: row.member_count,
    }));
}

export async function fetchCommunityById(id: string): Promise<Community | null> {
    if (!canUseBackend()) {
        return getMockCommunityById(id) || null;
    }

    const { data, error } = await supabase!
        .from('communities')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Community fetch error:', error?.message);
        return getMockCommunityById(id) || null;
    }

    return {
        id: data.id,
        name: data.name,
        logo: data.logo,
        isVerified: data.is_verified,
        description: data.description,
        memberCount: data.member_count,
    };
}

// ========== Event İşlemleri ==========

export async function fetchEvents(): Promise<Event[]> {
    if (!canUseBackend()) {
        return fallbackEvents();
    }

    const { data, error } = await supabase!
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Events fetch error:', error.message);
        return fallbackEvents();
    }

    return (data || []).map((row: any, index: number) => ({
        id: row.id,
        communityId: row.community_id,
        title: row.title,
        description: row.description,
        image: row.image,
        date: row.date,
        time: row.time?.substring(0, 5),
        endTime: row.end_time?.substring(0, 5),
        location: row.location,
        createdAt: new Date(row.created_at),
        color: row.color || eventDotColors[index % eventDotColors.length],
    }));
}

export async function fetchEventsByDate(date: string): Promise<Event[]> {
    if (!canUseBackend()) {
        return getEventsByDate(date);
    }

    const { data, error } = await supabase!
        .from('events')
        .select('*')
        .eq('date', date)
        .order('time');

    if (error) {
        console.error('Events by date fetch error:', error.message);
        return getEventsByDate(date);
    }

    return (data || []).map((row: any, index: number) => ({
        id: row.id,
        communityId: row.community_id,
        title: row.title,
        description: row.description,
        image: row.image,
        date: row.date,
        time: row.time?.substring(0, 5),
        endTime: row.end_time?.substring(0, 5),
        location: row.location,
        createdAt: new Date(row.created_at),
        color: row.color || eventDotColors[index % eventDotColors.length],
    }));
}

export async function fetchEventById(eventId: string): Promise<Event | null> {
    if (!canUseBackend()) {
        return fallbackEvents().find(item => item.id === eventId) || null;
    }

    const { data, error } = await supabase!
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

    if (error || !data) {
        console.error('Event fetch error:', error?.message);
        return fallbackEvents().find(item => item.id === eventId) || null;
    }

    return {
        id: data.id,
        communityId: data.community_id,
        title: data.title,
        description: data.description,
        image: data.image,
        date: data.date,
        time: data.time?.substring(0, 5),
        endTime: data.end_time?.substring(0, 5),
        location: data.location,
        createdAt: new Date(data.created_at),
        color: data.color || eventDotColors[0],
    };
}

export async function fetchEventsByCommunity(communityId: string): Promise<Event[]> {
    if (!canUseBackend()) {
        return getEventsByCommunityId(communityId);
    }

    const { data, error } = await supabase!
        .from('events')
        .select('*')
        .eq('community_id', communityId)
        .order('date', { ascending: false });

    if (error) {
        console.error('Events by community fetch error:', error.message);
        return getEventsByCommunityId(communityId);
    }

    return (data || []).map((row: any, index: number) => ({
        id: row.id,
        communityId: row.community_id,
        title: row.title,
        description: row.description,
        image: row.image,
        date: row.date,
        time: row.time?.substring(0, 5),
        endTime: row.end_time?.substring(0, 5),
        location: row.location,
        createdAt: new Date(row.created_at),
        color: row.color || eventDotColors[index % eventDotColors.length],
    }));
}

export async function fetchEventDates(): Promise<Map<string, Event[]>> {
    if (!canUseBackend()) {
        return getMockEventDates();
    }

    const events = await fetchEvents();
    const dateMap = new Map<string, Event[]>();
    events.forEach(event => {
        const existing = dateMap.get(event.date) || [];
        dateMap.set(event.date, [...existing, event]);
    });
    return dateMap;
}

// ========== Notification İşlemleri ==========

export async function fetchNotifications(): Promise<Notification[]> {
    if (!canUseBackend()) {
        return fallbackNotifications();
    }

    const { data, error } = await supabase!
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Notifications fetch error:', error.message);
        return fallbackNotifications();
    }

    return (data || []).map((row: any) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        description: row.description,
        eventId: row.event_id,
        createdAt: new Date(row.created_at),
        isRead: row.is_read,
    }));
}

export async function markNotificationAsRead(id: string): Promise<void> {
    if (!canUseBackend()) {
        return;
    }

    const { error } = await supabase!
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

    if (error) {
        console.error('Mark notification read error:', error.message);
    }
}

export async function fetchComments(eventId: string): Promise<Comment[]> {
    if (!canUseBackend()) {
        return [];
    }

    const { data, error } = await supabase!
        .from('event_comments')
        .select(`
            id,
            event_id,
            user_id,
            content,
            created_at,
            users ( name )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

    if (error || !data) {
        console.error('Comments fetch error:', error?.message);
        return [];
    }

    return data.map((row: any) => ({
        id: row.id,
        eventId: row.event_id,
        userId: row.user_id,
        userName: row.users?.name || 'Anonim',
        content: row.content,
        createdAt: new Date(row.created_at),
    }));
}

export async function addComment(eventId: string, userId: string, content: string): Promise<boolean> {
    if (!canUseBackend()) {
        return true;
    }

    const { error } = await supabase!
        .from('event_comments')
        .insert({
            event_id: eventId,
            user_id: userId,
            content,
        });

    if (error) {
        console.error('Add comment error:', error.message);
        return false;
    }
    return true;
}

// ========== Topluluk Üyelik İşlemleri ==========

export async function followCommunity(communityId: string, userId: string): Promise<boolean> {
    if (!canUseBackend()) {
        return true;
    }

    const { error } = await supabase!
        .from('community_members')
        .insert({
            community_id: communityId,
            user_id: userId,
        });

    if (error) {
        console.error('Follow community error:', error.message);
        return false;
    }
    return true;
}

export async function unfollowCommunity(communityId: string, userId: string): Promise<boolean> {
    if (!canUseBackend()) {
        return true;
    }

    const { error } = await supabase!
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', userId);

    if (error) {
        console.error('Unfollow community error:', error.message);
        return false;
    }
    return true;
}

export async function fetchFollowedCommunities(userId: string): Promise<string[]> {
    if (!canUseBackend()) {
        return [];
    }

    const { data, error } = await supabase!
        .from('community_members')
        .select('community_id')
        .eq('user_id', userId);

    if (error || !data) {
        console.error('Fetch followed communities error:', error?.message);
        return [];
    }

    return data.map((row: any) => row.community_id);
}
