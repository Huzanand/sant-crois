"use client";

import { ITaskData } from "@/models";
import styles from "./fillTextTask.module.css";
import { useOwnStore } from "@/store/storeProvider";
import { useCallback, useEffect, useState } from "react";
import FillTextSelect from "@/components/fillTextSelect/FillTextSelect";
import { useLanguageSync } from "@/utils/useLanguage";
import separatedText from "@/utils/separatedText";
import React from "react";

type propsTypes = {
    taskData: ITaskData;
    index: number;
};

const FillTextTask: React.FC<propsTypes> = ({ taskData, index }) => {
    const taskId = taskData.taskId;
    const content =
        taskData.content?.contentSource &&
        separatedText(taskData.content?.contentSource);

    const setUserAnswers = useOwnStore((state) => state.setUserAnswers);
    const userAnswers = useOwnStore((state) => state.userAnswers);

    const [answers, setAnswers] = useState<string[]>([]);
    const { t } = useLanguageSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const mustacheTemplate =
        /\{\{#q\}\}\{\{#o\}}(.*?)\{\{\/o\}\}(?:\{\{#a\}\}.*?\{\{\/a\}\})?\{\{\/q\}\}/g;

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

    const handleSelectChange = useCallback(
        (index: number, value: string) => {
            setAnswers((prev) => {
                const updated = [...prev];
                updated[index] = value;
                return updated;
            });

            setUserAnswers({
                taskId: taskId,
                questions: answers.map((answer, idx) => ({
                    questionId: String(idx),
                    userAnswer: idx === index ? value : answer,
                })),
            });
        },
        [taskId, answers, setUserAnswers]
    );

    const parseContent = (text: string[][]) => {
        const resultElements = [] as React.ReactNode[];
        let answerCounter = 0;

        text.forEach((paragraph, paragraphIndex) => {
            const paragraphElements = [] as React.ReactNode[];

            paragraph.forEach((sentence, sentenceIndex) => {
                const matches = [];
                mustacheTemplate.lastIndex = 0;
                let match;
                while ((match = mustacheTemplate.exec(sentence)) !== null) {
                    matches.push({
                        match,
                        start: match.index,
                        end: match.index + match[0].length,
                        answerIndex: answerCounter++,
                    });
                }

                let lastPos = 0;
                const sentenceParts = [] as React.ReactNode[];

                matches.forEach(
                    ({ match, start, end, answerIndex }, matchIndex) => {
                        if (start > lastPos) {
                            sentenceParts.push(sentence.slice(lastPos, start));
                        }

                        const options = match[1]
                            .split(",")
                            .map((option) => option.trim());

                        sentenceParts.push(
                            <FillTextSelect
                                key={`ft-${paragraphIndex}-${sentenceIndex}-${matchIndex}-${answerIndex}`}
                                selectIndex={answerIndex}
                                handleChange={handleSelectChange}
                                options={options}
                                currentOption={answers[answerIndex] || ""}
                            />
                        );

                        lastPos = end;
                    }
                );

                if (lastPos < sentence.length) {
                    sentenceParts.push(sentence.slice(lastPos));
                }

                paragraphElements.push(
                    <React.Fragment
                        key={`ft-p-${paragraphIndex}-s-${sentenceIndex}`}
                    >
                        {sentenceParts}
                    </React.Fragment>
                );
            });

            resultElements.push(
                <div key={`ft-p-${paragraphIndex}-${taskId}`}>
                    {paragraphElements}
                </div>
            );
        });

        return resultElements;
    };
    return (
        <div style={{ marginBottom: "1.5rem" }}>
            <h2 className="headlines-m" style={{ marginBottom: "1.5rem" }}>
                {`${t("exercise")} ${index}`}
            </h2>
            <div
                className={`body-m ${styles.container}`}
                style={{ lineHeight: "2.5rem" }}
            >
                {parseContent(content as string[][])}
            </div>
        </div>
    );
};

export default FillTextTask;
