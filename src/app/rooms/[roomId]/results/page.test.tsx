import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Results from "./page";

import { useOwnStore } from "@/store/storeProvider";
import { useParams, useRouter } from "next/navigation";

jest.mock("@/store/storeProvider");
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

jest.mock("@/components/error404/Error404", () => {
  return function MockError404({ page }: { page: string }) {
    return <div data-testid="error-404">Error 404: {page}</div>;
  };
});

const mockUseOwnStore = useOwnStore as jest.Mock;
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

const createVirtualRoom = ({
  isFinished = true,
  tasks = [],
}: {
  isFinished?: boolean;
  tasks?: any[];
} = {}) =>
  ({
    isFinished,
    exerciseWithUserResultDto: {
      tasks,
    },
  }) as any;

const setupStore = ({
  virtualRoom = undefined,
  relatedContents = [] as any[],
  userAnswers = [],
  results = [],
} = {}) => {
  const store = {
    virtualRoom,
    setVirtualRoom: jest.fn(),
    setUserAnswers: jest.fn(),
    relatedContents,
    clearRecomendations: jest.fn(),
    userAnswers,
    clearUserAnswers: jest.fn(),
    results,
    setResults: jest.fn(),
    clearResults: jest.fn(),
  };

  mockUseOwnStore.mockImplementation((selector) => selector(store));

  return store;
};

describe("Results page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({
      roomId: "room-123",
    });

    mockUseRouter.mockReturnValue({
      replace: jest.fn(),
    });

    global.fetch = jest.fn();
  });

  it("renders 404 when virtual room is not loaded", () => {
    setupStore();

    render(<Results />);

    expect(screen.getByTestId("error-404")).toHaveTextContent(
      "Error 404: check",
    );
  });

  it("fetches room data using roomId", async () => {
    const room = createVirtualRoom();

    setupStore();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => room,
    });

    render(<Results />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/rooms/room-123");
    });
  });

  it("sets virtual room after successful fetch", async () => {
    const room = createVirtualRoom();

    const store = setupStore();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => room,
    });

    render(<Results />);

    await waitFor(() => {
      expect(store.setVirtualRoom).toHaveBeenCalledWith(room);
    });
  });

  it("initializes user answers and results when room is finished", async () => {
    const tasks = [
      createTask("task-1", "TRUE_FALSE"),
      createTask("task-2", "CHOOSE_ANSWER"),
    ];

    const room = createVirtualRoom({
      isFinished: true,
      tasks,
    });

    const store = setupStore();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => room,
    });

    render(<Results />);

    await waitFor(() => {
      expect(store.setUserAnswers).toHaveBeenCalledTimes(2);
      expect(store.setResults).toHaveBeenCalledTimes(1);
    });

    expect(store.setUserAnswers).toHaveBeenNthCalledWith(1, {
      taskId: "task-1",
      questions: [
        {
          questionId: "task-1-question",
          userAnswer: "true",
        },
      ],
    });

    expect(store.setUserAnswers).toHaveBeenNthCalledWith(2, {
      taskId: "task-2",
      questions: [
        {
          questionId: "task-2-question",
          userAnswer: "true",
        },
      ],
    });

    expect(store.setResults).toHaveBeenCalledWith([
      {
        taskId: "task-1",
        questions: [
          {
            questionId: "task-1-question",
            questionDescription: "Question description",
            result: true,
            rightAnswers: ["true"],
          },
        ],
      },
      {
        taskId: "task-2",
        questions: [
          {
            questionId: "task-2-question",
            questionDescription: "Question description",
            result: true,
            rightAnswers: ["true"],
          },
        ],
      },
    ]);
  });

  it("does not initialize answers or results when room is not finished", async () => {
    const room = createVirtualRoom({
      isFinished: false,
      tasks: [createTask("task-1", "TRUE_FALSE")],
    });

    const store = setupStore();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => room,
    });

    render(<Results />);

    await waitFor(() => {
      expect(store.setVirtualRoom).toHaveBeenCalledWith(room);
    });

    expect(store.setUserAnswers).not.toHaveBeenCalled();
    expect(store.setResults).not.toHaveBeenCalled();
  });

  it("renders MultipleCheck with options for CHOOSE_TEMPLATE", () => {
    const room = createVirtualRoom({
      tasks: [createTask("task-1", "MEDIA_TASK", "CHOOSE_TEMPLATE")],
    });

    setupStore({
      virtualRoom: room,
    });

    render(<Results />);

    expect(screen.getByTestId("multiple-check")).toHaveTextContent(
      "MultipleCheck-task-1-1-with-options",
    );
  });

  it("renders MultipleCheck without options for FILL_TEMPLATE", () => {
    const room = createVirtualRoom({
      tasks: [createTask("task-1", "MEDIA_TASK", "FILL_TEMPLATE")],
    });

    setupStore({
      virtualRoom: room,
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
    const room = createVirtualRoom({
      tasks: [
        createTask("task-1", "CHOOSE_ANSWER"),
        createTask("task-2", "TRUE_FALSE"),
      ],
    });

    setupStore({
      virtualRoom: room,
    });

    render(<Results />);

    const checks = screen.getAllByTestId("single-check");

    expect(checks).toHaveLength(2);

    expect(checks[0]).toHaveTextContent("SingleCheck-task-1-1-CHOOSE_ANSWER");

    expect(checks[1]).toHaveTextContent("SingleCheck-task-2-2-TRUE_FALSE");
  });

  it("skips unsupported task types", () => {
    const room = createVirtualRoom({
      tasks: [
        createTask("task-1", "UNSUPPORTED"),
        createTask("task-2", "TRUE_FALSE"),
      ],
    });

    setupStore({
      virtualRoom: room,
    });

    render(<Results />);

    expect(screen.getAllByTestId("single-check")).toHaveLength(1);

    expect(screen.getByTestId("single-check")).toHaveTextContent(
      "SingleCheck-task-2-2-TRUE_FALSE",
    );
  });

  it("renders recommendations when related contents exist", () => {
    const room = createVirtualRoom({
      tasks: [createTask("task-1", "TRUE_FALSE")],
    });

    setupStore({
      virtualRoom: room,
      relatedContents: [{ id: "recommendation-1" }],
    });

    render(<Results />);

    expect(screen.getByTestId("recommendations")).toBeInTheDocument();
  });

  it("does not render recommendations when related contents are empty", () => {
    const room = createVirtualRoom({
      tasks: [createTask("task-1", "TRUE_FALSE")],
    });

    setupStore({
      virtualRoom: room,
      relatedContents: [],
    });

    render(<Results />);

    expect(screen.queryByTestId("recommendations")).not.toBeInTheDocument();
  });

  it("clears data and returns home when clicking Back", async () => {
    const user = userEvent.setup();

    const room = createVirtualRoom({
      tasks: [createTask("task-1", "TRUE_FALSE")],
    });

    const router = {
      replace: jest.fn(),
    };

    mockUseRouter.mockReturnValue(router);

    const store = setupStore({
      virtualRoom: room,
    });

    render(<Results />);

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(store.clearRecomendations).toHaveBeenCalledTimes(1);
    expect(store.clearUserAnswers).toHaveBeenCalledTimes(1);
    expect(store.clearResults).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/");
  });
});
