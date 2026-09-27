import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tooltip from "./Tooltip";

describe("Tooltip", () => {
  it("renders children", () => {
    render(
      <Tooltip>
        <span>Hover me</span>
      </Tooltip>,
    );

    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("applies underline class when underline is true", () => {
    render(
      <Tooltip underline>
        <span>Hover me</span>
      </Tooltip>,
    );

    expect(screen.getByText("Hover me").parentElement).toHaveClass(
      "body-m--underline",
    );
  });

  it("applies regular class when underline is not provided", () => {
    render(
      <Tooltip>
        <span>Hover me</span>
      </Tooltip>,
    );

    expect(screen.getByText("Hover me").parentElement).toHaveClass("body-m");
  });

  it("shows tooltip content on mouse enter and hides it on mouse leave", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip title="Tooltip title" content="Tooltip content">
        <span>Hover me</span>
      </Tooltip>,
    );

    const trigger = screen.getByText("Hover me");

    expect(screen.getByText("Tooltip title")).toBeInTheDocument();
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();

    const tooltip = screen.getByText("Tooltip content").parentElement;

    expect(tooltip?.className).not.toContain("open");

    await user.hover(trigger);

    expect(tooltip?.className).toContain("open");

    await user.unhover(trigger);

    expect(tooltip?.className).not.toContain("open");
  });

  it("does not render title or content when they are not provided", () => {
    render(
      <Tooltip>
        <span>Hover me</span>
      </Tooltip>,
    );

    expect(screen.queryByText("Tooltip title")).not.toBeInTheDocument();
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("passes custom style to tooltip", () => {
    render(
      <Tooltip style={{ top: "20px" }}>
        <span>Hover me</span>
      </Tooltip>,
    );

    const tooltip =
      screen.getByText("Hover me").parentElement?.nextElementSibling;

    expect(tooltip).toHaveStyle({ top: "20px" });
  });
});
