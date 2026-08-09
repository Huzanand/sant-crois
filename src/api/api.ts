import { IAnswer, ICard, IData, ILesson, IFiltersNullable } from "@/models";
import { interceptorsStore } from "@/store/interceptorsStore";
import axios from "axios";

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not defined in environment variables",
  );
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
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
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    interceptorsStore.getState().setLoading(false);

    return response;
  },
  (error) => {
    interceptorsStore.getState().setLoading(false);

    if (!axios.isCancel(error)) {
      interceptorsStore.getState().setError(true);
    }

    return Promise.reject(error);
  },
);

interface FetchLessonsParams {
  size?: number;
  activeTypeOfLesson?: string;
  selectedLanguageLevel?: string;
  selectedLearningLanguage?: string;
  selectedPrimaryTopics?: string[];
  selectedSecondaryTopics?: string[];
  selectedTags?: string[];
  selectedAgeGroup?: string[];
  selectedSorting?: string;
  params?: string;
  offset?: number;
  abortSignal?: AbortSignal;
}

// export const getAllLessons = async ({
//   size = 12,
//   offset = 0,
//   selectedLanguageLevel = "",
//   selectedLearningLanguage = "",
//   params = "",
//   abortSignal,
// }: FetchLessonsParams = {}): Promise<IData> => {
//   const endpoint = "/exercises";

//   const queryParams = new URLSearchParams({
//     offset: String(offset),
//     size: String(size),
//   });

//   if (selectedLanguageLevel && selectedLanguageLevel !== "All") {
//     const languageLevelForBE = selectedLanguageLevel.slice(0, 2);
//     queryParams.append("languageLevel", languageLevelForBE);
//   }

//   if (selectedLearningLanguage) {
//     queryParams.append("learningLanguage", selectedLearningLanguage);
//   }

//   if (params) {
//     const extraParams = new URLSearchParams(params);
//     extraParams.forEach((value, key) => {
//       queryParams.append(key, value);
//     });
//   }

//   const url = `${endpoint}?${queryParams.toString()}`;

//   const response = await axiosInstance.get(url, { signal: abortSignal });
//   return { metaData: response.data.metaData, lessons: response.data.content };
// };

export const getAllLessons = async ({
  size = 12,
  offset = 0,
  selectedLanguageLevel = "",
  selectedLearningLanguage = "",
  params = "",
  abortSignal,
}: FetchLessonsParams = {}): Promise<IData> => {
  const endpoint = "/exercises";

  // 1. Parse incoming params string into an array of entries or URLSearchParams
  const extraParams = new URLSearchParams(params);

  const queryParams = new URLSearchParams();

  // 2. Exact order from your old working commit:

  // Order 1: offset & size
  queryParams.append("offset", String(offset));
  queryParams.append("size", String(size));

  // Order 2: activeTypeOfLesson -> exerciseType
  const exerciseType =
    extraParams.get("exerciseType") ?? extraParams.get("activeTypeOfLesson");
  if (exerciseType && exerciseType.toLowerCase() !== "all") {
    queryParams.append("exerciseType", exerciseType.toUpperCase());
  }

  // Order 3: primaryTopics
  const primaryTopics = extraParams.get("primaryTopics");
  if (primaryTopics) {
    primaryTopics.split(",").forEach((topic) => {
      if (topic) queryParams.append("primaryTopics", topic);
    });
  }

  // Order 4: secondaryTopics
  const secondaryTopics = extraParams.get("secondaryTopics");
  if (secondaryTopics) {
    secondaryTopics.split(",").forEach((topic) => {
      if (topic) queryParams.append("secondaryTopics", topic);
    });
  }

  // Order 5: tags
  const tags = extraParams.get("tags");
  if (tags) {
    tags.split(",").forEach((tag) => {
      if (tag) queryParams.append("tags", tag);
    });
  }

  // Order 6: languageLevel
  if (selectedLanguageLevel && selectedLanguageLevel !== "All") {
    const languageLevelForBE = selectedLanguageLevel.slice(0, 2);
    queryParams.append("languageLevel", languageLevelForBE);
  }

  // Order 7: targetAgeGroup
  const targetAgeGroup =
    extraParams.get("targetAgeGroup") ?? extraParams.get("targetAgeGroups");
  if (targetAgeGroup) {
    targetAgeGroup.split(",").forEach((ageGroup) => {
      if (ageGroup) queryParams.append("targetAgeGroup", ageGroup);
    });
  }

  // Order 8: learningLanguage
  if (selectedLearningLanguage) {
    queryParams.append("learningLanguage", selectedLearningLanguage);
  }

  // Order 9: sort
  const sort = extraParams.get("sort") ?? "rating";
  queryParams.append("sort", sort);

  const url = `${endpoint}?${queryParams.toString()}`;

  const response = await axiosInstance.get(url, { signal: abortSignal });
  return { metaData: response.data.metaData, lessons: response.data.content };
};

export const getLessonById = async (
  id: string,
  signal?: AbortSignal,
): Promise<ILesson | null> => {
  const response = await axiosInstance.get(
    `/exercises/${encodeURIComponent(id)}`,
    { signal },
  );
  return response.data;
};

export const getRecomendations = async (ids: string[]): Promise<ICard[]> => {
  try {
    const recomendations: unknown[] = await Promise.all(
      ids.map((id) => getLessonById(id)),
    );
    return recomendations.filter(
      (recomendation): recomendation is ICard => recomendation !== null,
    );
  } catch (error) {
    console.error("Error fetching recomendations:", error);
    throw error;
  }
};

export const postUserAnswers = async (lessonId: string, answers: IAnswer[]) => {
  try {
    const response = await axiosInstance.post(
      `/exercises/${lessonId}/answers`,
      answers,
    );
    return response.data;
  } catch (error) {
    console.error(`Error sending user answers:`, error);
    throw error;
  }
};

export const getAllFilters = async (): Promise<IFiltersNullable> => {
  try {
    const filters = await axiosInstance.get("/exercises/filters");
    return filters.data;
  } catch (error) {
    console.error("Error fetching all filters:", error);
    return null;
  }
};
