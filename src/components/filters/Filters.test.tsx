import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Filters from "./Filters";
const mockUseOwnStore = jest.fn();
const mockStoreState = {
  fetchLessons: jest.fn(),
  selectedPrimaryTopics: [],
  selectedSecondaryTopics: [],
  selectedTags: [],
  selectedAgeGroup: [],
  offset: 0,
  setOffset: jest.fn(),
  primaryTopics: ["grammar", "vocabulary"],
  secondaryTopics: ["travel", "food"],
  tags: ["beginner", "popular"],
  targetAgeGroups: ["children", "adults"],
  size: 12,
  selectedLanguageLevel: "All",
  selectedLearningLanguage: "english",
};
jest.mock("@/store/storeProvider", () => ({
  useOwnStore: (selector: any) => selector(mockUseOwnStore()),
}));
const mockSetIsOpen = jest.fn();
const mockUseLanguageSync = jest.fn();
jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: () => mockUseLanguageSync(),
}));
jest.mock("@/components/divider/Divider", () => ({
  __esModule: true,
  default: () => <div data-testid="divider" />,
}));
jest.mock("@/components/searchComponent/SearchComponent", () => ({
  __esModule: true,
  default: ({
    label,
    arr,
    selectedValues,
    onToggle,
  }: {
    label: string;
    arr: string[];
    selectedValues: string[];
    onToggle: (value: string) => void;
  }) => (
    <div>
      {" "}
      <div>{label}</div>{" "}
      {arr.map((value) => (
        <button
          key={value}
          data-testid={`filter-${value}`}
          data-selected={selectedValues.includes(value)}
          onClick={() => onToggle(value)}
        >
          {" "}
          {value}{" "}
        </button>
      ))}{" "}
    </div>
  ),
}));
jest.mock("@/components/ageFilter/AgeFilter", () => ({
  __esModule: true,
  default: ({
    label,
    arr,
    selectedValues,
    onToggle,
  }: {
    label: string;
    arr: string[];
    selectedValues: string[];
    onToggle: (value: string) => void;
  }) => (
    <div>
      {" "}
      <div>{label}</div>{" "}
      {arr.map((value) => (
        <button
          key={value}
          data-testid={`age-${value}`}
          data-selected={selectedValues.includes(value)}
          onClick={() => onToggle(value)}
        >
          {" "}
          {value}{" "}
        </button>
      ))}{" "}
    </div>
  ),
}));
const mockReplace = jest.fn();
let searchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: mockReplace,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => searchParams,
}));
const mockUseWindowWidth = jest.fn();
jest.mock("@/utils/useWindowWidth", () => ({
  useWindowWidth: () => mockUseWindowWidth(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockUseOwnStore.mockReturnValue(mockStoreState);
  mockUseWindowWidth.mockReturnValue(1980);
  searchParams = new URLSearchParams();
  mockUseLanguageSync.mockReturnValue({ t: (key: string) => key });
});
describe("Filters", () => {
  it("renders closed", () => {
    render(<Filters height={100} isOpen={false} setIsOpen={mockSetIsOpen} />);
    expect(screen.queryByText("main theme")).not.toBeInTheDocument();
    expect(screen.queryByText("secondary theme")).not.toBeInTheDocument();
    expect(screen.queryByText("tags")).not.toBeInTheDocument();
    expect(screen.queryByTestId("age-group")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "apply" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "reset" }),
    ).not.toBeInTheDocument();
  });
  it("renders open", () => {
    render(<Filters height={100} isOpen={true} setIsOpen={mockSetIsOpen} />);
    expect(screen.queryByTestId("filters-overlay")).not.toBeInTheDocument();
    expect(screen.getByText("main theme")).toBeInTheDocument();
    expect(screen.getByText("secondary theme")).toBeInTheDocument();
    expect(screen.getByText("tags")).toBeInTheDocument();
    expect(screen.getByText("age group")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "apply" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "reset" })).toBeInTheDocument();
  });
  it("selects filter", async () => {
    const user = userEvent.setup();
    render(<Filters height={100} isOpen={true} setIsOpen={mockSetIsOpen} />);
    await user.click(screen.getByTestId("filter-travel"));
    expect(screen.getByTestId("filter-travel")).toHaveAttribute(
      "data-selected",
      "true",
    );
    await user.click(screen.getByTestId("filter-grammar"));
    expect(screen.getByTestId("filter-grammar")).toHaveAttribute(
      "data-selected",
      "true",
    );
    await user.click(screen.getByTestId("filter-beginner"));
    expect(screen.getByTestId("filter-beginner")).toHaveAttribute(
      "data-selected",
      "true",
    );
    expect(screen.getByTestId("filter-food")).toHaveAttribute(
      "data-selected",
      "false",
    );
    await user.click(screen.getByTestId("filter-food"));
    expect(screen.getByTestId("filter-travel")).toHaveAttribute(
      "data-selected",
      "true",
    );
    expect(screen.getByTestId("filter-food")).toHaveAttribute(
      "data-selected",
      "true",
    );
  });
  it("selects age group", async () => {
    const user = userEvent.setup();
    render(<Filters height={100} isOpen={true} setIsOpen={mockSetIsOpen} />);
    await user.click(screen.getByTestId("age-children"));
    expect(screen.getByTestId("age-children")).toHaveAttribute(
      "data-selected",
      "true",
    );
  });
  it("deselects filter", async () => {
    const user = userEvent.setup();
    render(<Filters height={100} isOpen={true} setIsOpen={mockSetIsOpen} />);
    const travel = screen.getByTestId("filter-travel");
    await user.click(travel);
    expect(travel).toHaveAttribute("data-selected", "true");
    await user.click(travel);
    expect(travel).toHaveAttribute("data-selected", "false");
  });
  it("applies filters", async () => {
    const user = userEvent.setup();
    render(<Filters height={100} isOpen={true} setIsOpen={mockSetIsOpen} />);
    await user.click(screen.getByTestId("filter-travel"));
    await user.click(screen.getByRole("button", { name: "apply" }));
    const updatedQueryString = "secondaryTopics=travel&offset=0";
    expect(mockReplace).toHaveBeenCalledWith(`/?${updatedQueryString}`, {
      scroll: false,
    });
    expect(mockStoreState.fetchLessons).toHaveBeenCalledWith(
      12,
      "All",
      "english",
      updatedQueryString,
      0,
    );
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });
  it("resets filters", async () => {
    const user = userEvent.setup();
    searchParams = new URLSearchParams(
      "secondaryTopics=travel&tags=beginner,popular&offset=12",
    );
    render(<Filters height={100} isOpen={true} setIsOpen={mockSetIsOpen} />);
    await user.click(screen.getByRole("button", { name: "reset" }));
    expect(mockReplace).toHaveBeenCalledWith("/?offset=12", { scroll: false });
  });
  it("closes by overlay", async () => {
    const user = userEvent.setup();
    mockUseWindowWidth.mockReturnValue(1000);
    render(<Filters height={100} isOpen={true} setIsOpen={mockSetIsOpen} />);
    await user.click(screen.getByTestId("filters-overlay"));
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });
  it("locks mobile body", () => {
    mockUseWindowWidth.mockReturnValue(500);
    render(<Filters height={100} isOpen={true} setIsOpen={mockSetIsOpen} />);
    expect(document.body.style.overflow).toBe("hidden");
  });
  it("unlocks mobile body", () => {
    mockUseWindowWidth.mockReturnValue(500);
    const { rerender } = render(
      <Filters height={100} isOpen={true} setIsOpen={mockSetIsOpen} />,
    );
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Filters height={100} isOpen={false} setIsOpen={mockSetIsOpen} />);
    expect(document.body.style.overflow).toBe("");
  });
  it("unlocks mobile body on cleanup", () => {
    mockUseWindowWidth.mockReturnValue(500);
    const { unmount } = render(
      <Filters height={100} isOpen={true} setIsOpen={mockSetIsOpen} />,
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
