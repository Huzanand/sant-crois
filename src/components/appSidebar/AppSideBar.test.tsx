import { render, screen } from "@testing-library/react";
import AppSideBar from "./AppSideBar";
import userEvent from "@testing-library/user-event";

const mockUseOwnStore = jest.fn();

const mockStoreState = {
  lessons: [],
  fetchLessons: jest.fn(),
  fetchFilters: jest.fn(),
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

const mockUseMobile = jest.fn();

jest.mock("@/utils/useMobile", () => ({
  useMobile: (width: number) => mockUseMobile(width),
}));

const mockUseFilterParam = jest.fn();

jest.mock("@/utils/useFilterParam", () => ({
  useFilterParam: (param: string) => mockUseFilterParam(param),
}));

const mockUseTranslatedOptions = jest.fn();

jest.mock("@/utils/useTranslatedOptions", () => ({
  __esModule: true,
  default: (optionArr: string[], translationKey: string) =>
    mockUseTranslatedOptions(optionArr, translationKey),
}));

const mockUseLanguageSync = jest.fn();

jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: () => mockUseLanguageSync(),
}));

jest.mock("@/components/divider/Divider", () => ({
  __esModule: true,
  default: () => <div data-testid="divider" />,
}));

jest.mock("../logo/Logo", () => ({
  __esModule: true,
  default: () => <div data-testid="logo" />,
}));

jest.mock("../typeOfLesson/TypeOfLesson", () => ({
  __esModule: true,
  default: () => <div data-testid="type-of-lesson" />,
}));

jest.mock("../settings/Settings", () => ({
  __esModule: true,
  default: () => <div data-testid="settings" />,
}));

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    return () => <div data-testid="burger-menu" />;
  },
}));

jest.mock("../settingsSelect/SettingsSelect", () => ({
  __esModule: true,
  default: ({
    onChangeSelect,
  }: {
    onChangeSelect: (value: string) => void;
  }) => (
    <button
      data-testid="settings-select"
      onClick={() => onChangeSelect("newest")}
    >
      settings-select
    </button>
  ),
}));

jest.mock("../filters/Filters", () => ({
  __esModule: true,
  default: ({
    isOpen,
    setIsOpen,
  }: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  }) => (
    <button data-testid="filters" onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? "open" : "closed"}
    </button>
  ),
}));

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const mockUpdateParam = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  mockUseOwnStore.mockReturnValue(mockStoreState);

  mockUseMobile.mockImplementation(() => {
    return false;
  });

  mockUseFilterParam.mockImplementation((param: string) => {
    if (param === "exerciseType") {
      return {
        selectedValue: "all",
      };
    }

    if (param === "sort") {
      return {
        selectedValue: "rating",
        updateParam: mockUpdateParam,
      };
    }
  });

  mockUseLanguageSync.mockReturnValue({
    t: (key: string) => key,
  });
});

describe("AppSideBar", () => {
  it("renders desktop sidebar", () => {
    render(<AppSideBar />);

    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("type-of-lesson")).toBeInTheDocument();
    expect(screen.getByTestId("divider")).toBeInTheDocument();
    expect(screen.queryByTestId("burger-menu")).not.toBeInTheDocument();
  });

  it("renders mobile sidebar", () => {
    mockUseMobile.mockImplementation(() => true);

    render(<AppSideBar />);

    expect(screen.getByTestId("burger-menu")).toBeInTheDocument();
    expect(screen.queryByTestId("logo")).not.toBeInTheDocument();
    expect(screen.queryByTestId("type-of-lesson")).not.toBeInTheDocument();
  });

  it("opens settings when settings button is clicked", async () => {
    const user = userEvent.setup();

    render(<AppSideBar />);

    await user.click(screen.getByText("settings"));

    expect(screen.getByTestId("settings")).toBeInTheDocument();
    expect(screen.queryByTestId("type-of-lesson")).not.toBeInTheDocument();
  });

  it("opens settings and closes them with the back button", async () => {
    const user = userEvent.setup();

    render(<AppSideBar />);

    expect(screen.queryByTestId("settings")).not.toBeInTheDocument();
    expect(screen.getByTestId("type-of-lesson")).toBeInTheDocument();

    await user.click(screen.getByText("settings"));

    expect(screen.getByTestId("settings")).toBeInTheDocument();
    expect(screen.queryByTestId("type-of-lesson")).not.toBeInTheDocument();

    await user.click(screen.getByText("all"));

    expect(screen.queryByTestId("settings")).not.toBeInTheDocument();
    expect(screen.queryByTestId("type-of-lesson")).toBeInTheDocument();
  });

  it("updates sorting when a different option is selected", async () => {
    const user = userEvent.setup();

    render(<AppSideBar />);

    await user.click(screen.getByTestId("settings-select"));

    expect(mockUpdateParam).toHaveBeenCalledWith("newest");
  });

  it("opens filters", async () => {
    const user = userEvent.setup();

    render(<AppSideBar />);

    expect(screen.getByTestId("filters")).toHaveTextContent("closed");

    await user.click(screen.getByTestId("filters"));

    expect(screen.getByTestId("filters")).toHaveTextContent("open");
  });

  it("renders mobile sidebar for tablet width", () => {
    mockUseMobile.mockImplementation((width: number) => {
      return width === 1012;
    });

    render(<AppSideBar />);

    expect(screen.getByTestId("burger-menu")).toBeInTheDocument();
    expect(screen.queryByTestId("logo")).not.toBeInTheDocument();
    expect(screen.queryByTestId("type-of-lesson")).not.toBeInTheDocument();
  });
});
