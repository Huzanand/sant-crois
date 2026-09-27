import { render, screen, fireEvent } from "@testing-library/react";
import LessonModal from "./page";
const mockBack = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ back: mockBack }) }));
jest.mock("../../modal/page", () => ({
  __esModule: true,
  default: () => <div data-testid="create-vr-form">Create VR Form</div>,
}));
describe("LessonModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = "";
  });
  afterEach(() => {
    document.body.style.overflow = "";
  });
  it("renders CreateVRForm", () => {
    render(<LessonModal />);
    expect(screen.getByTestId("create-vr-form")).toBeInTheDocument();
  });
  it("locks body scroll when mounted", () => {
    render(<LessonModal />);
    expect(document.body.style.overflow).toBe("hidden");
  });
  it("restores body scroll when unmounted", () => {
    const { unmount } = render(<LessonModal />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
  it("goes back when clicking the backdrop", () => {
    render(<LessonModal />);
    const form = screen.getByTestId("create-vr-form");
    const container = form.parentElement;
    const wrapper = container?.parentElement;
    expect(wrapper).toBeInTheDocument();
    fireEvent.click(wrapper!);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
  it("does not go back when clicking inside the modal", () => {
    render(<LessonModal />);
    const form = screen.getByTestId("create-vr-form");
    const container = form.parentElement;
    expect(container).toBeInTheDocument();
    fireEvent.click(container!);
    expect(mockBack).not.toHaveBeenCalled();
  });
});
