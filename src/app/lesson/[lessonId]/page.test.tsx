import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Lesson from "./page";

const mockLesson = {
  id: "1",
  header: "Test lesson",
  tasks: [{ id: "task-1" }, { id: "task-2" }],
  relatedContents: ["content-1", "content-2"],
};

const mockStoreState = {
  lesson: mockLesson,
  fetchLessonById: jest.fn(),
  fetchRecomendations: jest.fn(),
  clearRecomendations: jest.fn(),
};

const mockUseOwnStore = jest.fn();

jest.mock("@/store/storeProvider", () => ({
  useOwnStore: (selector: any) => selector(mockUseOwnStore()),
}));

const mockInterceptorsStore = jest.fn();

jest.mock("@/store/interceptorsStore", () => ({
  interceptorsStore: (selector: any) => selector(mockInterceptorsStore()),
}));

const mockUseParams = jest.fn();
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => mockUseParams(),
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/components/lessonInfo/LessonInfo", () => ({
  __esModule: true,
  default: () => <div data-testid="lesson-info" />,
}));

const mockUseLanguageSync = jest.fn();

jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: () => mockUseLanguageSync(),
}));

const mockRenderTasks = jest.fn();

jest.mock("@/utils/renderTasks/RenderTasks", () => ({
  RenderTasks: ({ tasks }: { tasks: any }) => {
    mockRenderTasks(tasks);

    return <div data-testid="render-tasks" />;
  },
}));

const mockRenderHeaderOfLesson = jest.fn();

jest.mock("@/utils/renderHeaderOfLesson/RenderHeaderOfLesson", () => ({
  RenderHeaderOfLesson: ({ lesson }: { lesson: any }) => {
    mockRenderHeaderOfLesson(lesson);

    return <div data-testid="render-header-of-lesson" />;
  },
}));

jest.mock("@/components/inDev/InDev", () => ({
  __esModule: true,
  default: () => <div data-testid="in-dev" />,
}));

jest.mock("@/components/error404/Error404", () => ({
  __esModule: true,
  default: () => <div data-testid="error404" />,
}));

beforeEach(() => {
  jest.clearAllMocks();

  mockUseOwnStore.mockReturnValue(mockStoreState);

  mockInterceptorsStore.mockReturnValue({
    error: false,
  });

  mockUseParams.mockReturnValue({
    lessonId: "1",
  });

  mockUseLanguageSync.mockReturnValue({
    t: (key: string) => key,
  });
});

describe("Lesson page", () => {
  it("fetches lesson by id when page mounts", () => {
    render(<Lesson />);

    expect(mockStoreState.fetchLessonById).toHaveBeenCalledWith("1");
  });

  it("renders lesson header and tasks when lesson exists", () => {
    render(<Lesson />);

    expect(screen.getByTestId("render-header-of-lesson")).toBeInTheDocument();
    expect(screen.getByTestId("render-tasks")).toBeInTheDocument();

    expect(mockRenderHeaderOfLesson).toHaveBeenCalledWith(mockLesson);
    expect(mockRenderTasks).toHaveBeenCalledWith(mockLesson.tasks);
  });

  it("fetches recommendations when lesson has related contents", () => {
    render(<Lesson />);

    expect(mockStoreState.fetchRecomendations).toHaveBeenCalledWith(
      mockLesson.relatedContents,
    );
  });

  it("does not fetch recommendations when lesson has no related contents", () => {
    mockUseOwnStore.mockReturnValue({
      ...mockStoreState,
      lesson: {
        ...mockLesson,
        relatedContents: [],
      },
    });

    render(<Lesson />);

    expect(mockStoreState.fetchRecomendations).not.toHaveBeenCalled();
  });

  it("renders error page when interceptor has an error", () => {
    mockInterceptorsStore.mockReturnValue({
      error: true,
    });

    render(<Lesson />);

    expect(screen.getByTestId("error404")).toBeInTheDocument();

    expect(screen.queryByTestId("lesson-info")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("render-header-of-lesson"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("render-tasks")).not.toBeInTheDocument();
  });

  it("navigates to lesson results when clicking finish button", async () => {
    const user = userEvent.setup();

    render(<Lesson />);

    await user.click(screen.getByRole("button", { name: "finishLesson" }));

    expect(mockPush).toHaveBeenCalledWith("/lesson/1/results");
  });
});
