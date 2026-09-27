import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CreateVRForm from "./page";

const mockBack = jest.fn();
const mockUseParams = jest.fn();
const mockFetchLessonById = jest.fn();

const mockUseOwnStore = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
  useParams: () => mockUseParams(),
}));

jest.mock("@/store/storeProvider", () => ({
  useOwnStore: () => mockUseOwnStore(),
}));

jest.mock("@/assets/svg/icons", () => ({
  CopyIco: () => <span data-testid="copy-icon" />,
}));

describe("CreateVRForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({
      lessonId: "lesson-123",
    });

    mockUseOwnStore.mockReturnValue({
      lesson: {
        id: "lesson-123",
      },
      fetchLessonById: mockFetchLessonById,
    });

    global.fetch = jest.fn();
  });

  it("renders stage 1 form", () => {
    render(<CreateVRForm />);

    expect(
      screen.getByText("Создание виртуальной комнаты"),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("name@mail.com")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("student`s name")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Create VR room" }),
    ).toBeInTheDocument();
  });

  it("fetches lesson when lesson is not loaded", () => {
    mockUseOwnStore.mockReturnValue({
      lesson: null,
      fetchLessonById: mockFetchLessonById,
    });

    render(<CreateVRForm />);

    expect(mockFetchLessonById).toHaveBeenCalledWith("lesson-123");
  });

  it("does not fetch lesson when lesson is already loaded", () => {
    render(<CreateVRForm />);

    expect(mockFetchLessonById).not.toHaveBeenCalled();
  });

  it("shows validation errors for invalid form data", async () => {
    const user = userEvent.setup();

    render(<CreateVRForm />);

    await user.click(screen.getByRole("button", { name: "Create VR room" }));

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();

    expect(
      screen.getByText("Name must be at least 2 characters"),
    ).toBeInTheDocument();

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("creates a room and moves to stage 2", async () => {
    const user = userEvent.setup();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        roomId: "room-456",
      }),
    });

    render(<CreateVRForm />);

    await user.type(
      screen.getByPlaceholderText("name@mail.com"),
      "teacher@example.com",
    );

    await user.type(screen.getByPlaceholderText("student`s name"), "John");

    await user.click(screen.getByRole("button", { name: "Create VR room" }));

    await waitFor(() => {
      expect(screen.getByText("Комната успешно создана!")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/exercises/lesson-123/rooms",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorEmail: "teacher@example.com",
          challengerName: "John",
        }),
      },
    );

    expect(
      screen.getByDisplayValue("https://sant-crois.fly.dev/rooms/room-456"),
    ).toBeInTheDocument();
  });

  it("shows loading state while creating a room", async () => {
    const user = userEvent.setup();

    let resolveRequest: (value: {
      ok: boolean;
      json: () => Promise<{ roomId: string }>;
    }) => void;

    global.fetch = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    render(<CreateVRForm />);

    await user.type(
      screen.getByPlaceholderText("name@mail.com"),
      "teacher@example.com",
    );

    await user.type(screen.getByPlaceholderText("student`s name"), "John");

    const submitButton = screen.getByRole("button", {
      name: "Create VR room",
    });

    await user.click(submitButton);

    expect(
      screen.getByRole("button", { name: "Creating a room..." }),
    ).toBeInTheDocument();

    resolveRequest!({
      ok: true,
      json: async () => ({
        roomId: "room-456",
      }),
    });

    await waitFor(() => {
      expect(screen.getByText("Комната успешно создана!")).toBeInTheDocument();
    });
  });

  it("shows API error when room creation fails", async () => {
    const user = userEvent.setup();

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    render(<CreateVRForm />);

    await user.type(
      screen.getByPlaceholderText("name@mail.com"),
      "teacher@example.com",
    );

    await user.type(screen.getByPlaceholderText("student`s name"), "John");

    await user.click(screen.getByRole("button", { name: "Create VR room" }));

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  it("copies room link and moves from stage 2 to stage 3", async () => {
    const user = userEvent.setup();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        roomId: "room-456",
      }),
    });

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    render(<CreateVRForm />);

    await user.type(
      screen.getByPlaceholderText("name@mail.com"),
      "teacher@example.com",
    );

    await user.type(screen.getByPlaceholderText("student`s name"), "John");

    await user.click(screen.getByRole("button", { name: "Create VR room" }));

    await waitFor(() => {
      expect(screen.getByText("Комната успешно создана!")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("copy-icon").parentElement!);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "https://sant-crois.fly.dev/rooms/room-456",
    );

    await user.click(screen.getByRole("button", { name: "Ready" }));

    expect(screen.getByText("Готово")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Закрыть" })).toBeInTheDocument();
  });

  it("goes back when closing stage 3", async () => {
    const user = userEvent.setup();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        roomId: "room-456",
      }),
    });

    render(<CreateVRForm />);

    await user.type(
      screen.getByPlaceholderText("name@mail.com"),
      "teacher@example.com",
    );

    await user.type(screen.getByPlaceholderText("student`s name"), "John");

    await user.click(screen.getByRole("button", { name: "Create VR room" }));

    await waitFor(() => {
      expect(screen.getByText("Комната успешно создана!")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Ready" }));

    await user.click(screen.getByRole("button", { name: "Закрыть" }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
