import type {
    AcademicTerm,
    CafeteriaMenuDay,
    CafeteriaMenuItem,
    CafeteriaMenuPeriod,
    CourseCatalogItem,
    CourseOffering,
    Department,
    StudentProfile,
} from './domain';

interface FallbackDataset {
    departments: Department[];
    activeTerm: AcademicTerm;
    studentProfile: StudentProfile;
    courseCatalog: CourseCatalogItem[];
    officialOfferings: CourseOffering[];
    cafeteriaPeriod: CafeteriaMenuPeriod;
}

type CourseSeed = {
    code: string;
    name: string;
    instructor: string;
    room: string;
    slots: Array<[number, number, number]>;
};

const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const SLOT_TIMES = [
    ['08:45', '09:30'],
    ['09:35', '10:20'],
    ['10:25', '11:10'],
    ['11:15', '12:00'],
    ['12:50', '13:35'],
    ['13:40', '14:25'],
    ['14:30', '15:15'],
    ['15:20', '16:05'],
    ['16:10', '16:55'],
] as const;

function toIsoDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

function getSlotRange(startSlot: number, endSlot: number) {
    return {
        startTime: SLOT_TIMES[startSlot][0],
        endTime: SLOT_TIMES[endSlot][1],
    };
}

const departments: Department[] = [
    {
        id: 'dep-ybs',
        facultyName: 'Ömer Seyfettin Uygulamalı Bilimler Fakültesi',
        departmentName: 'Yönetim Bilişim Sistemleri',
        code: 'YBS',
        isActive: true,
    },
    {
        id: 'dep-ceng',
        facultyName: 'Mühendislik ve Doğa Bilimleri Fakültesi',
        departmentName: 'Bilgisayar Mühendisliği',
        code: 'CENG',
        isActive: true,
    },
];

const courseSeeds: Record<string, Record<number, CourseSeed[]>> = {
    YBS: {
        1: [
            { code: 'YBS101', name: 'İnsan Etkileşimi Bilgisayar', instructor: 'Doç. Dr. Cemalettin HATİPOĞLU', room: 'AMFİ-3', slots: [[0, 0, 2]] },
            { code: 'YBS102', name: 'Bilgisayar Ağları ve Yönetimi', instructor: 'Öğr. Gör. Ömer DOĞAN', room: 'D-102', slots: [[1, 0, 2]] },
            { code: 'YBS103', name: 'Yabancı Dil (İngilizce) II', instructor: 'Öğr. Gör. Pınar AKPINAR', room: 'Uzaktan', slots: [[2, 0, 2]] },
            { code: 'YBS104', name: 'Veri Yapıları', instructor: 'Dr. Öğr. Üyesi Alican DOĞAN', room: 'AMFİ-3', slots: [[3, 0, 2]] },
            { code: 'YBS105', name: 'Türk Dili II', instructor: 'Öğr. Gör. Önder POTUR', room: 'Uzaktan', slots: [[3, 3, 4]] },
            { code: 'YBS106', name: 'Atatürk İlkeleri ve İnkılap Tarihi II', instructor: 'Öğr. Gör. Onur AKDOĞAN', room: 'Uzaktan', slots: [[1, 4, 5]] },
            { code: 'YBS107', name: 'Yönetim ve Organizasyon', instructor: 'Prof. Dr. Tarhan OKAN', room: 'G-208', slots: [[2, 3, 5]] },
            { code: 'YBS108', name: 'Ofis Programları', instructor: 'Öğr. Gör. Sedat ERSÖZ', room: 'G-201', slots: [[1, 6, 8]] },
            { code: 'YBS109', name: 'Matematik II', instructor: 'Dr. Öğr. Üyesi Muhammet KUTLU', room: 'AMFİ-3', slots: [[2, 6, 8]] },
        ],
        2: [
            { code: 'YBS201', name: 'Süreç Analizi', instructor: 'Doç. Dr. Cemalettin HATİPOĞLU', room: 'AMFİ-3', slots: [[1, 0, 2]] },
            { code: 'YBS202', name: 'Üretim Yönetimi', instructor: 'Dr. Öğr. Üyesi İnci Merve ALTAN', room: 'G-205', slots: [[3, 0, 2]] },
            { code: 'YBS203', name: 'İşletim Sistemleri Yönetimi', instructor: 'Öğr. Gör. Ömer DOĞAN', room: 'AMFİ-4', slots: [[4, 1, 3]] },
            { code: 'YBS204', name: 'Veri Tabanı Programlama', instructor: 'Dr. Öğr. Üyesi Alican DOĞAN', room: 'G-201', slots: [[3, 3, 5]] },
            { code: 'YBS205', name: 'Genel Ekonomi', instructor: 'Dr. Öğr. Üyesi Hüseyin GÜVENOĞLU', room: 'G-206', slots: [[0, 6, 8]] },
            { code: 'YBS206', name: 'Bilişim Hukuku ve Etiği', instructor: 'Öğr. Gör. Betül Gül ŞARSEL', room: 'G-207', slots: [[1, 6, 8]] },
            { code: 'YBS207', name: 'Görsel Programlama', instructor: 'Dr. Öğr. Üyesi Alican DOĞAN', room: 'G-201', slots: [[2, 6, 8]] },
            { code: 'YBS208', name: 'Python Programlama', instructor: 'Dr. Öğr. Üyesi Zeynep ÖZER', room: 'Merkezi Bilgisayar Lab (Zemin Kat)', slots: [[3, 6, 8]] },
            { code: 'YBS209', name: 'Mesleki İngilizce', instructor: 'Öğr. Gör. Sevcan ALPER', room: 'AMFİ-4', slots: [[4, 6, 8]] },
        ],
        3: [
            { code: 'YBS301', name: 'Örgütsel Davranış', instructor: 'Prof. Dr. Tarhan OKAN', room: 'G-207', slots: [[1, 0, 2]] },
            { code: 'YBS302', name: 'Girişimcilik', instructor: 'Doç. Dr. Sertaç ERCAN', room: 'G-206', slots: [[2, 0, 2]] },
            { code: 'YBS303', name: 'Mobil Programlama', instructor: 'Öğr. Gör. Salih KİRAZ', room: 'G-201', slots: [[0, 3, 5]] },
            { code: 'YBS304', name: 'Web Tasarımı ve İnternet Programlama II', instructor: 'Doç. Dr. Ufuk ÇELİK', room: 'AMFİ-3', slots: [[2, 3, 5]] },
            { code: 'YBS305', name: 'Makine Öğrenmesi', instructor: 'Dr. Öğr. Üyesi Zeynep ÖZER', room: 'Merkezi Bilgisayar Lab.', slots: [[1, 6, 8]] },
            { code: 'YBS306', name: 'Üniversite Seçmeli Ders', instructor: 'Üniversite Seçmeli Ders', room: 'Uzaktan', slots: [[2, 6, 8]] },
            { code: 'YBS307', name: 'Sektör Buluşmaları', instructor: 'Prof. Dr. Özer YILMAZ', room: 'AMFİ-3', slots: [[3, 6, 8]] },
        ],
        4: [
            { code: 'YBS401', name: 'İş ve Sosyal Güvenlik Hukuku', instructor: 'Öğr. Gör. Nilüfer AYHAN', room: 'Z-9', slots: [[0, 3, 5]] },
            { code: 'YBS402', name: 'Bilişim Proje Yön.', instructor: 'Doç. Dr. Ufuk ÇELİK', room: 'G-208', slots: [[3, 3, 5]] },
            { code: 'YBS403', name: 'E-Ticaret ve E-Devlet', instructor: 'Öğr. Gör. Sedat ERSÖZ', room: 'Merkezi Derslik MF-106', slots: [[0, 6, 8]] },
            { code: 'YBS404', name: 'Örgütsel Performans', instructor: 'Dr. Öğr. Üyesi Pınar KURT', room: 'G-206', slots: [[1, 6, 8]] },
            { code: 'YBS405', name: 'Hedef Pazar Planlama', instructor: 'Prof. Dr. Özer YILMAZ', room: 'G-204', slots: [[2, 6, 8]] },
            { code: 'YBS406', name: 'Kurumsal Kaynak Planlama', instructor: 'Öğr. Gör. Gülçin ÇÖMEZ', room: 'G-206', slots: [[3, 6, 8]] },
            { code: 'YBS407', name: 'İnsan Kaynakları Yön.', instructor: 'Dr. Öğr. Üyesi Volkan AKGÜL', room: 'G-206', slots: [[4, 6, 8]] },
        ],
    },
    CENG: {
        1: [
            { code: 'MTI1221', name: 'Mathematics I', instructor: 'Prof. Dr. Mehmet Ali AKINLAR', room: 'Derslik 9', slots: [[0, 0, 3]] },
            { code: 'BMI1121', name: 'Linear Algebra', instructor: 'Prof. Dr. Mehmet Ali AKINLAR', room: 'Derslik 9', slots: [[0, 5, 7]] },
            { code: 'KAR1101', name: 'Career Planning', instructor: 'Doç. Dr. Armağan TÜRK', room: 'UE', slots: [[0, 8, 8]] },
            { code: 'BMI1122', name: 'Introduction to Computer Engineering', instructor: 'Dr. Öğr. Üyesi Alpay DORUK', room: 'Derslik 7', slots: [[1, 2, 3]] },
            { code: 'FZI1101', name: 'Physics I', instructor: 'Doç. Dr. Bülent BÜYÜK', room: 'TIP 11 / FİZİK LAB', slots: [[1, 4, 7], [2, 2, 3]] },
            { code: 'TDI1101', name: 'Turkish Language I', instructor: 'Öğr. Gör. Dr. Banu DÜNDAR', room: 'UE', slots: [[1, 8, 8]] },
            { code: 'BMI1123', name: 'Introduction to Programming', instructor: 'Doç. Dr. Selahattin KOŞUNALP', room: 'TIP 11 / MDBF LAB 1', slots: [[2, 4, 8]] },
            { code: 'AIT1201', name: "Atatürk's Principles and History of Revolutions II", instructor: 'Öğr. Gör. Onur AKDOĞAN', room: 'UE', slots: [[4, 8, 8]] },
        ],
        2: [
            { code: 'BMI2121', name: 'Probability and Statistics', instructor: 'Dr. Öğr. Üyesi Özlem ORHAN', room: 'Derslik 7', slots: [[2, 1, 3]] },
            { code: 'BMI2131', name: 'Professional Foreign Language', instructor: 'Öğr. Gör. Büşra Öncü ÇAKIR', room: 'Derslik 8', slots: [[3, 1, 3]] },
            { code: 'BMI2122', name: 'Electronics', instructor: 'Dr. Öğr. Üyesi Semih KORKMAZ', room: 'TIP 10 / Elektronik-LAB', slots: [[0, 4, 6], [2, 7, 8]] },
            { code: 'BMI2123', name: 'Data Structures', instructor: 'Dr. Öğr. Üyesi Arzum KARATAŞ', room: 'Derslik 7', slots: [[1, 4, 7]] },
            { code: 'BMI2120', name: 'Differential Equations', instructor: 'Prof. Dr. Hüseyin IŞIK', room: 'Derslik 8', slots: [[2, 4, 6]] },
            { code: 'BMI2124', name: 'Advanced Programming', instructor: 'Dr. Öğr. Üyesi Alpay DORUK', room: 'Derslik 8 / MDBF LAB1', slots: [[3, 4, 8]] },
        ],
        3: [
            { code: 'BMI3123', name: 'Data Communication', instructor: 'Dr. Öğr. Üyesi Semih KORKMAZ', room: 'Tıp 11', slots: [[0, 1, 3]] },
            { code: 'BMI3121', name: 'Microprocessor Systems', instructor: 'Doç. Dr. Mehmet Akif ÇİFTÇİ', room: 'Tıp 11', slots: [[1, 1, 3]] },
            { code: 'BMI3121L', name: 'Microprocessor Systems-LAB', instructor: 'Doç. Dr. Mehmet Akif ÇİFTÇİ', room: 'MDBF LAB 1', slots: [[4, 2, 3]] },
            { code: 'BMI3125', name: 'Computer Networks', instructor: 'Doç. Dr. Selahattin KOŞUNALP', room: 'Derslik 2', slots: [[2, 1, 3]] },
            { code: 'BMI3127', name: 'Computer Operating Systems', instructor: 'Dr. Öğr. Üyesi Alpay DORUK', room: 'Derslik 7', slots: [[3, 1, 3]] },
            { code: 'BMI3144', name: 'Visual Programming', instructor: 'Doç. Dr. Mehmet Akif ÇİFTÇİ', room: 'MDBF LAB 1', slots: [[1, 4, 6]] },
            { code: 'ISG3101', name: 'Occupational Health and Safety I', instructor: 'Dr. Öğr. Üyesi Kübra ŞAR', room: 'Derslik 2', slots: [[2, 4, 5]] },
            { code: 'BMI3129', name: 'Numerical Analysis', instructor: 'Dr. Öğr. Üyesi Özlem ORHAN', room: 'Derslik 2', slots: [[3, 4, 6]] },
            { code: 'BMI3131', name: 'Robotics', instructor: 'Dr. Öğr. Üyesi Cemil KÖZKURT', room: 'Derslik 8', slots: [[4, 6, 8]] },
        ],
        4: [
            { code: 'BMI4121', name: 'Image Processing', instructor: 'Doç. Dr. Mehmet Akif ÇİFTÇİ', room: 'MDBF LAB 1', slots: [[0, 1, 3]] },
            { code: 'BMI4123', name: 'Data Mining', instructor: 'Dr. Öğr. Üyesi Bahar MİLANİ', room: 'Derslik 8', slots: [[1, 1, 3]] },
            { code: 'BMI4125', name: 'Compiler Design', instructor: 'Dr. Öğr. Üyesi Muhammed MİLANİ', room: 'Tıp 11', slots: [[2, 1, 3]] },
            { code: 'BMI4127', name: 'Artificial Intelligence', instructor: 'Doç. Dr. Mehmet Akif ÇİFTÇİ', room: 'Derslik 1', slots: [[0, 4, 6]] },
            { code: 'BMI4129', name: 'Enterpreneurship', instructor: 'Prof. Dr. Özgen KORKMAZ', room: 'Derslik 3', slots: [[1, 4, 6]] },
            { code: 'ISG4101', name: 'Occupational Health and Safety I', instructor: 'Dr. Öğr. Üyesi Kübra ŞAR', room: 'Derslik 2', slots: [[2, 4, 5]] },
            { code: 'BMI4131', name: 'Introduction to Social Networks Analysis', instructor: 'Doç. Dr. Arzum KARATAŞ', room: 'Derslik 3', slots: [[2, 6, 8]] },
        ],
    },
};

function buildCatalog() {
    const seen = new Map<string, CourseCatalogItem>();
    Object.values(courseSeeds).forEach((byClass) => {
        Object.values(byClass).flat().forEach((seed) => {
            seen.set(seed.code, {
                id: `catalog-${seed.code.toLowerCase()}`,
                courseCode: seed.code,
                courseName: seed.name,
                credits: 4,
                isActive: true,
            });
        });
    });
    return Array.from(seen.values());
}

function buildOfferings(activeTerm: AcademicTerm, catalog: CourseCatalogItem[]) {
    const catalogByCode = new Map(catalog.map((course) => [course.courseCode, course]));
    const offerings: CourseOffering[] = [];
    const examStartTimes = [
        ['09:00', '10:30'],
        ['11:00', '12:30'],
        ['13:00', '14:30'],
        ['15:00', '16:30'],
    ] as const;

    departments.forEach((department) => {
        const seedsByClass = courseSeeds[department.code] ?? {};
        Object.entries(seedsByClass).forEach(([classLevel, seeds]) => {
            seeds.forEach((seed, index) => {
                const course = catalogByCode.get(seed.code)!;
                const id = `offering-${department.code.toLowerCase()}-${classLevel}-${index + 1}`;
                const [examStartTime, examEndTime] = examStartTimes[index % examStartTimes.length];
                offerings.push({
                    id,
                    courseId: course.id,
                    termId: activeTerm.id,
                    departmentId: department.id,
                    classLevel: Number(classLevel),
                    section: 'A',
                    instructorName: seed.instructor,
                    isActive: true,
                    weeklyHours: seed.slots.reduce((total, [, start, end]) => total + end - start + 1, 0),
                    allowedAbsenceHours: 9,
                    course,
                    scheduleSlots: seed.slots.map(([dayOfWeek, startSlot, endSlot], slotIndex) => {
                        const range = getSlotRange(startSlot, endSlot);
                        return {
                            id: `slot-${id}-${slotIndex + 1}`,
                            offeringId: id,
                            dayOfWeek,
                            startTime: range.startTime,
                            endTime: range.endTime,
                            room: seed.room,
                            building: department.code === 'YBS' ? 'Ömer Seyfettin UBF' : 'Mühendislik ve Doğa Bilimleri Fakültesi',
                            deliveryType: seed.room.toLocaleLowerCase('tr-TR').includes('uzaktan') || seed.room === 'UE' ? 'online' : 'face_to_face',
                        };
                    }),
                    examSessions: [
                        {
                            id: `exam-${id}`,
                            offeringId: id,
                            examType: 'final',
                            examDate: toIsoDate(addDays(new Date(2026, 4, 11), index + (Number(classLevel) - 1) * 2)),
                            startTime: examStartTime,
                            endTime: examEndTime,
                            building: department.code === 'YBS' ? 'Ömer Seyfettin UBF' : 'MDBF',
                            room: seed.room,
                            notes: null,
                            isPublished: true,
                        },
                    ],
                });
            });
        });
    });

    return offerings;
}

function createMenuItems(menuDayId: string, names: Array<[string, string, number]>): CafeteriaMenuItem[] {
    return names.map(([itemName, itemType, calories], index) => ({
        id: `${menuDayId}-item-${index + 1}`,
        menuDayId,
        itemName,
        itemType,
        sortOrder: index,
        calories,
    }));
}

function createMay2026Menu(periodId: string): CafeteriaMenuDay[] {
    const rows: Array<[string, Array<[string, string, number]>]> = [
        ['2026-05-01', [['Resmi Tatil', 'holiday', 0]]],
        ['2026-05-04', [['Mercimek Çorba', 'soup', 130], ['Tavuklu Pilav', 'main', 290], ['Mevsim Türlü', 'main', 120], ['Kemalpaşa', 'dessert', 330], ['Ayran', 'drink', 70]]],
        ['2026-05-05', [['Mantar Çorba', 'soup', 165], ['Seb. Et Sote/Pat.Pür.', 'main', 285], ['Taze Fasulye', 'main', 175], ['Bulgur Pilavı', 'side', 240], ['Tulumba', 'dessert', 295]]],
        ['2026-05-06', [['Ezogelin Çorba', 'soup', 140], ['Biber Dolmay.Grn', 'main', 220], ['Mantar Sote', 'main', 280], ['Börek', 'side', 300], ['Komposto', 'drink', 175]]],
        ['2026-05-07', [['Tavuk Suyu Çorba', 'soup', 145], ['Etli Kuru Fasülye', 'main', 310], ['Bezelye', 'main', 190], ['Pirinç Pilavı', 'side', 280], ['Cacık', 'salad', 80]]],
        ['2026-05-08', [['Domates Çorba', 'soup', 140], ['Cordon Blue', 'main', 320], ['Karnabahar', 'main', 150], ['Erişte', 'side', 300], ['Süt Helvası', 'dessert', 250]]],
        ['2026-05-11', [['Sebze Çorba', 'soup', 130], ['Fırın Piliç/Püre', 'main', 230], ['Yeşil Mercimek', 'main', 200], ['Arpa Şeh.Pilavı', 'side', 280], ['Ayran', 'drink', 70]]],
        ['2026-05-12', [['Mercimek Çorba', 'soup', 140], ['Patlıcan Musakka', 'main', 360], ['Kereviz', 'main', 190], ['Pirinç Pilavı', 'side', 280], ['Cacık', 'salad', 80]]],
        ['2026-05-13', [['Ezogelin Çorba', 'soup', 140], ['İskender', 'main', 400], ['Pırasa', 'main', 120], ['Baklava', 'dessert', 350], ['Mevsim Salata', 'salad', 70]]],
        ['2026-05-14', [['Yoğurt Çorba', 'soup', 120], ['Harput Köfte', 'main', 290], ['Brokoli', 'main', 120], ['Makarna', 'side', 300], ['Mevsim Meyve', 'dessert', 70]]],
        ['2026-05-15', [['Kre. Mantar Çorba', 'soup', 155], ['Etli Nohut', 'main', 290], ['Fırın Sebze', 'main', 100], ['Pirinç Pilavı', 'side', 280], ['Turşu', 'salad', 80]]],
        ['2026-05-18', [['Mercimek Çorba', 'soup', 140], ['Şinitzel/Püre', 'main', 320], ['Taze Fasulye', 'main', 175], ['Makarna', 'side', 300], ['Şekerpare', 'dessert', 330]]],
        ['2026-05-19', [['Resmi Tatil', 'holiday', 0]]],
        ['2026-05-20', [['Domates Çorba', 'soup', 140], ['Tavuk Döner/P.Kız.', 'main', 315], ['Bezelye', 'main', 190], ['Pirinç Pilavı', 'side', 280], ['Ayran', 'drink', 70]]],
        ['2026-05-21', [['Ezogelin Çorba', 'soup', 140], ['Orman Kebabı', 'main', 330], ['Yeşil Mercimek', 'main', 200], ['Makarna', 'side', 300], ['Aşure', 'dessert', 350]]],
        ['2026-05-22', [['Sebze Çorba', 'soup', 130], ['Etli Kuru Fasülye', 'main', 310], ['Brokoli', 'main', 130], ['Pirinç Pilavı', 'side', 280], ['Cacık', 'salad', 80]]],
        ['2026-05-25', [['Tarhana Çorba', 'soup', 140], ['Kadın Budu Köfte/Püre', 'main', 330], ['Pırasa', 'main', 120], ['Makarna', 'side', 300], ['Mevsim Meyve', 'dessert', 70]]],
        ['2026-05-26', [['Arife Günü', 'holiday', 0]]],
        ['2026-05-27', [['Kurban Bayramı 1. Gün', 'holiday', 0]]],
        ['2026-05-28', [['Kurban Bayramı 2. Gün', 'holiday', 0]]],
        ['2026-05-29', [['Kurban Bayramı 3. Gün', 'holiday', 0]]],
    ];

    return rows.map(([serviceDate, items], index) => {
        const menuDayId = `menu-day-may-2026-${index + 1}`;
        return {
            id: menuDayId,
            periodId,
            serviceDate,
            mealSession: 'lunch',
            items: createMenuItems(menuDayId, items),
        };
    });
}

export function createFallbackDataset(now = new Date()): FallbackDataset {
    const activeTerm: AcademicTerm = {
        id: 'term-2026-spring',
        year: 2026,
        termName: 'Bahar',
        startsAt: '2026-02-10',
        endsAt: '2026-06-20',
        isActive: true,
    };

    const courseCatalog = buildCatalog();
    const officialOfferings = buildOfferings(activeTerm, courseCatalog);
    const sampleDepartment = departments[0];
    const studentProfile: StudentProfile = {
        id: 'fallback-user',
        schoolEmail: 'ogrenci@bandirma.edu.tr',
        fullName: 'Bandırma Öğrencisi',
        phone: null,
        facultyName: sampleDepartment.facultyName,
        departmentId: sampleDepartment.id,
        departmentCode: sampleDepartment.code,
        departmentName: sampleDepartment.departmentName,
        classLevel: 2,
        studentNumber: 'BAN-000001',
        isActive: true,
        source: 'demo_signup',
        mustChangePassword: false,
        passwordChangedAt: now.toISOString(),
        tcLast4: null,
    };

    const cafeteriaPeriod: CafeteriaMenuPeriod = {
        id: 'menu-period-2026-5',
        year: 2026,
        month: 5,
        validFrom: '2026-05-01',
        validTo: '2026-05-31',
        version: 2,
        isPublished: true,
        days: createMay2026Menu('menu-period-2026-5'),
    };

    return {
        departments,
        activeTerm,
        studentProfile,
        courseCatalog,
        officialOfferings,
        cafeteriaPeriod,
    };
}

export function getDayLabel(date: string) {
    return DAY_NAMES[new Date(`${date}T12:00:00`).getDay()];
}
