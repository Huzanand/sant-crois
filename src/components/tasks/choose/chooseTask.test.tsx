import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChooseTask from "./ChooseTask";
import { ITaskData } from "@/models";
import { useOwnStore } from "@/store/storeProvider";
import { useLanguageSync } from "@/utils/useLanguage";
jest.mock("@/store/storeProvider", () => ({ useOwnStore: jest.fn() }));
jest.mock("@/utils/useLanguage", () => ({ useLanguageSync: jest.fn() }));
const mockUseOwnStore = useOwnStore as jest.Mock;
const mockUseLanguageSync = useLanguageSync as jest.Mock;
const createTask = (): ITaskData =>
  ({
    taskId: "task-1",
    taskType: "CHOOSE_ANSWER",
    taskDescriptions: {
      English: "Choose the correct answer",
      German: "Wähle die richtige Antwort",
    },
    questions: [
      {
        questionId: "q1",
        questionText: "What is the capital of France?",
        options: ["Paris", "London", "Berlin"],
      },
      {
        questionId: "q2",
        questionText: "What is 2 + 2?",
        options: ["3", "4", "5"],
      },
    ],
  }) as ITaskData;
describe("ChooseTask", () => {
  let userAnswers: {
    taskId: string;
    questions: { questionId: string; userAnswer: string | null }[];
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
        const translations: Record<string, string> = { exercise: "Exercise" };
        return translations[key];
      },
    });
  });
  it("renders exercise heading, description, questions and options", () => {
    render(<ChooseTask taskData={createTask()} index={3} />);
    expect(
      screen.getByRole("heading", { name: "Exercise 3" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Choose the correct answer")).toBeInTheDocument();
    expect(
      screen.getByText("What is the capital of France?"),
    ).toBeInTheDocument();
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(6);
  });
  it("initializes answers for a new task", () => {
    render(<ChooseTask taskData={createTask()} index={1} />);
    expect(setUserAnswers).toHaveBeenCalledWith({
      taskId: "task-1",
      questions: [
        { questionId: "q1", userAnswer: null },
        { questionId: "q2", userAnswer: null },
      ],
    });
  });
  it("restores existing answers and checks the selected option", () => {
    userAnswers = [
      {
        taskId: "task-1",
        questions: [
          { questionId: "q1", userAnswer: "Paris" },
          { questionId: "q2", userAnswer: "4" },
        ],
      },
    ];
    render(<ChooseTask taskData={createTask()} index={1} />);
    expect(screen.getByRole("radio", { name: "Paris" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "4" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "London" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "5" })).not.toBeChecked();
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
    render(<ChooseTask taskData={createTask()} index={1} />);
    await user.click(screen.getByRole("radio", { name: "Paris" }));
    expect(setUserAnswers).toHaveBeenLastCalledWith({
      taskId: "task-1",
      questions: [
        { questionId: "q1", userAnswer: "Paris" },
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
          { questionId: "q1", userAnswer: "Paris" },
          { questionId: "q2", userAnswer: "4" },
        ],
      },
    ];
    render(<ChooseTask taskData={createTask()} index={1} />);
    await user.click(screen.getByRole("radio", { name: "London" }));
    expect(setUserAnswers).toHaveBeenLastCalledWith({
      taskId: "task-1",
      questions: [
        { questionId: "q1", userAnswer: "London" },
        { questionId: "q2", userAnswer: "4" },
      ],
    });
  });
  it("keeps answers for other questions when selecting an option", async () => {
    const user = userEvent.setup();
    userAnswers = [
      {
        taskId: "task-1",
        questions: [
          { questionId: "q1", userAnswer: "Paris" },
          { questionId: "q2", userAnswer: "4" },
        ],
      },
    ];
    render(<ChooseTask taskData={createTask()} index={1} />);
    await user.click(screen.getByRole("radio", { name: "5" }));
    expect(setUserAnswers).toHaveBeenLastCalledWith({
      taskId: "task-1",
      questions: [
        { questionId: "q1", userAnswer: "Paris" },
        { questionId: "q2", userAnswer: "5" },
      ],
    });
  });
  it("disables radio buttons in readonly mode", () => {
    render(<ChooseTask taskData={createTask()} index={1} readonly />);
    expect(screen.getAllByRole("radio")).toHaveLength(6);
    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });
  it("keeps radio buttons enabled in editable mode", () => {
    render(<ChooseTask taskData={createTask()} index={1} />);
    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).toBeEnabled();
    });
  });
  it("adds a missing question to existing task answers", async () => {
    const user = userEvent.setup();
    userAnswers = [
      {
        taskId: "task-1",
        questions: [{ questionId: "q1", userAnswer: "Paris" }],
      },
    ];
    render(<ChooseTask taskData={createTask()} index={1} />);
    await user.click(screen.getByRole("radio", { name: "4" }));
    expect(setUserAnswers).toHaveBeenLastCalledWith({
      taskId: "task-1",
      questions: [
        { questionId: "q1", userAnswer: "Paris" },
        { questionId: "q2", userAnswer: "4" },
      ],
    });
  });
});
