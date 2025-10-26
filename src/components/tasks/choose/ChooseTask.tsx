"use client";

import styles from "./chooseTask.module.css";
import { IAnswer, ITaskData } from "@/models";
import { useOwnStore } from "@/store/storeProvider";
import { useLanguageSync } from "@/utils/useLanguage";
import { useEffect } from "react";

type propsTypes = {
    taskData: ITaskData;
    index: number;
    readonly?: boolean;
};

const ChooseTask: React.FC<propsTypes> = ({ taskData, index, readonly }) => {
    const { setUserAnswers, userAnswers, selectedInterfaceLanguage } =
        useOwnStore((state) => state);

    const { t } = useLanguageSync();

    const initUserAnswers = () => {
        const initObject = {
            taskId: taskData.taskId,
            questions: [] as {
                questionId: string;
                userAnswer: string | null;
            }[],
        };

        taskData.questions?.map((q) => {
            const newQuestion = {
                questionId: q.questionId,
                userAnswer: null,
            };

            initObject.questions.push(newQuestion);
        });

        setUserAnswers(initObject as IAnswer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!userAnswers.some((answer) => answer.taskId === taskData.taskId))
            initUserAnswers();
    });

    const changeOption = (
        e: React.ChangeEvent<HTMLInputElement>,
        newQuestionId: string
    ) => {
        const selectedOption = e.target.value;

        const existingAnswer = userAnswers.find(
            (answer: IAnswer) => answer.taskId === taskData.taskId
        );

        let updatedQuestions;

        if (existingAnswer) {
            const existingQuestionIndex = existingAnswer.questions.findIndex(
                (q) => q.questionId === newQuestionId
            );

            if (existingQuestionIndex > -1) {
                updatedQuestions = existingAnswer.questions.map(
                    (q, index: number) =>
                        index === existingQuestionIndex
                            ? { ...q, userAnswer: selectedOption }
                            : q
                );
            } else {
                updatedQuestions = [
                    ...existingAnswer.questions,
                    { questionId: newQuestionId, userAnswer: selectedOption },
                ];
            }
        } else {
            updatedQuestions = [
                { questionId: newQuestionId, userAnswer: selectedOption },
            ];
        }

        const questionList = {
            taskId: taskData.taskId,
            questions: updatedQuestions,
        };

        setUserAnswers(questionList);
    };

    return (
        <div>
            <h2 className="headlines-m" style={{ margin: "1.5rem 0" }}>
                {`${t("exercise")} ${index}`}
            </h2>

            <p className="headlines-m" style={{ margin: "0 0 1.25rem" }}>
                {taskData?.taskDescriptions[selectedInterfaceLanguage]}
            </p>

            <div className={styles.qustion_container}>
                {taskData.questions?.map((question) => (
                    <div
                        className={styles.question_item}
                        key={question.questionId}
                    >
                        <h3
                            className="headlines-s"
                            style={{ marginBottom: "1rem" }}
                        >
                            {question?.questionText}
                        </h3>

                        <div>
                            {question.options?.map((option, index) => {
                                const isChecked =
                                    userAnswers
                                        .find(
                                            (answer: IAnswer) =>
                                                answer.taskId ===
                                                taskData.taskId
                                        )
                                        ?.questions.find(
                                            (q) =>
                                                q.questionId ===
                                                question.questionId
                                        )?.userAnswer === option;
                                return (
                                    <div className={styles.option} key={index}>
                                        <label
                                            className={
                                                isChecked
                                                    ? `${styles.label_checked} body-l`
                                                    : "body-l"
                                            }
                                        >
                                            <input
                                                type="radio"
                                                value={option}
                                                disabled={readonly}
                                                onChange={(e) =>
                                                    changeOption(
                                                        e,
                                                        question.questionId
                                                    )
                                                }
                                                checked={
                                                    userAnswers
                                                        .find(
                                                            (answer: IAnswer) =>
                                                                answer.taskId ===
                                                                taskData.taskId
                                                        )
                                                        ?.questions.find(
                                                            (q) =>
                                                                q.questionId ===
                                                                question.questionId
                                                        )?.userAnswer === option
                                                }
                                            />
                                            <span
                                                className={
                                                    styles.custom_radioBtn
                                                }
                                            />
                                            {option}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChooseTask;
