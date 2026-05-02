import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
    buildAbsenceCard,
    buildExamViewModels,
    buildTimetableEntries,
    createAbsenceEvent,
    fetchActiveTerm,
    fetchCafeteriaMenuPeriod,
    fetchDepartments,
    fetchOfficialOfferings,
    fetchOfferingsByIds,
    getMenuDayForDate,
    getNextExam,
    getTodayTimetableEntries,
    isMenuStillValid,
    removeAbsenceState,
    searchOfferings,
    sortOfferings,
    undoAbsenceState,
    updateAbsenceState,
} from '../lib/academicService';
import type {
    AcademicTerm,
    CafeteriaMenuDay,
    CafeteriaMenuPeriod,
    CourseOffering,
    Department,
    ExamViewModel,
    LocalAbsenceEvent,
    LocalAbsenceState,
    LocalCourseOverride,
    SelectableOffering,
    TimetableEntry,
} from '../lib/domain';
import {
    loadAbsenceState,
    loadCourseOverrides,
    loadMenuCache,
    saveAbsenceState,
    saveCourseOverrides,
    saveMenuCache,
} from '../lib/localStore';
import { useAuth } from './AuthContext';

interface AcademicContextType {
    loading: boolean;
    error: string | null;
    departments: Department[];
    activeTerm: AcademicTerm | null;
    officialOfferings: CourseOffering[];
    effectiveOfferings: CourseOffering[];
    timetableEntries: TimetableEntry[];
    todayTimetable: TimetableEntry[];
    examList: ExamViewModel[];
    nextExam: ExamViewModel | null;
    menuPeriod: CafeteriaMenuPeriod | null;
    todaysMenu: CafeteriaMenuDay | null;
    overrides: LocalCourseOverride;
    absenceState: LocalAbsenceState;
    refreshAcademicData: () => Promise<void>;
    searchAvailableOfferings: (query: string) => Promise<SelectableOffering[]>;
    addLocalOffering: (offering: CourseOffering) => Promise<void>;
    removeOffering: (offeringId: string) => Promise<void>;
    getOfferingById: (offeringId: string) => CourseOffering | undefined;
    getAbsenceEvents: (offeringId: string) => LocalAbsenceEvent[];
    getAbsenceCard: (offeringId: string) => ReturnType<typeof buildAbsenceCard>['card'] | null;
    recordAbsence: (offeringId: string) => Promise<void>;
    undoLastAbsence: (offeringId: string) => Promise<void>;
}

const AcademicContext = createContext<AcademicContextType>({
    loading: true,
    error: null,
    departments: [],
    activeTerm: null,
    officialOfferings: [],
    effectiveOfferings: [],
    timetableEntries: [],
    todayTimetable: [],
    examList: [],
    nextExam: null,
    menuPeriod: null,
    todaysMenu: null,
    overrides: { addedOfferingIds: [], removedOfferingIds: [] },
    absenceState: {},
    refreshAcademicData: async () => {},
    searchAvailableOfferings: async () => [],
    addLocalOffering: async () => {},
    removeOffering: async () => {},
    getOfferingById: () => undefined,
    getAbsenceEvents: () => [],
    getAbsenceCard: () => null,
    recordAbsence: async () => {},
    undoLastAbsence: async () => {},
});

export function AcademicProvider({ children }: { children: React.ReactNode }) {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [activeTerm, setActiveTerm] = useState<AcademicTerm | null>(null);
    const [officialOfferings, setOfficialOfferings] = useState<CourseOffering[]>([]);
    const [addedOfferings, setAddedOfferings] = useState<CourseOffering[]>([]);
    const [overrides, setOverrides] = useState<LocalCourseOverride>({ addedOfferingIds: [], removedOfferingIds: [] });
    const [absenceState, setAbsenceState] = useState<LocalAbsenceState>({});
    const [menuPeriod, setMenuPeriod] = useState<CafeteriaMenuPeriod | null>(null);

    const refreshAcademicData = async () => {
        if (!profile) {
            setDepartments([]);
            setActiveTerm(null);
            setOfficialOfferings([]);
            setAddedOfferings([]);
            setOverrides({ addedOfferingIds: [], removedOfferingIds: [] });
            setAbsenceState({});
            setMenuPeriod(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [nextDepartments, nextTerm] = await Promise.all([
                fetchDepartments(),
                fetchActiveTerm(),
            ]);

            const [nextOverrides, nextAbsenceState, nextOfficialOfferings] = await Promise.all([
                loadCourseOverrides(profile.id, nextTerm.id),
                loadAbsenceState(profile.id, nextTerm.id),
                fetchOfficialOfferings(profile, nextTerm.id),
            ]);

            const nextAddedOfferings = nextOverrides.addedOfferingIds.length
                ? await fetchOfferingsByIds(nextOverrides.addedOfferingIds)
                : [];

            const cachedMenu = await loadMenuCache<CafeteriaMenuPeriod>();
            let nextMenu = cachedMenu && isMenuStillValid(cachedMenu) ? cachedMenu : null;

            if (!nextMenu) {
                nextMenu = await fetchCafeteriaMenuPeriod();
                if (nextMenu) {
                    await saveMenuCache(nextMenu);
                }
            }

            setDepartments(nextDepartments);
            setActiveTerm(nextTerm);
            setOverrides(nextOverrides);
            setAbsenceState(nextAbsenceState);
            setOfficialOfferings(sortOfferings(nextOfficialOfferings));
            setAddedOfferings(sortOfferings(nextAddedOfferings));
            setMenuPeriod(nextMenu);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Akademik veriler yuklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void refreshAcademicData();
    }, [profile?.id]);

    const effectiveOfferings = useMemo(() => {
        const merged = new Map<string, CourseOffering>();

        officialOfferings.forEach((offering) => merged.set(offering.id, offering));
        addedOfferings.forEach((offering) => merged.set(offering.id, offering));
        overrides.removedOfferingIds.forEach((offeringId) => merged.delete(offeringId));

        return sortOfferings(Array.from(merged.values()));
    }, [officialOfferings, addedOfferings, overrides]);

    const timetableEntries = useMemo(() => buildTimetableEntries(effectiveOfferings), [effectiveOfferings]);
    const todayTimetable = useMemo(() => getTodayTimetableEntries(effectiveOfferings), [effectiveOfferings]);
    const examList = useMemo(() => buildExamViewModels(effectiveOfferings), [effectiveOfferings]);
    const nextExam = useMemo(() => getNextExam(examList), [examList]);
    const todaysMenu = useMemo(() => getMenuDayForDate(menuPeriod), [menuPeriod]);

    const persistOverrides = async (nextOverrides: LocalCourseOverride) => {
        if (!profile || !activeTerm) {
            return;
        }

        setOverrides(nextOverrides);
        await saveCourseOverrides(profile.id, activeTerm.id, nextOverrides);
    };

    const persistAbsenceState = async (nextAbsenceState: LocalAbsenceState) => {
        if (!profile || !activeTerm) {
            return;
        }

        setAbsenceState(nextAbsenceState);
        await saveAbsenceState(profile.id, activeTerm.id, nextAbsenceState);
    };

    const searchAvailableOfferings = async (query: string) => {
        if (!activeTerm || !profile) {
            return [];
        }

        const result = await searchOfferings(query, activeTerm.id, profile.departmentId);
        const excluded = new Set(effectiveOfferings.map((offering) => offering.id));
        return result.filter((offering) => !excluded.has(offering.id));
    };

    const addLocalOffering = async (offering: CourseOffering) => {
        const isOfficial = officialOfferings.some((item) => item.id === offering.id);
        const nextOverrides: LocalCourseOverride = {
            addedOfferingIds: isOfficial
                ? overrides.addedOfferingIds
                : Array.from(new Set([...overrides.addedOfferingIds, offering.id])),
            removedOfferingIds: overrides.removedOfferingIds.filter((item) => item !== offering.id),
        };

        if (!isOfficial) {
            setAddedOfferings((current) => sortOfferings([...current.filter((item) => item.id !== offering.id), offering]));
        }

        await persistOverrides(nextOverrides);
    };

    const removeOffering = async (offeringId: string) => {
        const isOfficial = officialOfferings.some((item) => item.id === offeringId);
        const nextOverrides: LocalCourseOverride = {
            addedOfferingIds: overrides.addedOfferingIds.filter((item) => item !== offeringId),
            removedOfferingIds: isOfficial
                ? Array.from(new Set([...overrides.removedOfferingIds, offeringId]))
                : overrides.removedOfferingIds.filter((item) => item !== offeringId),
        };

        setAddedOfferings((current) => current.filter((item) => item.id !== offeringId));
        await persistOverrides(nextOverrides);
        await persistAbsenceState(removeAbsenceState(absenceState, offeringId));
    };

    const getOfferingById = (offeringId: string) => {
        return effectiveOfferings.find((offering) => offering.id === offeringId);
    };

    const getAbsenceEvents = (offeringId: string) => {
        return absenceState[offeringId]?.events ?? [];
    };

    const getAbsenceCard = (offeringId: string) => {
        const offering = getOfferingById(offeringId);
        if (!offering) {
            return null;
        }

        return buildAbsenceCard(offering, absenceState).card;
    };

    const recordAbsence = async (offeringId: string) => {
        const nextAbsenceState = updateAbsenceState(absenceState, offeringId, createAbsenceEvent());
        await persistAbsenceState(nextAbsenceState);
    };

    const undoLastAbsence = async (offeringId: string) => {
        const nextAbsenceState = undoAbsenceState(absenceState, offeringId);
        await persistAbsenceState(nextAbsenceState);
    };

    return (
        <AcademicContext.Provider
            value={{
                loading,
                error,
                departments,
                activeTerm,
                officialOfferings,
                effectiveOfferings,
                timetableEntries,
                todayTimetable,
                examList,
                nextExam,
                menuPeriod,
                todaysMenu,
                overrides,
                absenceState,
                refreshAcademicData,
                searchAvailableOfferings,
                addLocalOffering,
                removeOffering,
                getOfferingById,
                getAbsenceEvents,
                getAbsenceCard,
                recordAbsence,
                undoLastAbsence,
            }}
        >
            {children}
        </AcademicContext.Provider>
    );
}

export function useAcademic() {
    return useContext(AcademicContext);
}
