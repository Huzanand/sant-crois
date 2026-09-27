import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Recomendations from "./Recomandations";

jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("../card/Card", () => {
  return function MockCard({ id, header }: { id: string; header: string }) {
    return (
      <div data-testid="card">
        {id}-{header}
      </div>
    );
  };
});

jest.mock("@/assets/svg/icons", () => ({
  CaruselArrowLeftIco: () => <span data-testid="arrow-left">Left</span>,
  CaruselArrowRightIco: () => <span data-testid="arrow-right">Right</span>,
}));

const createCard = (id: string, header: string) =>
  ({
    id,
    header,
    cover: "cover.jpg",
    primaryTopics: [],
    secondaryTopics: [],
    learningLanguage: "English",
    languageLevel: "B1",
    acceptance: 1,
    rating: 5,
    views: 100,
  }) as any;

describe("Recomendations", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders recommendation cards", () => {
    const content = [
      createCard("1", "First lesson"),
      createCard("2", "Second lesson"),
    ];

    render(<Recomendations content={content} />);

    expect(screen.getAllByTestId("card")).toHaveLength(2);

    expect(screen.getByText("1-First lesson")).toBeInTheDocument();
    expect(screen.getByText("2-Second lesson")).toBeInTheDocument();
  });

  it("links each recommendation to its lesson page", () => {
    const content = [
      createCard("1", "First lesson"),
      createCard("2", "Second lesson"),
    ];

    render(<Recomendations content={content} />);

    expect(
      screen.getByRole("link", { name: "1-First lesson" }),
    ).toHaveAttribute("href", "/lesson/1");

    expect(
      screen.getByRole("link", { name: "2-Second lesson" }),
    ).toHaveAttribute("href", "/lesson/2");
  });

  it("renders both slider arrows", () => {
    render(<Recomendations content={[createCard("1", "First lesson")]} />);

    expect(screen.getByTestId("arrow-left")).toBeInTheDocument();
    expect(screen.getByTestId("arrow-right")).toBeInTheDocument();
  });

  it("moves slider to the next position", async () => {
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    render(
      <Recomendations
        content={[
          createCard("1", "First lesson"),
          createCard("2", "Second lesson"),
        ]}
      />,
    );

    const slider =
      screen.getByTestId("arrow-right").parentElement?.previousElementSibling;

    expect(slider).toBeTruthy();

    const scrollTo = jest.fn();

    Object.defineProperty(slider, "scrollLeft", {
      value: 0,
      writable: true,
    });

    Object.defineProperty(slider, "scrollTo", {
      value: scrollTo,
    });

    await user.click(screen.getByTestId("arrow-right"));

    expect(scrollTo).toHaveBeenCalledWith({
      left: 280,
      behavior: "smooth",
    });
  });

  it("moves slider to the previous position", async () => {
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    render(
      <Recomendations
        content={[
          createCard("1", "First lesson"),
          createCard("2", "Second lesson"),
        ]}
      />,
    );

    const slider =
      screen.getByTestId("arrow-left").parentElement?.nextElementSibling;

    expect(slider).toBeTruthy();

    const scrollTo = jest.fn();

    Object.defineProperty(slider, "scrollLeft", {
      value: 560,
      writable: true,
    });

    Object.defineProperty(slider, "scrollTo", {
      value: scrollTo,
    });

    await user.click(screen.getByTestId("arrow-left"));

    expect(scrollTo).toHaveBeenCalledWith({
      left: 280,
      behavior: "smooth",
    });
  });

  it("does not move slider again while animation is in progress", async () => {
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    render(
      <Recomendations
        content={[
          createCard("1", "First lesson"),
          createCard("2", "Second lesson"),
        ]}
      />,
    );

    const slider =
      screen.getByTestId("arrow-right").parentElement?.previousElementSibling;

    expect(slider).toBeTruthy();

    const scrollTo = jest.fn();

    Object.defineProperty(slider, "scrollLeft", {
      value: 0,
      writable: true,
    });

    Object.defineProperty(slider, "scrollTo", {
      value: scrollTo,
    });

    const arrow = screen.getByTestId("arrow-right");

    await user.click(arrow);
    await user.click(arrow);

    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it("allows another slider movement after animation finishes", async () => {
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    render(
      <Recomendations
        content={[
          createCard("1", "First lesson"),
          createCard("2", "Second lesson"),
        ]}
      />,
    );

    const slider =
      screen.getByTestId("arrow-right").parentElement?.previousElementSibling;

    expect(slider).toBeTruthy();

    const scrollTo = jest.fn();

    Object.defineProperty(slider, "scrollLeft", {
      value: 0,
      writable: true,
    });

    Object.defineProperty(slider, "scrollTo", {
      value: scrollTo,
    });

    const arrow = screen.getByTestId("arrow-right");

    await user.click(arrow);

    act(() => {
      jest.advanceTimersByTime(400);
    });

    await user.click(arrow);

    expect(scrollTo).toHaveBeenCalledTimes(2);
  });
});
