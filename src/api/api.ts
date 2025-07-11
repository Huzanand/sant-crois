import {
    IAnswer, ICard, IData, ILesson, IFiltersNullable,
} from "@/models";
import { interceptorsStore } from "@/store/interceptorsStore";
import axios from "axios";

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
}

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    // baseURL: 'http://localhost:8080',
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        interceptorsStore.getState().setLoading(true);
        interceptorsStore.getState().setError(false);


        return config;
    },
    (error) => {
        interceptorsStore.getState().setLoading(false);
        interceptorsStore.getState().setError(false);

        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        interceptorsStore.getState().setLoading(false);
        return response;
    },
    (error) => {
        interceptorsStore.getState().setLoading(false);
        interceptorsStore.getState().setError(true);
        return Promise.reject(error);
    }
);

export const getAllLessons = async (
    size = 12,
    activeTypeOfLesson: string,
    selectedLanguageLevel: string,
    selectedLearningLanguage: string,
    selectedPrimaryTopics: string[],
    selectedSecondaryTopics: string[],
    selectedTags: string[],
    selectedAgeGroup: string[],
    selectedSorting: string,
    page: number
): Promise<IData> => {

    const endpoint = '/exercises';

    const queryParams = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (activeTypeOfLesson) {
        if (activeTypeOfLesson !== "all") queryParams.append('exerciseType', activeTypeOfLesson.toUpperCase());
    }

    if (selectedPrimaryTopics.length) {
        selectedPrimaryTopics.forEach(topic => queryParams.append('primaryTopics', topic));
    }

    if (selectedSecondaryTopics.length) {
        selectedSecondaryTopics.forEach(topic => queryParams.append('secondaryTopics', topic));
    }

    if (selectedTags.length) {
        selectedTags.forEach(tag => queryParams.append('tags', tag));
    }

    if (selectedLanguageLevel) {
        if (selectedLanguageLevel !== 'All') {
            const languageLevelForBE = selectedLanguageLevel.slice(0, 2);
            queryParams.append('languageLevel', languageLevelForBE);
        }
    }

    if (selectedAgeGroup.length) {
        selectedAgeGroup.forEach(ageGroup => queryParams.append('targetAgeGroup', ageGroup));
    }

    if (selectedLearningLanguage) {
        queryParams.append('learningLanguage', selectedLearningLanguage);
    }

    queryParams.append('sort', `${selectedSorting}`)

    const url = `${endpoint}?${queryParams.toString()}`;

    console.log(`new request url: ${url}`)


    try {
        // const response = await axiosInstance.get(endpoint);
        const response = await axiosInstance.get(url);
        return { metaData: response.data.metaData, lessons: response.data.content, }
    } catch (error) {
        console.error("Error fetching all lessons:", error);
        return { metaData: { totalCount: 0, page: 1, size: 12 }, lessons: [] }
    }
};

export const getLessonById = async (id: string): Promise<ILesson | null> => {

    try {
        const response = await axiosInstance.get(`/exercises/${encodeURIComponent(id)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching lesson by ID: ${id}`, error);
        return null;
    }
};

export const getRecomendations = async (ids: string[]): Promise<ICard[]> => {
    try {
        const recomendations: unknown[] = await Promise.all(ids.map(id => getLessonById(id)));
        return recomendations.filter((recomendation): recomendation is ICard => recomendation !== null);
    } catch (error) {
        console.error("Error fetching recomendations:", error);
        throw error;
    }
};

export const postUserAnswers = async (
    lessonId: string,
    answers: IAnswer[]
) => {
    try {
        const response = await axiosInstance.post(`/exercises/${lessonId}/answers`, answers);
        return response.data;
    } catch (error) {
        console.error(`Error sending user answers:`, error);
        throw error;
    }
}

export const getAllFilters = async (): Promise<IFiltersNullable> => {

    try {
        const filters = await axiosInstance.get("/exercises/filters")
        return filters.data
    } catch (error) {
        console.error("Error fetching all filters:", error);
        return null
    }
};
