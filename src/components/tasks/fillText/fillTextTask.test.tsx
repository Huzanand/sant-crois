import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FillTextTask from "./FillTextTask";
import { ITaskData } from "@/models";
import { useOwnStore } from "@/store/storeProvider";
import { useLanguageSync } from "@/utils/useLanguage";

jest.mock("@/store/storeProvider", () => ({
  useOwnStore: jest.fn(),
}));

jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: jest.fn(),
}));

jest.mock("@/components/fillTextSelect/FillTextSelect", () => ({
  __esModule: true,
  default: ({
    selectIndex,
    handleChange,
    options,
    currentOption,
    readonly,
  }: {
    selectIndex: number;
    handleChange: (index: number, value: string) => void;
    options: string[];
    currentOption: string;
    readonly?: boolean;
  }) => (
    <select
      data-testid={`fill-select-${selectIndex}`}
      value={currentOption}
      disabled={readonly}
      onChange={(e) => handleChange(selectIndex, e.target.value)}
    >
      <option value="">Select...</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  ),
}));

const mockUseOwnStore = useOwnStore as jest.Mock;
const mockUseLanguageSync = useLanguageSync as jest.Mock;

const createTask = (contentSource: string, taskId = "task-1"): ITaskData =>
  ({
    taskId,
    taskType: "MEDIA_TASK",
    taskDescriptions: {},
    content: {
      contentType: "CHOOSE_TEMPLATE",
      contentSource,
      transcription: "",
    },
  }) as ITaskData;

describe("FillTextTask", () => {
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

  it("renders exercise heading and select fields for each question", () => {
    const task = createTask(
      "Choose the correct word: {{#q}}{{#o}}cat, dog, bird{{/o}}{{/q}} and {{#q}}{{#o}}red, blue, green{{/o}}{{/q}}.",
    );

    render(<FillTextTask taskData={task} index={2} />);

    expect(
      screen.getByRole("heading", { name: "Exercise 2" }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("combobox")).toHaveLength(2);
  });

  it("passes parsed options to each select", () => {
    const task = createTask("Choose: {{#q}}{{#o}}cat, dog, bird{{/o}}{{/q}}.");

    render(<FillTextTask taskData={task} index={1} />);

    const select = screen.getByTestId("fill-select-0");

    expect(select).toHaveDisplayValue("Select...");

    expect(screen.getByRole("option", { name: "cat" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "dog" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "bird" })).toBeInTheDocument();
  });

  it("initializes empty answers in the store for a new task", () => {
    const task = createTask(
      "{{#q}}{{#o}}cat, dog{{/o}}{{/q}} and {{#q}}{{#o}}red, blue{{/o}}{{/q}}.",
    );

    render(<FillTextTask taskData={task} index={1} />);

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
            userAnswer: "dog",
          },
          {
            questionId: "1",
            userAnswer: "blue",
          },
        ],
      },
    ];

    const task = createTask(
      "{{#q}}{{#o}}cat, dog{{/o}}{{/q}} and {{#q}}{{#o}}red, blue{{/o}}{{/q}}.",
    );

    render(<FillTextTask taskData={task} index={1} />);

    expect(screen.getByTestId("fill-select-0")).toHaveValue("dog");
    expect(screen.getByTestId("fill-select-1")).toHaveValue("blue");
    expect(setUserAnswers).not.toHaveBeenCalled();
  });

  it("updates the selected answer in the store", async () => {
    const user = userEvent.setup();

    const task = createTask(
      "{{#q}}{{#o}}cat, dog{{/o}}{{/q}} and {{#q}}{{#o}}red, blue{{/o}}{{/q}}.",
    );

    render(<FillTextTask taskData={task} index={1} />);

    await user.selectOptions(screen.getByTestId("fill-select-0"), "dog");

    expect(setUserAnswers).toHaveBeenLastCalledWith({
      taskId: "task-1",
      questions: [
        {
          questionId: "0",
          userAnswer: "dog",
        },
        {
          questionId: "1",
          userAnswer: "",
        },
      ],
    });
  });

  it("keeps other answers when changing one select", async () => {
    const user = userEvent.setup();

    userAnswers = [
      {
        taskId: "task-1",
        questions: [
          {
            questionId: "0",
            userAnswer: "cat",
          },
          {
            questionId: "1",
            userAnswer: "blue",
          },
        ],
      },
    ];

    const task = createTask(
      "{{#q}}{{#o}}cat, dog{{/o}}{{/q}} and {{#q}}{{#o}}red, blue{{/o}}{{/q}}.",
    );

    render(<FillTextTask taskData={task} index={1} />);

    await user.selectOptions(screen.getByTestId("fill-select-1"), "red");

    expect(setUserAnswers).toHaveBeenLastCalledWith({
      taskId: "task-1",
      questions: [
        {
          questionId: "0",
          userAnswer: "cat",
        },
        {
          questionId: "1",
          userAnswer: "red",
        },
      ],
    });
  });

  it("passes readonly state to the selects", () => {
    const task = createTask("{{#q}}{{#o}}cat, dog{{/o}}{{/q}}.");

    render(<FillTextTask taskData={task} index={1} readonly />);

    expect(screen.getByTestId("fill-select-0")).toBeDisabled();
  });

  it("keeps selects enabled in editable mode", () => {
    const task = createTask("{{#q}}{{#o}}cat, dog{{/o}}{{/q}}.");

    render(<FillTextTask taskData={task} index={1} />);

    expect(screen.getByTestId("fill-select-0")).toBeEnabled();
  });

  it("preserves text around select fields", () => {
    const task = createTask("Before {{#q}}{{#o}}cat, dog{{/o}}{{/q}} after.");

    render(<FillTextTask taskData={task} index={1} />);

    expect(screen.getByText(/Before/)).toBeInTheDocument();
    expect(screen.getByText(/after\./)).toBeInTheDocument();
  });
});
