import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MultipleCheck from "./MultipleCheck";

const mockUseMobile = jest.fn();
const mockUseLanguageSync = jest.fn();

jest.mock("@/utils/useMobile", () => ({
  useMobile: (breakpoint: number) => mockUseMobile(breakpoint),
}));

jest.mock("@/utils/useLanguage", () => ({
  useLanguageSync: () => mockUseLanguageSync(),
}));

jest.mock("@/utils/separatedText", () => ({
  __esModule: true,
  default: (text: string) => {
    if (!text) return [];

    return text.split("\n").map((paragraph) => paragraph.split("."));
  },
}));

jest.mock("@/components/divider/Divider", () => {
  return function MockDivider() {
    return <div data-testid="divider" />;
  };
});

jest.mock("@/components/modalMod/ModalMod", () => {
  return function MockModalMob({
    isOpen,
    title,
    content,
    children,
  }: {
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
    children: React.ReactNode;
  }) {
    if (!isOpen) return null;

    return (
      <div data-testid="modal">
        <h2>{title}</h2>
        <div>{content}</div>
        {children}
      </div>
    );
  };
});

jest.mock("@/assets/svg/icons", () => ({
  BageFalseIco: () => <span data-testid="badge-false">False badge</span>,
  BageTrueIco: () => <span data-testid="badge-true">True badge</span>,
  CorrectIco: () => <span data-testid="correct-icon">Correct</span>,
  IncorrextIco: () => <span data-testid="incorrect-icon">Incorrect</span>,
}));

jest.mock("@/utils/keyManager", () => ({
  getStableKey: jest.fn(
    (componentId: string, key: string) => `${componentId}-${key}`,
  ),
}));

const createTask = () =>
  ({
    taskId: "task-1",
    taskType: "MEDIA_TASK",
    taskDescriptions: {
      English: "Complete the missing answers.",
      German: "Vervollständige die fehlenden Antworten.",
    },
    content: {
      contentType: "CHOOSE_TEMPLATE",
      contentSource: "The capital of France is {{#q}}{{#a}}Paris{{/a}}{{/q}}.",
    },
    questions: [
      {
        questionId: "q1",
        questionText: "Capital of France",
        questionDescription: "France has Paris as its capital.",
      },
    ],
  }) as any;

const createTaskWithTwoAnswers = () =>
  ({
    taskId: "task-1",
    taskType: "MEDIA_TASK",
    taskDescriptions: {
      English: "Complete the missing answers.",
    },
    content: {
      contentType: "CHOOSE_TEMPLATE",
      contentSource:
        "France is {{#q}}{{#a}}Paris{{/a}}{{/q}} and Germany is {{#q}}{{#a}}Berlin{{/a}}{{/q}}.",
    },
    questions: [
      {
        questionId: "q1",
        questionText: "Capital of France",
        questionDescription: "France has Paris as its capital.",
      },
      {
        questionId: "q2",
        questionText: "Capital of Germany",
        questionDescription: "Germany has Berlin as its capital.",
      },
    ],
  }) as any;

const createResults = (result = true) => [
  {
    taskId: "task-1",
    questions: [
      {
        questionId: "q1",
        questionDescription: "France has Paris as its capital.",
        result,
        rightAnswers: ["Paris"],
      },
    ],
  },
];

describe("MultipleCheck", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseMobile.mockReturnValue(false);

    mockUseLanguageSync.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          exercise: "Exercise",
          mulCheckInfo: "Select an answer to see the result.",
        };

        return translations[key] ?? key;
      },
    });
  });

  it("renders exercise heading and content", () => {
    render(
      <MultipleCheck
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={createResults()}
      />,
    );

    expect(screen.getByText("Exercise 1")).toBeInTheDocument();

    expect(screen.getByText("The capital of France is")).toBeInTheDocument();

    expect(screen.getByDisplayValue("")).toBeInTheDocument();
  });

  it("renders existing user answer", () => {
    render(
      <MultipleCheck
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
            ],
          },
        ]}
        results={createResults()}
      />,
    );

    expect(screen.getByDisplayValue("Paris")).toBeInTheDocument();
  });

  it("renders a true badge for a correct answer", () => {
    render(
      <MultipleCheck
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={createResults(true)}
      />,
    );

    expect(screen.getByTestId("badge-true")).toBeInTheDocument();
    expect(screen.queryByTestId("badge-false")).not.toBeInTheDocument();
  });

  it("renders a false badge for an incorrect answer", () => {
    render(
      <MultipleCheck
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={createResults(false)}
      />,
    );

    expect(screen.getByTestId("badge-false")).toBeInTheDocument();
    expect(screen.queryByTestId("badge-true")).not.toBeInTheDocument();
  });

  it("renders fallback false badge when task result is missing", () => {
    render(
      <MultipleCheck
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={[]}
      />,
    );

    expect(screen.getByTestId("badge-false")).toBeInTheDocument();
  });

  it("shows information message before selecting a sentence", () => {
    render(
      <MultipleCheck
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={createResults()}
      />,
    );

    expect(
      screen.getByText("Select an answer to see the result."),
    ).toBeInTheDocument();
  });

  it("shows selected answer result on desktop", async () => {
    const user = userEvent.setup();

    render(
      <MultipleCheck
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={createResults(true)}
      />,
    );

    const input = screen.getByDisplayValue("");

    await user.click(input);

    expect(
      screen.getByText("France has Paris as its capital."),
    ).toBeInTheDocument();

    expect(screen.getByTestId("correct-icon")).toBeInTheDocument();
    expect(screen.getAllByText("Paris")).toHaveLength(2);
  });

  it("shows incorrect result on desktop", async () => {
    const user = userEvent.setup();

    render(
      <MultipleCheck
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={createResults(false)}
      />,
    );

    const input = screen.getByDisplayValue("");

    await user.click(input);

    expect(screen.getByTestId("incorrect-icon")).toBeInTheDocument();
    expect(screen.getAllByText("Paris")).toHaveLength(2);
  });

  it("renders mobile information message", () => {
    mockUseMobile.mockReturnValue(true);

    render(
      <MultipleCheck
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={createResults()}
      />,
    );

    expect(
      screen.getByText("Select an answer to see the result."),
    ).toBeInTheDocument();
  });

  it("opens modal when selecting an answer on mobile", async () => {
    mockUseMobile.mockReturnValue(true);

    const user = userEvent.setup();

    render(
      <MultipleCheck
        index={1}
        taskData={createTask()}
        userAnswers={[]}
        results={createResults(true)}
      />,
    );

    const input = screen.getByDisplayValue("");

    await user.click(input);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getAllByText("Exercise 1")).toHaveLength(2);
    expect(screen.getByTestId("correct-icon")).toBeInTheDocument();
  });

  it("renders results for multiple answers in the selected sentence", async () => {
    const user = userEvent.setup();

    render(
      <MultipleCheck
        index={1}
        taskData={createTaskWithTwoAnswers()}
        userAnswers={[]}
        results={[
          {
            taskId: "task-1",
            questions: [
              {
                questionId: "q1",
                questionDescription: "France has Paris as its capital.",
                result: true,
                rightAnswers: ["Paris"],
              },
              {
                questionId: "q2",
                questionDescription: "Germany has Berlin as its capital.",
                result: false,
                rightAnswers: ["Berlin"],
              },
            ],
          },
        ]}
      />,
    );

    const inputs = screen.getAllByDisplayValue("");

    await user.click(inputs[0]);

    expect(screen.getByTestId("correct-icon")).toBeInTheDocument();
    expect(screen.getByTestId("incorrect-icon")).toBeInTheDocument();

    expect(
      screen.getByText("France has Paris as its capital."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Germany has Berlin as its capital."),
    ).toBeInTheDocument();
  });

  it("renders empty answer as an empty input", () => {
    render(
      <MultipleCheck
        index={1}
        taskData={createTask()}
        userAnswers={[
          {
            taskId: "task-1",
            questions: [
              {
                questionId: "q1",
                userAnswer: "null",
              },
            ],
          },
        ]}
        results={createResults()}
      />,
    );

    expect(screen.getByDisplayValue("")).toBeInTheDocument();
  });
});
