import {
    // IAnswer,
    ICard, ICheckAnswers, IData, ILesson, IFiltersNullable
} from "@/models";
import { interceptorsStore } from "@/store/interceptorsStore";
import axios from "axios";

if (!process.env.NEXT_PUBLIC_CONTENT_URL) {
    throw new Error("NEXT_PUBLIC_CONTENT_URL is not defined in environment variables");
}

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CONTENT_URL,
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

    const endpoint = '/content';

    const queryParams = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (activeTypeOfLesson) {
        if (activeTypeOfLesson !== "ALL") queryParams.append('exerciseType', activeTypeOfLesson);
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
        const languageLevelForBE = selectedLanguageLevel.slice(0, 2);
        queryParams.append('languageLevel', languageLevelForBE);
    }

    if (selectedAgeGroup.length) {
        selectedAgeGroup.forEach(ageGroup => queryParams.append('targetAgeGroup', ageGroup));
    }

    if (selectedLearningLanguage) {
        queryParams.append('learningLanguage', selectedLearningLanguage.toUpperCase());
    }

    if (selectedSorting && selectedSorting !== 'Default') {
        queryParams.append('sort', selectedSorting.toLowerCase())
    }

    const url = `${endpoint}?${queryParams.toString()}`;

    console.log(`new request url: ${url}`)


    try {
        // const response = await axiosInstance.get("/exercises");
        const [response1, response2] = await Promise.all([
            axiosInstance.get("/metaData"),
            axiosInstance.get("/content")
        ]);
        return { metaData: response1.data, lessons: response2.data, }
    } catch (error) {
        console.error("Error fetching all lessons:", error);
        return { metaData: { totalCount: 0, page: 0, size: 0 }, lessons: [] }
    }
};

export const getLessonById = async (id: string): Promise<ILesson | null> => {

    try {
        const response = await axiosInstance.get(`/content/${encodeURIComponent(id)}`);
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
    // lessonId: string, 
    // answers: IAnswer[]
) => {
    try {
        // const response = await axiosInstance.post(`/answers`, answers);
        const simulatedResponse: ICheckAnswers[] = [
            {
                taskId: "666b16d5c196ad000000cc99",
                questions: [
                    {
                        questionId: "0",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 1"],
                        result: true,
                    },
                    {
                        questionId: "1",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 2"],
                        result: false,
                    },
                    {
                        questionId: "2",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 3"],
                        result: true,
                    },
                    {
                        questionId: "3",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 4"],
                        result: false,
                    },
                    {
                        questionId: "4",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 5"],
                        result: true,
                    },
                    {
                        questionId: "5",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 6"],
                        result: false,
                    },
                    {
                        questionId: "6",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 7"],
                        result: true,
                    },
                    {
                        questionId: "7",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 8"],
                        result: false,
                    },
                    {
                        questionId: "8",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 9"],
                        result: true,
                    },
                    {
                        questionId: "9",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 10"],
                        result: false,
                    },
                    {
                        questionId: "10",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 11"],
                        result: true,
                    },
                    {
                        questionId: "11",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 12"],
                        result: false,
                    },
                    {
                        questionId: "12",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 13"],
                        result: true,
                    },
                    {
                        questionId: "13",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 14"],
                        result: false,
                    },
                    {
                        questionId: "14",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 15"],
                        result: true,
                    },
                    {
                        questionId: "15",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 16"],
                        result: false,
                    },
                ],
            },
            {
                taskId: "667fdb52f97d65000082ac45",
                questions: [
                    {
                        questionId: "0",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 1"],
                        result: true,
                    },
                    {
                        questionId: "1",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 2"],
                        result: false,
                    },
                    {
                        questionId: "2",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 3"],
                        result: true,
                    },
                    {
                        questionId: "3",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 4"],
                        result: false,
                    },
                    {
                        questionId: "4",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 5"],
                        result: true,
                    },
                    {
                        questionId: "5",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 6"],
                        result: false,
                    },
                    {
                        questionId: "6",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 7"],
                        result: true,
                    },
                    {
                        questionId: "7",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 8"],
                        result: false,
                    },
                    {
                        questionId: "8",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 9"],
                        result: true,
                    },
                    {
                        questionId: "9",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 10"],
                        result: false,
                    },
                    {
                        questionId: "10",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 11"],
                        result: true,
                    },
                    {
                        questionId: "11",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 12"],
                        result: false,
                    },
                    {
                        questionId: "12",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 13"],
                        result: true,
                    },
                    {
                        questionId: "13",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 14"],
                        result: false,
                    },
                    {
                        questionId: "14",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 15"],
                        result: true,
                    },
                    {
                        questionId: "15",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 16"],
                        result: false,
                    },
                ],
            },
            {
                taskId: "666b16d5c196ad000000cf53",
                questions: [
                    {
                        questionId: "0",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 1"],
                        result: true,
                    },
                    {
                        questionId: "1",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 2"],
                        result: false,
                    },
                    {
                        questionId: "2",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 3"],
                        result: true,
                    },
                    {
                        questionId: "3",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 4"],
                        result: false,
                    },
                    {
                        questionId: "4",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 5"],
                        result: true,
                    },
                    {
                        questionId: "5",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 6"],
                        result: false,
                    },
                    {
                        questionId: "6",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 7"],
                        result: true,
                    },
                    {
                        questionId: "7",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 8"],
                        result: false,
                    },
                    {
                        questionId: "8",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 9"],
                        result: true,
                    },
                    {
                        questionId: "9",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 10"],
                        result: false,
                    },
                    {
                        questionId: "10",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 11"],
                        result: true,
                    },
                    {
                        questionId: "11",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 12"],
                        result: false,
                    },
                    {
                        questionId: "12",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 13"],
                        result: true,
                    },
                    {
                        questionId: "13",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 14"],
                        result: false,
                    },
                    {
                        questionId: "14",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 15"],
                        result: true,
                    },
                    {
                        questionId: "15",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 16"],
                        result: false,
                    },
                ],
            },
            {
                taskId: "667fdb52f97d65000082a445",
                questions: [
                    {
                        questionId: "0",
                        questionDescription: "Question Description",
                        rightAnswers: ["right option 1"],
                        result: true,
                    },
                    {
                        questionId: "1",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 2"],
                        result: false,
                    },
                    {
                        questionId: "2",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 3"],
                        result: true,
                    },
                    {
                        questionId: "3",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 4"],
                        result: false,
                    },
                    {
                        questionId: "4",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 5"],
                        result: true,
                    },
                    {
                        questionId: "5",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 6"],
                        result: false,
                    },
                    {
                        questionId: "6",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 7"],
                        result: true,
                    },
                    {
                        questionId: "7",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 8"],
                        result: false,
                    },
                    {
                        questionId: "8",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 9"],
                        result: true,
                    },
                    {
                        questionId: "9",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 10"],
                        result: false,
                    },
                    {
                        questionId: "10",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 11"],
                        result: true,
                    },
                    {
                        questionId: "11",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 12"],
                        result: false,
                    },
                    {
                        questionId: "12",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 13"],
                        result: true,
                    },
                    {
                        questionId: "13",
                        questionDescription: "Question Description",
                        rightAnswers: ["right 14"],
                        result: false,
                    },
                    {
                        questionId: "14",
                        questionDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat erat, feugiat porta arcu in, tincidunt cursus nisi. Nunc sem mauris, dictum at tortor hendrerit, luctus posuere ligula. Sed condimentum ligula sed dolor eleifend, id vehicula orci eleifend. Vestibulum ullamcorper ex laoreet mauris iaculis blandit. Suspendisse mattis, ipsum sed finibus.",
                        rightAnswers: ["right 15"],
                        result: true,
                    },
                    {
                        questionId: "15",
                        questionDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat erat, feugiat porta arcu in, tincidunt cursus nisi. Nunc sem mauris, dictum at tortor hendrerit, luctus posuere ligula. Sed condimentum ligula sed dolor eleifend, id vehicula orci eleifend. Vestibulum ullamcorper ex laoreet mauris iaculis blandit. Suspendisse mattis, ipsum sed finibus.",
                        rightAnswers: ["right 16"],
                        result: false,
                    },
                ],
            },
            {
                taskId: "66582402b98b3700005b929e",
                questions: [
                    {
                        questionId: "665825ccb98b3700005b929e",
                        questionDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat erat, feugiat porta arcu in, tincidunt cursus nisi. Nunc sem mauris, dictum at tortor hendrerit, luctus posuere ligula. Sed condimentum ligula sed dolor eleifend, id vehicula orci eleifend. Vestibulum ullamcorper ex laoreet mauris iaculis blandit. Suspendisse mattis, ipsum sed finibus.",
                        rightAnswers: ["right answer 1"],
                        result: true,
                    },
                    {
                        questionId: "665826ebb98b3700005b929f",
                        questionDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat erat, feugiat porta arcu in, tincidunt cursus nisi. Nunc sem mauris, dictum at tortor hendrerit, luctus posuere ligula. Sed condimentum ligula sed dolor eleifend, id vehicula orci eleifend. Vestibulum ullamcorper ex laoreet mauris iaculis blandit. Suspendisse mattis, ipsum sed finibus.",
                        rightAnswers: ["right answer 2"],
                        result: false,
                    },
                    {
                        questionId: "66582743b98b3700005b92a0",
                        questionDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat erat, feugiat porta arcu in, tincidunt cursus nisi. Nunc sem mauris, dictum at tortor hendrerit, luctus posuere ligula. Sed condimentum ligula sed dolor eleifend, id vehicula orci eleifend. Vestibulum ullamcorper ex laoreet mauris iaculis blandit. Suspendisse mattis, ipsum sed finibus.",
                        rightAnswers: ["right answer 3"],
                        result: true,
                    },
                ],
            }, {
                taskId: "66582402b98b3555005b929d",
                questions: [
                    {
                        questionId: "665825ccb98b3755005b929e",
                        questionDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat erat, feugiat porta arcu in, tincidunt cursus nisi. Nunc sem mauris, dictum at tortor hendrerit, luctus posuere ligula. Sed condimentum ligula sed dolor eleifend, id vehicula orci eleifend. Vestibulum ullamcorper ex laoreet mauris iaculis blandit. Suspendisse mattis, ipsum sed finibus.",
                        rightAnswers: ["true"],
                        result: true,
                    },
                    {
                        questionId: "665826ebb98b3755005b929f",
                        questionDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat erat, feugiat porta arcu in, tincidunt cursus nisi. Nunc sem mauris, dictum at tortor hendrerit, luctus posuere ligula. Sed condimentum ligula sed dolor eleifend, id vehicula orci eleifend. Vestibulum ullamcorper ex laoreet mauris iaculis blandit. Suspendisse mattis, ipsum sed finibus.",
                        rightAnswers: ["not specified"],
                        result: false,
                    },
                    {
                        questionId: "66582743b98b3755005b92a0",
                        questionDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat erat, feugiat porta arcu in, tincidunt cursus nisi. Nunc sem mauris, dictum at tortor hendrerit, luctus posuere ligula. Sed condimentum ligula sed dolor eleifend, id vehicula orci eleifend. Vestibulum ullamcorper ex laoreet mauris iaculis blandit. Suspendisse mattis, ipsum sed finibus.",
                        rightAnswers: ["not specified"],
                        result: true,
                    },
                ],
            },
        ];

        return simulatedResponse;
    } catch (error) {
        console.error(`Error sending user answers:`, error);
        throw error;
    }
}

export const getAllFilters = async (): Promise<IFiltersNullable> => {

    try {
        // const response = await axiosInstance.get("/exercises");
        const filters = await axiosInstance.get("/filters")
        return filters.data
    } catch (error) {
        console.error("Error fetching all filters:", error);
        return null
    }
};
