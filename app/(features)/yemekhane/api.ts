/**
 * Yemekhane Modülü - Supabase API Katmanı
 * Menü, yemek, oy ve geri bildirim verileri
 */

import supabase, { isSupabaseConfigured } from '../../../lib/supabase';

type FeedbackPayload = {
    student_id?: string;
    meal_time: 'lunch' | 'dinner';
    category: string;
    meal_name: string;
    comment: string;
};

function isApiReady() {
    return Boolean(isSupabaseConfigured && supabase);
}

// ─── Günlük Menüler ────────────────────────────────────────────

/** Tüm menüleri getir */
export async function fetchMenus() {
    if (!isApiReady()) {
        return null;
    }

    const { data, error } = await supabase!
        .from('gunluk_menu')
        .select('*')
        .order('tarih', { ascending: true });

    if (error) {
        console.error('Menü verileri alınamadı:', error.message);
        return null;
    }

    return data;
}

/** Bugünün menüsünü getir */
export async function fetchTodayMenu() {
    if (!isApiReady()) {
        return null;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data, error } = await supabase!
        .from('gunluk_menu')
        .select('*')
        .eq('tarih', today)
        .single();

    if (error) {
        console.error('Bugünün menüsü alınamadı:', error.message);
        return null;
    }

    return data;
}

/** Bu haftanın menülerini getir */
export async function fetchWeekMenus() {
    if (!isApiReady()) {
        return null;
    }

    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4); // Pazartesi-Cuma

    const { data, error } = await supabase!
        .from('gunluk_menu')
        .select('*')
        .gte('tarih', startOfWeek.toISOString().split('T')[0])
        .lte('tarih', endOfWeek.toISOString().split('T')[0])
        .order('tarih');

    if (error) {
        console.error('Haftalık menü alınamadı:', error.message);
        return null;
    }

    return data;
}

/** Aya göre menüleri getir */
export async function fetchMonthMenus(year: number, month: number) {
    if (!isApiReady()) {
        return null;
    }

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    const { data, error } = await supabase!
        .from('gunluk_menu')
        .select('*')
        .gte('tarih', startDate)
        .lte('tarih', endDate)
        .order('tarih');

    if (error) {
        console.error('Aylık menü alınamadı:', error.message);
        return null;
    }

    return data;
}

// ─── Oylar ──────────────────────────────────────────────────────

/** Menüye oy ver (like/dislike) */
export async function voteMenu(menuId: string, voteType: 'like' | 'dislike') {
    if (!isApiReady()) {
        return null;
    }

    const column = voteType === 'like' ? 'begeniler' : 'begenmeyenler';

    // Mevcut değeri al ve 1 artır
    const { data: menu } = await supabase!
        .from('gunluk_menu')
        .select(column)
        .eq('id', menuId)
        .single();

    if (!menu) return null;

    const { data, error } = await supabase!
        .from('gunluk_menu')
        .update({ [column]: (menu as any)[column] + 1 })
        .eq('id', menuId)
        .select()
        .single();

    if (error) {
        console.error('Oy verilemedi:', error.message);
        return null;
    }

    return data;
}

// ─── Geri Bildirim ──────────────────────────────────────────────

/** Geri bildirimleri getir */
export async function fetchFeedback() {
    if (!isApiReady()) {
        return null;
    }

    const { data, error } = await supabase!
        .from('yemek_yorumlari')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Geri bildirimler alınamadı:', error.message);
        return null;
    }

    return (data || []).map((item: any) => ({
        id: item.id,
        student_id: item.student_id ?? item.kullanici_id ?? null,
        meal_time: item.meal_time ?? item.ogun ?? 'lunch',
        category: item.category ?? item.kategori ?? 'GENEL',
        meal_name: item.meal_name ?? item.yemek_adi ?? 'Genel Degerlendirme',
        comment: item.comment ?? item.yorum ?? '',
        likes: item.likes ?? item.begeniler ?? 0,
        dislikes: item.dislikes ?? item.begenmeyenler ?? 0,
        created_at: item.created_at,
    }));
}

/** Yeni geri bildirim ekle */
export async function addFeedback(feedback: FeedbackPayload) {
    if (!isApiReady()) {
        return null;
    }

    const payloads = [
        feedback,
        {
            kullanici_id: feedback.student_id,
            ogun: feedback.meal_time,
            kategori: feedback.category,
            yemek_adi: feedback.meal_name,
            yorum: feedback.comment,
        },
    ];

    for (const payload of payloads) {
        const { data, error } = await supabase!
            .from('yemek_yorumlari')
            .insert(payload)
            .select()
            .single();

        if (!error) {
            return data;
        }
    }

    return null;
}

// ─── Yorum Oyları ──────────────────────────────────────────────

/** Yorum beğen/beğenme */
export async function voteFeedback(feedbackId: string, voteType: 'like' | 'dislike') {
    if (!isApiReady()) {
        return null;
    }

    const preferredColumn = voteType === 'like' ? 'likes' : 'dislikes';
    const fallbackColumn = voteType === 'like' ? 'begeniler' : 'begenmeyenler';

    const { data: preferredFeedback } = await supabase!
        .from('yemek_yorumlari')
        .select(preferredColumn)
        .eq('id', feedbackId)
        .single();

    const preferredCounts = preferredFeedback as Record<string, unknown> | null;
    const counterColumn = preferredCounts?.[preferredColumn] !== undefined ? preferredColumn : fallbackColumn;

    const { data: feedback } = await supabase!
        .from('yemek_yorumlari')
        .select(counterColumn)
        .eq('id', feedbackId)
        .single();

    if (!feedback) return null;

    const { data, error } = await supabase!
        .from('yemek_yorumlari')
        .update({ [counterColumn]: (feedback as any)[counterColumn] + 1 })
        .eq('id', feedbackId)
        .select()
        .single();

    if (error) {
        console.error('Yorum oyu verilemedi:', error.message);
        return null;
    }

    return data;
}
