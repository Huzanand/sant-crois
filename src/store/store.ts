"use client"

import { getAllLessons, getAllFilters, getLessonById, getRecomendations, postUserAnswers } from "@/api/api"
import { IAnswer, IData, IDraft, IFiltersNullable, IState, IStore } from "@/models"
import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { createStore } from "zustand/vanilla"
import { persistentSettingsSlice } from "./slices/persistentSettingsSlice"
import { settingsSlice } from "./slices/settingsSlice"
import { constructorSlice } from "./slices/constructorSlice"


const SYNCED_KEYS = ['selectedInterfaceLanguage', 'selectedLearningLanguage', 'selectedLanguageLevel'];

const syncStorages = (state: any) => {
    if (typeof window === "undefined") return;

    SYNCED_KEYS.forEach((key) => {
        const valueFromState = state[key] !== undefined ? state[key] : null;

        const localValue = localStorage.getItem(key);
        const sessionValue = sessionStorage.getItem(key);

        if (localValue) {
            sessionStorage.setItem(key, localValue);
        } else if (sessionValue) {
            localStorage.setItem(key, sessionValue);
        } else if (valueFromState) {
            const valStr = JSON.stringify(valueFromState);
            localStorage.setItem(key, valStr);
            sessionStorage.setItem(key, valStr);
        }
    });
};

export const initialState: IState = {
    totalCount: 0,
    offset: 0,
    size: 12,

    lessons: [],

    lesson: null,
    relatedContents: [],

    userAnswers: [],
    results: [],

    virtualRoom: null,

    activeTypeOfLesson: 'all',
    primaryTopics: [],
    selectedPrimaryTopics: [],
    secondaryTopics: [],
    selectedSecondaryTopics: [],
    tags: [],
    selectedTags: [],
    targetAgeGroups: [],
    selectedAgeGroup: [],
    sortingOptions: ['rating', 'views', '-views', 'acceptance', '-acceptance', 'languageLevel', '-languageLevel', 'creationDateTime', '-creationDateTime'],
    selectedSorting: 'rating',

    homePageContentHeight: 0,
    resetFiltersIndex: 0,
}

export const Store = (
    initState: IState = initialState,
) => {
    syncStorages({ ...initState });
    return createStore<IStore>()(
        devtools(
            persist(
                (set, get) => {
                    return {
                        ...initState,
                        ...persistentSettingsSlice(set, get, {} as any),
                        ...settingsSlice(set, get, {} as any),
                        ...constructorSlice(set, get, {} as any),

                        fetchLessons: async (size,
                            activeTypeOfLesson,
                            selectedLanguageLevel,
                            selectedLearningLanguage,
                            selectedPrimaryTopics,
                            selectedSecondaryTopics,
                            selectedTags,
                            selectedAgeGroup,
                            selectedSorting,
                            offset) => {
                            const data: IData = await getAllLessons(size,
                                activeTypeOfLesson,
                                selectedLanguageLevel,
                                selectedLearningLanguage,
                                selectedPrimaryTopics,
                                selectedSecondaryTopics,
                                selectedTags,
                                selectedAgeGroup,
                                offset,
                                selectedSorting);
                            set(() => ({
                                lessons: data.lessons,
                                totalCount: data.metaData.totalCount,
                                offset: data.metaData.offset
                            }));
                        },

                        setVirtualRoom: async (newVR) => {
                            set(() => ({
                                virtualRoom: newVR
                            }))
                        },

                        fetchFilters: async () => {
                            const data: IFiltersNullable = await getAllFilters();
                            if (data) {
                                set(() => ({
                                    primaryTopics: data.primaryTopics,
                                    secondaryTopics: data.secondaryTopics,
                                    tags: data.tags,
                                    targetAgeGroups: data.targetAgeGroups,
                                    learningLanguageOptions: data.learningLanguages.map((lang) => lang.toLowerCase()),
                                }));
                            }
                        },

                        fetchLessonById: async (id) => {
                            const lesson = await getLessonById(id);
                            set(() => ({ lesson }));
                        },

                        fetchRecomendations: async (ids) => {
                            if (!Array.isArray(ids)) {
                                throw new Error("Expected an array of IDs");
                            }

                            try {
                                const recomendations = await getRecomendations(ids);

                                set(() => ({ relatedContents: recomendations }));
                            } catch (error) {
                                console.error("Error fetching recommendations:", error);
                            }
                        },

                        clearRecomendations: () => set(() => ({ relatedContents: [] })),

                        setUserAnswers: (newAnswer: IAnswer) => {
                            set((state) => ({
                                userAnswers: state.userAnswers.some((answer) => answer.taskId === newAnswer.taskId)
                                    ? state.userAnswers.map((answer) =>
                                        answer.taskId === newAnswer.taskId ? newAnswer : answer
                                    )
                                    : [...state.userAnswers, newAnswer],
                            }));
                        },

                        clearUserAnswers: () => set({ userAnswers: [] }),
                        clearResults: () => set({ results: [] }),

                        sendUserAnswers: async (
                            lessonId
                        ) => {
                            const {
                                userAnswers
                            } = get();
                            const newResult = await postUserAnswers(
                                lessonId, userAnswers
                            );
                            set(() => ({
                                results: newResult
                            }));
                        },

                        setResults: (newResult) => set({ results: newResult }),

                        setVRAnswers: async (data) => {
                            set(() => ({
                                results: data
                            }));
                        },

                        setSelectedPrimaryTopics: (primaryTopics) => {
                            set(() => ({
                                selectedPrimaryTopics: primaryTopics
                            }))
                        },

                        setSelectedSecondaryTopics: (secondaryTopics) => {
                            set(() => ({
                                selectedSecondaryTopics: secondaryTopics
                            }))
                        },

                        setSelectedTags: (tags) => {
                            set(() => ({
                                selectedTags: tags
                            }))
                        },

                        setSelectedAgeGroup: (ageGroup) => {
                            set(() => ({
                                selectedAgeGroup: ageGroup
                            }))
                        },

                        setActiveTypeOfLesson: (newActiveType) => {
                            set(() => ({
                                activeTypeOfLesson: newActiveType
                            }))
                        },

                        setSize: (inc) => {
                            if (inc === 0) {
                                set(() => ({
                                    size: 12
                                }))
                            } else {
                                set((state) => ({
                                    size: state.size + inc
                                }))
                            }
                        },

                        resetSize: () => {
                            set(() => ({
                                size: 12
                            }))
                        },

                        setOffset: (newOffset) => {
                            const { resetSize } = get();
                            resetSize();
                            set(() => ({
                                offset: newOffset,
                            }));
                        },

                        setHomePageContentHeight: (contentHeight) => {
                            set(() => ({
                                homePageContentHeight: contentHeight
                            }))
                        },

                        clearFilters: () => {
                            set(() => ({
                                selectedPrimaryTopics: [],
                                selectedSecondaryTopics: [],
                                selectedTags: [],
                                selectedAgeGroup: [],
                            }))
                        },

                        resetFilters: () => {
                            const { resetFiltersIndex } = get();
                            set(() => ({
                                resetFiltersIndex: resetFiltersIndex + 1
                            }))
                        },
                    };
                }, {
                name: 'root-storage',
                storage: createJSONStorage(() => sessionStorage),
                partialize: (state) => {
                    const { size, ...persistedState } = state;

                    const stateAny = state as Record<string, any>;

                    Object.keys(stateAny).forEach((key) => {
                        if (SYNCED_KEYS.includes(key) && stateAny[key]) {
                            localStorage.setItem(key, JSON.stringify(stateAny[key]));
                        }
                    });

                    return persistedState;
                },
            })
        )
    );
};