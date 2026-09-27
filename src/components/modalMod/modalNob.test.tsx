import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalMob from "./ModalMod";

describe("ModalMob", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    jest.clearAllMocks();
  });

  it("renders children", () => {
    render(
      <ModalMob>
        <span>Open modal</span>
      </ModalMob>,
    );

    expect(screen.getByText("Open modal")).toBeInTheDocument();
  });

  it("applies underline class when underline is true", () => {
    render(
      <ModalMob underline>
        <span>Open modal</span>
      </ModalMob>,
    );

    expect(screen.getByText("Open modal").parentElement).toHaveClass(
      "body-m--underline",
    );
  });

  it("opens modal when clicking children", async () => {
    const user = userEvent.setup();

    render(
      <ModalMob title="Modal title" content="Modal content">
        <span>Open modal</span>
      </ModalMob>,
    );

    const modalContent =
      screen.getByText("Modal content").parentElement?.parentElement;

    expect(modalContent?.className).not.toContain("open");

    await user.click(screen.getByText("Open modal"));

    expect(modalContent?.className).toContain("open");
  });

  it("closes modal and calls onClose when clicking overlay", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <ModalMob
        isOpen
        onClose={onClose}
        title="Modal title"
        content="Modal content"
      >
        <span>Open modal</span>
      </ModalMob>,
    );

    const modalContent =
      screen.getByText("Modal content").parentElement?.parentElement;

    expect(modalContent?.className).toContain("open");

    const overlay = modalContent?.previousElementSibling;

    expect(overlay).toBeInTheDocument();

    await user.click(overlay!);

    expect(modalContent?.className).not.toContain("open");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes modal and calls onClose when clicking close button", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <ModalMob
        isOpen
        onClose={onClose}
        title="Modal title"
        content="Modal content"
      >
        <span>Open modal</span>
      </ModalMob>,
    );

    const modalContent =
      screen.getByText("Modal content").parentElement?.parentElement;

    expect(modalContent?.className).toContain("open");

    const closeButton = modalContent?.querySelector(".closeIco");

    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton!);

    expect(modalContent?.className).not.toContain("open");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("opens and closes modal through isOpen prop", async () => {
    const { rerender } = render(
      <ModalMob isOpen={false}>
        <span>Open modal</span>
      </ModalMob>,
    );

    const trigger = screen.getByText("Open modal");

    let modal = trigger.parentElement?.nextElementSibling?.nextElementSibling;

    expect(modal?.className).not.toContain("open");

    rerender(
      <ModalMob isOpen>
        <span>Open modal</span>
      </ModalMob>,
    );

    modal =
      screen.getByText("Open modal").parentElement?.nextElementSibling
        ?.nextElementSibling;

    expect(modal?.className).toContain("open");

    rerender(
      <ModalMob isOpen={false}>
        <span>Open modal</span>
      </ModalMob>,
    );

    modal =
      screen.getByText("Open modal").parentElement?.nextElementSibling
        ?.nextElementSibling;

    expect(modal?.className).not.toContain("open");

    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("renders title and content when provided", () => {
    render(
      <ModalMob title="Modal title" content="Modal content">
        <span>Open modal</span>
      </ModalMob>,
    );

    expect(
      screen.getByRole("heading", { name: "Modal title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render title or content when they are not provided", () => {
    render(
      <ModalMob>
        <span>Open modal</span>
      </ModalMob>,
    );

    expect(
      screen.queryByRole("heading", { name: "Modal title" }),
    ).not.toBeInTheDocument();

    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });
});
