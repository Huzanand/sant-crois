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

  // 1. Define the exact sequence your backend expects
  const PARAM_ORDER = [
    "offset",
    "size",
    "activeTypeOfLesson",
    "primaryTopics",
    "secondaryTopics",
    "tags",
    "languageLevel",
    "targetAgeGroup",
    "learningLanguage",
    "sort",
  ];

  // 2. Collect all raw incoming values into a dictionary
  const rawData = new Map<string, string>();

  rawData.set("size", String(size));
  rawData.set("offset", String(offset));

  if (selectedLanguageLevel && selectedLanguageLevel !== "All") {
    rawData.set("languageLevel", selectedLanguageLevel.slice(0, 2));
  }

  if (selectedLearningLanguage) {
    rawData.set("learningLanguage", selectedLearningLanguage);
  }

  if (params) {
    const extraParams = new URLSearchParams(params);
    extraParams.forEach((value, key) => {
      if (value) {
        rawData.set(key, value);
      }
    });
  }

  // 3. Build URLSearchParams strictly in the order defined by PARAM_ORDER
  const queryParams = new URLSearchParams();

  // Pull keys in PARAM_ORDER sequence
  PARAM_ORDER.forEach((key) => {
    if (rawData.has(key)) {
      const value = rawData.get(key);
      if (value) {
        queryParams.append(key, value);
      }
      rawData.delete(key); // Remove so we don't repeat it
    }
  });

  // Append any unexpected / extra custom params at the end
  rawData.forEach((value, key) => {
    if (value) {
      queryParams.append(key, value);
    }
  });

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
