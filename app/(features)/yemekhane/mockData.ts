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
    month: 'Mayıs',
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
        date: '01.05.2026',
        dayName: 'Cuma',
        dayShort: 'Cum',
        dayNumber: 1,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '2',
        date: '04.05.2026',
        dayName: 'Pazartesi',
        dayShort: 'Pzt',
        dayNumber: 4,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm2-1', name: 'MERCİMEK ÇORBA', type: 'soup', calories: 130 },
            { id: 'm2-2', name: 'TAVUKLU PİLAV', type: 'mainDish', calories: 290 },
            { id: 'm2-3', name: 'MEVSİM TÜRLÜ', type: 'mainDish', calories: 120 },
            { id: 'm2-4', name: 'KEMALPAŞA', type: 'dessert', calories: 330 },
            { id: 'm2-5', name: 'AYRAN', type: 'drink', calories: 70 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '3',
        date: '05.05.2026',
        dayName: 'Salı',
        dayShort: 'Sal',
        dayNumber: 5,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm3-1', name: 'MANTAR ÇORBA', type: 'soup', calories: 165 },
            { id: 'm3-2', name: 'SEB. ET SOTE/PAT.PÜR.', type: 'mainDish', calories: 285 },
            { id: 'm3-3', name: 'TAZE FASÜLYE', type: 'mainDish', calories: 175 },
            { id: 'm3-4', name: 'BULGUR PİLAVI', type: 'sideDish', calories: 240 },
            { id: 'm3-5', name: 'TULUMBA', type: 'dessert', calories: 295 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '4',
        date: '06.05.2026',
        dayName: 'Çarşamba',
        dayShort: 'Çar',
        dayNumber: 6,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm4-1', name: 'EZOGELİN ÇORBA', type: 'soup', calories: 140 },
            { id: 'm4-2', name: 'BİBER DOLMA/Y.GRN', type: 'mainDish', calories: 220 },
            { id: 'm4-3', name: 'MANTAR SOTE', type: 'mainDish', calories: 280 },
            { id: 'm4-4', name: 'BÖREK', type: 'sideDish', calories: 300 },
            { id: 'm4-5', name: 'KOMPOSTO', type: 'drink', calories: 175 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '5',
        date: '07.05.2026',
        dayName: 'Perşembe',
        dayShort: 'Per',
        dayNumber: 7,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm5-1', name: 'TAVUK SUYU ÇORBA', type: 'soup', calories: 145 },
            { id: 'm5-2', name: 'ETLİ KURU FASÜLYE', type: 'mainDish', calories: 310 },
            { id: 'm5-3', name: 'BEZELYE', type: 'mainDish', calories: 190 },
            { id: 'm5-4', name: 'PİRİNÇ PİLAVI', type: 'sideDish', calories: 280 },
            { id: 'm5-5', name: 'CACIK', type: 'salad', calories: 80 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '6',
        date: '08.05.2026',
        dayName: 'Cuma',
        dayShort: 'Cum',
        dayNumber: 8,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm6-1', name: 'DOMATES ÇORBA', type: 'soup', calories: 140 },
            { id: 'm6-2', name: 'CORDON BLUE', type: 'mainDish', calories: 320 },
            { id: 'm6-3', name: 'KARNABAHAR', type: 'mainDish', calories: 150 },
            { id: 'm6-4', name: 'ERİŞTE', type: 'sideDish', calories: 300 },
            { id: 'm6-5', name: 'SÜT HELVASI', type: 'dessert', calories: 250 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '7',
        date: '11.05.2026',
        dayName: 'Pazartesi',
        dayShort: 'Pzt',
        dayNumber: 11,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm7-1', name: 'SEBZE ÇORBA', type: 'soup', calories: 130 },
            { id: 'm7-2', name: 'FIRIN PİLİÇ/PÜRE', type: 'mainDish', calories: 230 },
            { id: 'm7-3', name: 'YEŞİL MERCİMEK', type: 'mainDish', calories: 200 },
            { id: 'm7-4', name: 'ARPA ŞEH.PİLAVI', type: 'sideDish', calories: 280 },
            { id: 'm7-5', name: 'AYRAN', type: 'drink', calories: 70 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '8',
        date: '12.05.2026',
        dayName: 'Salı',
        dayShort: 'Sal',
        dayNumber: 12,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm8-1', name: 'MERCİMEK ÇORBA', type: 'soup', calories: 140 },
            { id: 'm8-2', name: 'PATLICAN MUSAKKA', type: 'mainDish', calories: 360 },
            { id: 'm8-3', name: 'KEREVİZ', type: 'mainDish', calories: 190 },
            { id: 'm8-4', name: 'PİRİNÇ PİLAVI', type: 'sideDish', calories: 280 },
            { id: 'm8-5', name: 'CACIK', type: 'salad', calories: 80 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '9',
        date: '13.05.2026',
        dayName: 'Çarşamba',
        dayShort: 'Çar',
        dayNumber: 13,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm9-1', name: 'EZOGELİN ÇORBA', type: 'soup', calories: 140 },
            { id: 'm9-2', name: 'İSKENDER', type: 'mainDish', calories: 400 },
            { id: 'm9-3', name: 'PIRASA', type: 'mainDish', calories: 120 },
            { id: 'm9-4', name: 'BAKLAVA', type: 'dessert', calories: 350 },
            { id: 'm9-5', name: 'MEVSİM SALATA', type: 'salad', calories: 70 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '10',
        date: '14.05.2026',
        dayName: 'Perşembe',
        dayShort: 'Per',
        dayNumber: 14,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm10-1', name: 'YOĞURT ÇORBA', type: 'soup', calories: 120 },
            { id: 'm10-2', name: 'HARPUT KÖFTE', type: 'mainDish', calories: 290 },
            { id: 'm10-3', name: 'BROKOLİ', type: 'mainDish', calories: 120 },
            { id: 'm10-4', name: 'MAKARNA', type: 'sideDish', calories: 300 },
            { id: 'm10-5', name: 'MEVSİM MEYVE', type: 'dessert', calories: 70 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '11',
        date: '15.05.2026',
        dayName: 'Cuma',
        dayShort: 'Cum',
        dayNumber: 15,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm11-1', name: 'KRE. MANTAR ÇORBA', type: 'soup', calories: 155 },
            { id: 'm11-2', name: 'ETLİ NOHUT', type: 'mainDish', calories: 290 },
            { id: 'm11-3', name: 'FIRIN SEBZE', type: 'mainDish', calories: 100 },
            { id: 'm11-4', name: 'PİRİNÇ PİLAVI', type: 'sideDish', calories: 280 },
            { id: 'm11-5', name: 'TURŞU', type: 'salad', calories: 80 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '12',
        date: '18.05.2026',
        dayName: 'Pazartesi',
        dayShort: 'Pzt',
        dayNumber: 18,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm12-1', name: 'MERCİMEK ÇORBA', type: 'soup', calories: 140 },
            { id: 'm12-2', name: 'ŞİNİTZEL/PÜRE', type: 'mainDish', calories: 320 },
            { id: 'm12-3', name: 'TAZE FASÜLYE', type: 'mainDish', calories: 175 },
            { id: 'm12-4', name: 'MAKARNA', type: 'sideDish', calories: 300 },
            { id: 'm12-5', name: 'ŞEKERPARE', type: 'dessert', calories: 330 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '13',
        date: '19.05.2026',
        dayName: 'Salı',
        dayShort: 'Sal',
        dayNumber: 19,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '14',
        date: '20.05.2026',
        dayName: 'Çarşamba',
        dayShort: 'Çar',
        dayNumber: 20,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm14-1', name: 'DOMATES ÇORBA', type: 'soup', calories: 140 },
            { id: 'm14-2', name: 'TAVUK DÖNER/P.KIZ.', type: 'mainDish', calories: 315 },
            { id: 'm14-3', name: 'BEZELYE', type: 'mainDish', calories: 190 },
            { id: 'm14-4', name: 'PİRİNÇ PİLAVI', type: 'sideDish', calories: 280 },
            { id: 'm14-5', name: 'AYRAN', type: 'drink', calories: 70 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '15',
        date: '21.05.2026',
        dayName: 'Perşembe',
        dayShort: 'Per',
        dayNumber: 21,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm15-1', name: 'EZOGELİN ÇORBA', type: 'soup', calories: 140 },
            { id: 'm15-2', name: 'ORMAN KEBABI', type: 'mainDish', calories: 330 },
            { id: 'm15-3', name: 'YEŞİL MERCİMEK', type: 'mainDish', calories: 200 },
            { id: 'm15-4', name: 'MAKARNA', type: 'sideDish', calories: 300 },
            { id: 'm15-5', name: 'AŞURE', type: 'dessert', calories: 350 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '16',
        date: '22.05.2026',
        dayName: 'Cuma',
        dayShort: 'Cum',
        dayNumber: 22,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm16-1', name: 'SEBZE ÇORBA', type: 'soup', calories: 130 },
            { id: 'm16-2', name: 'ETLİ KURU FASÜLYE', type: 'mainDish', calories: 310 },
            { id: 'm16-3', name: 'BROKOLİ', type: 'mainDish', calories: 130 },
            { id: 'm16-4', name: 'PİRİNÇ PİLAVI', type: 'sideDish', calories: 280 },
            { id: 'm16-5', name: 'CACIK', type: 'salad', calories: 80 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '17',
        date: '25.05.2026',
        dayName: 'Pazartesi',
        dayShort: 'Pzt',
        dayNumber: 25,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [
            { id: 'm17-1', name: 'TARHANA ÇORBA', type: 'soup', calories: 140 },
            { id: 'm17-2', name: 'KADIN BUDU KÖFTE/PÜRE', type: 'mainDish', calories: 330 },
            { id: 'm17-3', name: 'PIRASA', type: 'mainDish', calories: 120 },
            { id: 'm17-4', name: 'MAKARNA', type: 'sideDish', calories: 300 },
            { id: 'm17-5', name: 'MEVSİM MEYVE', type: 'dessert', calories: 70 },
        ],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '18',
        date: '26.05.2026',
        dayName: 'Salı',
        dayShort: 'Sal',
        dayNumber: 26,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '19',
        date: '27.05.2026',
        dayName: 'Çarşamba',
        dayShort: 'Çar',
        dayNumber: 27,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '20',
        date: '28.05.2026',
        dayName: 'Perşembe',
        dayShort: 'Per',
        dayNumber: 28,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [],
        votes: { likes: 0, dislikes: 0 },
    },
    {
        id: '21',
        date: '29.05.2026',
        dayName: 'Cuma',
        dayShort: 'Cum',
        dayNumber: 29,
        lunchTime: serviceHours.birinciOgretimOgle,
        dinnerTime: serviceHours.ikinciOgretimAksam,
        meals: [],
        votes: { likes: 0, dislikes: 0 },
    },
];

// Bugünün menüsünü getir
const toShortDate = (value: Date) => {
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}.${value.getFullYear()}`;
};

export const getTodayMenu = (): DailyMenu | undefined => {
    const today = toShortDate(new Date());
    return weeklyMenuData.find(menu => menu.date === today);
};

// Bu haftanın menüsünü getir
export const getThisWeekMenu = (): DailyMenu[] => {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    return weeklyMenuData.filter((menu) => {
        const [day, month, year] = menu.date.split('.').map(Number);
        const date = new Date(year, month - 1, day);
        return date >= monday && date <= friday;
    });
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
export const calendarData: CalendarDay[] = Array.from({ length: 31 }, (_, index) => ({
    day: index + 1,
    satisfaction: null,
}));

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
    date: '08 Mayıs',
    meals: 'DOMATES ÇORBA, CORDON BLUE, KARNABAHAR, ERİŞTE, SÜT HELVASI',
    approvalRate: 92,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200',
};
