import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Room from "./page";

const mockPush = jest.fn();
const mockUseParams = jest.fn();
const mockUseLanguageSync = jest.fn();
const mockUseOwnStore = jest.fn();

const mockSetVirtualRoom = jest.fn();
const mockSetVRAnswers = jest.fn();
const mockSetResults = jest.fn();
const mockSetUserAnswers = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => mockUseParams(),
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: () => mockUseLanguageSync(),
}));

jest.mock("@/store/storeProvider", () => ({
  useOwnStore: () => mockUseOwnStore(),
}));

jest.mock("@/components/roomInfo/RoomInfo", () => ({
  __esModule: true,
  default: () => <div data-testid="room-info">Room Info</div>,
}));

jest.mock("@/utils/renderTasks/RenderTasks", () => ({
  RenderTasks: ({ readonly }: { readonly?: boolean }) => (
    <div data-testid="render-tasks">Tasks readonly: {String(readonly)}</div>
  ),
}));

jest.mock("@/utils/renderHeaderOfLesson/RenderHeaderOfLesson", () => ({
  RenderHeaderOfLesson: () => (
    <div data-testid="lesson-header">Lesson Header</div>
  ),
}));

const createVirtualRoom = (
  overrides: Partial<{
    isFinished: boolean;
  }> = {},
) => ({
  isFinished: false,
  exerciseWithUserResultDto: {
    id: "lesson-1",
    tasks: [
      {
        taskId: "task-1",
        taskType: "CHOOSE_ANSWER",
        questions: [
          {
            questionId: "question-1",
            questionText: "Choose the correct answer",
            userAnswer: "Paris",
            questionDescription: "Capital of France",
            result: true,
            rightAnswers: ["Paris"],
          },
        ],
      },
    ],
  },
  ...overrides,
});

describe("Room", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({
      roomId: "room-123",
    });

    mockUseLanguageSync.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          finishLesson: "Finish lesson",
          "vr.seeResults": "See results",
        };

        return translations[key] ?? key;
      },
    });

    mockUseOwnStore.mockReturnValue({
      virtualRoom: null,
      setVirtualRoom: mockSetVirtualRoom,
      setVRAnswers: mockSetVRAnswers,
      setResults: mockSetResults,
      userAnswers: [],
      setUserAnswers: mockSetUserAnswers,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => createVirtualRoom(),
    });
  });

  it("fetches room data using roomId", async () => {
    const virtualRoom = createVirtualRoom();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => virtualRoom,
    });

    render(<Room />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/rooms/room-123");
    });

    expect(mockSetVirtualRoom).toHaveBeenCalledWith(virtualRoom);
  });

  it("does not fetch room data when roomId is missing", () => {
    mockUseParams.mockReturnValue({
      roomId: undefined,
    });

    render(<Room />);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("renders room content after virtual room is loaded", () => {
    const virtualRoom = createVirtualRoom();

    mockUseOwnStore.mockReturnValue({
      virtualRoom,
      setVirtualRoom: mockSetVirtualRoom,
      setVRAnswers: mockSetVRAnswers,
      setResults: mockSetResults,
      userAnswers: [],
      setUserAnswers: mockSetUserAnswers,
    });

    render(<Room />);

    expect(screen.getByTestId("room-info")).toBeInTheDocument();
    expect(screen.getByTestId("lesson-header")).toBeInTheDocument();
    expect(screen.getByTestId("render-tasks")).toHaveTextContent(
      "Tasks readonly: false",
    );
  });

  it("restores answers and results for a finished room", async () => {
    const virtualRoom = createVirtualRoom({
      isFinished: true,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => virtualRoom,
    });

    render(<Room />);

    await waitFor(() => {
      expect(mockSetUserAnswers).toHaveBeenCalledWith({
        taskId: "task-1",
        questions: [
          {
            questionId: "question-1",
            userAnswer: "Paris",
          },
        ],
      });
    });

    expect(mockSetResults).toHaveBeenCalledWith([
      {
        taskId: "task-1",
        questions: [
          {
            questionId: "question-1",
            questionDescription: "Capital of France",
            result: true,
            rightAnswers: ["Paris"],
          },
        ],
      },
    ]);
  });

  it("shows see results button and goes directly to results for a finished room", async () => {
    const user = userEvent.setup();

    const virtualRoom = createVirtualRoom({
      isFinished: true,
    });

    mockUseOwnStore.mockReturnValue({
      virtualRoom,
      setVirtualRoom: mockSetVirtualRoom,
      setVRAnswers: mockSetVRAnswers,
      setResults: mockSetResults,
      userAnswers: [],
      setUserAnswers: mockSetUserAnswers,
    });

    render(<Room />);

    const button = screen.getByRole("button", {
      name: "See results",
    });

    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/rooms/room-123");

    expect(mockPush).toHaveBeenCalledWith("/rooms/room-123/results");
  });

  it("posts user answers and goes to results when the room is not finished", async () => {
    const user = userEvent.setup();

    const userAnswers = [
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

    const virtualRoom = createVirtualRoom({
      isFinished: false,
    });

    mockUseOwnStore.mockReturnValue({
      virtualRoom,
      setVirtualRoom: mockSetVirtualRoom,
      setVRAnswers: mockSetVRAnswers,
      setResults: mockSetResults,
      userAnswers,
      setUserAnswers: mockSetUserAnswers,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        result: "checked",
      }),
    });

    render(<Room />);

    await user.click(
      screen.getByRole("button", {
        name: "Finish lesson",
      }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/rooms/room-123/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userAnswers),
      });
    });

    expect(mockSetVRAnswers).toHaveBeenCalledWith({
      result: "checked",
    });

    expect(mockPush).toHaveBeenCalledWith("/rooms/room-123/results");
  });

  it("shows finish lesson button for an unfinished room", () => {
    const virtualRoom = createVirtualRoom({
      isFinished: false,
    });

    mockUseOwnStore.mockReturnValue({
      virtualRoom,
      setVirtualRoom: mockSetVirtualRoom,
      setVRAnswers: mockSetVRAnswers,
      setResults: mockSetResults,
      userAnswers: [],
      setUserAnswers: mockSetUserAnswers,
    });

    render(<Room />);

    expect(
      screen.getByRole("button", {
        name: "Finish lesson",
      }),
    ).toBeInTheDocument();
  });

  it("passes finished state as readonly to RenderTasks", () => {
    const virtualRoom = createVirtualRoom({
      isFinished: true,
    });

    mockUseOwnStore.mockReturnValue({
      virtualRoom,
      setVirtualRoom: mockSetVirtualRoom,
      setVRAnswers: mockSetVRAnswers,
      setResults: mockSetResults,
      userAnswers: [],
      setUserAnswers: mockSetUserAnswers,
    });

    render(<Room />);

    expect(screen.getByTestId("render-tasks")).toHaveTextContent(
      "Tasks readonly: true",
    );
  });
});
