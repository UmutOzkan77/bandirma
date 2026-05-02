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
const SLOT_TIMES = [
    ['08:45', '10:20'],
    ['10:25', '12:00'],
    ['12:50', '14:25'],
    ['14:30', '16:05'],
    ['16:10', '17:45'],
] as const;

function toIsoDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
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
        id: 'dep-ceng-en',
        facultyName: 'Mühendislik ve Doğa Bilimleri Fakültesi',
        departmentName: 'Bilgisayar Mühendisliği (İngilizce)',
        code: 'CENG-EN',
        isActive: true,
    },
];

type CourseSeed = {
    code: string;
    name: string;
    instructor: string;
    room: string;
    day: number;
    slot: number;
};

const courseSeeds: Record<string, Record<number, CourseSeed[]>> = {
    YBS: {
        1: [
            { code: 'YBS1203', name: 'Yönetim Bilişim Sistemlerine Giriş II', instructor: 'Dr. Öğr. Üyesi Emre Yıldız', room: 'UBF-101', day: 0, slot: 0 },
            { code: 'IKT1202', name: 'Mikro İktisat', instructor: 'Dr. Öğr. Üyesi Selen Akın', room: 'UBF-102', day: 1, slot: 1 },
            { code: 'MAT1202', name: 'Matematik II', instructor: 'Doç. Dr. Barış Acar', room: 'UBF-201', day: 2, slot: 2 },
            { code: 'HUK1202', name: 'Temel Hukuk', instructor: 'Dr. Öğr. Üyesi Aylin Kara', room: 'UBF-103', day: 3, slot: 1 },
        ],
        2: [
            { code: 'YBS2204', name: 'Veritabanı Yönetim Sistemleri', instructor: 'Dr. Öğr. Üyesi Ece Demir', room: 'Lab-1', day: 0, slot: 1 },
            { code: 'YBS2206', name: 'Sistem Analizi ve Tasarımı', instructor: 'Dr. Öğr. Üyesi Can Öztürk', room: 'UBF-203', day: 1, slot: 2 },
            { code: 'YBS2208', name: 'Nesne Yönelimli Programlama', instructor: 'Öğr. Gör. Mert Kaya', room: 'Lab-2', day: 2, slot: 3 },
            { code: 'YBS2210', name: 'İşletme İstatistiği', instructor: 'Dr. Öğr. Üyesi Seda Arslan', room: 'UBF-204', day: 4, slot: 0 },
        ],
        3: [
            { code: 'YBS3202', name: 'Kurumsal Kaynak Planlama', instructor: 'Dr. Öğr. Üyesi Deniz Yalçın', room: 'UBF-301', day: 0, slot: 2 },
            { code: 'YBS3204', name: 'İş Zekası ve Veri Ambarı', instructor: 'Doç. Dr. Zeynep Şahin', room: 'Lab-1', day: 1, slot: 3 },
            { code: 'YBS3206', name: 'E-Ticaret Sistemleri', instructor: 'Dr. Öğr. Üyesi Kerem Uslu', room: 'UBF-302', day: 3, slot: 0 },
            { code: 'YBS3208', name: 'Proje Yönetimi', instructor: 'Dr. Öğr. Üyesi Elif Koç', room: 'UBF-303', day: 4, slot: 1 },
        ],
        4: [
            { code: 'YBS4202', name: 'Bilişim Sistemleri Güvenliği', instructor: 'Dr. Öğr. Üyesi Alper Tuncer', room: 'Lab-2', day: 0, slot: 3 },
            { code: 'YBS4204', name: 'Dijital Dönüşüm Yönetimi', instructor: 'Doç. Dr. Melis Aydın', room: 'UBF-401', day: 1, slot: 1 },
            { code: 'YBS4206', name: 'Bitirme Projesi', instructor: 'Bölüm Öğretim Üyeleri', room: 'Proje Ofisi', day: 2, slot: 4 },
            { code: 'YBS4208', name: 'Karar Destek Sistemleri', instructor: 'Dr. Öğr. Üyesi Burak Ergin', room: 'UBF-402', day: 4, slot: 2 },
        ],
    },
    'CENG-EN': {
        1: [
            { code: 'MTI1221', name: 'Mathematics II', instructor: 'Prof. Dr. Mehmet Ali Akınlar', room: 'Derslik 9', day: 0, slot: 0 },
            { code: 'BMI1222', name: 'Object Oriented Programming', instructor: 'Dr. Öğr. Üyesi Alpay Doruk', room: 'Tıp 10', day: 1, slot: 1 },
            { code: 'BMI1221', name: 'Discrete Mathematics', instructor: 'Prof. Dr. Hüseyin Işık', room: 'Derslik 7', day: 2, slot: 2 },
            { code: 'FZI1201', name: 'Physics II', instructor: 'Doç. Dr. Bülent Büyük', room: 'Derslik 7', day: 4, slot: 2 },
        ],
        2: [
            { code: 'BMI2221', name: 'Logic Circuits', instructor: 'Doç. Dr. Semih Korkmaz', room: 'Tıp 10', day: 0, slot: 1 },
            { code: 'BMI2223', name: 'Database Management Systems', instructor: 'Dr. Öğr. Üyesi Arzum Karataş', room: 'Derslik 8', day: 2, slot: 1 },
            { code: 'BMI2224', name: 'Algorithms', instructor: 'Dr. Öğr. Üyesi Erkut Arıcan', room: 'Derslik 7', day: 4, slot: 0 },
            { code: 'BMI2225', name: 'Internet Based Programming', instructor: 'Dr. Öğr. Üyesi Mehmet Sevi', room: 'Derslik 9', day: 4, slot: 2 },
        ],
        3: [
            { code: 'BMI3221', name: 'Automata Theory', instructor: 'Dr. Öğr. Üyesi Muhammed Milani', room: 'Derslik 7', day: 0, slot: 1 },
            { code: 'BMI3225', name: 'Computer Operating Systems', instructor: 'Dr. Öğr. Üyesi Alpay Doruk', room: 'Derslik 10', day: 4, slot: 1 },
            { code: 'BMI3223', name: 'Software Engineering', instructor: 'Dr. Öğr. Üyesi Erkut Arıcan', room: 'Derslik 2', day: 3, slot: 2 },
            { code: 'BMI3227', name: 'Computer Networks', instructor: 'Doç. Dr. Selahattin Koşunalp', room: 'Derslik 2', day: 4, slot: 3 },
        ],
        4: [
            { code: 'BMI4246', name: 'Optimization Theory', instructor: 'Dr. Öğr. Üyesi Cemil Közkurt', room: 'Derslik 2', day: 0, slot: 1 },
            { code: 'BMI4241', name: 'Parallel Programming', instructor: 'Doç. Dr. Mehmet Akif Çifçi', room: 'Derslik 7', day: 2, slot: 1 },
            { code: 'BMI4244', name: 'Pattern Recognition', instructor: 'Dr. Öğr. Üyesi Bahar Milani', room: 'Derslik 3', day: 4, slot: 1 },
            { code: 'BMI4248', name: 'Graduation Project', instructor: 'Department Members', room: 'Project Lab', day: 3, slot: 4 },
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

    departments.forEach((department) => {
        const seedsByClass = courseSeeds[department.code] ?? {};
        Object.entries(seedsByClass).forEach(([classLevel, seeds]) => {
            seeds.forEach((seed, index) => {
                const [startTime, endTime] = SLOT_TIMES[seed.slot];
                const course = catalogByCode.get(seed.code)!;
                const id = `offering-${department.code.toLowerCase()}-${classLevel}-${index + 1}`;
                offerings.push({
                    id,
                    courseId: course.id,
                    termId: activeTerm.id,
                    departmentId: department.id,
                    classLevel: Number(classLevel),
                    section: 'A',
                    instructorName: seed.instructor,
                    isActive: true,
                    weeklyHours: 3,
                    allowedAbsenceHours: 9,
                    course,
                    scheduleSlots: [
                        {
                            id: `slot-${id}`,
                            offeringId: id,
                            dayOfWeek: seed.day,
                            startTime,
                            endTime,
                            room: seed.room,
                            building: department.code === 'YBS' ? 'Ömer Seyfettin UBF' : 'Mühendislik ve Doğa Bilimleri Fakültesi',
                            deliveryType: seed.room.toLowerCase().includes('lab') ? 'lab' : 'face_to_face',
                        },
                    ],
                    examSessions: [
                        {
                            id: `exam-${id}`,
                            offeringId: id,
                            examType: 'final',
                            examDate: toIsoDate(addDays(new Date(2026, 4, 25), index + Number(classLevel))),
                            startTime: startTime,
                            endTime,
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
        ['2026-05-01', [['Mercimek Çorba', 'soup', 182], ['İzmir Köfte', 'main', 315], ['Pirinç Pilavı', 'side', 280], ['Mevsim Salata', 'salad', 95], ['Ayran', 'drink', 90]]],
        ['2026-05-04', [['Ezogelin Çorba', 'soup', 195], ['Etli Nohut', 'main', 324], ['Bulgur Pilavı', 'side', 305], ['Turşu', 'salad', 76], ['Mevsim Meyve', 'dessert', 115]]],
        ['2026-05-05', [['Tarhana Çorba', 'soup', 110], ['Tavuk Sote', 'main', 310], ['Makarna', 'side', 330], ['Cacık', 'salad', 90], ['Kemalpaşa Tatlısı', 'dessert', 260]]],
        ['2026-05-06', [['Yayla Çorba', 'soup', 160], ['Etli Kuru Fasulye', 'main', 375], ['Pirinç Pilavı', 'side', 280], ['Karışık Turşu', 'salad', 70], ['Ayran', 'drink', 90]]],
        ['2026-05-07', [['Domates Çorba', 'soup', 150], ['Hasanpaşa Köfte', 'main', 269], ['Zeytinyağlı Taze Fasulye', 'main', 180], ['Bulgur Pilavı', 'side', 305], ['Yoğurt', 'drink', 124]]],
        ['2026-05-08', [['Sebze Çorba', 'soup', 130], ['Piliç Pane', 'main', 392], ['Soslu Makarna', 'side', 330], ['Mevsim Salata', 'salad', 95], ['Sütlaç', 'dessert', 220]]],
        ['2026-05-11', [['Mercimek Çorba', 'soup', 182], ['Orman Kebabı', 'main', 360], ['Pirinç Pilavı', 'side', 280], ['Ayran', 'drink', 90], ['Meyve', 'dessert', 115]]],
        ['2026-05-12', [['Tavuksuyu Çorba', 'soup', 213], ['Etli Bezelye', 'main', 350], ['Erişte', 'side', 296], ['Mevsim Salata', 'salad', 95], ['Şekerpare', 'dessert', 300]]],
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
        version: 1,
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
