import { render, screen } from "@testing-library/react";
import Home from "./page";

const mockLessons = [
  {
    id: "1",
    header: "First lesson",
    primaryTopics: [],
    languageLevel: "A1",
    learningLanguage: "english",
    tasks: [],
    relatedContents: [],
    creationDateTime: new Date(),
  },
  {
    id: "2",
    header: "Second lesson",
    primaryTopics: [],
    languageLevel: "A2",
    learningLanguage: "english",
    tasks: [],
    relatedContents: [],
    creationDateTime: new Date(),
  },
];
const mockUseOwnStore = jest.fn();
const mockFetchFilters = jest.fn();
const mockFetchLessons = jest.fn();

const mockStoreState = {
  lessons: mockLessons,
  fetchLessons: mockFetchLessons,
  fetchFilters: mockFetchFilters,
  activeTypeOfLesson: "all",
  selectedLanguageLevel: "All",
  selectedLearningLanguage: "english",
  selectedPrimaryTopics: [],
  selectedSecondaryTopics: [],
  selectedTags: [],
  selectedAgeGroup: [],
  offset: 0,
  setOffset: jest.fn(),
  size: 12,
  setSize: jest.fn(),
  totalCount: 2,
  selectedSorting: "rating",
  setHomePageContentHeight: jest.fn(),
};

jest.mock("@/store/storeProvider", () => ({
  useOwnStore: (selector: any) => selector(mockUseOwnStore()),
}));

const mockInterceptorsStore = jest.fn();

jest.mock("@/store/interceptorsStore", () => ({
  interceptorsStore: (selector: any) => selector(mockInterceptorsStore()),
}));

const mockSearchParams = jest.fn();

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams(),
}));

jest.mock("@/components/card/Card", () => ({
  __esModule: true,
  default: ({ header }: { header?: string }) => (
    <div data-testid="lesson-card">{header}</div>
  ),
}));

jest.mock("@/components/appSidebar/AppSideBar", () => ({
  __esModule: true,
  default: () => <div />,
}));

jest.mock("@/components/pagination/Pagination", () => ({
  __esModule: true,
  default: () => <div data-testid="pagination" />,
}));

jest.mock("@/components/skeleton/Skeleton", () => ({
  __esModule: true,
  default: () => <div data-testid="skeleton" />,
}));

jest.mock("@/components/error404/Error404", () => ({
  __esModule: true,
  default: () => <div data-testid="error-state" />,
}));

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

beforeEach(() => {
  jest.clearAllMocks();

  mockUseOwnStore.mockReturnValue(mockStoreState);

  mockInterceptorsStore.mockReturnValue({
    loading: false,
    error: false,
  });

  mockSearchParams.mockReturnValue({
    toString: () => "",
  });
});

describe("Lesson Library", () => {
  it("renders lesson cards when lessons are available", () => {
    render(<Home />);

    const cards = screen.getAllByTestId("lesson-card");

    expect(cards).toHaveLength(2);

    expect(screen.getByText("First lesson")).toBeInTheDocument();
    expect(screen.getByText("Second lesson")).toBeInTheDocument();
  });

  it("shows error state when lessons request fails", () => {
    mockInterceptorsStore.mockReturnValue({
      loading: false,
      error: true,
    });

    render(<Home />);

    expect(screen.queryByTestId("lesson-card")).not.toBeInTheDocument();
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("shows skeleton loading state when lessons are loading", () => {
    mockInterceptorsStore.mockReturnValue({
      loading: true,
      error: false,
    });

    render(<Home />);

    const skeletons = screen.getAllByTestId("skeleton");

    expect(skeletons).toHaveLength(6);
    expect(screen.queryByTestId("lesson-card")).not.toBeInTheDocument();
  });

  it("shows pagination on render", () => {
    render(<Home />);

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("fetches filters when Home mounts", () => {
    render(<Home />);

    expect(mockFetchFilters).toHaveBeenCalledTimes(1);
  });

  it("fetches lessons when Home mounts", () => {
    render(<Home />);

    expect(mockFetchLessons).toHaveBeenCalled();
  });

  it("fetches lessons with correct parameters", () => {
    render(<Home />);

    expect(mockFetchLessons).toHaveBeenCalledWith(12, "All", "english", "", 0);
  });

  it("fetches lessons again when offset changes", () => {
    const { rerender } = render(<Home />);

    mockUseOwnStore.mockReturnValue({
      ...mockStoreState,
      offset: 12,
    });

    rerender(<Home />);

    expect(mockFetchLessons).toHaveBeenLastCalledWith(
      12,
      "All",
      "english",
      "",
      12,
    );
  });

  it("fetches lessons again when filters change", () => {
    const { rerender } = render(<Home />);

    mockUseOwnStore.mockReturnValue({
      ...mockStoreState,
      selectedLanguageLevel: "A2",
    });

    rerender(<Home />);

    expect(mockFetchLessons).toHaveBeenLastCalledWith(
      12,
      "A2",
      "english",
      "",
      0,
    );
  });

  it("fetches lessons again when learning language changes", () => {
    const { rerender } = render(<Home />);

    mockUseOwnStore.mockReturnValue({
      ...mockStoreState,
      selectedLearningLanguage: "german",
    });

    rerender(<Home />);

    expect(mockFetchLessons).toHaveBeenLastCalledWith(
      12,
      "All",
      "german",
      "",
      0,
    );
  });

  it("fetches lessons with exercise type from search params", () => {
    mockSearchParams.mockReturnValue({
      toString: () => "exerciseType=grammar",
    });

    render(<Home />);

    expect(mockFetchLessons).toHaveBeenLastCalledWith(
      12,
      "All",
      "english",
      "exerciseType=grammar",
      0,
    );
  });

  it("resets pagination when filters change", () => {
    const setOffset = jest.fn();
    const setSize = jest.fn();

    const { rerender } = render(<Home />);

    mockUseOwnStore.mockReturnValue({
      ...mockStoreState,
      selectedLanguageLevel: "A2",
      setOffset,
      setSize,
    });

    rerender(<Home />);

    expect(setOffset).toHaveBeenCalledWith(0);
    expect(setSize).toHaveBeenCalledWith(0);
  });

  it("links lesson card to the correct lesson page", () => {
    render(<Home />);

    const lessonLinks = screen.getAllByRole("link");

    expect(lessonLinks[0]).toHaveAttribute("href", "/lesson/1");
  });
});
