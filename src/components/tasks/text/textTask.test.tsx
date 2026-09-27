import { render, screen } from "@testing-library/react";
import TextTask from "./TextTask";

jest.mock("../../tooltip/Tooltip", () => ({
  __esModule: true,
  default: ({
    title,
    content,
    children,
  }: {
    title: string;
    content: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="tooltip" data-title={title} data-content={content}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/modalMod/ModalMod", () => ({
  __esModule: true,
  default: ({
    title,
    content,
    children,
  }: {
    title: string;
    content: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="modal-mob" data-title={title} data-content={content}>
      {children}
    </div>
  ),
}));

jest.mock("@/utils/useMobile", () => ({
  useMobile: jest.fn(),
}));

jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: jest.fn(),
}));

import { useMobile } from "@/utils/useMobile";
import { useLanguageSync } from "@/utils/useLanguage";

const mockUseMobile = useMobile as jest.Mock;
const mockUseLanguageSync = useLanguageSync as jest.Mock;

describe("TextTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseMobile.mockReturnValue(false);

    mockUseLanguageSync.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it("renders regular text with exercise heading", () => {
    render(<TextTask content="This is a text" index={3} />);

    expect(
      screen.getByRole("heading", { name: "exercise 3" }),
    ).toBeInTheDocument();
    expect(screen.getByText("This is a text")).toBeInTheDocument();
  });

  it("does not render exercise heading for transcription", () => {
    render(
      <TextTask content="This is a transcription" isTranscription index={3} />,
    );

    expect(
      screen.queryByRole("heading", { name: "exercise 3" }),
    ).not.toBeInTheDocument();

    expect(screen.getByText("This is a transcription")).toBeInTheDocument();
  });

  it("renders bold text as strong", () => {
    render(<TextTask content="This is **important** text" />);

    const boldText = screen.getByText("important");

    expect(boldText.tagName).toBe("STRONG");
  });

  it("renders tooltip on desktop with parsed title and content", () => {
    render(
      <TextTask
        content={
          'Man benutzt den <[Konjunktiv II]{title="Konjunktiv II" content="Diese Form wird oft für hypothetische Aussagen oder Wünsche verwendet."}> oft.'
        }
      />,
    );

    const tooltip = screen.getByTestId("tooltip");

    expect(tooltip).toHaveAttribute("data-title", "Konjunktiv II");
    expect(tooltip).toHaveAttribute(
      "data-content",
      "Diese Form wird oft für hypothetische Aussagen oder Wünsche verwendet.",
    );

    expect(screen.getByText("Konjunktiv II")).toBeInTheDocument();
  });

  it("renders all tooltips from the real lesson content", () => {
    render(
      <TextTask
        content={
          'Man benutzt den <[Konjunktiv II]{title="Konjunktiv II" content="Diese Form wird oft für hypothetische Aussagen oder Wünsche verwendet."}> oft, um <[Wünsche]{title="Wünsche ausdrücken" content="Zum Beispiel: Ich wünschte, ich hätte mehr Zeit."}> oder <[Vorschläge]{title="Höfliche Vorschläge" content="Zum Beispiel: Wir könnten ins Kino gehen."}> zu äußern. Die Struktur ist ähnlich wie im Präsens, aber anstelle eines modalen Hilfsverbs verwendet man oft <[würden]{title="Hilfsverb im Konjunktiv" content="Statt eines Modalverbs nutzt man ‚würden‘ + Infinitiv."}>.'
        }
      />,
    );

    expect(screen.getAllByTestId("tooltip")).toHaveLength(4);

    expect(screen.getByText("Konjunktiv II")).toBeInTheDocument();
    expect(screen.getByText("Wünsche")).toBeInTheDocument();
    expect(screen.getByText("Vorschläge")).toBeInTheDocument();
    expect(screen.getByText("würden")).toBeInTheDocument();
  });

  it("renders ModalMob instead of Tooltip on mobile", () => {
    mockUseMobile.mockReturnValue(true);

    render(
      <TextTask
        content={
          '<[Konjunktiv II]{title="Konjunktiv II" content="Diese Form wird oft für hypothetische Aussagen oder Wünsche verwendet."}>'
        }
      />,
    );

    expect(screen.getByTestId("modal-mob")).toBeInTheDocument();
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();

    expect(screen.getByText("Konjunktiv II")).toBeInTheDocument();
  });

  it("does not render anything when content is empty", () => {
    const { container } = render(<TextTask content="" />);

    expect(container.firstChild).toBeNull();
  });
});
