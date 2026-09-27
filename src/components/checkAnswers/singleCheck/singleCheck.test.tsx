import { render, screen } from "@testing-library/react";

import SingleCheck from "./SingleCheck";

const mockUseLanguageSync = jest.fn();

jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: () => mockUseLanguageSync(),
}));

jest.mock("@/assets/svg/icons", () => ({
  CorrectIco: () => <span data-testid="correct-icon">Correct</span>,
  IncorrextIco: () => <span data-testid="incorrect-icon">Incorrect</span>,
}));

const createTask = () =>
  ({
    taskId: "task-1",
    taskType: "CHOOSE_ANSWER",
    taskDescriptions: {
      English: "Choose the correct answer.",
    },
    questions: [
      {
        questionId: "q1",
        questionText: "What is the capital of France?",
        questionDescription: "Paris is the capital of France.",
      },
      {
        questionId: "q2",
        questionText: "What is the capital of Germany?",
        questionDescription: "Berlin is the capital of Germany.",
      },
    ],
  }) as any;

const createResults = (result = true) => [
  {
    taskId: "task-1",
    questions: [
      {
        questionId: "q1",
        questionDescription: "Paris is the capital of France.",
        result,
        rightAnswers: ["Paris"],
      },
      {
        questionId: "q2",
        questionDescription: "Berlin is the capital of Germany.",
        result,
        rightAnswers: ["Berlin"],
      },
    ],
  },
];

describe("SingleCheck", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLanguageSync.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          exercise: "Exercise",
          right: "Right",
          wrong: "Wrong",
          noAnswer: "No answer",
          true: "True",
          false: "False",
          "not specified": "Not specified",
        };

        return translations[key] ?? key;
      },
    });
  });

  it("renders exercise heading and questions", () => {
    render(
      <SingleCheck
        type="CHOOSE_ANSWER"
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={createResults()}
      />,
    );

    expect(screen.getByText("Exercise 1")).toBeInTheDocument();

    expect(
      screen.getByText("What is the capital of France?"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("What is the capital of Germany?"),
    ).toBeInTheDocument();
  });

  it("renders correct result for questions", () => {
    render(
      <SingleCheck
        type="CHOOSE_ANSWER"
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={createResults(true)}
      />,
    );

    expect(screen.getAllByTestId("correct-icon")).toHaveLength(2);
    expect(screen.getAllByText("Right")).toHaveLength(2);
  });

  it("renders incorrect result for questions", () => {
    render(
      <SingleCheck
        type="CHOOSE_ANSWER"
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={createResults(false)}
      />,
    );

    expect(screen.getAllByTestId("incorrect-icon")).toHaveLength(2);
    expect(screen.getAllByText("Wrong")).toHaveLength(2);
  });

  it("renders selected answers for CHOOSE_ANSWER", () => {
    render(
      <SingleCheck
        type="CHOOSE_ANSWER"
        index={1}
        taskData={createTask()}
        userAnswers={[
          {
            taskId: "task-1",
            questions: [
              {
                questionId: "q1",
                userAnswer: "Paris",
              },
              {
                questionId: "q2",
                userAnswer: "Munich",
              },
            ],
          },
        ]}
        results={createResults(true)}
      />,
    );

    expect(screen.getAllByText("You choose:")).toHaveLength(2);
    expect(screen.getByText('"Paris"')).toBeInTheDocument();
    expect(screen.getByText('"Munich"')).toBeInTheDocument();
  });

  it("renders translated answers for TRUE_FALSE", () => {
    render(
      <SingleCheck
        type="TRUE_FALSE"
        index={1}
        taskData={createTask()}
        userAnswers={[
          {
            taskId: "task-1",
            questions: [
              {
                questionId: "q1",
                userAnswer: "true",
              },
              {
                questionId: "q2",
                userAnswer: "not specified",
              },
            ],
          },
        ]}
        results={createResults(true)}
      />,
    );

    expect(screen.getByText("True")).toBeInTheDocument();
    expect(screen.getByText("Not specified")).toBeInTheDocument();
  });

  it("renders no answer when user did not provide an answer", () => {
    render(
      <SingleCheck
        type="CHOOSE_ANSWER"
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={createResults()}
      />,
    );

    expect(screen.getAllByText("No answer")).toHaveLength(2);
  });

  it("renders no answer for a question without a user answer", () => {
    render(
      <SingleCheck
        type="CHOOSE_ANSWER"
        index={1}
        taskData={createTask()}
        userAnswers={[
          {
            taskId: "task-1",
            questions: [
              {
                questionId: "q1",
                userAnswer: "Paris",
              },
              {
                questionId: "q2",
                userAnswer: "",
              },
            ],
          },
        ]}
        results={createResults(true)}
      />,
    );

    expect(screen.getByText('"Paris"')).toBeInTheDocument();
    expect(screen.getByText("No answer")).toBeInTheDocument();
  });

  it("renders question descriptions", () => {
    render(
      <SingleCheck
        type="CHOOSE_ANSWER"
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={createResults()}
      />,
    );

    expect(
      screen.getByText("Paris is the capital of France."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Berlin is the capital of Germany."),
    ).toBeInTheDocument();
  });
});
