import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Results from "./page";

import { useOwnStore } from "@/store/storeProvider";
import { interceptorsStore } from "@/store/interceptorsStore";
import { useParams, useRouter } from "next/navigation";

jest.mock("@/store/storeProvider");
jest.mock("@/store/interceptorsStore");
jest.mock("next/navigation");

jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        exercise: "Exercise",
        btnBack: "Back",
      };

      return translations[key] ?? key;
    },
  }),
}));

jest.mock("@/components/settingsSelect/resultsHeader/ResultsHeader", () => {
  return function MockResultsHeader() {
    return <div data-testid="results-header">Results Header</div>;
  };
});

jest.mock("@/components/checkAnswers/multipleCheck/MultipleCheck", () => {
  return function MockMultipleCheck({
    taskData,
    index,
    withOptions,
  }: {
    taskData: { taskId: string };
    index: number;
    withOptions?: boolean;
  }) {
    return (
      <div data-testid="multiple-check">
        MultipleCheck-{taskData.taskId}-{index}
        {withOptions ? "-with-options" : ""}
      </div>
    );
  };
});

jest.mock("@/components/checkAnswers/singleCheck/SingleCheck", () => {
  return function MockSingleCheck({
    taskData,
    index,
    type,
  }: {
    taskData: { taskId: string };
    index: number;
    type: string;
  }) {
    return (
      <div data-testid="single-check">
        SingleCheck-{taskData.taskId}-{index}-{type}
      </div>
    );
  };
});

jest.mock("@/components/recomendations/Recomandations", () => {
  return function MockRecommendations() {
    return <div data-testid="recommendations">Recommendations</div>;
  };
});

jest.mock("@/components/loader/Loader", () => {
  return function MockLoader() {
    return <div data-testid="loader">Loading...</div>;
  };
});

jest.mock("@/components/error404/Error404", () => {
  return function MockError404({ page }: { page: string }) {
    return <div data-testid="error-404">Error 404: {page}</div>;
  };
});

const mockUseOwnStore = useOwnStore as jest.Mock;
const mockInterceptorsStore = interceptorsStore as unknown as jest.Mock;
const mockUseParams = useParams as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

const createTask = (taskId: string, taskType: string, contentType?: string) =>
  ({
    taskId,
    taskType,
    content: contentType
      ? {
          contentType,
        }
      : undefined,
    questions: [
      {
        questionId: `${taskId}-question`,
        questionText: "Test question",
        questionDescription: "Question description",
        userAnswer: "true",
        result: true,
        rightAnswers: ["true"],
      },
    ],
  }) as any;

const createLesson = ({
  tasks = [],
}: {
  tasks?: any[];
} = {}) =>
  ({
    id: "lesson-1",
    title: "Test lesson",
    tasks,
  }) as any;

const setupStore = ({
  lesson = undefined,
  relatedContents = [] as any[],
  userAnswers = [],
  results = [],
} = {}) => {
  const store = {
    lesson,
    relatedContents,
    clearRecomendations: jest.fn(),
    userAnswers,
    sendUserAnswers: jest.fn(),
    clearUserAnswers: jest.fn(),
    results,
    clearResults: jest.fn(),
  };

  mockUseOwnStore.mockImplementation((selector) => selector(store));

  return store;
};

const setupInterceptors = ({ loading = false, error = false } = {}) => {
  const store = {
    loading,
    error,
  };

  mockInterceptorsStore.mockImplementation((selector) => selector(store));

  return store;
};

describe("Results page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({
      lessonId: "lesson-123",
    });

    mockUseRouter.mockReturnValue({
      replace: jest.fn(),
    });

    setupInterceptors();
  });

  it("renders 404 when lesson is not loaded", () => {
    setupStore();

    render(<Results />);

    expect(screen.getByTestId("error-404")).toHaveTextContent(
      "Error 404: check",
    );
  });

  it("sends user answers using lessonId", () => {
    const store = setupStore({
      lesson: createLesson(),
    });

    render(<Results />);

    expect(store.sendUserAnswers).toHaveBeenCalledWith("lesson-123");
  });

  it("does not send user answers when lessonId is missing", () => {
    mockUseParams.mockReturnValue({
      lessonId: undefined,
    });

    const store = setupStore({
      lesson: createLesson(),
    });

    render(<Results />);

    expect(store.sendUserAnswers).not.toHaveBeenCalled();
  });

  it("renders loader while loading without error", () => {
    setupStore({
      lesson: createLesson(),
    });

    setupInterceptors({
      loading: true,
      error: false,
    });

    render(<Results />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByTestId("results-header")).not.toBeInTheDocument();
  });

  it("does not render results content when there is an error", () => {
    setupStore({
      lesson: createLesson(),
    });

    setupInterceptors({
      loading: false,
      error: true,
    });

    render(<Results />);

    expect(screen.queryByTestId("results-header")).not.toBeInTheDocument();

    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
  });

  it("renders MultipleCheck with options for CHOOSE_TEMPLATE", () => {
    const lesson = createLesson({
      tasks: [createTask("task-1", "MEDIA_TASK", "CHOOSE_TEMPLATE")],
    });

    setupStore({
      lesson,
    });

    render(<Results />);

    expect(screen.getByTestId("multiple-check")).toHaveTextContent(
      "MultipleCheck-task-1-1-with-options",
    );
  });

  it("renders MultipleCheck without options for FILL_TEMPLATE", () => {
    const lesson = createLesson({
      tasks: [createTask("task-1", "MEDIA_TASK", "FILL_TEMPLATE")],
    });

    setupStore({
      lesson,
    });

    render(<Results />);

    expect(screen.getByTestId("multiple-check")).toHaveTextContent(
      "MultipleCheck-task-1-1",
    );

    expect(screen.getByTestId("multiple-check")).not.toHaveTextContent(
      "with-options",
    );
  });

  it("renders SingleCheck for CHOOSE_ANSWER and TRUE_FALSE", () => {
    const lesson = createLesson({
      tasks: [
        createTask("task-1", "CHOOSE_ANSWER"),
        createTask("task-2", "TRUE_FALSE"),
      ],
    });

    setupStore({
      lesson,
    });

    render(<Results />);

    const checks = screen.getAllByTestId("single-check");

    expect(checks).toHaveLength(2);

    expect(checks[0]).toHaveTextContent("SingleCheck-task-1-1-CHOOSE_ANSWER");

    expect(checks[1]).toHaveTextContent("SingleCheck-task-2-2-TRUE_FALSE");
  });

  it("skips unsupported task types and content types", () => {
    const lesson = createLesson({
      tasks: [
        createTask("task-1", "UNSUPPORTED"),
        createTask("task-2", "MEDIA_TASK", "UNSUPPORTED_CONTENT"),
        createTask("task-3", "TRUE_FALSE"),
      ],
    });

    setupStore({
      lesson,
    });

    render(<Results />);

    expect(screen.getAllByTestId("single-check")).toHaveLength(1);

    expect(screen.getByTestId("single-check")).toHaveTextContent(
      "SingleCheck-task-3-3-TRUE_FALSE",
    );

    expect(screen.queryByTestId("multiple-check")).not.toBeInTheDocument();
  });

  it("renders recommendations when related contents exist", () => {
    const lesson = createLesson({
      tasks: [createTask("task-1", "TRUE_FALSE")],
    });

    setupStore({
      lesson,
      relatedContents: [{ id: "recommendation-1" }],
    });

    render(<Results />);

    expect(screen.getByTestId("recommendations")).toBeInTheDocument();
  });

  it("does not render recommendations when related contents are empty", () => {
    const lesson = createLesson({
      tasks: [createTask("task-1", "TRUE_FALSE")],
    });

    setupStore({
      lesson,
      relatedContents: [],
    });

    render(<Results />);

    expect(screen.queryByTestId("recommendations")).not.toBeInTheDocument();
  });

  it("clears data and returns home when clicking Back", async () => {
    const user = userEvent.setup();

    const lesson = createLesson({
      tasks: [createTask("task-1", "TRUE_FALSE")],
    });

    const router = {
      replace: jest.fn(),
    };

    mockUseRouter.mockReturnValue(router);

    const store = setupStore({
      lesson,
    });

    render(<Results />);

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(store.clearRecomendations).toHaveBeenCalledTimes(1);

    expect(store.clearUserAnswers).toHaveBeenCalledTimes(1);

    expect(store.clearResults).toHaveBeenCalledTimes(1);

    expect(router.replace).toHaveBeenCalledWith("/");
  });
});
