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

const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

function toIsoDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

function getWeekdayInMonth(baseDate: Date, weekday: number, weekOffset = 0) {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    while (date.getDay() !== weekday) {
        date.setDate(date.getDate() + 1);
    }
    date.setDate(date.getDate() + weekOffset * 7);
    return date;
}

function createMenuDays(periodId: string, monthDate: Date): CafeteriaMenuDay[] {
    const recipeSets = [
        [
            ['Mercimek Corbasi', 'soup', 145],
            ['Firinda Tavuk', 'main', 380],
            ['Pirinç Pilavi', 'side', 260],
            ['Cacik', 'salad', 90],
        ],
        [
            ['Ezogelin Corbasi', 'soup', 160],
            ['Etli Nohut', 'main', 420],
            ['Bulgur Pilavi', 'side', 240],
            ['Mevsim Salata', 'salad', 80],
        ],
        [
            ['Domates Corbasi', 'soup', 150],
            ['Kofte', 'main', 400],
            ['Makarna', 'side', 300],
            ['Ayran', 'drink', 95],
        ],
        [
            ['Sebze Corbasi', 'soup', 130],
            ['Tavuk Sote', 'main', 360],
            ['Patates Pure', 'side', 210],
            ['Meyve', 'dessert', 120],
        ],
    ] as const;

    const days: CafeteriaMenuDay[] = [];

    for (let i = 0; i < 10; i += 1) {
        const weekdayIndex = i % 5;
        const serviceDate = getWeekdayInMonth(monthDate, weekdayIndex === 4 ? 5 : weekdayIndex + 1, Math.floor(i / 5));
        const menuDayId = `menu-day-${i + 1}`;
        const items: CafeteriaMenuItem[] = recipeSets[i % recipeSets.length].map(([itemName, itemType, calories], index) => ({
            id: `${menuDayId}-item-${index + 1}`,
            menuDayId,
            itemName,
            itemType,
            sortOrder: index,
            calories,
        }));

        days.push({
            id: menuDayId,
            periodId,
            serviceDate: toIsoDate(serviceDate),
            mealSession: 'lunch',
            items,
        });
    }

    return days;
}

export function createFallbackDataset(now = new Date()): FallbackDataset {
    const departments: Department[] = [
        {
            id: 'dep-ceng',
            facultyName: 'Muhendislik ve Doga Bilimleri Fakultesi',
            departmentName: 'Bilgisayar Muhendisligi',
            code: 'CENG',
            isActive: true,
        },
        {
            id: 'dep-ie',
            facultyName: 'Muhendislik ve Doga Bilimleri Fakultesi',
            departmentName: 'Endustri Muhendisligi',
            code: 'IE',
            isActive: true,
        },
        {
            id: 'dep-law',
            facultyName: 'Hukuk Fakultesi',
            departmentName: 'Hukuk',
            code: 'LAW',
            isActive: true,
        },
    ];

    const activeTerm: AcademicTerm = {
        id: 'term-2026-spring',
        year: now.getFullYear(),
        termName: 'Bahar',
        startsAt: toIsoDate(new Date(now.getFullYear(), 1, 10)),
        endsAt: toIsoDate(new Date(now.getFullYear(), 5, 20)),
        isActive: true,
    };

    const studentProfile: StudentProfile = {
        id: 'fallback-user',
        schoolEmail: 'ogrenci@bandirma.edu.tr',
        fullName: 'Muhammed Salih Ay',
        phone: '05551234567',
        facultyName: departments[0].facultyName,
        departmentId: departments[0].id,
        departmentCode: departments[0].code,
        departmentName: departments[0].departmentName,
        classLevel: 2,
        studentNumber: 'BAN-123456',
        isActive: true,
        source: 'imported',
        mustChangePassword: true,
        passwordChangedAt: null,
        tcLast4: '7890',
    };

    const courseCatalog: CourseCatalogItem[] = [
        { id: 'catalog-1', courseCode: 'CENG201', courseName: 'Veri Yapilari', credits: 4, isActive: true },
        { id: 'catalog-2', courseCode: 'CENG203', courseName: 'Veritabani Sistemleri', credits: 4, isActive: true },
        { id: 'catalog-3', courseCode: 'CENG205', courseName: 'Mobil Programlama', credits: 3, isActive: true },
        { id: 'catalog-4', courseCode: 'CENG101', courseName: 'Programlamaya Giris', credits: 5, isActive: true },
        { id: 'catalog-5', courseCode: 'CENG301', courseName: 'Algoritma Analizi', credits: 4, isActive: true },
    ];

    const officialOfferings: CourseOffering[] = [
        {
            id: 'offering-1',
            courseId: 'catalog-1',
            termId: activeTerm.id,
            departmentId: departments[0].id,
            classLevel: 2,
            section: 'A',
            instructorName: 'Dr. Ogretim Uyesi Elif Demir',
            isActive: true,
            weeklyHours: 4,
            allowedAbsenceHours: 12,
            course: courseCatalog[0],
            scheduleSlots: [
                { id: 'slot-1', offeringId: 'offering-1', dayOfWeek: 0, startTime: '09:00', endTime: '10:45', room: 'A-101', building: 'Merkez Yerleske', deliveryType: 'face_to_face' },
                { id: 'slot-2', offeringId: 'offering-1', dayOfWeek: 2, startTime: '09:00', endTime: '10:45', room: 'A-101', building: 'Merkez Yerleske', deliveryType: 'face_to_face' },
            ],
            examSessions: [
                { id: 'exam-1', offeringId: 'offering-1', examType: 'vize', examDate: toIsoDate(addDays(now, 0)), startTime: '09:00', endTime: '12:00', building: 'Merkez Yerleske', room: 'Amfi 1', notes: null, isPublished: true },
            ],
        },
        {
            id: 'offering-2',
            courseId: 'catalog-2',
            termId: activeTerm.id,
            departmentId: departments[0].id,
            classLevel: 2,
            section: 'A',
            instructorName: 'Dr. Ogretim Uyesi Mert Kaya',
            isActive: true,
            weeklyHours: 3,
            allowedAbsenceHours: 10,
            course: courseCatalog[1],
            scheduleSlots: [
                { id: 'slot-3', offeringId: 'offering-2', dayOfWeek: 1, startTime: '11:00', endTime: '12:30', room: 'B-204', building: 'Teknoloji Binasi', deliveryType: 'face_to_face' },
                { id: 'slot-4', offeringId: 'offering-2', dayOfWeek: 3, startTime: '11:00', endTime: '12:30', room: 'B-204', building: 'Teknoloji Binasi', deliveryType: 'face_to_face' },
            ],
            examSessions: [
                { id: 'exam-2', offeringId: 'offering-2', examType: 'vize', examDate: toIsoDate(addDays(now, 0)), startTime: '11:00', endTime: '13:00', building: 'Teknoloji Binasi', room: 'Derslik 204', notes: null, isPublished: true },
            ],
        },
        {
            id: 'offering-3',
            courseId: 'catalog-3',
            termId: activeTerm.id,
            departmentId: departments[0].id,
            classLevel: 2,
            section: 'A',
            instructorName: 'Ogretim Gorevlisi Zeynep Arslan',
            isActive: true,
            weeklyHours: 2,
            allowedAbsenceHours: 8,
            course: courseCatalog[2],
            scheduleSlots: [
                { id: 'slot-5', offeringId: 'offering-3', dayOfWeek: 4, startTime: '14:00', endTime: '15:30', room: 'Lab-2', building: 'Teknoloji Binasi', deliveryType: 'lab' },
            ],
            examSessions: [
                { id: 'exam-3', offeringId: 'offering-3', examType: 'quiz', examDate: toIsoDate(addDays(now, 1)), startTime: '14:00', endTime: '15:30', building: 'Teknoloji Binasi', room: 'Lab-2', notes: 'Kisa quiz', isPublished: true },
            ],
        },
        {
            id: 'offering-4',
            courseId: 'catalog-4',
            termId: activeTerm.id,
            departmentId: departments[0].id,
            classLevel: 1,
            section: 'A',
            instructorName: 'Dr. Ogretim Uyesi Deniz Yalcin',
            isActive: true,
            weeklyHours: 4,
            allowedAbsenceHours: 12,
            course: courseCatalog[3],
            scheduleSlots: [
                { id: 'slot-6', offeringId: 'offering-4', dayOfWeek: 0, startTime: '13:30', endTime: '15:15', room: 'C-101', building: 'Merkez Yerleske', deliveryType: 'face_to_face' },
            ],
            examSessions: [
                { id: 'exam-4', offeringId: 'offering-4', examType: 'final', examDate: toIsoDate(addDays(now, 16)), startTime: '13:00', endTime: '15:00', building: 'Merkez Yerleske', room: 'C-101', notes: null, isPublished: true },
            ],
        },
        {
            id: 'offering-5',
            courseId: 'catalog-5',
            termId: activeTerm.id,
            departmentId: departments[0].id,
            classLevel: 3,
            section: 'A',
            instructorName: 'Prof. Dr. Banu Cetin',
            isActive: true,
            weeklyHours: 3,
            allowedAbsenceHours: 9,
            course: courseCatalog[4],
            scheduleSlots: [
                { id: 'slot-7', offeringId: 'offering-5', dayOfWeek: 2, startTime: '15:00', endTime: '16:30', room: 'A-305', building: 'Merkez Yerleske', deliveryType: 'face_to_face' },
            ],
            examSessions: [
                { id: 'exam-5', offeringId: 'offering-5', examType: 'final', examDate: toIsoDate(addDays(now, 18)), startTime: '15:00', endTime: '17:00', building: 'Merkez Yerleske', room: 'A-305', notes: null, isPublished: true },
            ],
        },
    ];

    const menuMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodId = `menu-period-${menuMonth.getFullYear()}-${menuMonth.getMonth() + 1}`;
    const cafeteriaPeriod: CafeteriaMenuPeriod = {
        id: periodId,
        year: menuMonth.getFullYear(),
        month: menuMonth.getMonth() + 1,
        validFrom: toIsoDate(menuMonth),
        validTo: toIsoDate(new Date(menuMonth.getFullYear(), menuMonth.getMonth() + 1, 0)),
        version: 1,
        isPublished: true,
        days: createMenuDays(periodId, menuMonth),
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
