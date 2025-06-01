"use client";

import { ITaskData } from "@/models";
import styles from "./writeTask.module.css";
import { useOwnStore } from "@/store/storeProvider";
import React, { useCallback, useEffect, useState } from "react";
import { useLanguageSync } from "@/utils/useLanguage";
import separatedText from "@/utils/separatedText";

type propsTypes = {
    taskData: ITaskData;
    index: number;
};

const WriteTask: React.FC<propsTypes> = ({ taskData, index }) => {
    const { t } = useLanguageSync();

    const { taskId } = taskData;
    const content =
        taskData.content?.contentSource &&
        separatedText(taskData.content?.contentSource);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const mustacheTemplate = new RegExp(/{{#q}}.*?{{\/q}}/, "g");
    const setUserAnswers = useOwnStore((state) => state.setUserAnswers);
    const userAnswers = useOwnStore((state) => state.userAnswers);

    const [answers, setAnswers] = useState<string[]>([]);

    useEffect(() => {
        const taskAnswers = userAnswers.find((task) => task.taskId === taskId);
        const questionCount = countQuestionsInContent(content as string[][]);

        if (taskAnswers) {
            const initializedAnswers = Array(questionCount)
                .fill("")
                .map((_, index) => {
                    const found = taskAnswers.questions.find(
                        (q) => q.questionId === String(index)
                    );
                    return found?.userAnswer || "";
                });
            setAnswers(initializedAnswers);
        } else {
            setAnswers(Array(questionCount).fill(""));

            setUserAnswers({
                taskId: taskId,
                questions: Array(questionCount)
                    .fill("")
                    .map((_, idx) => ({
                        questionId: String(idx),
                        userAnswer: "",
                    })),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId]);

    const countQuestionsInContent = useCallback(
        (text: string[][]) => {
            let count = 0;
            text?.forEach((paragraph) => {
                paragraph?.forEach((sentence) => {
                    const matches = sentence.match(mustacheTemplate) || [];
                    count += matches.length;
                });
            });
            return count;
        },
        [mustacheTemplate]
    );

    const handleInputChange = (index: number, value: string | null) => {
        const updatedAnswers: string[] = [...answers];
        updatedAnswers[index] = value as string;
        setAnswers(updatedAnswers);

        const newUserAnswers: { questionId: string; userAnswer: string }[] = [];

        updatedAnswers.map((answer, index) => {
            newUserAnswers.push({
                questionId: String(index),
                userAnswer: answer,
            });
        });
        setUserAnswers({ taskId: taskId, questions: newUserAnswers });
    };

    const addWriteField = (text: string[][]) => {
        const resultText = [] as React.ReactNode[];
        let answerCouner = 0;

        text.map((paragraph, paragrafIndex) => {
            const newParagraf = [] as React.JSX.Element[];

            paragraph.map((sentence, sentenceIndex) => {
                const matches = [];
                let match;
                while ((match = mustacheTemplate.exec(sentence)) !== null) {
                    matches.push({
                        start: match.index,
                        end: match.index + match[0].length,
                        answerIndex: answerCouner,
                    });
                    answerCouner++;
                }

                let lastPos = 0;
                const parts = [] as React.ReactNode[];

                for (const { start, end, answerIndex } of matches) {
                    if (start > lastPos) {
                        parts.push(sentence.slice(lastPos, start));
                    }

                    parts.push(
                        <div
                            key={`${paragrafIndex}-${sentenceIndex}-${answerIndex}`}
                            className={styles.input__container}
                        >
                            <input
                                className={styles.input}
                                value={answers[answerIndex] || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        answerIndex,
                                        e.target.value
                                    )
                                }
                            />
                            {!answers[answerIndex] && (
                                <span className={styles.underline} />
                            )}
                        </div>
                    );
                    lastPos = end;
                }

                if (lastPos < sentence.length) {
                    parts.push(sentence.slice(lastPos));
                }

                newParagraf.push(
                    <React.Fragment key={`${paragrafIndex}-${sentenceIndex}`}>
                        {parts}
                    </React.Fragment>
                );
            });

            resultText.push(
                <div key={`wt-p-${paragrafIndex}-${taskId}`}>{newParagraf}</div>
            );
        });

        return (
            <div
                className="body-l"
                style={{ display: "inline-block", lineHeight: "2.2rem" }}
            >
                {resultText}
            </div>
        );
    };

    return (
        <div>
            <h2 className="headlines-m" style={{ margin: "1.5rem 0" }}>
                {`${t("exersice")} ${index}`}
            </h2>
            {content && addWriteField(content)}
        </div>
    );
};

export default WriteTask;
