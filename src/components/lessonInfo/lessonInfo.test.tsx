import { render, screen } from "@testing-library/react";
import LessonInfo from "./LessonInfo";

const mockUseMobile = jest.fn();

jest.mock("@/utils/useMobile", () => ({
  useMobile: (breakpoint: number) => mockUseMobile(breakpoint),
}));

jest.mock("./DefaultViev", () => ({
  __esModule: true,
  default: () => <div data-testid="default-view" />,
}));

jest.mock("./MobileViev", () => ({
  __esModule: true,
  default: () => <div data-testid="mobile-view" />,
}));

describe("LessonInfo", () => {
  it("renders desktop view when screen is not mobile", () => {
    mockUseMobile.mockReturnValue(false);

    render(<LessonInfo />);

    expect(screen.getByTestId("default-view")).toBeInTheDocument();
    expect(screen.queryByTestId("mobile-view")).not.toBeInTheDocument();

    expect(mockUseMobile).toHaveBeenCalledWith(1024);
  });

  it("renders mobile view when screen is mobile", () => {
    mockUseMobile.mockReturnValue(true);

    render(<LessonInfo />);

    expect(screen.getByTestId("mobile-view")).toBeInTheDocument();
    expect(screen.queryByTestId("default-view")).not.toBeInTheDocument();

    expect(mockUseMobile).toHaveBeenCalledWith(1024);
  });
});
