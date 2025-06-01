"use client"

import { getAllLessons, getAllFilters, getLessonById, getRecomendations, postUserAnswers } from "@/api/api"
import { IAnswer, IData, IFiltersNullable, IState, IStore } from "@/models"
import { devtools, persist } from "zustand/middleware"
import { createStore } from "zustand/vanilla"
import { getFromLocalStorage, setToLocalStorage } from "./localStorageUtils"



export const initialState: IState = {
    totalCount: 0,
    page: 1,
    size: 12,
    lessons: [],
    lesson: null,
    userAnswers: [],
    results: [],
    activeTypeOfLesson: 'show all',
    selectedLanguageLevel: 'A1',
    languageLevelOptions: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    selectedInterfaceLanguage: "ukrainian",
    interfaceLanguageOptions: [],
    selectedLearningLanguage: 'Ukrainian',
    learningLanguageOptions: [],
    primaryTopics: [],
    selectedPrimaryTopics: [],
    secondaryTopics: [],
    selectedSecondaryTopics: [],
    tags: [],
    selectedTags: [],
    targetAgeGroups: [],
    selectedAgeGroup: [],
    virtualKeyboard: false,
    sortingOptions: ['default', 'author', 'views', 'acceptance', 'rating', 'language level', 'age', 'data'],
    selectedSorting: 'default',
    relatedContents: [],
}

export const Store = (
    initState: IState = initialState,
) => {
    return createStore<IStore>()(
        devtools(
            persist(
                (set, get) => {
                    const initialStateWithLocalStorage = {
                        ...initState,
                        selectedInterfaceLanguage: getFromLocalStorage('selectedInterfaceLanguage', initState.selectedInterfaceLanguage),
                        selectedLearningLanguage: getFromLocalStorage('selectedLearningLanguage', initState.selectedLearningLanguage),
                        selectedLanguageLevel: getFromLocalStorage('selectedLanguageLevel', initState.selectedLanguageLevel),
                        results: getFromLocalStorage('results', initState.results),
                    };

                    return {
                        ...initialStateWithLocalStorage,

                        fetchLessons: async (size,
                            activeTypeOfLesson,
                            selectedLanguageLevel,
                            selectedLearningLanguage,
                            selectedPrimaryTopics,
                            selectedSecondaryTopics,
                            selectedTags,
                            selectedAgeGroup,
                            selectedSorting,
                            page) => {
                            const data: IData = await getAllLessons(size,
                                activeTypeOfLesson,
                                selectedLanguageLevel,
                                selectedLearningLanguage,
                                selectedPrimaryTopics,
                                selectedSecondaryTopics,
                                selectedTags,
                                selectedAgeGroup,
                                page,
                                selectedSorting);
                            set(() => ({
                                lessons: data.lessons,
                                totalCount: data.metaData.totalCount,
                                page: data.metaData.page
                            }));
                        },

                        fetchFilters: async () => {
                            const data: IFiltersNullable = await getAllFilters();
                            if (data) {
                                set(() => ({
                                    interfaceLanguageOptions: data.learningLanguages.map((lang) => lang.toLowerCase()),
                                    learningLanguageOptions: data.learningLanguages.map((lang) => lang.toLowerCase()),
                                    primaryTopics: data.primaryTopics,
                                    secondaryTopics: data.secondaryTopics,
                                    tags: data.tags,
                                    targetAgeGroups: data.targetAgeGroups,
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
                            // lessonId
                        ) => {
                            const {
                                // userAnswers 
                            } = get();
                            const newResult = await postUserAnswers(
                                // lessonId, userAnswers
                            );
                            set(() => ({
                                results: newResult
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

                        onSelectChange: (selectName, value) => {
                            set(() => ({
                                [selectName]: value,
                            }));

                            if (selectName === 'selectedInterfaceLanguage') {
                                setToLocalStorage('selectedInterfaceLanguage', value)
                            }
                            if (selectName === 'selectedLearningLanguage') {
                                setToLocalStorage('selectedLearningLanguage', value)
                            }
                            if (selectName === 'selectedLanguageLevel') {
                                setToLocalStorage('selectedLanguageLevel', value)
                            }
                        },

                        setActiveTypeOfLesson: (newActiveType) => {
                            set(() => ({
                                activeTypeOfLesson: newActiveType
                            }))
                        },

                        toggleVirtualKeyboard: () =>
                            set((state) => ({
                                virtualKeyboard: !state.virtualKeyboard,
                            })),



                        setSize: (inc) => {
                            set((state) => ({
                                size: state.size + inc
                            }))
                        },

                        resetSize: () => {
                            set(() => ({
                                size: 12
                            }))
                        },

                        setPage: (newPage) => {
                            const { resetSize } = get();
                            resetSize();
                            set(() => ({
                                page: newPage,
                            }));
                        },

                        rehydrateState: () => {
                            const storedState = sessionStorage.getItem('lesson-storage');
                            if (storedState) {
                                set(JSON.parse(storedState));
                            }
                        },
                    };
                }, {
                name: 'lesson-storage',
                storage: {
                    getItem: (key) => {
                        const data = sessionStorage.getItem(key);
                        if (!data) return null;
                        const parsed = JSON.parse(data);
                        return { ...parsed, state: { ...parsed.state, size: parsed.state?.size || 12 } };
                    },
                    setItem: (key, value) => {
                        const { state, ...rest } = JSON.parse(JSON.stringify(value));
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { size, ...persistedState } = state;
                        sessionStorage.setItem(key, JSON.stringify({ ...rest, state: persistedState }));
                    },

                    removeItem: (key) => {
                        sessionStorage.removeItem(key);
                    },
                },
            })
        )
    );
};

