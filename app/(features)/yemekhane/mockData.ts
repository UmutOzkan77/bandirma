/**
 * Yemekhane Modülü Mock Data
 * Bandırma Onyedi Eylül Üniversitesi - Şubat 2026 Gerçek Verileri
 */

// Yemek türleri
export type MealType = 'soup' | 'mainDish' | 'sideDish' | 'dessert' | 'drink' | 'salad';
export type MealTime = 'lunch' | 'dinner';
export type DensityLevel = 'low' | 'medium' | 'high';

// Yemek arayüzü
export interface Meal {
    id: string;
    name: string;
    description?: string;
    type: MealType;
    calories: number;
    badges?: ('GF' | 'V' | 'VG')[];
}

// Günlük menü arayüzü
export interface DailyMenu {
    id: string;
    date: string;
    dayName: string;
    dayShort: string;
    dayNumber: number;
    meals: Meal[];
    lunchTime: string;
    dinnerTime: string;
    votes: {
        likes: number;
        dislikes: number;
    };
}

// Popüler yemek arayüzü
export interface PopularMeal {
    id: string;
    name: string;
    image: string;
    rating: number;
    voteCount: number;
    approvalRate: number;
}

// Geri bildirim arayüzü
export interface Feedback {
    id: string;
    userId: string;
    mealTime: MealTime;
    category: string;
    mealName: string;
    comment: string;
    likes: number;
    dislikes: number;
    timeAgo: string;
}

// Takvim günü arayüzü
export interface CalendarDay {
    day: number;
    satisfaction: 'positive' | 'neutral' | 'negative' | null;
}

// Türkçe gün isimleri
export const turkishDays = {
    monday: { full: 'Pazartesi', short: 'Pzt' },
    tuesday: { full: 'Salı', short: 'Sal' },
    wednesday: { full: 'Çarşamba', short: 'Çar' },
    thursday: { full: 'Perşembe', short: 'Per' },
    friday: { full: 'Cuma', short: 'Cum' },
    saturday: { full: 'Cumartesi', short: 'Cmt' },
    sunday: { full: 'Pazar', short: 'Paz' },
};

// Türkçe ay isimleri
export const turkishMonths = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

// Servis saatleri
export const serviceHours = {
    birinciOgretimOgle: '11:30 - 14:00',
    ikinciOgretimAksam: '16:00 - 17:30'
};

// Üniversite bilgisi
export const universityInfo = {
    name: 'Bandırma Onyedi Eylül Üniversitesi',
    year: 2026,
    month: 'Şubat',
    allergyNote: 'Yemeklerimiz alerjiye neden olan (Gluten, laktoz vb...) belirli madde veya ürünleri içermektedir.'
};

// Yemek türünü belirleyen yardımcı fonksiyon
const getMealType = (name: string): MealType => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('çorba')) return 'soup';
    if (lowerName.includes('salata') || lowerName.includes('turşu') || lowerName.includes('cacık') || lowerName.includes('tarator')) return 'salad';
    if (lowerName.includes('ayran') || lowerName.includes('komposto')) return 'drink';
    if (lowerName.includes('tatlı') || lowerName.includes('meyve') || lowerName.includes('şekerpare') || lowerName.includes('kadayıf') || lowerName.includes('helva') || lowerName.includes('kemalpaşa') || lowerName.includes('prenses')) return 'dessert';
    if (lowerName.includes('pilav') || lowerName.includes('makarna') || lowerName.includes('spagetti') || lowerName.includes('erişte') || lowerName.includes('börek')) return 'sideDish';
    return 'mainDish';
};

// Şubat 2026 Haftalık Menü Verileri (Gerçek Veriler)
export const weeklyMenuData: DailyMenu[] = [
    {
        id: '1',
        date: '02.02.2026',
        dayName: 'Pazartesi',
        dayShort: 'Pzt',
        dayNumber: 2,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l1-1', name: 'Mercimek Çorba', type: 'soup', calories: 182 },
            { id: 'l1-2', name: 'Hasanpaşa Köfte', type: 'mainDish', calories: 269 },
            { id: 'l1-3', name: 'Taze Fasulye', type: 'mainDish', calories: 75, badges: ['V'] },
            { id: 'l1-4', name: 'Pesto Soslu Makarna', type: 'sideDish', calories: 410 },
            { id: 'l1-5', name: 'Mevsim Salata', type: 'salad', calories: 195, badges: ['V', 'GF'] },
        ],
        votes: { likes: 187, dislikes: 23 },
    },
    {
        id: '2',
        date: '03.02.2026',
        dayName: 'Salı',
        dayShort: 'Sal',
        dayNumber: 3,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l2-1', name: 'Tavuksuyu Çorba', type: 'soup', calories: 213 },
            { id: 'l2-2', name: 'Etli Nohut', type: 'mainDish', calories: 324 },
            { id: 'l2-3', name: 'Mantar Sote', type: 'mainDish', calories: 189, badges: ['V'] },
            { id: 'l2-4', name: 'Bulgur Pilavı', type: 'sideDish', calories: 305 },
            { id: 'l2-5', name: 'Turşu', type: 'salad', calories: 76, badges: ['V', 'GF'] },
        ],
        votes: { likes: 156, dislikes: 34 },
    },
    {
        id: '3',
        date: '04.02.2026',
        dayName: 'Çarşamba',
        dayShort: 'Çar',
        dayNumber: 4,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l3-1', name: 'Ezogelin Çorba', type: 'soup', calories: 195 },
            { id: 'l3-2', name: 'Pilav Üstü Tavuk', type: 'mainDish', calories: 315 },
            { id: 'l3-3', name: 'Ispanak', type: 'mainDish', calories: 145, badges: ['V', 'GF'] },
            { id: 'l3-4', name: 'Peynir Tatlısı', type: 'dessert', calories: 310 },
            { id: 'l3-5', name: 'Ayran', type: 'drink', calories: 90, badges: ['V', 'GF'] },
        ],
        votes: { likes: 245, dislikes: 12 },
    },
    {
        id: '4',
        date: '05.02.2026',
        dayName: 'Perşembe',
        dayShort: 'Per',
        dayNumber: 5,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l4-1', name: 'Naneli Yoğurt Çorba', type: 'soup', calories: 135 },
            { id: 'l4-2', name: 'Etli Mevsim Türlü', type: 'mainDish', calories: 305 },
            { id: 'l4-3', name: 'Yeşil Mercimek', type: 'mainDish', calories: 185, badges: ['V'] },
            { id: 'l4-4', name: 'Cevizli Erişte', type: 'sideDish', calories: 290 },
            { id: 'l4-5', name: 'Prenses Tatlısı', type: 'dessert', calories: 220 },
        ],
        votes: { likes: 178, dislikes: 28 },
    },
    {
        id: '5',
        date: '06.02.2026',
        dayName: 'Cuma',
        dayShort: 'Cum',
        dayNumber: 6,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l5-1', name: 'Tarhana Çorba', type: 'soup', calories: 110 },
            { id: 'l5-2', name: 'İzmir Köfte', type: 'mainDish', calories: 315 },
            { id: 'l5-3', name: 'Brüksel Lahana', type: 'mainDish', calories: 195, badges: ['V', 'GF'] },
            { id: 'l5-4', name: 'Pirinç Pilavı', type: 'sideDish', calories: 280 },
            { id: 'l5-5', name: 'Mevsim Meyve', type: 'dessert', calories: 115, badges: ['V', 'GF', 'VG'] },
        ],
        votes: { likes: 203, dislikes: 19 },
    },
    {
        id: '6',
        date: '09.02.2026',
        dayName: 'Pazartesi',
        dayShort: 'Pzt',
        dayNumber: 9,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l6-1', name: 'Maraş Çorba', type: 'soup', calories: 180 },
            { id: 'l6-2', name: 'Oba Piliç', type: 'mainDish', calories: 312 },
            { id: 'l6-3', name: 'Karnabahar', type: 'mainDish', calories: 190, badges: ['V', 'GF'] },
            { id: 'l6-4', name: 'Soslu Makarna', type: 'sideDish', calories: 330 },
            { id: 'l6-5', name: 'Mevsim Salata', type: 'salad', calories: 195, badges: ['V', 'GF'] },
        ],
        votes: { likes: 165, dislikes: 31 },
    },
    {
        id: '7',
        date: '10.02.2026',
        dayName: 'Salı',
        dayShort: 'Sal',
        dayNumber: 10,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l7-1', name: 'Sebze Çorba', type: 'soup', calories: 190, badges: ['V'] },
            { id: 'l7-2', name: 'Tavuk Döner / Patates Kızartması', type: 'mainDish', calories: 270 },
            { id: 'l7-3', name: 'Kapuska', type: 'mainDish', calories: 180, badges: ['V'] },
            { id: 'l7-4', name: 'Pirinç Pilavı', type: 'sideDish', calories: 280 },
            { id: 'l7-5', name: 'Ayran', type: 'drink', calories: 90, badges: ['V', 'GF'] },
        ],
        votes: { likes: 198, dislikes: 22 },
    },
    {
        id: '8',
        date: '11.02.2026',
        dayName: 'Çarşamba',
        dayShort: 'Çar',
        dayNumber: 11,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l8-1', name: 'Domates Çorba', type: 'soup', calories: 160 },
            { id: 'l8-2', name: 'Balık', type: 'mainDish', calories: 326, badges: ['GF'] },
            { id: 'l8-3', name: 'Brokoli', type: 'mainDish', calories: 195, badges: ['V', 'GF', 'VG'] },
            { id: 'l8-4', name: 'Bulgur Pilavı', type: 'sideDish', calories: 298 },
            { id: 'l8-5', name: 'Kemalpaşa Tatlısı', type: 'dessert', calories: 310 },
        ],
        votes: { likes: 221, dislikes: 15 },
    },
    {
        id: '9',
        date: '12.02.2026',
        dayName: 'Perşembe',
        dayShort: 'Per',
        dayNumber: 12,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l9-1', name: 'Mercimek Çorba', type: 'soup', calories: 182 },
            { id: 'l9-2', name: 'Mitite Köfte', type: 'mainDish', calories: 257 },
            { id: 'l9-3', name: 'Ispanak/Yoğurt', type: 'mainDish', calories: 205, badges: ['V', 'GF'] },
            { id: 'l9-4', name: 'Spagetti', type: 'sideDish', calories: 280 },
            { id: 'l9-5', name: 'Havuç Tarator', type: 'salad', calories: 168, badges: ['V'] },
        ],
        votes: { likes: 172, dislikes: 33 },
    },
    {
        id: '10',
        date: '13.02.2026',
        dayName: 'Cuma',
        dayShort: 'Cum',
        dayNumber: 13,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l10-1', name: 'Tavuksuyu Çorba', type: 'soup', calories: 213 },
            { id: 'l10-2', name: 'Etli Kuru Fasulye', type: 'mainDish', calories: 320 },
            { id: 'l10-3', name: 'Kereviz', type: 'mainDish', calories: 190, badges: ['V'] },
            { id: 'l10-4', name: 'Pirinç Pilavı', type: 'sideDish', calories: 280 },
            { id: 'l10-5', name: 'Cacık', type: 'salad', calories: 295, badges: ['V', 'GF'] },
        ],
        votes: { likes: 189, dislikes: 25 },
    },
    {
        id: '11',
        date: '16.02.2026',
        dayName: 'Pazartesi',
        dayShort: 'Pzt',
        dayNumber: 16,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l11-1', name: 'Mercimek Çorbası', type: 'soup', calories: 182 },
            { id: 'l11-2', name: 'Et Döner', type: 'mainDish', calories: 250 },
            { id: 'l11-3', name: 'Kapuska', type: 'mainDish', calories: 185, badges: ['V'] },
            { id: 'l11-4', name: 'Pirinç Pilavı', type: 'sideDish', calories: 280 },
            { id: 'l11-5', name: 'Ayran', type: 'drink', calories: 90, badges: ['V', 'GF'] },
        ],
        votes: { likes: 215, dislikes: 18 },
    },
    {
        id: '12',
        date: '17.02.2026',
        dayName: 'Salı',
        dayShort: 'Sal',
        dayNumber: 17,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l12-1', name: 'Düğün Çorba', type: 'soup', calories: 145 },
            { id: 'l12-2', name: 'Etli Nohut', type: 'mainDish', calories: 324 },
            { id: 'l12-3', name: 'Kereviz', type: 'mainDish', calories: 205, badges: ['V'] },
            { id: 'l12-4', name: 'Bulgur Pilavı', type: 'sideDish', calories: 298 },
            { id: 'l12-5', name: 'Turşu', type: 'salad', calories: 76, badges: ['V', 'GF'] },
        ],
        votes: { likes: 168, dislikes: 29 },
    },
    {
        id: '13',
        date: '18.02.2026',
        dayName: 'Çarşamba',
        dayShort: 'Çar',
        dayNumber: 18,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l13-1', name: 'Domates Çorba', type: 'soup', calories: 160 },
            { id: 'l13-2', name: 'Bezelyeli Tavuk', type: 'mainDish', calories: 258 },
            { id: 'l13-3', name: 'Karnabahar', type: 'mainDish', calories: 190, badges: ['V', 'GF'] },
            { id: 'l13-4', name: 'Makarna', type: 'sideDish', calories: 280 },
            { id: 'l13-5', name: 'Mevsim Meyve', type: 'dessert', calories: 115, badges: ['V', 'GF', 'VG'] },
        ],
        votes: { likes: 192, dislikes: 24 },
    },
    {
        id: '14',
        date: '19.02.2026',
        dayName: 'Perşembe',
        dayShort: 'Per',
        dayNumber: 19,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l14-1', name: 'Ezogelin Çorba', type: 'soup', calories: 195 },
            { id: 'l14-2', name: 'Kadınbudu Köfte', type: 'mainDish', calories: 372 },
            { id: 'l14-3', name: 'Ispanak/Yoğurt', type: 'mainDish', calories: 205, badges: ['V', 'GF'] },
            { id: 'l14-4', name: 'Puf Börek', type: 'sideDish', calories: 290 },
            { id: 'l14-5', name: 'Komposto', type: 'drink', calories: 90, badges: ['V', 'GF', 'VG'] },
        ],
        votes: { likes: 201, dislikes: 21 },
    },
    {
        id: '15',
        date: '20.02.2026',
        dayName: 'Cuma',
        dayShort: 'Cum',
        dayNumber: 20,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l15-1', name: 'Gendime Çorba', type: 'soup', calories: 110 },
            { id: 'l15-2', name: 'Kremalı Mantarlı Tavuk', type: 'mainDish', calories: 467 },
            { id: 'l15-3', name: 'Brokoli', type: 'mainDish', calories: 170, badges: ['V', 'GF', 'VG'] },
            { id: 'l15-4', name: 'Pirinç Pilavı', type: 'sideDish', calories: 280 },
            { id: 'l15-5', name: 'Süt Helvası', type: 'dessert', calories: 268 },
        ],
        votes: { likes: 234, dislikes: 14 },
    },
    {
        id: '16',
        date: '23.02.2026',
        dayName: 'Pazartesi',
        dayShort: 'Pzt',
        dayNumber: 23,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l16-1', name: 'Kremalı Domates Çorba', type: 'soup', calories: 280 },
            { id: 'l16-2', name: 'Orman Kebabı', type: 'mainDish', calories: 320 },
            { id: 'l16-3', name: 'Mevsim Türlü', type: 'mainDish', calories: 180, badges: ['V'] },
            { id: 'l16-4', name: 'Pirinç Pilavı', type: 'sideDish', calories: 280 },
            { id: 'l16-5', name: 'Şekerpare', type: 'dessert', calories: 272 },
        ],
        votes: { likes: 208, dislikes: 20 },
    },
    {
        id: '17',
        date: '24.02.2026',
        dayName: 'Salı',
        dayShort: 'Sal',
        dayNumber: 24,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l17-1', name: 'Ezogelin Çorba', type: 'soup', calories: 195 },
            { id: 'l17-2', name: 'Çıtır Tavuk', type: 'mainDish', calories: 324 },
            { id: 'l17-3', name: 'Pırasa', type: 'mainDish', calories: 61, badges: ['V'] },
            { id: 'l17-4', name: 'Lorlu Maydanozlu Makarna', type: 'sideDish', calories: 290 },
            { id: 'l17-5', name: 'Mevsim Salata', type: 'salad', calories: 195, badges: ['V', 'GF'] },
        ],
        votes: { likes: 195, dislikes: 26 },
    },
    {
        id: '18',
        date: '25.02.2026',
        dayName: 'Çarşamba',
        dayShort: 'Çar',
        dayNumber: 25,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l18-1', name: 'Tavuksuyu Çorbası', type: 'soup', calories: 213 },
            { id: 'l18-2', name: 'Etli Kuru Fasulye', type: 'mainDish', calories: 379 },
            { id: 'l18-3', name: 'Mantar Sote', type: 'mainDish', calories: 189, badges: ['V'] },
            { id: 'l18-4', name: 'Pirinç Pilavı', type: 'sideDish', calories: 280 },
            { id: 'l18-5', name: 'Ayran', type: 'drink', calories: 90, badges: ['V', 'GF'] },
        ],
        votes: { likes: 223, dislikes: 16 },
    },
    {
        id: '19',
        date: '26.02.2026',
        dayName: 'Perşembe',
        dayShort: 'Per',
        dayNumber: 26,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l19-1', name: 'Mercimek Çorba', type: 'soup', calories: 182 },
            { id: 'l19-2', name: 'Şinitzel', type: 'mainDish', calories: 286 },
            { id: 'l19-3', name: 'Bezelye', type: 'mainDish', calories: 90, badges: ['V', 'GF'] },
            { id: 'l19-4', name: 'Arpa Şehriye Pilavı', type: 'sideDish', calories: 280 },
            { id: 'l19-5', name: 'Sütlü Kadayıf Tatlısı', type: 'dessert', calories: 180 },
        ],
        votes: { likes: 187, dislikes: 27 },
    },
    {
        id: '20',
        date: '27.02.2026',
        dayName: 'Cuma',
        dayShort: 'Cum',
        dayNumber: 27,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'l20-1', name: 'Kaşarlı Domates Çorba', type: 'soup', calories: 290 },
            { id: 'l20-2', name: 'İçli Köfte/Püreli', type: 'mainDish', calories: 350 },
            { id: 'l20-3', name: 'Taze Fasulye', type: 'mainDish', calories: 210, badges: ['V'] },
            { id: 'l20-4', name: 'Soslu Makarna', type: 'sideDish', calories: 390 },
            { id: 'l20-5', name: 'Yoğurt', type: 'drink', calories: 90, badges: ['V', 'GF'] },
        ],
        votes: { likes: 211, dislikes: 19 },
    },
];

// Bugünün menüsünü getir
export const getTodayMenu = (): DailyMenu | undefined => {
    const today = new Date();
    const day = today.getDate();
    return weeklyMenuData.find(menu => menu.dayNumber === day);
};

// Bu haftanın menüsünü getir
export const getThisWeekMenu = (): DailyMenu[] => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const endOfWeek = startOfWeek + 4; // Pazartesi-Cuma

    return weeklyMenuData.filter(menu =>
        menu.dayNumber >= startOfWeek && menu.dayNumber <= endOfWeek
    );
};

// Popüler yemekler verileri (gerçek menüden)
export const popularMealsData: PopularMeal[] = [
    {
        id: '1',
        name: 'Kremalı Mantarlı Tavuk',
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200',
        rating: 4.8,
        voteCount: 234,
        approvalRate: 94,
    },
    {
        id: '2',
        name: 'Orman Kebabı',
        image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200',
        rating: 4.6,
        voteCount: 208,
        approvalRate: 91,
    },
    {
        id: '3',
        name: 'İzmir Köfte',
        image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200',
        rating: 4.5,
        voteCount: 203,
        approvalRate: 91,
    },
    {
        id: '4',
        name: 'Balık',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200',
        rating: 4.4,
        voteCount: 221,
        approvalRate: 94,
    },
    {
        id: '5',
        name: 'Et Döner',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200',
        rating: 4.3,
        voteCount: 215,
        approvalRate: 92,
    },
];

// Geri bildirim verileri
export const feedbackData: Feedback[] = [
    {
        id: '1',
        userId: 'user1',
        mealTime: 'lunch',
        category: 'ANA YEMEK',
        mealName: 'Kremalı Mantarlı Tavuk',
        comment: 'Harika lezzet! Mantarlar taze ve sos mükemmeldi. Kesinlikle tekrar yemek isterim.',
        likes: 45,
        dislikes: 2,
        timeAgo: '1s önce',
    },
    {
        id: '2',
        userId: 'user2',
        mealTime: 'lunch',
        category: 'ÇORBA',
        mealName: 'Ezogelin Çorba',
        comment: 'Her zamanki gibi güzel. Biraz daha sıcak servis edilebilir.',
        likes: 28,
        dislikes: 1,
        timeAgo: '2s önce',
    },
    {
        id: '3',
        userId: 'user3',
        mealTime: 'lunch',
        category: 'TATLI',
        mealName: 'Şekerpare',
        comment: 'Şerbeti tam kıvamındaydı, çok beğendim!',
        likes: 32,
        dislikes: 3,
        timeAgo: '3s önce',
    },
    {
        id: '4',
        userId: 'user4',
        mealTime: 'lunch',
        category: 'ANA YEMEK',
        mealName: 'Hasanpaşa Köfte',
        comment: 'Köfteler biraz kuru geldi ama patates püresi güzeldi.',
        likes: 15,
        dislikes: 4,
        timeAgo: '5s önce',
    },
];

// Şubat 2026 takvim verileri (memnuniyet haritası için)
export const calendarData: CalendarDay[] = [
    { day: 1, satisfaction: null }, // Pazar
    { day: 2, satisfaction: 'positive' },
    { day: 3, satisfaction: 'positive' },
    { day: 4, satisfaction: 'positive' },
    { day: 5, satisfaction: 'positive' },
    { day: 6, satisfaction: 'positive' },
    { day: 7, satisfaction: null }, // Cumartesi
    { day: 8, satisfaction: null }, // Pazar
    { day: 9, satisfaction: 'positive' },
    { day: 10, satisfaction: 'positive' },
    { day: 11, satisfaction: 'positive' },
    { day: 12, satisfaction: 'neutral' },
    { day: 13, satisfaction: 'positive' },
    { day: 14, satisfaction: null }, // Cumartesi
    { day: 15, satisfaction: null }, // Pazar
    { day: 16, satisfaction: 'positive' },
    { day: 17, satisfaction: 'neutral' },
    { day: 18, satisfaction: 'positive' },
    { day: 19, satisfaction: 'positive' },
    { day: 20, satisfaction: 'positive' },
    { day: 21, satisfaction: null }, // Cumartesi
    { day: 22, satisfaction: null }, // Pazar
    { day: 23, satisfaction: 'positive' },
    { day: 24, satisfaction: 'positive' },
    { day: 25, satisfaction: 'positive' },
    { day: 26, satisfaction: 'positive' },
    { day: 27, satisfaction: 'positive' },
    { day: 28, satisfaction: null }, // Cumartesi
];

// Yemekhane yoğunluk durumu
export const densityData = {
    current: 'medium' as DensityLevel,
    lastUpdated: '5 dakika önce',
    percentFull: 65,
};

// Günlük memnuniyet verileri
export const dailySatisfactionData = {
    percentage: 82,
    totalVotes: 287,
    trend: 'up' as 'up' | 'down' | 'stable',
};

// Ayın favorisi
export const monthlyFavorite = {
    date: '20 Şubat',
    meals: 'Kremalı Mantarlı Tavuk, Pirinç Pilavı, Brokoli, Süt Helvası',
    approvalRate: 94,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200',
};
