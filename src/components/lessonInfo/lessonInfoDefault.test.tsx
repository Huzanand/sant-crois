import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DefaultViev from "./DefaultViev";

const mockReplace = jest.fn();
const mockPush = jest.fn();

const mockOnSelectChange = jest.fn();
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

jest.mock("@/utils/useTranslatedOptions", () => ({
  __esModule: true,
  default: (options: any) => options,
}));

jest.mock("../logo/Logo", () => ({
  __esModule: true,
  default: () => <div data-testid="logo" />,
}));

jest.mock("../divider/Divider", () => ({
  __esModule: true,
  default: () => <div data-testid="divider" />,
}));

jest.mock("../settingsSelect/SettingsSelect", () => ({
  __esModule: true,
  default: ({
    selectedOption,
    selectedOptionLabel,
    onChangeSelect,
  }: {
    selectedOption?: string;
    selectedOptionLabel?: string;
    onChangeSelect?: (value: string) => void;
  }) => (
    <div>
      <span data-testid="selected-language">{selectedOption}</span>
      <span data-testid="selected-language-label">{selectedOptionLabel}</span>

      <button onClick={() => onChangeSelect?.("uk")}>change language</button>
    </div>
  ),
}));

jest.mock("../rating/Rating", () => ({
  __esModule: true,
  default: ({ rating }: { rating: number }) => (
    <div data-testid="rating">{rating}</div>
  ),
}));

jest.mock("@/assets/svg/icons", () => ({
  ArrowDownIco: () => <span data-testid="back-icon" />,
  InterfaceLanguageIco: () => <span data-testid="language-icon" />,
  SendTaskIco: () => <span data-testid="send-icon" />,
  StarIco: () => <span data-testid="star-icon" />,
}));

beforeEach(() => {
  jest.clearAllMocks();

  mockUseOwnStore.mockReturnValue({
    lesson: mockLesson,
    onSelectChange: mockOnSelectChange,
    selectedInterfaceLanguage: "en",
    interfaceLanguageOptions: [{ value: "en" }, { value: "uk" }],
    clearRecomendations: mockClearRecomendations,
    clearUserAnswers: mockClearUserAnswers,
  });

  mockUseLanguageSync.mockReturnValue({
    t: (key: string) => key,
  });
});

describe("DefaultViev", () => {
  it("renders lesson information", () => {
    render(<DefaultViev />);

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

  it("renders medium complexity when acceptance is between 0.3 and 0.8", () => {
    mockUseOwnStore.mockReturnValue({
      lesson: {
        ...mockLesson,
        acceptance: 0.5,
      },
      onSelectChange: mockOnSelectChange,
      selectedInterfaceLanguage: "en",
      interfaceLanguageOptions: [],
      clearRecomendations: mockClearRecomendations,
      clearUserAnswers: mockClearUserAnswers,
    });

    render(<DefaultViev />);

    expect(screen.getByText("parsedComplexity.medium")).toBeInTheDocument();
  });

  it("renders hard complexity when acceptance is 0.3 or lower", () => {
    mockUseOwnStore.mockReturnValue({
      lesson: {
        ...mockLesson,
        acceptance: 0.3,
      },
      onSelectChange: mockOnSelectChange,
      selectedInterfaceLanguage: "en",
      interfaceLanguageOptions: [],
      clearRecomendations: mockClearRecomendations,
      clearUserAnswers: mockClearUserAnswers,
    });

    render(<DefaultViev />);

    expect(screen.getByText("parsedComplexity.hard")).toBeInTheDocument();
  });

  it("does not render complexity when acceptance is missing", () => {
    mockUseOwnStore.mockReturnValue({
      lesson: {
        ...mockLesson,
        acceptance: undefined,
      },
      onSelectChange: mockOnSelectChange,
      selectedInterfaceLanguage: "en",
      interfaceLanguageOptions: [],
      clearRecomendations: mockClearRecomendations,
      clearUserAnswers: mockClearUserAnswers,
    });

    render(<DefaultViev />);

    expect(screen.getByText("complexity")).toBeInTheDocument();
    expect(screen.queryByText(/parsedComplexity/)).not.toBeInTheDocument();
  });

  it("does not render rating when rating is missing", () => {
    mockUseOwnStore.mockReturnValue({
      lesson: {
        ...mockLesson,
        rating: undefined,
      },
      onSelectChange: mockOnSelectChange,
      selectedInterfaceLanguage: "en",
      interfaceLanguageOptions: [],
      clearRecomendations: mockClearRecomendations,
      clearUserAnswers: mockClearUserAnswers,
    });

    render(<DefaultViev />);

    expect(screen.getByText("rating:")).toBeInTheDocument();
    expect(screen.queryByTestId("rating")).not.toBeInTheDocument();
  });

  it("returns to home and clears lesson state when back button is clicked", async () => {
    const user = userEvent.setup();

    render(<DefaultViev />);

    const backButton = screen.getByTestId("back-icon").closest("button");

    expect(backButton).toBeInTheDocument();

    await user.click(backButton!);

    expect(mockReplace).toHaveBeenCalledWith("/");
    expect(mockClearRecomendations).toHaveBeenCalled();
    expect(mockClearUserAnswers).toHaveBeenCalled();
  });

  it("calls onSelectChange when interface language is changed", async () => {
    const user = userEvent.setup();

    render(<DefaultViev />);

    await user.click(screen.getByRole("button", { name: "change language" }));

    expect(mockOnSelectChange).toHaveBeenCalledWith("uk");
  });

  it("navigates to assign student modal when button is clicked", async () => {
    const user = userEvent.setup();

    render(<DefaultViev />);

    await user.click(screen.getByRole("button", { name: "assignStudent" }));

    expect(mockPush).toHaveBeenCalledWith("/lesson/42/modal");
  });
});
