import { render, screen } from "@testing-library/react";
import MediaTask from "./MediaTask";
import { ITaskData } from "@/models";
import { useOwnStore } from "@/store/storeProvider";
import { useLanguageSync } from "@/utils/useLanguage";

jest.mock("@/components/tasks/text/TextTask", () => ({
  __esModule: true,
  default: ({
    content,
    isTranscription,
  }: {
    content: string;
    isTranscription?: boolean;
  }) => (
    <div
      data-testid="text-task"
      data-content={content}
      data-is-transcription={String(isTranscription)}
    />
  ),
}));

jest.mock("@/store/storeProvider", () => ({
  useOwnStore: jest.fn(),
}));

jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: jest.fn(),
}));

const mockUseOwnStore = useOwnStore as jest.Mock;
const mockUseLanguageSync = useLanguageSync as jest.Mock;

const createTask = (
  contentType: "VIDEO" | "AUDIO",
  contentSource: string,
  transcription = "Test transcription",
): ITaskData =>
  ({
    taskId: "task-1",
    taskType: "MEDIA_TASK",
    taskDescriptions: {
      English: "Watch the video",
      German: "Schau dir das Video an",
    },
    content: {
      contentType,
      contentSource,
      transcription,
    },
  }) as ITaskData;

beforeEach(() => {
  mockUseOwnStore.mockReturnValue({
    selectedLearningLanguage: "English",
  });

  mockUseLanguageSync.mockReturnValue({
    t: (key: string) => {
      const translations: Record<string, string> = {
        exercise: "Exercise",
        transcription: "Transcription",
      };

      return translations[key];
    },
  });
});

describe("MediaTask", () => {
  it("renders video with correct exercise number, description and transcription", () => {
    const task = createTask(
      "VIDEO",
      "https://www.youtube.com/watch?v=abcdefghijk",
      "This is the transcription",
    );

    const { container } = render(<MediaTask taskData={task} index={3} />);

    expect(
      screen.getByRole("heading", { name: "Exercise 3" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Watch the video")).toBeInTheDocument();

    const iframe = container.querySelector("iframe");

    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/abcdefghijk?controls=1",
    );

    expect(screen.getByTestId("text-task")).toHaveAttribute(
      "data-content",
      "This is the transcription",
    );

    expect(screen.getByTestId("text-task")).toHaveAttribute(
      "data-is-transcription",
      "true",
    );
  });

  it("renders audio with the correct source", () => {
    const task = createTask(
      "AUDIO",
      "https://example.com/audio.mp3",
      "Audio transcription",
    );

    const { container } = render(<MediaTask taskData={task} index={2} />);

    const audio = container.querySelector("audio");

    expect(audio).toHaveAttribute("src", "https://example.com/audio.mp3");

    expect(audio).toHaveAttribute("controls");

    expect(container.querySelector("iframe")).not.toBeInTheDocument();

    expect(screen.getByTestId("text-task")).toHaveAttribute(
      "data-content",
      "Audio transcription",
    );
  });

  it("does not render audio for a video task", () => {
    const task = createTask(
      "VIDEO",
      "https://www.youtube.com/watch?v=abcdefghijk",
    );

    const { container } = render(<MediaTask taskData={task} index={1} />);

    expect(container.querySelector("audio")).not.toBeInTheDocument();
    expect(container.querySelector("iframe")).toBeInTheDocument();
  });

  it("does not render video for an audio task", () => {
    const task = createTask("AUDIO", "https://example.com/audio.mp3");

    const { container } = render(<MediaTask taskData={task} index={1} />);

    expect(container.querySelector("iframe")).not.toBeInTheDocument();
    expect(container.querySelector("audio")).toBeInTheDocument();
  });

  it("uses the selected learning language for the task description", () => {
    mockUseOwnStore.mockReturnValue({
      selectedLearningLanguage: "German",
    });

    const task = createTask(
      "VIDEO",
      "https://www.youtube.com/watch?v=abcdefghijk",
    );

    render(<MediaTask taskData={task} index={1} />);

    expect(screen.getByText("Schau dir das Video an")).toBeInTheDocument();
    expect(screen.queryByText("Watch the video")).not.toBeInTheDocument();
  });

  it("renders the transcription heading", () => {
    const task = createTask("AUDIO", "https://example.com/audio.mp3");

    render(<MediaTask taskData={task} index={1} />);

    expect(
      screen.getByRole("heading", { name: "Transcription:" }),
    ).toBeInTheDocument();
  });
});
