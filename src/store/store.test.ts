import {
  getAllFilters,
  getAllLessons,
  getLessonById,
  getRecomendations,
  postUserAnswers,
} from "@/api/api";
import { IAnswer, ICheckAnswers, IVirtualRoom } from "@/models";
import { setToLocalStorage } from "./localStorageUtils";
import { initialState, Store } from "./store";

jest.mock("@/api/api", () => ({
  getAllFilters: jest.fn(),
  getAllLessons: jest.fn(),
  getLessonById: jest.fn(),
  getRecomendations: jest.fn(),
  postUserAnswers: jest.fn(),
}));

jest.mock("./localStorageUtils", () => ({
  getFromLocalStorage: jest.fn(),
  setToLocalStorage: jest.fn(),
}));

jest.mock("zustand/middleware", () => ({
  devtools: (initializer: unknown) => initializer,
  persist: (initializer: unknown) => initializer,
}));

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    isCancel: jest.fn(() => false),
  },
}));

const mockGetAllLessons = getAllLessons as jest.Mock;
const mockGetAllFilters = getAllFilters as jest.Mock;
const mockGetLessonById = getLessonById as jest.Mock;
const mockGetRecomendations = getRecomendations as jest.Mock;
const mockPostUserAnswers = postUserAnswers as jest.Mock;
const mockSetToLocalStorage = setToLocalStorage as jest.Mock;

describe("Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("setUserAnswers", () => {
    it("adds a new answer when the task has not been answered yet", () => {
      const store = Store();

      const answer: IAnswer = {
        taskId: "task-1",
        questions: [
          {
            questionId: "question-1",
            userAnswer: "Paris",
          },
        ],
      };

      store.getState().setUserAnswers(answer);

      expect(store.getState().userAnswers).toEqual([answer]);
    });

    it("updates an existing answer instead of adding a duplicate", () => {
      const existingAnswer: IAnswer = {
        taskId: "task-1",
        questions: [
          {
            questionId: "question-1",
            userAnswer: "London",
          },
        ],
      };

      const store = Store({
        ...initialState,
        userAnswers: [existingAnswer],
      });

      const newAnswer: IAnswer = {
        taskId: "task-1",
        questions: [
          {
            questionId: "question-1",
            userAnswer: "Paris",
          },
        ],
      };

      store.getState().setUserAnswers(newAnswer);

      expect(store.getState().userAnswers).toEqual([newAnswer]);
    });
  });

  describe("setSize", () => {
    it("changes size by the given increment", () => {
      const store = Store({
        ...initialState,
        size: 12,
      });

      store.getState().setSize(6);

      expect(store.getState().size).toBe(18);
    });

    it("resets size to 12 when increment is zero", () => {
      const store = Store({
        ...initialState,
        size: 36,
      });

      store.getState().setSize(0);

      expect(store.getState().size).toBe(12);
    });
  });

  describe("setOffset", () => {
    it("changes offset and resets size", () => {
      const store = Store({
        ...initialState,
        size: 36,
        offset: 0,
      });

      store.getState().setOffset(24);

      expect(store.getState().offset).toBe(24);
      expect(store.getState().size).toBe(12);
    });
  });

  describe("onSelectChange", () => {
    it("updates the selected value in the store", () => {
      const store = Store();

      store.getState().onSelectChange("selectedSorting", "views");

      expect(store.getState().selectedSorting).toBe("views");
    });

    it("persists interface language selection", () => {
      const store = Store();

      store.getState().onSelectChange("selectedInterfaceLanguage", "German");

      expect(mockSetToLocalStorage).toHaveBeenCalledWith(
        "selectedInterfaceLanguage",
        "German",
      );
    });

    it("persists learning language selection", () => {
      const store = Store();

      store.getState().onSelectChange("selectedLearningLanguage", "french");

      expect(mockSetToLocalStorage).toHaveBeenCalledWith(
        "selectedLearningLanguage",
        "french",
      );
    });

    it("persists language level selection", () => {
      const store = Store();

      store.getState().onSelectChange("selectedLanguageLevel", "B2");

      expect(mockSetToLocalStorage).toHaveBeenCalledWith(
        "selectedLanguageLevel",
        "B2",
      );
    });
  });

  describe("fetchLessons", () => {
    it("fetches lessons and updates lessons, totalCount and offset", async () => {
      mockGetAllLessons.mockResolvedValue({
        lessons: [{ id: "lesson-1" }],
        metaData: {
          totalCount: 100,
          offset: 24,
        },
      });

      const store = Store();

      await store
        .getState()
        .fetchLessons(12, "B1", "english", "sort=rating", 24);

      expect(mockGetAllLessons).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 12,
          selectedLanguageLevel: "B1",
          selectedLearningLanguage: "english",
          params: "sort=rating",
          offset: 24,
          abortSignal: expect.any(AbortSignal),
        }),
      );

      expect(store.getState().lessons).toEqual([{ id: "lesson-1" }]);
      expect(store.getState().totalCount).toBe(100);
      expect(store.getState().offset).toBe(24);
    });

    it("does not update state when the request is cancelled", async () => {
      const store = Store({
        ...initialState,
        lessons: [{ id: "old-lesson" } as never],
        totalCount: 10,
        offset: 0,
      });

      const cancelError = new Error("Request canceled");
      cancelError.name = "CanceledError";

      mockGetAllLessons.mockRejectedValue(cancelError);

      await store.getState().fetchLessons(12, "B1", "english", "", 12);

      expect(store.getState().lessons).toEqual([{ id: "old-lesson" }]);
      expect(store.getState().totalCount).toBe(10);
      expect(store.getState().offset).toBe(0);

      expect(console.log).toHaveBeenCalledWith(
        "Request canceled, state update bypassed.",
      );
    });

    it("does not update state when the API request fails", async () => {
      const store = Store({
        ...initialState,
        lessons: [{ id: "old-lesson" } as never],
        totalCount: 10,
        offset: 0,
      });

      const error = new Error("Network error");

      mockGetAllLessons.mockRejectedValue(error);

      await store.getState().fetchLessons(12, "B1", "english", "", 12);

      expect(store.getState().lessons).toEqual([{ id: "old-lesson" }]);
      expect(store.getState().totalCount).toBe(10);
      expect(store.getState().offset).toBe(0);

      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch lessons:",
        error,
      );
    });

    it("aborts the previous request when a new request starts", async () => {
      let resolveFirstRequest!: (value: {
        lessons: unknown[];
        metaData: {
          totalCount: number;
          offset: number;
        };
      }) => void;

      const firstRequest = new Promise((resolve) => {
        resolveFirstRequest = resolve;
      });

      mockGetAllLessons
        .mockReturnValueOnce(firstRequest)
        .mockResolvedValueOnce({
          lessons: [{ id: "lesson-2" }],
          metaData: {
            totalCount: 50,
            offset: 12,
          },
        });

      const store = Store();

      const firstFetch = store
        .getState()
        .fetchLessons(12, "B1", "english", "", 0);

      const firstAbortSignal = mockGetAllLessons.mock.calls[0][0].abortSignal;

      const secondFetch = store
        .getState()
        .fetchLessons(12, "B1", "english", "", 12);

      expect(firstAbortSignal.aborted).toBe(true);

      await secondFetch;

      resolveFirstRequest({
        lessons: [{ id: "lesson-1" }],
        metaData: {
          totalCount: 100,
          offset: 0,
        },
      });

      await firstFetch;

      expect(store.getState().lessons).toEqual([{ id: "lesson-2" }]);
      expect(store.getState().totalCount).toBe(50);
      expect(store.getState().offset).toBe(12);
    });
  });

  describe("fetchLessonById", () => {
    it("fetches a lesson and stores it", async () => {
      const lesson = {
        id: "lesson-1",
        title: "Test lesson",
      };

      mockGetLessonById.mockResolvedValue(lesson);

      const store = Store();

      await store.getState().fetchLessonById("lesson-1");

      expect(mockGetLessonById).toHaveBeenCalledWith(
        "lesson-1",
        expect.any(AbortSignal),
      );

      expect(store.getState().lesson).toEqual(lesson);
    });

    it("does not update state when the request is cancelled", async () => {
      const store = Store({
        ...initialState,
        lesson: {
          id: "old-lesson",
        } as never,
      });

      const cancelError = new Error("Request canceled");
      cancelError.name = "CanceledError";

      mockGetLessonById.mockRejectedValue(cancelError);

      await store.getState().fetchLessonById("lesson-1");

      expect(store.getState().lesson).toEqual({
        id: "old-lesson",
      });

      expect(console.log).toHaveBeenCalledWith(
        "Request canceled, state update bypassed.",
      );
    });

    it("does not update state when the API request fails", async () => {
      const store = Store({
        ...initialState,
        lesson: {
          id: "old-lesson",
        } as never,
      });

      const error = new Error("Network error");

      mockGetLessonById.mockRejectedValue(error);

      await store.getState().fetchLessonById("lesson-1");

      expect(store.getState().lesson).toEqual({
        id: "old-lesson",
      });

      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch lesson with id lesson-1:",
        error,
      );
    });

    it("aborts the previous request when a new lesson request starts", async () => {
      let resolveFirstRequest!: (value: unknown) => void;

      const firstRequest = new Promise((resolve) => {
        resolveFirstRequest = resolve;
      });

      mockGetLessonById
        .mockReturnValueOnce(firstRequest)
        .mockResolvedValueOnce({
          id: "lesson-2",
          title: "Second lesson",
        });

      const store = Store();

      const firstFetch = store.getState().fetchLessonById("lesson-1");

      const firstAbortSignal = mockGetLessonById.mock.calls[0][1];

      const secondFetch = store.getState().fetchLessonById("lesson-2");

      expect(firstAbortSignal.aborted).toBe(true);

      await secondFetch;

      resolveFirstRequest({
        id: "lesson-1",
        title: "First lesson",
      });

      await firstFetch;

      expect(store.getState().lesson).toEqual({
        id: "lesson-2",
        title: "Second lesson",
      });
    });
  });

  describe("fetchFilters", () => {
    it("stores filter data and normalizes learning languages", async () => {
      mockGetAllFilters.mockResolvedValue({
        primaryTopics: ["Grammar"],
        secondaryTopics: ["Travel"],
        tags: ["Beginner"],
        targetAgeGroups: ["Adults"],
        learningLanguages: ["English", "GERMAN"],
      });

      const store = Store();

      await store.getState().fetchFilters();

      expect(store.getState().primaryTopics).toEqual(["Grammar"]);
      expect(store.getState().secondaryTopics).toEqual(["Travel"]);
      expect(store.getState().tags).toEqual(["Beginner"]);
      expect(store.getState().targetAgeGroups).toEqual(["Adults"]);
      expect(store.getState().learningLanguageOptions).toEqual([
        "english",
        "german",
      ]);
    });

    it("does not update filters when the API returns null", async () => {
      const store = Store({
        ...initialState,
        primaryTopics: ["Existing"],
        secondaryTopics: ["Existing"],
        tags: ["Existing"],
        targetAgeGroups: ["Existing"],
        learningLanguageOptions: ["existing"],
      });

      mockGetAllFilters.mockResolvedValue(null);

      await store.getState().fetchFilters();

      expect(store.getState().primaryTopics).toEqual(["Existing"]);
      expect(store.getState().secondaryTopics).toEqual(["Existing"]);
      expect(store.getState().tags).toEqual(["Existing"]);
      expect(store.getState().targetAgeGroups).toEqual(["Existing"]);
      expect(store.getState().learningLanguageOptions).toEqual(["existing"]);
    });
  });

  describe("fetchRecomendations", () => {
    it("fetches recommendations and stores them", async () => {
      const recommendations = [{ id: "lesson-1" }, { id: "lesson-2" }];

      mockGetRecomendations.mockResolvedValue(recommendations);

      const store = Store();

      await store.getState().fetchRecomendations(["lesson-1", "lesson-2"]);

      expect(mockGetRecomendations).toHaveBeenCalledWith([
        "lesson-1",
        "lesson-2",
      ]);

      expect(store.getState().relatedContents).toEqual(recommendations);
    });

    it("rejects when recommendation ids are not an array", async () => {
      const store = Store();

      await expect(
        store.getState().fetchRecomendations("lesson-1" as never),
      ).rejects.toThrow("Expected an array of IDs");

      expect(mockGetRecomendations).not.toHaveBeenCalled();
    });

    it("does not update recommendations when the API request fails", async () => {
      const store = Store({
        ...initialState,
        relatedContents: [{ id: "existing" } as never],
      });

      const error = new Error("Network error");

      mockGetRecomendations.mockRejectedValue(error);

      await store.getState().fetchRecomendations(["lesson-1"]);

      expect(store.getState().relatedContents).toEqual([{ id: "existing" }]);

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching recommendations:",
        error,
      );
    });

    it("clears recommendations", () => {
      const store = Store({
        ...initialState,
        relatedContents: [{ id: "lesson-1" } as never],
      });

      store.getState().clearRecomendations();

      expect(store.getState().relatedContents).toEqual([]);
    });
  });

  describe("user answers and results", () => {
    it("clears user answers", () => {
      const answer: IAnswer = {
        taskId: "task-1",
        questions: [
          {
            questionId: "question-1",
            userAnswer: "Paris",
          },
        ],
      };

      const store = Store({
        ...initialState,
        userAnswers: [answer],
      });

      store.getState().clearUserAnswers();

      expect(store.getState().userAnswers).toEqual([]);
    });

    it("clears results", () => {
      const results: ICheckAnswers[] = [
        {
          taskId: "task-1",
          questions: [
            {
              questionId: "question-1",
              questionDescription: "Capital",
              rightAnswers: ["Paris"],
              result: true,
            },
          ],
        },
      ];

      const store = Store({
        ...initialState,
        results,
      });

      store.getState().clearResults();

      expect(store.getState().results).toEqual([]);
    });

    it("sends current user answers and stores the result", async () => {
      const userAnswers: IAnswer[] = [
        {
          taskId: "task-1",
          questions: [
            {
              questionId: "question-1",
              userAnswer: "Paris",
            },
          ],
        },
      ];

      const result: ICheckAnswers[] = [
        {
          taskId: "task-1",
          questions: [
            {
              questionId: "question-1",
              questionDescription: "Capital of France",
              rightAnswers: ["Paris"],
              result: true,
            },
          ],
        },
      ];

      mockPostUserAnswers.mockResolvedValue(result);

      const store = Store({
        ...initialState,
        userAnswers,
      });

      await store.getState().sendUserAnswers("lesson-1");

      expect(mockPostUserAnswers).toHaveBeenCalledWith("lesson-1", userAnswers);

      expect(store.getState().results).toEqual(result);
    });

    it("sets results directly", () => {
      const results: ICheckAnswers[] = [
        {
          taskId: "task-1",
          questions: [],
        },
      ];

      const store = Store();

      store.getState().setResults(results);

      expect(store.getState().results).toEqual(results);
    });

    it("sets VR answers as results", () => {
      const results: ICheckAnswers[] = [
        {
          taskId: "task-1",
          questions: [],
        },
      ];

      const store = Store();

      store.getState().setVRAnswers(results);

      expect(store.getState().results).toEqual(results);
    });
  });

  describe("toggleVirtualKeyboard", () => {
    it("toggles virtual keyboard state", () => {
      const store = Store({
        ...initialState,
        virtualKeyboard: false,
      });

      store.getState().toggleVirtualKeyboard();

      expect(store.getState().virtualKeyboard).toBe(true);

      store.getState().toggleVirtualKeyboard();

      expect(store.getState().virtualKeyboard).toBe(false);
    });
  });

  describe("resetSize", () => {
    it("resets size to 12", () => {
      const store = Store({
        ...initialState,
        size: 36,
      });

      store.getState().resetSize();

      expect(store.getState().size).toBe(12);
    });
  });

  describe("setHomePageContentHeight", () => {
    it("updates home page content height", () => {
      const store = Store();

      store.getState().setHomePageContentHeight(720);

      expect(store.getState().homePageContentHeight).toBe(720);
    });
  });

  describe("setOpenInDev", () => {
    it("updates openInDev state", () => {
      const store = Store();

      store.getState().setOpenInDev(true);

      expect(store.getState().openInDev).toBe(true);
    });
  });

  describe("setVirtualRoom", () => {
    it("stores the virtual room", () => {
      const virtualRoom: IVirtualRoom = {
        challengerName: "John",
        keepAliveTime: 100,
        isExpired: false,
        isFinished: false,
        exerciseWithUserResultDto: {
          id: "lesson-1",
          primaryTopics: [],
          tasks: [],
          relatedContents: [],
          creationDateTime: new Date(),
          languageLevel: "B1",
          learningLanguage: "english",
        },
      };

      const store = Store();

      store.getState().setVirtualRoom(virtualRoom);

      expect(store.getState().virtualRoom).toEqual(virtualRoom);
    });
  });
});
