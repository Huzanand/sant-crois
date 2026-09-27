import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Error404 from "./Error404";
const mockReplace = jest.fn();
const mockUsePathname = jest.fn();
const mockUseLanguageSync = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => mockUsePathname(),
}));
jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: () => mockUseLanguageSync(),
}));
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));
describe("Error404", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
    mockUseLanguageSync.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          "maskot404.header": "Page not found",
          "maskot404.text": "Nothing was found.",
          "maskot404.resetFilters": "Reset filters",
          "maskot404.homeButton": "Go home",
        };
        return translations[key] ?? key;
      },
    });
  });
  it("renders the home error state with reset filters button", () => {
    render(<Error404 page="home" />);
    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(screen.getByText("Nothing was found.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset filters" }),
    ).toBeInTheDocument();
    expect(screen.getByAltText("maskot")).toBeInTheDocument();
  });
  it("resets filters when clicking the reset filters button", async () => {
    const user = userEvent.setup();
    render(<Error404 page="home" />);
    await user.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(mockReplace).toHaveBeenCalledWith("/?", { scroll: false });
  });
  it.each(["lesson", "check"] as const)(
    "renders home link for %s page",
    (page) => {
      render(<Error404 page={page} />);
      expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute(
        "href",
        "/",
      );
      expect(screen.queryByText("Nothing was found.")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Reset filters" }),
      ).not.toBeInTheDocument();
    },
  );
});
