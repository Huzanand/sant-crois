import { render, screen } from "@testing-library/react";
import Pagination from "./Pagination";
import styles from "./Pagination.module.scss";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

jest.mock("@/assets/svg/icons", () => ({
  PrevPage: ({ disabled }: { disabled?: boolean }) => (
    <div data-testid="arrow-icon" data-disabled={disabled} />
  ),
}));

const mockUseWindowWidth = jest.fn();

jest.mock("@/utils/useWindowWidth", () => ({
  useWindowWidth: () => mockUseWindowWidth(),
}));

const mockUseLanguageSync = jest.fn();

jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: () => mockUseLanguageSync(),
}));

const mockUseOwnStore = jest.fn();

const mockStoreState = {
  activeTypeOfLesson: "all",
  selectedLanguageLevel: "All",
  selectedLearningLanguage: "english",
  selectedPrimaryTopics: [],
  selectedSecondaryTopics: [],
  selectedTags: [],
  selectedAgeGroup: "All",
  selectedSorting: "rating",
};

jest.mock("@/store/storeProvider", () => ({
  useOwnStore: (selector: any) => selector(mockUseOwnStore()),
}));

beforeEach(() => {
  jest.clearAllMocks();

  mockUseOwnStore.mockReturnValue(mockStoreState);

  mockUseWindowWidth.mockReturnValue(1980);

  mockUseLanguageSync.mockReturnValue({ t: (key: string) => key });

  window.scrollTo = jest.fn();
});

describe("Pagination", () => {
  it("Pagination renders correctly", () => {
    render(
      <Pagination
        totalCount={60}
        initialSize={12}
        size={12}
        offset={0}
        setOffset={jest.fn()}
        setSize={jest.fn()}
      />,
    );

    expect(screen.getByTestId("prev-page-button")).toBeInTheDocument();
    expect(screen.getByTestId("prev-page-button")).toBeDisabled();

    expect(screen.getByTestId("next-page-button")).toBeInTheDocument();
    expect(screen.getByTestId("next-page-button")).not.toBeDisabled();

    expect(screen.getByTestId("load-more-button")).toBeInTheDocument();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("1")).toHaveClass(styles.active);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("2")).not.toHaveClass(styles.active);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("Transition to next page", async () => {
    const user = userEvent.setup();

    const Wrapper = () => {
      const [offset, setOffset] = useState(0);

      return (
        <Pagination
          totalCount={60}
          initialSize={12}
          size={12}
          offset={offset}
          setOffset={setOffset}
          setSize={jest.fn()}
        />
      );
    };

    render(<Wrapper />);

    await user.click(screen.getByTestId("next-page-button"));

    expect(screen.getByTestId("prev-page-button")).not.toBeDisabled();
    expect(screen.getByText("1")).not.toHaveClass(styles.active);
    expect(screen.getByText("2")).toHaveClass(styles.active);
  });

  it("Next page button becomes disabled on the last page", async () => {
    const user = userEvent.setup();

    const Wrapper = () => {
      const [offset, setOffset] = useState(0);

      return (
        <Pagination
          totalCount={24}
          initialSize={12}
          size={12}
          offset={offset}
          setOffset={setOffset}
          setSize={jest.fn()}
        />
      );
    };

    render(<Wrapper />);

    await user.click(screen.getByTestId("next-page-button"));

    expect(screen.getByTestId("next-page-button")).toBeDisabled();
  });

  it("Transition to prev page", async () => {
    const user = userEvent.setup();

    const Wrapper = () => {
      const [offset, setOffset] = useState(12);

      return (
        <Pagination
          totalCount={60}
          initialSize={12}
          size={12}
          offset={offset}
          setOffset={setOffset}
          setSize={jest.fn()}
        />
      );
    };

    render(<Wrapper />);

    await user.click(screen.getByTestId("prev-page-button"));

    expect(screen.getByTestId("prev-page-button")).toBeDisabled();
    expect(screen.getByText("1")).toHaveClass(styles.active);
    expect(screen.getByText("2")).not.toHaveClass(styles.active);
  });

  it("Transition from 1 to 3 page", async () => {
    const user = userEvent.setup();
    const mockSetOffset = jest.fn();

    const Wrapper = () => {
      const [offset, setOffset] = useState(0);

      const handleSetOffset = (newOffset: number) => {
        mockSetOffset(newOffset);
        setOffset(newOffset);
      };

      return (
        <Pagination
          totalCount={60}
          initialSize={12}
          size={12}
          offset={offset}
          setOffset={handleSetOffset}
          setSize={jest.fn()}
        />
      );
    };

    render(<Wrapper />);

    await user.click(screen.getByText("3"));

    expect(mockSetOffset).toHaveBeenCalledWith(24);

    expect(screen.getByTestId("prev-page-button")).not.toBeDisabled();
    expect(screen.getByText("1")).not.toHaveClass(styles.active);
    expect(screen.getByText("3")).toHaveClass(styles.active);
  });

  it("Load more pages", async () => {
    const user = userEvent.setup();

    const mockSetSize = jest.fn();

    const Wrapper = () => {
      const [size, setSize] = useState(12);

      const handleSetSize = (newSize: number) => {
        mockSetSize(newSize);
        setSize(newSize);
      };

      return (
        <Pagination
          totalCount={60}
          initialSize={12}
          size={size}
          offset={0}
          setOffset={jest.fn()}
          setSize={handleSetSize}
        />
      );
    };

    render(<Wrapper />);

    await user.click(screen.getByTestId("load-more-button"));

    expect(mockSetSize).toHaveBeenCalledWith(12);

    expect(screen.getByTestId("prev-page-button")).toBeDisabled();
    expect(screen.getByText("1")).toHaveClass(styles.active);
    expect(screen.getByText("2")).toHaveClass(styles.active);
  });

  it("Load more became disabled", async () => {
    const user = userEvent.setup();

    const Wrapper = () => {
      const [size, setSize] = useState(12);

      return (
        <Pagination
          totalCount={60}
          initialSize={12}
          size={size}
          offset={24}
          setOffset={jest.fn()}
          setSize={(inc) => setSize((prev) => prev + inc)}
        />
      );
    };

    render(<Wrapper />);

    await user.click(screen.getByTestId("load-more-button"));

    expect(screen.getByTestId("load-more-button")).not.toBeDisabled();

    await user.click(screen.getByTestId("load-more-button"));

    expect(screen.getByTestId("load-more-button")).toBeDisabled();
  });

  it("mobile render", () => {
    mockUseWindowWidth.mockReturnValue(500);

    render(
      <Pagination
        totalCount={60}
        initialSize={12}
        size={12}
        offset={0}
        setOffset={jest.fn()}
        setSize={jest.fn()}
      />,
    );

    expect(screen.queryByTestId("prev-page-button")).not.toBeInTheDocument();

    expect(screen.queryByTestId("next-page-button")).not.toBeInTheDocument();

    expect(screen.getByTestId("load-more-button")).toBeInTheDocument();
    expect(screen.getByTestId("load-more-button")).not.toBeDisabled();
  });

  it("Load more button disappears when all items are loaded", async () => {
    const user = userEvent.setup();
    mockUseWindowWidth.mockReturnValue(500);

    const Wrapper = () => {
      const [size, setSize] = useState(12);

      return (
        <Pagination
          totalCount={24}
          initialSize={12}
          size={size}
          offset={0}
          setOffset={jest.fn()}
          setSize={(inc) => setSize((prev) => prev + inc)}
        />
      );
    };

    render(<Wrapper />);

    await user.click(screen.getByTestId("load-more-button"));

    expect(screen.queryByTestId("load-more-button")).not.toBeInTheDocument();
  });

  it("pagination does not appear when items count is less than or equal to size", () => {
    render(
      <Pagination
        totalCount={11}
        initialSize={12}
        size={12}
        offset={0}
        setOffset={jest.fn()}
        setSize={jest.fn()}
      />,
    );

    expect(screen.queryByTestId("prev-page-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("load-more-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("next-page-button")).not.toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("shifts visible page numbers when navigating to the middle", async () => {
    const user = userEvent.setup();

    const Wrapper = () => {
      const [offset, setOffset] = useState(0);

      return (
        <Pagination
          totalCount={120}
          initialSize={12}
          size={12}
          offset={offset}
          setOffset={setOffset}
          setSize={jest.fn()}
        />
      );
    };

    render(<Wrapper />);

    // Initial: 1 2 3 4 7 8 9 10
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.queryByText("5")).not.toBeInTheDocument();

    await user.click(screen.getByText("4"));

    // After page 4: 1 3 4 5 7 8 9 10
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toHaveClass(styles.active);
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("stops shifting page numbers when left range reaches the last pages", async () => {
    const user = userEvent.setup();

    const Wrapper = () => {
      const [offset, setOffset] = useState(0);

      return (
        <Pagination
          totalCount={120}
          initialSize={12}
          size={12}
          offset={offset}
          setOffset={setOffset}
          setSize={jest.fn()}
        />
      );
    };

    render(<Wrapper />);

    const nextButton = screen.getByTestId("next-page-button");

    // Go from page 1 to page 6
    for (let i = 0; i < 5; i++) {
      await user.click(nextButton);
    }

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toHaveClass(styles.active);

    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    expect(screen.queryByText("2")).not.toBeInTheDocument();
    expect(screen.queryByText("3")).not.toBeInTheDocument();
  });

  it("renders pagination correctly with an even number of pages", () => {
    render(
      <Pagination
        totalCount={60}
        initialSize={10}
        size={10}
        offset={0}
        setOffset={jest.fn()}
        setSize={jest.fn()}
      />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByTestId("load-more-button")).toBeInTheDocument();

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("renders pagination correctly with an odd number of pages", () => {
    render(
      <Pagination
        totalCount={50}
        initialSize={10}
        size={10}
        offset={0}
        setOffset={jest.fn()}
        setSize={jest.fn()}
      />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByTestId("load-more-button")).toBeInTheDocument();

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("changes page when clicking a page number with an even number of pages", async () => {
    const user = userEvent.setup();
    const mockSetOffset = jest.fn();

    render(
      <Pagination
        totalCount={60}
        initialSize={10}
        size={10}
        offset={0}
        setOffset={mockSetOffset}
        setSize={jest.fn()}
      />,
    );

    await user.click(screen.getByText("3"));

    expect(mockSetOffset).toHaveBeenCalledWith(20);
  });

  it("changes page when clicking a page number with an odd number of pages", async () => {
    const user = userEvent.setup();
    const mockSetOffset = jest.fn();

    render(
      <Pagination
        totalCount={50}
        initialSize={10}
        size={10}
        offset={0}
        setOffset={mockSetOffset}
        setSize={jest.fn()}
      />,
    );

    await user.click(screen.getByText("3"));

    expect(mockSetOffset).toHaveBeenCalledWith(20);
  });

  it("renders all page numbers with 7 pages", () => {
    render(
      <Pagination
        totalCount={70}
        initialSize={10}
        size={10}
        offset={0}
        setOffset={jest.fn()}
        setSize={jest.fn()}
      />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();

    expect(screen.getByTestId("load-more-button")).toBeInTheDocument();
  });

  it("renders all page numbers with 8 pages", () => {
    render(
      <Pagination
        totalCount={80}
        initialSize={10}
        size={10}
        offset={0}
        setOffset={jest.fn()}
        setSize={jest.fn()}
      />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    expect(screen.queryByText("5")).toBeInTheDocument();

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("changes page when clicking a page number from the second half", async () => {
    const user = userEvent.setup();
    const mockSetOffset = jest.fn();

    render(
      <Pagination
        totalCount={60}
        initialSize={10}
        size={10}
        offset={0}
        setOffset={mockSetOffset}
        setSize={jest.fn()}
      />,
    );

    await user.click(screen.getByText("5"));

    expect(mockSetOffset).toHaveBeenCalledWith(40);
  });
});
