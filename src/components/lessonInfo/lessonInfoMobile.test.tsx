import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileViev from "./MobileViev";

const mockReplace = jest.fn();
const mockPush = jest.fn();

const mockClearRecomendations = jest.fn();
const mockClearUserAnswers = jest.fn();

const mockUseOwnStore = jest.fn();

const mockLesson = {
  id: "42",
  header: "Test lesson",
  targetAgeGroup: "adults",
  author: "John Doe",
  languageLevel: "B2",
  rating: 4.5,
  acceptance: 0.9,
  creationDateTime: "2026-08-20T10:30:00.000Z",
  views: 123,
};

jest.mock("@/store/storeProvider", () => ({
  useOwnStore: (selector: any) => selector(mockUseOwnStore()),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
}));

const mockUseLanguageSync = jest.fn();

jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: () => mockUseLanguageSync(),
}));

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    const DynamicComponent = () => <div data-testid="burger-menu" />;

    return DynamicComponent;
  },
}));

jest.mock("../rating/Rating", () => ({
  __esModule: true,
  default: ({ rating }: { rating: number }) => (
    <div data-testid="rating">{rating}</div>
  ),
}));

jest.mock("@/assets/svg/icons", () => ({
  ArrowDownIco: () => <span data-testid="back-icon" />,
  SendTaskIco: () => <span data-testid="send-icon" />,
  StarIco: () => <span data-testid="star-icon" />,
}));

beforeEach(() => {
  jest.clearAllMocks();

  mockUseOwnStore.mockReturnValue({
    lesson: mockLesson,
    clearRecomendations: mockClearRecomendations,
    clearUserAnswers: mockClearUserAnswers,
  });

  mockUseLanguageSync.mockReturnValue({
    t: (key: string) => key,
  });
});

describe("MobileViev", () => {
  it("renders lesson information", () => {
    render(<MobileViev />);

    expect(screen.getByTestId("burger-menu")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Test lesson" }),
    ).toBeInTheDocument();

    expect(screen.getByText("age group:")).toBeInTheDocument();
    expect(screen.getByText("adults")).toBeInTheDocument();

    expect(screen.getByText("author:")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    expect(screen.getByText("level:")).toBeInTheDocument();
    expect(screen.getByText("selectedLanguageLevel.B2")).toBeInTheDocument();

    expect(screen.getByText("rating:")).toBeInTheDocument();
    expect(screen.getByTestId("rating")).toHaveTextContent("4.5");

    expect(screen.getByText("complexity")).toBeInTheDocument();
    expect(screen.getByText("parsedComplexity.light")).toBeInTheDocument();

    expect(screen.getByText("created:")).toBeInTheDocument();
    expect(screen.getByText("20-08-2026")).toBeInTheDocument();

    expect(screen.getByText("views:")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("renders hard complexity when acceptance is 0.3 or lower", () => {
    mockUseOwnStore.mockReturnValue({
      lesson: {
        ...mockLesson,
        acceptance: 0.3,
      },
      clearRecomendations: mockClearRecomendations,
      clearUserAnswers: mockClearUserAnswers,
    });

    render(<MobileViev />);

    expect(screen.getByText("parsedComplexity.hard")).toBeInTheDocument();
  });

  it("renders medium complexity when acceptance is between 0.3 and 0.8", () => {
    mockUseOwnStore.mockReturnValue({
      lesson: {
        ...mockLesson,
        acceptance: 0.5,
      },
      clearRecomendations: mockClearRecomendations,
      clearUserAnswers: mockClearUserAnswers,
    });

    render(<MobileViev />);

    expect(screen.getByText("parsedComplexity.medium")).toBeInTheDocument();
  });

  it("does not render rating when rating is missing", () => {
    mockUseOwnStore.mockReturnValue({
      lesson: {
        ...mockLesson,
        rating: undefined,
      },
      clearRecomendations: mockClearRecomendations,
      clearUserAnswers: mockClearUserAnswers,
    });

    render(<MobileViev />);

    expect(screen.getByText("rating:")).toBeInTheDocument();
    expect(screen.queryByTestId("rating")).not.toBeInTheDocument();
  });

  it("renders fallback when creation date is missing", () => {
    mockUseOwnStore.mockReturnValue({
      lesson: {
        ...mockLesson,
        creationDateTime: undefined,
      },
      clearRecomendations: mockClearRecomendations,
      clearUserAnswers: mockClearUserAnswers,
    });

    render(<MobileViev />);

    expect(screen.getByText("----------")).toBeInTheDocument();
  });

  it("returns to home and clears lesson state when back button is clicked", async () => {
    const user = userEvent.setup();

    render(<MobileViev />);

    const backButton = screen.getByTestId("back-icon").closest("button");

    expect(backButton).toBeInTheDocument();

    await user.click(backButton!);

    expect(mockReplace).toHaveBeenCalledWith("/");
    expect(mockClearRecomendations).toHaveBeenCalled();
    expect(mockClearUserAnswers).toHaveBeenCalled();
  });

  it("navigates to assign student modal when button is clicked", async () => {
    const user = userEvent.setup();

    render(<MobileViev />);

    await user.click(screen.getByRole("button", { name: "assignStudent" }));

    expect(mockPush).toHaveBeenCalledWith("/lesson/42/modal");
  });
});
