"use client";

import {
  getAllLessons,
  getAllFilters,
  getLessonById,
  getRecomendations,
  postUserAnswers,
} from "@/api/api";
import { IAnswer, IData, IFiltersNullable, IState, IStore } from "@/models";
import { devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { getFromLocalStorage, setToLocalStorage } from "./localStorageUtils";
import axios from "axios";

let activeGetLessonsAbortController: AbortController | null = null;
let activeGetLessonByIdAbortController: AbortController | null = null;

export const initialState: IState = {
  totalCount: 0,
  offset: 0,
  size: 12,
  lessons: [],
  lesson: null,
  virtualRoom: null,
  userAnswers: [],
  results: [],
  activeTypeOfLesson: "all",
  selectedLanguageLevel: "All",
  languageLevelOptions: ["All", "A1", "A2", "B1", "B2", "C1", "C2"],
  selectedInterfaceLanguage: "English",
  interfaceLanguageOptions: ["Ukrainian", "English", "French", "German"],
  selectedLearningLanguage: "english",
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
  sortingOptions: [
    "rating",
    "views",
    "-views",
    "acceptance",
    "-acceptance",
    "languageLevel",
    "-languageLevel",
    "creationDateTime",
    "-creationDateTime",
  ],
  selectedSorting: "rating",
  relatedContents: [],
  homePageContentHeight: 0,
  openInDev: false,
  resetFiltersIndex: 0,
};

export const Store = (initState: IState = initialState) => {
  return createStore<IStore>()(
    devtools(
      persist(
        (set, get) => {
          const initialStateWithLocalStorage = {
            ...initState,
          };

          return {
            ...initialStateWithLocalStorage,

            loadFromLocalStorage: () => {
              if (typeof window === "undefined") return;
              set({
                selectedInterfaceLanguage: getFromLocalStorage(
                  "selectedInterfaceLanguage",
                  initState.selectedInterfaceLanguage
                    ? initState.selectedInterfaceLanguage
                    : "english",
                ),
                selectedLearningLanguage: getFromLocalStorage(
                  "selectedLearningLanguage",
                  initState.selectedLearningLanguage
                    ? initState.selectedLearningLanguage
                    : "english",
                ),
                selectedLanguageLevel: getFromLocalStorage(
                  "selectedLanguageLevel",
                  initState.selectedLanguageLevel
                    ? initState.selectedLanguageLevel
                    : "en",
                ),
                results: getFromLocalStorage("results", initState.results),
              });
            },

            fetchLessons: async (
              size,
              activeTypeOfLesson,
              selectedLanguageLevel,
              selectedLearningLanguage,
              selectedPrimaryTopics,
              selectedSecondaryTopics,
              selectedTags,
              selectedAgeGroup,
              selectedSorting,
              offset,
            ) => {
              if (activeGetLessonsAbortController) {
                activeGetLessonsAbortController.abort();
              }

              const controller = new AbortController();
              activeGetLessonsAbortController = controller;

              try {
                const data: IData = await getAllLessons({
                  size,
                  activeTypeOfLesson,
                  selectedLanguageLevel,
                  selectedLearningLanguage,
                  selectedPrimaryTopics,
                  selectedSecondaryTopics,
                  selectedTags,
                  selectedAgeGroup,
                  selectedSorting,
                  offset,
                  abortSignal: controller.signal,
                });

                if (!controller.signal.aborted) {
                  set(() => ({
                    lessons: data.lessons,
                    totalCount: data.metaData.totalCount,
                    offset: data.metaData.offset,
                  }));
                }
              } catch (error) {
                if (
                  axios.isCancel(error) ||
                  (error instanceof Error && error.name === "CanceledError")
                ) {
                  console.log("Request canceled, state update bypassed.");
                  return;
                }
                console.error("Failed to fetch lessons:", error);
              } finally {
                if (activeGetLessonsAbortController === controller) {
                  activeGetLessonsAbortController = null;
                }
              }
            },

            setVirtualRoom: async (newVR) => {
              set(() => ({
                virtualRoom: newVR,
              }));
            },

            fetchFilters: async () => {
              const data: IFiltersNullable = await getAllFilters();
              if (data) {
                set(() => ({
                  primaryTopics: data.primaryTopics,
                  secondaryTopics: data.secondaryTopics,
                  tags: data.tags,
                  targetAgeGroups: data.targetAgeGroups,
                  learningLanguageOptions: data.learningLanguages.map((lang) =>
                    lang.toLowerCase(),
                  ),
                }));
              }
            },

            fetchLessonById: async (id) => {
              if (activeGetLessonByIdAbortController) {
                activeGetLessonByIdAbortController.abort();
              }

              const controller = new AbortController();
              activeGetLessonByIdAbortController = controller;

              try {
                const lesson = await getLessonById(id, controller.signal);
                if (!controller.signal.aborted) {
                  set(() => ({ lesson }));
                }
              } catch (error) {
                if (
                  axios.isCancel(error) ||
                  (error instanceof Error && error.name === "CanceledError")
                ) {
                  console.log("Request canceled, state update bypassed.");
                  return;
                }
                console.error(`Failed to fetch lesson with id ${id}:`, error);
              } finally {
                if (activeGetLessonByIdAbortController === controller) {
                  activeGetLessonByIdAbortController = null;
                }
              }
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
                userAnswers: state.userAnswers.some(
                  (answer) => answer.taskId === newAnswer.taskId,
                )
                  ? state.userAnswers.map((answer) =>
                      answer.taskId === newAnswer.taskId ? newAnswer : answer,
                    )
                  : [...state.userAnswers, newAnswer],
              }));
            },

            clearUserAnswers: () => set({ userAnswers: [] }),
            clearResults: () => set({ results: [] }),

            sendUserAnswers: async (lessonId) => {
              const { userAnswers } = get();
              const newResult = await postUserAnswers(lessonId, userAnswers);
              set(() => ({
                results: newResult,
              }));
            },

            setResults: (newResult) => set({ results: newResult }),

            setVRAnswers: async (data) => {
              set(() => ({
                results: data,
              }));
            },

            onSelectChange: (selectName, value) => {
              set(() => ({
                [selectName]: value,
              }));

              if (selectName === "selectedInterfaceLanguage") {
                setToLocalStorage("selectedInterfaceLanguage", value);
              }
              if (selectName === "selectedLearningLanguage") {
                setToLocalStorage("selectedLearningLanguage", value);
              }
              if (selectName === "selectedLanguageLevel") {
                setToLocalStorage("selectedLanguageLevel", value);
              }
            },

            toggleVirtualKeyboard: () =>
              set((state) => ({
                virtualKeyboard: !state.virtualKeyboard,
              })),

            setSize: (inc) => {
              if (inc === 0) {
                set(() => ({
                  size: 12,
                }));
              } else {
                set((state) => ({
                  size: state.size + inc,
                }));
              }
            },

            resetSize: () => {
              set(() => ({
                size: 12,
              }));
            },

            setOffset: (newOffset) => {
              const { resetSize } = get();
              resetSize();
              set(() => ({
                offset: newOffset,
              }));
            },

            rehydrateState: () => {
              const storedState = sessionStorage.getItem("lesson-storage");
              if (storedState) {
                set(JSON.parse(storedState));
              }
            },

            setHomePageContentHeight: (contentHeight) => {
              set(() => ({
                homePageContentHeight: contentHeight,
              }));
            },

            setOpenInDev: (newState) => {
              set(() => ({
                openInDev: newState,
              }));
            },
          };
        },
        {
          name: "lesson-storage",
          storage: {
            getItem: (key) => {
              if (typeof window === "undefined") return null;
              const data = sessionStorage.getItem(key);
              if (!data) return null;
              const parsed = JSON.parse(data);
              return {
                ...parsed,
                state: { ...parsed.state, size: parsed.state?.size || 12 },
              };
            },
            setItem: (key, value) => {
              if (typeof window === "undefined") return;
              const { state, ...rest } = JSON.parse(JSON.stringify(value));
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { size, ...persistedState } = state;
              sessionStorage.setItem(
                key,
                JSON.stringify({ ...rest, state: persistedState }),
              );
            },

            removeItem: (key) => {
              if (typeof window === "undefined") return;
              sessionStorage.removeItem(key);
            },
          },
        },
      ),
    ),
  );
};
