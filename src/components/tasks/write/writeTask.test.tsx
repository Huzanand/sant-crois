import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WriteTask from "./WriteTask";
import { ITaskData } from "@/models";
import { useOwnStore } from "@/store/storeProvider";
import { useLanguageSync } from "@/utils/useLanguage";

jest.mock("@/store/storeProvider", () => ({
  useOwnStore: jest.fn(),
}));

jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: jest.fn(),
}));

const mockUseOwnStore = useOwnStore as jest.Mock;
const mockUseLanguageSync = useLanguageSync as jest.Mock;

const createTask = (contentSource: string, taskId = "task-1"): ITaskData =>
  ({
    taskId,
    taskType: "MEDIA_TASK",
    taskDescriptions: {},
    content: {
      contentType: "FILL_TEMPLATE",
      contentSource,
      transcription: "",
    },
  }) as ITaskData;

describe("WriteTask", () => {
  let userAnswers: {
    taskId: string;
    questions: {
      questionId: string;
      userAnswer: string;
    }[];
  }[];

  const setUserAnswers = jest.fn();

  beforeEach(() => {
    userAnswers = [];

    setUserAnswers.mockReset();

    mockUseOwnStore.mockImplementation((selector) =>
      selector({
        userAnswers,
        setUserAnswers,
      }),
    );

    mockUseLanguageSync.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          exercise: "Exercise",
        };

        return translations[key];
      },
    });
  });

  it("renders exercise heading and input fields for each question", () => {
    const task = createTask(
      "Complete the sentence: {{#q}}first{{/q}} and {{#q}}second{{/q}}.",
    );

    render(<WriteTask taskData={task} index={3} />);

    expect(
      screen.getByRole("heading", { name: "Exercise 3" }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });

  it("initializes empty answers in the store for a new task", () => {
    const task = createTask(
      "First {{#q}}answer{{/q}} and second {{#q}}answer{{/q}}.",
    );

    render(<WriteTask taskData={task} index={1} />);

    expect(setUserAnswers).toHaveBeenCalledWith({
      taskId: "task-1",
      questions: [
        {
          questionId: "0",
          userAnswer: "",
        },
        {
          questionId: "1",
          userAnswer: "",
        },
      ],
    });
  });

  it("restores existing answers from the store", () => {
    userAnswers = [
      {
        taskId: "task-1",
        questions: [
          {
            questionId: "0",
            userAnswer: "Hello",
          },
          {
            questionId: "1",
            userAnswer: "world",
          },
        ],
      },
    ];

    const task = createTask(
      "First {{#q}}answer{{/q}} and second {{#q}}answer{{/q}}.",
    );

    render(<WriteTask taskData={task} index={1} />);

    const inputs = screen.getAllByRole("textbox");

    expect(inputs[0]).toHaveValue("Hello");
    expect(inputs[1]).toHaveValue("world");
    expect(setUserAnswers).not.toHaveBeenCalled();
  });

  it("updates the selected answer in the store when the user types", async () => {
    const user = userEvent.setup();

    const task = createTask(
      "First {{#q}}answer{{/q}} and second {{#q}}answer{{/q}}.",
    );

    render(<WriteTask taskData={task} index={1} />);

    const inputs = screen.getAllByRole("textbox");

    await user.type(inputs[0], "Hello");

    expect(setUserAnswers).toHaveBeenLastCalledWith({
      taskId: "task-1",
      questions: [
        {
          questionId: "0",
          userAnswer: "Hello",
        },
        {
          questionId: "1",
          userAnswer: "",
        },
      ],
    });
  });

  it("keeps answers of other questions when updating one input", async () => {
    const user = userEvent.setup();

    userAnswers = [
      {
        taskId: "task-1",
        questions: [
          {
            questionId: "0",
            userAnswer: "First",
          },
          {
            questionId: "1",
            userAnswer: "Second",
          },
        ],
      },
    ];

    const task = createTask("{{#q}}answer{{/q}} and {{#q}}answer{{/q}}.");

    render(<WriteTask taskData={task} index={1} />);

    const inputs = screen.getAllByRole("textbox");

    await user.clear(inputs[1]);
    await user.type(inputs[1], "Updated");

    expect(setUserAnswers).toHaveBeenLastCalledWith({
      taskId: "task-1",
      questions: [
        {
          questionId: "0",
          userAnswer: "First",
        },
        {
          questionId: "1",
          userAnswer: "Updated",
        },
      ],
    });
  });

  it("disables inputs in readonly mode", () => {
    const task = createTask("Answer: {{#q}}test{{/q}}.");

    render(<WriteTask taskData={task} index={1} readonly />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("keeps inputs enabled in editable mode", () => {
    const task = createTask("Answer: {{#q}}test{{/q}}.");

    render(<WriteTask taskData={task} index={1} />);

    expect(screen.getByRole("textbox")).toBeEnabled();
  });
});
