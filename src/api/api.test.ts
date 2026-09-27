jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    })),
    isCancel: jest.fn(),
  },
}));
import axios from "axios";
import {
  getAllLessons,
  getLessonById,
  getRecomendations,
  postUserAnswers,
  getAllFilters,
} from "./api";
import { interceptorsStore } from "@/store/interceptorsStore";
const mockAxiosCreate = axios.create as jest.Mock;
const mockAxiosInstance = mockAxiosCreate.mock.results[0].value;
const mockRequestUse = mockAxiosInstance.interceptors.request.use;
const mockResponseUse = mockAxiosInstance.interceptors.response.use;
describe("getAllLessons", () => {
  beforeEach(() => {
    mockAxiosInstance.get.mockReset();
  });
  it("builds request URL from filters and pagination", async () => {
    mockAxiosInstance.get.mockResolvedValue({
      data: { metaData: { totalElements: 100 }, content: [{ id: "lesson-1" }] },
    });
    const result = await getAllLessons({
      size: 20,
      offset: 40,
      selectedLanguageLevel: "B1 - Intermediate",
      selectedLearningLanguage: "German",
      params:
        "exerciseType=video&primaryTopics=grammar,travel&secondaryTopics=school,work&tags=beginner,online&targetAgeGroup=adults,teens&sort=newest",
    });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      "/exercises?offset=40&size=20&exerciseType=VIDEO&primaryTopics=grammar&primaryTopics=travel&secondaryTopics=school&secondaryTopics=work&tags=beginner&tags=online&languageLevel=B1&targetAgeGroup=adults&targetAgeGroup=teens&learningLanguage=German&sort=newest",
      { signal: undefined },
    );
    expect(result).toEqual({
      metaData: { totalElements: 100 },
      lessons: [{ id: "lesson-1" }],
    });
  });
  it("uses default pagination and sorting values", async () => {
    mockAxiosInstance.get.mockResolvedValue({
      data: { metaData: {}, content: [] },
    });
    await getAllLessons();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      "/exercises?offset=0&size=12&sort=rating",
      { signal: undefined },
    );
  });
  it("ignores All exercise type and All language level", async () => {
    mockAxiosInstance.get.mockResolvedValue({
      data: { metaData: {}, content: [] },
    });
    await getAllLessons({
      selectedLanguageLevel: "All",
      params: "exerciseType=all",
    });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      "/exercises?offset=0&size=12&sort=rating",
      { signal: undefined },
    );
  });
  it("supports fallback filter parameter names and skips empty values", async () => {
    mockAxiosInstance.get.mockResolvedValue({
      data: { metaData: {}, content: [] },
    });
    await getAllLessons({
      params:
        "activeTypeOfLesson=audio&primaryTopics=grammar,,travel&secondaryTopics=,,work&tags=online,,&targetAgeGroups=adults,,teens&sort=popular",
    });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      "/exercises?offset=0&size=12&exerciseType=AUDIO&primaryTopics=grammar&primaryTopics=travel&secondaryTopics=work&tags=online&targetAgeGroup=adults&targetAgeGroup=teens&sort=popular",
      { signal: undefined },
    );
  });
  it("passes abort signal to the request", async () => {
    mockAxiosInstance.get.mockResolvedValue({
      data: { metaData: {}, content: [] },
    });
    const abortController = new AbortController();
    await getAllLessons({ abortSignal: abortController.signal });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      "/exercises?offset=0&size=12&sort=rating",
      { signal: abortController.signal },
    );
  });
});
describe("getLessonById", () => {
  beforeEach(() => {
    mockAxiosInstance.get.mockReset();
  });
  it("fetches a lesson by encoded id and returns response data", async () => {
    mockAxiosInstance.get.mockResolvedValue({
      data: { id: "lesson/123", title: "Test lesson" },
    });
    const result = await getLessonById("lesson/123");
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      "/exercises/lesson%2F123",
      { signal: undefined },
    );
    expect(result).toEqual({ id: "lesson/123", title: "Test lesson" });
  });
  it("passes abort signal to the request", async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: { id: "lesson-1" } });
    const abortController = new AbortController();
    await getLessonById("lesson-1", abortController.signal);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith("/exercises/lesson-1", {
      signal: abortController.signal,
    });
  });
});
describe("getRecomendations", () => {
  beforeEach(() => {
    mockAxiosInstance.get.mockReset();
  });
  it("fetches all lessons and removes null recommendations", async () => {
    mockAxiosInstance.get
      .mockResolvedValueOnce({ data: { id: "lesson-1", title: "First" } })
      .mockResolvedValueOnce({ data: null })
      .mockResolvedValueOnce({ data: { id: "lesson-3", title: "Third" } });
    const result = await getRecomendations([
      "lesson-1",
      "lesson-2",
      "lesson-3",
    ]);
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);
    expect(result).toEqual([
      { id: "lesson-1", title: "First" },
      { id: "lesson-3", title: "Third" },
    ]);
  });
  it("rethrows an error when fetching recommendations fails", async () => {
    const error = new Error("Request failed");
    mockAxiosInstance.get.mockRejectedValue(error);
    await expect(getRecomendations(["lesson-1"])).rejects.toBe(error);
  });
});
describe("postUserAnswers", () => {
  beforeEach(() => {
    mockAxiosInstance.post.mockReset();
  });
  it("posts answers and returns response data", async () => {
    const answers = [{ questionId: "q1", answer: "Paris" }];
    mockAxiosInstance.post.mockResolvedValue({ data: { score: 100 } });
    const result = await postUserAnswers("lesson-1", answers as never);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      "/exercises/lesson-1/answers",
      answers,
    );
    expect(result).toEqual({ score: 100 });
  });
  it("rethrows an error when posting answers fails", async () => {
    const error = new Error("Request failed");
    mockAxiosInstance.post.mockRejectedValue(error);
    await expect(postUserAnswers("lesson-1", [])).rejects.toBe(error);
  });
});
describe("getAllFilters", () => {
  beforeEach(() => {
    mockAxiosInstance.get.mockReset();
  });
  it("fetches and returns filters data", async () => {
    const filters = {
      languageLevels: ["A1", "B1"],
      topics: ["Grammar", "Travel"],
    };
    mockAxiosInstance.get.mockResolvedValue({ data: filters });
    const result = await getAllFilters();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith("/exercises/filters");
    expect(result).toEqual(filters);
  });
  it("returns null when fetching filters fails", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockAxiosInstance.get.mockRejectedValue(new Error("Request failed"));
    const result = await getAllFilters();
    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
      "Error fetching all filters:",
      expect.any(Error),
    );
    errorSpy.mockRestore();
  });
});
describe("axios interceptors", () => {
  it("registers request and response interceptors", () => {
    expect(mockRequestUse).toHaveBeenCalledTimes(1);
    expect(mockResponseUse).toHaveBeenCalledTimes(1);
  });
  it("sets loading and clears error on successful request", () => {
    const requestInterceptor = mockRequestUse.mock.calls[0][0];
    const setLoadingSpy = jest.spyOn(
      interceptorsStore.getState(),
      "setLoading",
    );
    const setErrorSpy = jest.spyOn(interceptorsStore.getState(), "setError");
    const config = { url: "/test" };
    const result = requestInterceptor(config);
    expect(result).toBe(config);
    expect(setLoadingSpy).toHaveBeenCalledWith(true);
    expect(setErrorSpy).toHaveBeenCalledWith(false);
    setLoadingSpy.mockRestore();
    setErrorSpy.mockRestore();
  });
  it("clears loading and error when request interceptor receives an error", async () => {
    const requestErrorInterceptor = mockRequestUse.mock.calls[0][1];
    const setLoadingSpy = jest.spyOn(
      interceptorsStore.getState(),
      "setLoading",
    );
    const setErrorSpy = jest.spyOn(interceptorsStore.getState(), "setError");
    const error = new Error("Request error");
    await expect(requestErrorInterceptor(error)).rejects.toBe(error);
    expect(setLoadingSpy).toHaveBeenCalledWith(false);
    expect(setErrorSpy).toHaveBeenCalledWith(false);
    setLoadingSpy.mockRestore();
    setErrorSpy.mockRestore();
  });
  it("clears loading on successful response", () => {
    const responseInterceptor = mockResponseUse.mock.calls[0][0];
    const setLoadingSpy = jest.spyOn(
      interceptorsStore.getState(),
      "setLoading",
    );
    const response = { data: { id: "lesson-1" } };
    const result = responseInterceptor(response);
    expect(result).toBe(response);
    expect(setLoadingSpy).toHaveBeenCalledWith(false);
    setLoadingSpy.mockRestore();
  });
  it("clears loading and sets error on failed response", async () => {
    const responseErrorInterceptor = mockResponseUse.mock.calls[0][1];
    const setLoadingSpy = jest.spyOn(
      interceptorsStore.getState(),
      "setLoading",
    );
    const setErrorSpy = jest.spyOn(interceptorsStore.getState(), "setError");
    const error = new Error("Response error");
    await expect(responseErrorInterceptor(error)).rejects.toBe(error);
    expect(setLoadingSpy).toHaveBeenCalledWith(false);
    expect(setErrorSpy).toHaveBeenCalledWith(true);
    setLoadingSpy.mockRestore();
    setErrorSpy.mockRestore();
  });
  it("does not set error for cancelled requests", async () => {
    const responseErrorInterceptor = mockResponseUse.mock.calls[0][1];
    const setLoadingSpy = jest.spyOn(
      interceptorsStore.getState(),
      "setLoading",
    );
    const setErrorSpy = jest.spyOn(interceptorsStore.getState(), "setError");
    (axios.isCancel as unknown as jest.Mock).mockReturnValue(true);
    const error = new Error("Cancelled");
    await expect(responseErrorInterceptor(error)).rejects.toBe(error);
    expect(setLoadingSpy).toHaveBeenCalledWith(false);
    expect(setErrorSpy).not.toHaveBeenCalledWith(true);
    setLoadingSpy.mockRestore();
    setErrorSpy.mockRestore();
    (axios.isCancel as unknown as jest.Mock).mockReturnValue(false);
  });
});
