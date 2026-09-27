import { render, screen } from "@testing-library/react";
import { RenderHeaderOfLesson } from "./RenderHeaderOfLesson";

const mockUseOwnStore = jest.fn();

jest.mock("@/store/storeProvider", () => ({
  useOwnStore: (selector: any) => selector(mockUseOwnStore()),
}));

jest.mock("../makeFirstLetterUppercase", () => ({
  makeFirstLetterUppercase: (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1),
}));

const mockLesson = {
  id: "1",
  header: "Test lesson",
  cover: "/test-cover.jpg",
  primaryTopics: ["Grammar"],
  secondaryTopics: ["Present Simple"],
  tags: ["grammar", "beginner", "english"],
  exerciseDescriptions: {
    En: "English exercise description",
    Uk: "Ukrainian exercise description",
  },
} as any;

beforeEach(() => {
  jest.clearAllMocks();

  mockUseOwnStore.mockReturnValue({
    selectedInterfaceLanguage: "en",
    selectedLearningLanguage: "uk",
  });
});

describe("RenderHeaderOfLesson", () => {
  it("renders lesson header and primary topic", () => {
    render(<RenderHeaderOfLesson lesson={mockLesson} />);

    expect(
      screen.getByRole("heading", { name: "Test lesson" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Grammar")).toBeInTheDocument();
  });

  it("renders secondary topic when provided", () => {
    render(<RenderHeaderOfLesson lesson={mockLesson} />);

    expect(screen.getByText("Present Simple")).toBeInTheDocument();
  });

  it("renders all lesson tags", () => {
    render(<RenderHeaderOfLesson lesson={mockLesson} />);

    expect(screen.getByText("grammar")).toBeInTheDocument();
    expect(screen.getByText("beginner")).toBeInTheDocument();
    expect(screen.getByText("english")).toBeInTheDocument();
  });

  it("uses interface language description when available", () => {
    render(<RenderHeaderOfLesson lesson={mockLesson} />);

    expect(
      screen.getByText("English exercise description"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Ukrainian exercise description"),
    ).not.toBeInTheDocument();
  });

  it("falls back to learning language description when interface language is unavailable", () => {
    mockUseOwnStore.mockReturnValue({
      selectedInterfaceLanguage: "de",
      selectedLearningLanguage: "uk",
    });

    render(<RenderHeaderOfLesson lesson={mockLesson} />);

    expect(
      screen.getByText("Ukrainian exercise description"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("English exercise description"),
    ).not.toBeInTheDocument();
  });
});
