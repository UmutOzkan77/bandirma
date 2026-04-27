import type {
    AcademicTerm,
    CafeteriaMenuPeriod,
    CourseCatalogItem,
    CourseOffering,
    Department,
    ExamViewModel,
    LocalAbsenceEntry,
    LocalAbsenceEvent,
    LocalAbsenceState,
    SelectableOffering,
    StudentProfile,
    TimetableEntry,
} from './domain';
import { createFallbackDataset, getDayLabel } from './fallbackData';
import { isSupabaseConfigured, supabase } from './supabase';

const fallback = createFallbackDataset();

function toLocalIsoDate(value = new Date()) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


type ProfileRow = {
    id: string;
    school_email: string;
    full_name: string;
    phone: string | null;
    faculty_name: string;
    department_id: string | null;
    class_level: number | null;
    student_number: string | null;
    is_active: boolean;
    source: 'imported' | 'demo_signup';
    must_change_password: boolean;
    password_changed_at: string | null;
    tc_last4: string | null;
    department?: {
        id: string;
        faculty_name: string;
        department_name: string;
        code: string;
        is_active: boolean;
    } | null;
};

type OfferingRow = {
    id: string;
    course_id: string;
    term_id: string;
    department_id: string;
    class_level: number;
    section: string | null;
    instructor_name: string | null;
    is_active: boolean;
    weekly_hours: number | null;
    allowed_absence_hours: number | null;
    course: {
        id: string;
        course_code: string;
        course_name: string;
        credits: number | null;
        is_active: boolean;
    } | null;
    schedule_slots: Array<{
        id: string;
        offering_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        room: string | null;
        building: string | null;
        delivery_type: string | null;
    }> | null;
    exam_sessions: Array<{
        id: string;
        offering_id: string;
        exam_type: 'vize' | 'final' | 'bütünleme' | 'quiz';
        exam_date: string;
        start_time: string;
        end_time: string;
        building: string | null;
        room: string | null;
        notes: string | null;
        is_published: boolean;
    }> | null;
    department?: {
        id: string;
        faculty_name: string;
        department_name: string;
        code: string;
        is_active: boolean;
    } | null;
};

function normalizeDepartment(row: {
    id: string;
    faculty_name: string;
    department_name: string;
    code: string;
    is_active: boolean;
}): Department {
    return {
        id: row.id,
        facultyName: row.faculty_name,
        departmentName: row.department_name,
        code: row.code,
        isActive: row.is_active,
    };
}

function normalizeProfile(row: ProfileRow): StudentProfile {
    return {
        id: row.id,
        schoolEmail: row.school_email,
        fullName: row.full_name,
        phone: row.phone,
        facultyName: row.faculty_name,
        departmentId: row.department_id,
        departmentCode: row.department?.code ?? null,
        departmentName: row.department?.department_name ?? null,
        classLevel: row.class_level,
        studentNumber: row.student_number,
        isActive: row.is_active,
        source: row.source,
        mustChangePassword: row.must_change_password,
        passwordChangedAt: row.password_changed_at,
        tcLast4: row.tc_last4,
    };
}

function normalizeOffering(row: OfferingRow): SelectableOffering {
    const course = row.course ?? {
        id: row.course_id,
        course_code: 'BILINMEYEN',
        course_name: 'Bilinmeyen Ders',
        credits: null,
        is_active: true,
    };

    return {
        id: row.id,
        courseId: row.course_id,
        termId: row.term_id,
        departmentId: row.department_id,
        classLevel: row.class_level,
        section: row.section,
        instructorName: row.instructor_name,
        isActive: row.is_active,
        weeklyHours: row.weekly_hours,
        allowedAbsenceHours: row.allowed_absence_hours,
        course: {
            id: course.id,
            courseCode: course.course_code,
            courseName: course.course_name,
            credits: course.credits,
            isActive: course.is_active,
        },
        scheduleSlots: (row.schedule_slots ?? []).map((slot) => ({
            id: slot.id,
            offeringId: slot.offering_id,
            dayOfWeek: slot.day_of_week,
            startTime: slot.start_time,
            endTime: slot.end_time,
            room: slot.room,
            building: slot.building,
            deliveryType: slot.delivery_type,
        })),
        examSessions: (row.exam_sessions ?? []).map((exam) => ({
            id: exam.id,
            offeringId: exam.offering_id,
            examType: exam.exam_type,
            examDate: exam.exam_date,
            startTime: exam.start_time,
            endTime: exam.end_time,
            building: exam.building,
            room: exam.room,
            notes: exam.notes,
            isPublished: exam.is_published,
        })),
        department: row.department ? normalizeDepartment(row.department) : null,
    };
}

function offeringSelect() {
    return `
        id,
        course_id,
        term_id,
        department_id,
        class_level,
        section,
        instructor_name,
        is_active,
        weekly_hours,
        allowed_absence_hours,
        course:course_catalog (
            id,
            course_code,
            course_name,
            credits,
            is_active
        ),
        department:departments (
            id,
            faculty_name,
            department_name,
            code,
            is_active
        ),
        schedule_slots (
            id,
            offering_id,
            day_of_week,
            start_time,
            end_time,
            room,
            building,
            delivery_type
        ),
        exam_sessions (
            id,
            offering_id,
            exam_type,
            exam_date,
            start_time,
            end_time,
            building,
            room,
            notes,
            is_published
        )
    `;
}

export async function fetchDepartments(): Promise<Department[]> {
    if (!isSupabaseConfigured || !supabase) {
        return fallback.departments;
    }

    const { data, error } = await supabase
        .from('departments')
        .select('id, faculty_name, department_name, code, is_active')
        .eq('is_active', true)
        .order('faculty_name', { ascending: true })
        .order('department_name', { ascending: true });

    if (error || !data?.length) {
        return fallback.departments;
    }

    return data.map(normalizeDepartment);
}

export async function fetchActiveTerm(): Promise<AcademicTerm> {
    if (!isSupabaseConfigured || !supabase) {
        return fallback.activeTerm;
    }

    const { data, error } = await supabase
        .from('academic_terms')
        .select('id, year, term_name, starts_at, ends_at, is_active')
        .eq('is_active', true)
        .order('starts_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error || !data) {
        return fallback.activeTerm;
    }

    return {
        id: data.id,
        year: data.year,
        termName: data.term_name,
        startsAt: data.starts_at,
        endsAt: data.ends_at,
        isActive: data.is_active,
    };
}

export async function fetchStudentProfile(userId: string): Promise<StudentProfile | null> {
    if (!isSupabaseConfigured || !supabase) {
        return userId === fallback.studentProfile.id ? fallback.studentProfile : null;
    }

    const { data, error } = await supabase
        .from('students')
        .select(`
            id,
            school_email,
            full_name,
            phone,
            faculty_name,
            department_id,
            class_level,
            student_number,
            is_active,
            source,
            must_change_password,
            password_changed_at,
            tc_last4,
            department:departments (
                id,
                faculty_name,
                department_name,
                code,
                is_active
            )
        `)
        .eq('id', userId)
        .maybeSingle();

    if (error || !data) {
        return null;
    }

    return normalizeProfile(data as unknown as ProfileRow);
}

export async function fetchOfficialOfferings(profile: StudentProfile, termId: string): Promise<CourseOffering[]> {
    if (!profile.departmentId || profile.classLevel === null) {
        return [];
    }

    if (!isSupabaseConfigured || !supabase) {
        return fallback.officialOfferings.filter((offering) =>
            offering.departmentId === profile.departmentId &&
            offering.classLevel === profile.classLevel &&
            offering.termId === termId
        );
    }

    const { data, error } = await supabase
        .from('course_offerings')
        .select(offeringSelect())
        .eq('department_id', profile.departmentId)
        .eq('class_level', profile.classLevel)
        .eq('term_id', termId)
        .eq('is_active', true);

    if (error || !data) {
        return fallback.officialOfferings.filter((offering) =>
            offering.departmentId === profile.departmentId &&
            offering.classLevel === profile.classLevel &&
            offering.termId === termId
        );
    }

    return (data as unknown as OfferingRow[]).map(normalizeOffering);
}

export async function fetchOfferingsByIds(ids: string[]): Promise<CourseOffering[]> {
    if (!ids.length) {
        return [];
    }

    if (!isSupabaseConfigured || !supabase) {
        return fallback.officialOfferings.filter((offering) => ids.includes(offering.id));
    }

    const { data, error } = await supabase
        .from('course_offerings')
        .select(offeringSelect())
        .in('id', ids);

    if (error || !data) {
        return fallback.officialOfferings.filter((offering) => ids.includes(offering.id));
    }

    return (data as unknown as OfferingRow[]).map(normalizeOffering);
}

export async function searchOfferings(query: string, termId: string, departmentId: string | null): Promise<SelectableOffering[]> {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
        return [];
    }

    if (!isSupabaseConfigured || !supabase) {
        return fallback.officialOfferings.filter((offering) =>
            offering.termId === termId &&
            offering.departmentId === departmentId &&
            (
                offering.course.courseCode.toLowerCase().includes(normalizedQuery) ||
                offering.course.courseName.toLowerCase().includes(normalizedQuery)
            )
        );
    }

    const { data: catalogRows, error: catalogError } = await supabase
        .from('course_catalog')
        .select('id, course_code, course_name, credits, is_active')
        .or(`course_code.ilike.%${normalizedQuery}%,course_name.ilike.%${normalizedQuery}%`)
        .eq('is_active', true)
        .limit(25);

    if (catalogError || !catalogRows?.length) {
        return [];
    }

    const courseIds = catalogRows.map((course) => course.id);
    let queryBuilder = supabase
        .from('course_offerings')
        .select(offeringSelect())
        .eq('term_id', termId)
        .eq('is_active', true)
        .in('course_id', courseIds);

    if (departmentId) {
        queryBuilder = queryBuilder.eq('department_id', departmentId);
    }

    const { data, error } = await queryBuilder;

    if (error || !data) {
        return [];
    }

    return (data as unknown as OfferingRow[]).map(normalizeOffering);
}

export async function fetchCafeteriaMenuPeriod(referenceDate = new Date()): Promise<CafeteriaMenuPeriod | null> {
    if (!isSupabaseConfigured || !supabase) {
        return fallback.cafeteriaPeriod;
    }

    const iso = toLocalIsoDate(referenceDate);
    const { data, error } = await supabase
        .from('cafeteria_menu_periods')
        .select(`
            id,
            year,
            month,
            valid_from,
            valid_to,
            version,
            is_published,
            cafeteria_menu_days (
                id,
                period_id,
                service_date,
                meal_session,
                cafeteria_menu_items (
                    id,
                    menu_day_id,
                    item_name,
                    item_type,
                    sort_order,
                    calories
                )
            )
        `)
        .eq('is_published', true)
        .lte('valid_from', iso)
        .gte('valid_to', iso)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error || !data) {
        return fallback.cafeteriaPeriod;
    }

    return {
        id: data.id,
        year: data.year,
        month: data.month,
        validFrom: data.valid_from,
        validTo: data.valid_to,
        version: data.version,
        isPublished: data.is_published,
        days: (data.cafeteria_menu_days ?? []).map((day) => ({
            id: day.id,
            periodId: day.period_id,
            serviceDate: day.service_date,
            mealSession: day.meal_session,
            items: (day.cafeteria_menu_items ?? []).map((item) => ({
                id: item.id,
                menuDayId: item.menu_day_id,
                itemName: item.item_name,
                itemType: item.item_type,
                sortOrder: item.sort_order,
                calories: item.calories,
            })),
        })),
    };
}

export function sortOfferings(offerings: CourseOffering[]) {
    return [...offerings].sort((a, b) => {
        const aSlot = [...a.scheduleSlots].sort((slotA, slotB) => (
            slotA.dayOfWeek - slotB.dayOfWeek || slotA.startTime.localeCompare(slotB.startTime)
        ))[0];
        const bSlot = [...b.scheduleSlots].sort((slotA, slotB) => (
            slotA.dayOfWeek - slotB.dayOfWeek || slotA.startTime.localeCompare(slotB.startTime)
        ))[0];

        if (!aSlot && !bSlot) {
            return a.course.courseCode.localeCompare(b.course.courseCode);
        }
        if (!aSlot) {
            return 1;
        }
        if (!bSlot) {
            return -1;
        }

        return aSlot.dayOfWeek - bSlot.dayOfWeek || aSlot.startTime.localeCompare(bSlot.startTime);
    });
}

export function buildTimetableEntries(offerings: CourseOffering[]): TimetableEntry[] {
    return offerings.flatMap((offering) =>
        offering.scheduleSlots.map((slot) => ({
            offeringId: offering.id,
            courseCode: offering.course.courseCode,
            courseName: offering.course.courseName,
            instructor: offering.instructorName ?? 'Ogretim Gorevlisi',
            startTime: slot.startTime,
            endTime: slot.endTime,
            room: slot.room ?? 'Sinif bilgisi yok',
            building: slot.building ?? '',
            dayOfWeek: slot.dayOfWeek,
            isOnline: slot.deliveryType === 'online',
        }))
    ).sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
}

export function buildExamViewModels(offerings: CourseOffering[]): ExamViewModel[] {
    const exams = offerings.flatMap((offering) =>
        offering.examSessions
            .filter((exam) => exam.isPublished)
            .map((exam) => ({
                id: exam.id,
                offeringId: offering.id,
                courseCode: offering.course.courseCode,
                courseName: offering.course.courseName,
                examType: exam.examType,
                date: exam.examDate,
                startTime: exam.startTime,
                endTime: exam.endTime,
                building: exam.building ?? 'Bina bilgisi yok',
                room: exam.room ?? 'Salon bilgisi yok',
                hasConflict: false,
                conflictWith: null,
            }))
    );

    return exams
        .map((exam) => {
            const conflicts = exams.filter((candidate) =>
                candidate.id !== exam.id &&
                candidate.date === exam.date &&
                candidate.startTime === exam.startTime
            );

            return {
                ...exam,
                hasConflict: conflicts.length > 0,
                conflictWith: conflicts[0]?.courseCode ?? null,
            };
        })
        .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`));
}

export function getTodayTimetableEntries(offerings: CourseOffering[], now = new Date()) {
    const dayOfWeek = ((now.getDay() + 6) % 7);
    return buildTimetableEntries(offerings).filter((entry) => entry.dayOfWeek === dayOfWeek);
}

export function getNextExam(exams: ExamViewModel[], now = new Date()) {
    const nowTs = now.getTime();
    return exams.find((exam) => new Date(exam.date + "T" + exam.startTime + ":00").getTime() >= nowTs) ?? exams[0] ?? null;
}

export function buildAbsenceCard(offering: CourseOffering, absenceState: LocalAbsenceState): {
    card: {
        id: string;
        code: string;
        name: string;
        instructor: string;
        totalHours: number;
        usedHours: number;
        remainingHours: number | string;
        status: 'normal' | 'warning' | 'critical';
    };
    entry: LocalAbsenceEntry;
} {
    const entry = absenceState[offering.id] ?? { usedHours: 0, events: [] };
    const totalHours = offering.allowedAbsenceHours ?? Math.max(offering.weeklyHours ?? 0, 1) * 3;
    const remaining = totalHours - entry.usedHours;

    let status: 'normal' | 'warning' | 'critical' = 'normal';
    if (remaining <= 0) {
        status = 'critical';
    } else if (remaining <= 3) {
        status = 'warning';
    }

    return {
        card: {
            id: offering.id,
            code: offering.course.courseCode,
            name: offering.course.courseName,
            instructor: offering.instructorName ?? 'Ogretim Gorevlisi',
            totalHours,
            usedHours: entry.usedHours,
            remainingHours: remaining <= 0 ? '-' : remaining,
            status,
        },
        entry,
    };
}

export function createAbsenceEvent(now = new Date()): LocalAbsenceEvent {
    const isoDate = toLocalIsoDate(now);
    return {
        id: `${now.getTime()}`,
        date: isoDate,
        dayLabel: getDayLabel(isoDate),
        createdAt: now.toISOString(),
    };
}

export function updateAbsenceState(
    current: LocalAbsenceState,
    offeringId: string,
    event: LocalAbsenceEvent
): LocalAbsenceState {
    const previous = current[offeringId] ?? { usedHours: 0, events: [] };

    return {
        ...current,
        [offeringId]: {
            usedHours: previous.usedHours + 1,
            events: [event, ...previous.events],
        },
    };
}

export function undoAbsenceState(current: LocalAbsenceState, offeringId: string): LocalAbsenceState {
    const previous = current[offeringId];
    if (!previous || previous.events.length === 0) {
        return current;
    }

    const nextEvents = previous.events.slice(1);
    if (!nextEvents.length) {
        const clone = { ...current };
        delete clone[offeringId];
        return clone;
    }

    return {
        ...current,
        [offeringId]: {
            usedHours: Math.max(previous.usedHours - 1, 0),
            events: nextEvents,
        },
    };
}

export function removeAbsenceState(current: LocalAbsenceState, offeringId: string): LocalAbsenceState {
    if (!current[offeringId]) {
        return current;
    }

    const clone = { ...current };
    delete clone[offeringId];
    return clone;
}

export function isMenuStillValid(period: CafeteriaMenuPeriod | null, now = new Date()) {
    if (!period) {
        return false;
    }

    return period.validTo >= toLocalIsoDate(now);
}

export function getMenuDayForDate(period: CafeteriaMenuPeriod | null, date = new Date()) {
    if (!period) {
        return null;
    }

    const isoDate = toLocalIsoDate(date);
    return period.days.find((day) => day.serviceDate === isoDate) ?? period.days[0] ?? null;
}

export function getFallbackCourseCatalog(): CourseCatalogItem[] {
    return fallback.courseCatalog;
}
