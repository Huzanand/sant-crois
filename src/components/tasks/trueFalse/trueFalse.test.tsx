import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TrueFalseTask from "./TrueFalse";
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

const createTask = (): ITaskData =>
  ({
    taskId: "task-1",
    taskType: "TRUE_FALSE",
    taskDescriptions: {
      English: "Decide whether each statement is true or false",
      German: "Entscheide, ob die Aussage richtig oder falsch ist",
    },
    questions: [
      {
        questionId: "q1",
        questionText: "The Earth is round.",
      },
      {
        questionId: "q2",
        questionText: "Water freezes at 100°C.",
      },
    ],
  }) as ITaskData;

describe("TrueFalseTask", () => {
  let userAnswers: {
    taskId: string;
    questions: {
      questionId: string;
      userAnswer: string | null;
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
        selectedInterfaceLanguage: "English",
      }),
    );

    mockUseLanguageSync.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          exercise: "Exercise",
          true: "True",
          false: "False",
          "not specified": "Not specified",
        };

        return translations[key];
      },
    });
  });

  it("renders exercise heading, description, questions and options", () => {
    render(<TrueFalseTask taskData={createTask()} index={3} />);

    expect(
      screen.getByRole("heading", { name: "Exercise 3" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Decide whether each statement is true or false"),
    ).toBeInTheDocument();

    expect(screen.getByText("The Earth is round.")).toBeInTheDocument();

    expect(screen.getByText("Water freezes at 100°C.")).toBeInTheDocument();

    expect(screen.getAllByRole("radio")).toHaveLength(6);

    expect(screen.getAllByRole("radio", { name: "True" })).toHaveLength(2);
    expect(screen.getAllByRole("radio", { name: "False" })).toHaveLength(2);
    expect(
      screen.getAllByRole("radio", { name: "Not specified" }),
    ).toHaveLength(2);
  });

  it("initializes answers for a new task", () => {
    render(<TrueFalseTask taskData={createTask()} index={1} />);

    expect(setUserAnswers).toHaveBeenCalledWith({
      taskId: "task-1",
      questions: [
        { questionId: "q1", userAnswer: null },
        { questionId: "q2", userAnswer: null },
      ],
    });
  });

  it("restores existing answers and checks the selected options", () => {
    userAnswers = [
      {
        taskId: "task-1",
        questions: [
          { questionId: "q1", userAnswer: "true" },
          { questionId: "q2", userAnswer: "not specified" },
        ],
      },
    ];

    render(<TrueFalseTask taskData={createTask()} index={1} />);

    expect(screen.getAllByRole("radio", { name: "True" })[0]).toBeChecked();

    expect(
      screen.getAllByRole("radio", { name: "Not specified" })[1],
    ).toBeChecked();

    expect(
      screen.getAllByRole("radio", { name: "False" })[0],
    ).not.toBeChecked();

    expect(screen.getAllByRole("radio", { name: "True" })[1]).not.toBeChecked();

    expect(setUserAnswers).not.toHaveBeenCalled();
  });

  it("saves a selected option to the store", async () => {
    const user = userEvent.setup();

    userAnswers = [
      {
        taskId: "task-1",
        questions: [
          { questionId: "q1", userAnswer: null },
          { questionId: "q2", userAnswer: null },
        ],
      },
    ];

    render(<TrueFalseTask taskData={createTask()} index={1} />);

    await user.click(screen.getAllByRole("radio", { name: "True" })[0]);

    expect(setUserAnswers).toHaveBeenLastCalledWith({
      taskId: "task-1",
      questions: [
        { questionId: "q1", userAnswer: "true" },
        { questionId: "q2", userAnswer: null },
      ],
    });
  });

  it("replaces an existing answer when another option is selected", async () => {
    const user = userEvent.setup();

    userAnswers = [
      {
        taskId: "task-1",
        questions: [
          { questionId: "q1", userAnswer: "true" },
          { questionId: "q2", userAnswer: "false" },
        ],
      },
    ];

    render(<TrueFalseTask taskData={createTask()} index={1} />);

    await user.click(screen.getAllByRole("radio", { name: "False" })[0]);

    expect(setUserAnswers).toHaveBeenLastCalledWith({
      taskId: "task-1",
      questions: [
        { questionId: "q1", userAnswer: "false" },
        { questionId: "q2", userAnswer: "false" },
      ],
    });
  });

  it("keeps answers for other questions when selecting an option", async () => {
    const user = userEvent.setup();

    userAnswers = [
      {
        taskId: "task-1",
        questions: [
          { questionId: "q1", userAnswer: "true" },
          { questionId: "q2", userAnswer: "false" },
        ],
      },
    ];

    render(<TrueFalseTask taskData={createTask()} index={1} />);

    await user.click(
      screen.getAllByRole("radio", { name: "Not specified" })[1],
    );

    expect(setUserAnswers).toHaveBeenLastCalledWith({
      taskId: "task-1",
      questions: [
        { questionId: "q1", userAnswer: "true" },
        { questionId: "q2", userAnswer: "not specified" },
      ],
    });
  });

  it("disables radio buttons in readonly mode", () => {
    render(<TrueFalseTask taskData={createTask()} index={1} readonly />);

    expect(screen.getAllByRole("radio")).toHaveLength(6);

    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it("keeps radio buttons enabled in editable mode", () => {
    render(<TrueFalseTask taskData={createTask()} index={1} />);

    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).toBeEnabled();
    });
  });

  it("adds a missing question to existing task answers", async () => {
    const user = userEvent.setup();

    userAnswers = [
      {
        taskId: "task-1",
        questions: [{ questionId: "q1", userAnswer: "true" }],
      },
    ];

    render(<TrueFalseTask taskData={createTask()} index={1} />);

    await user.click(screen.getAllByRole("radio", { name: "False" })[1]);

    expect(setUserAnswers).toHaveBeenLastCalledWith({
      taskId: "task-1",
      questions: [
        { questionId: "q1", userAnswer: "true" },
        { questionId: "q2", userAnswer: "false" },
      ],
    });
  });
});
