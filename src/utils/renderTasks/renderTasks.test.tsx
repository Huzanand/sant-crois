import { render, screen } from "@testing-library/react";
import { RenderTasks } from "./RenderTasks";
import { ITaskData } from "@/models";

jest.mock("@/components/tasks/choose/ChooseTask", () => ({
  __esModule: true,
  default: ({ index, readonly }: { index: number; readonly?: boolean }) => (
    <div data-testid="choose-task">
      ChooseTask-{index}-{String(readonly)}
    </div>
  ),
}));

jest.mock("@/components/tasks/fillText/FillTextTask", () => ({
  __esModule: true,
  default: ({ index, readonly }: { index: number; readonly?: boolean }) => (
    <div data-testid="fill-text-task">
      FillTextTask-{index}-{String(readonly)}
    </div>
  ),
}));

jest.mock("@/components/tasks/media/MediaTask", () => ({
  __esModule: true,
  default: ({ index }: { index: number }) => (
    <div data-testid="media-task">MediaTask-{index}</div>
  ),
}));

jest.mock("@/components/tasks/text/TextTask", () => ({
  __esModule: true,
  default: ({ index, content }: { index: number; content: string }) => (
    <div data-testid="text-task">
      TextTask-{index}-{content}
    </div>
  ),
}));

jest.mock("@/components/tasks/trueFalse/TrueFalse", () => ({
  __esModule: true,
  default: ({ index, readonly }: { index: number; readonly?: boolean }) => (
    <div data-testid="true-false-task">
      TrueFalseTask-{index}-{String(readonly)}
    </div>
  ),
}));

jest.mock("@/components/tasks/write/WriteTask", () => ({
  __esModule: true,
  default: ({ index, readonly }: { index: number; readonly?: boolean }) => (
    <div data-testid="write-task">
      WriteTask-{index}-{String(readonly)}
    </div>
  ),
}));

const createTask = (overrides: Partial<ITaskData> = {}): ITaskData => ({
  taskId: "1",
  taskType: "TRUE_FALSE",
  taskDescriptions: {
    en: "Test task",
  },
  ...overrides,
});

const createMediaTask = (
  contentType: "AUDIO" | "VIDEO" | "TEXT" | "CHOOSE_TEMPLATE" | "FILL_TEMPLATE",
  contentSource = "test-content",
  taskId = "1",
): ITaskData =>
  createTask({
    taskId,
    taskType: "MEDIA_TASK",
    content: {
      contentType,
      contentSource,
    },
  });

describe("RenderTasks", () => {
  it("renders TextTask for MEDIA_TASK with TEXT content", () => {
    const tasks = [createMediaTask("TEXT", "Hello world")];

    render(<RenderTasks tasks={tasks} />);

    expect(screen.getByTestId("text-task")).toHaveTextContent(
      "TextTask-1-Hello world",
    );
  });

  it("renders MediaTask for MEDIA_TASK with VIDEO content", () => {
    const tasks = [createMediaTask("VIDEO")];

    render(<RenderTasks tasks={tasks} />);

    expect(screen.getByTestId("media-task")).toHaveTextContent("MediaTask-1");
  });

  it("renders MediaTask for MEDIA_TASK with AUDIO content", () => {
    const tasks = [createMediaTask("AUDIO")];

    render(<RenderTasks tasks={tasks} />);

    expect(screen.getByTestId("media-task")).toHaveTextContent("MediaTask-1");
  });

  it("renders WriteTask for MEDIA_TASK with FILL_TEMPLATE content", () => {
    const tasks = [createMediaTask("FILL_TEMPLATE")];

    render(<RenderTasks tasks={tasks} readonly />);

    expect(screen.getByTestId("write-task")).toHaveTextContent(
      "WriteTask-1-true",
    );
  });

  it("renders FillTextTask for MEDIA_TASK with CHOOSE_TEMPLATE content", () => {
    const tasks = [createMediaTask("CHOOSE_TEMPLATE")];

    render(<RenderTasks tasks={tasks} readonly />);

    expect(screen.getByTestId("fill-text-task")).toHaveTextContent(
      "FillTextTask-1-true",
    );
  });

  it("renders TrueFalseTask for TRUE_FALSE task", () => {
    const tasks = [
      createTask({
        taskId: "1",
        taskType: "TRUE_FALSE",
      }),
    ];

    render(<RenderTasks tasks={tasks} readonly />);

    expect(screen.getByTestId("true-false-task")).toHaveTextContent(
      "TrueFalseTask-1-true",
    );
  });

  it("renders ChooseTask for CHOOSE_ANSWER task", () => {
    const tasks = [
      createTask({
        taskId: "1",
        taskType: "CHOOSE_ANSWER",
      }),
    ];

    render(<RenderTasks tasks={tasks} readonly />);

    expect(screen.getByTestId("choose-task")).toHaveTextContent(
      "ChooseTask-1-true",
    );
  });

  it("passes the correct index to each task", () => {
    const tasks = [
      createTask({
        taskId: "1",
        taskType: "TRUE_FALSE",
      }),
      createTask({
        taskId: "2",
        taskType: "CHOOSE_ANSWER",
      }),
    ];

    render(<RenderTasks tasks={tasks} />);

    expect(screen.getByTestId("true-false-task")).toHaveTextContent(
      "TrueFalseTask-1-undefined",
    );

    expect(screen.getByTestId("choose-task")).toHaveTextContent(
      "ChooseTask-2-undefined",
    );
  });

  it("does not render a task for an unknown task type", () => {
    const tasks = [
      {
        ...createTask(),
        taskId: "1",
        taskType: "UNKNOWN_TASK",
      },
    ] as unknown as ITaskData[];

    render(<RenderTasks tasks={tasks} />);

    expect(screen.queryByTestId("text-task")).not.toBeInTheDocument();
    expect(screen.queryByTestId("media-task")).not.toBeInTheDocument();
    expect(screen.queryByTestId("write-task")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fill-text-task")).not.toBeInTheDocument();
    expect(screen.queryByTestId("true-false-task")).not.toBeInTheDocument();
    expect(screen.queryByTestId("choose-task")).not.toBeInTheDocument();
  });

  it("does not render a task for an unknown MEDIA_TASK content type", () => {
    const tasks = [
      {
        ...createMediaTask("TEXT"),
        content: {
          contentType: "UNKNOWN_CONTENT",
          contentSource: "test-content",
        },
      },
    ] as unknown as ITaskData[];

    render(<RenderTasks tasks={tasks} />);

    expect(screen.queryByTestId("text-task")).not.toBeInTheDocument();
    expect(screen.queryByTestId("media-task")).not.toBeInTheDocument();
    expect(screen.queryByTestId("write-task")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fill-text-task")).not.toBeInTheDocument();
  });

  it("renders tasks in the same order as the input array", () => {
    const tasks = [
      createTask({
        taskId: "1",
        taskType: "TRUE_FALSE",
      }),
      createTask({
        taskId: "2",
        taskType: "CHOOSE_ANSWER",
      }),
      createMediaTask("TEXT", "Third task", "3"),
    ];

    render(<RenderTasks tasks={tasks} />);

    const renderedTasks = screen.getAllByTestId(
      /^(true-false-task|choose-task|text-task)$/,
    );

    expect(
      renderedTasks.map((element) => element.getAttribute("data-testid")),
    ).toEqual(["true-false-task", "choose-task", "text-task"]);
  });
});
