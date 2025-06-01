import styles from "./multipleCheck.module.css";
import { IAnswer, ICheckAnswers, ITaskData } from "@/models";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
    BageFalseIco,
    BageTrueIco,
    CorrectIco,
    IncorrextIco,
} from "@/assets/svg/icons";
import Divider from "@/components/divider/Divider";
import { useMobile } from "@/utils/useMobile";
import ModalMob from "@/components/modalMod/ModalMod";
import { useLanguageSync } from "@/utils/useLanguage";
import separatedText from "@/utils/separatedText";
import { getStableKey } from "@/utils/keyManager";

type propsTypes = {
    taskData: ITaskData;
    index: number;
    userAnswers: IAnswer[];
    results: ICheckAnswers[];
    withOptions?: boolean;
};

const MultipleCheck: React.FC<propsTypes> = ({
    index: taskIndex,
    taskData,
    userAnswers,
    results,
    withOptions,
}) => {
    const componentId = `MultipleCheck-${taskIndex}`;
    const isMobile = useMobile(1024);
    const { t } = useLanguageSync();

    const contentRef = useRef<HTMLDivElement | null>(null);
    const selectedSentenceRef = useRef<HTMLDivElement | null>(null);
    const descriptionRef = useRef<HTMLDivElement | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [descriptionHeight, setDescriptionHeight] = useState(250);

    const updateHeight = () => {
        if (
            contentRef.current &&
            selectedSentenceRef.current &&
            descriptionRef.current
        ) {
            const newHeight =
                contentRef.current.clientHeight -
                selectedSentenceRef.current.clientHeight -
                22;
            setDescriptionHeight((prev) =>
                prev !== newHeight ? newHeight : prev
            );
        }
    };

    setTimeout(updateHeight, 0);

    useEffect(() => {
        updateHeight();
    }, [selectedSentenceRef.current?.clientHeight]);

    const mustacheTemplate = withOptions
        ? new RegExp(
              /\{\{#q\}\}\{\{#o\}}(.*?)\{\{\/o\}\}(?:\{\{#a\}\}.*?\{\{\/a\}\})?\{\{\/q\}\}/g
          )
        : new RegExp(/{{#q}}\s*{{#a}}.*?{{\/a}}\s*{{\/q}}\s*/g);

    const { taskId } = taskData;
    const content = taskData.content?.contentSource;
    const [answers, setAnswers] = useState<string[]>([]);
    const [selectedSentence, setSelectedSentence] = useState<
        [paragrafIndex: number, sentenseIndex: number, answerIndex: number] | []
    >([]);
    const task = results?.find((task) => task.taskId === taskId);
    const separatedContent = separatedText(content!);

    useEffect(() => {
        const findedTask = userAnswers.find((task) => task.taskId === taskId);
        if (!findedTask) return;

        const tempAnswers = findedTask.questions.map((q) => q.userAnswer || "");
        setAnswers(tempAnswers);
    }, [userAnswers, taskId]);

    const addBadge = (index: number) => {
        if (!task || !task.questions) return <BageFalseIco />;

        return task.questions[index]?.result === true ? (
            <BageTrueIco />
        ) : (
            <BageFalseIco />
        );
    };

    const openModal = () => {
        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = "hidden";
        setIsModalOpen(true); // Open modal on mobile
    };

    const closeModal = () => {
        document.body.style.paddingRight = "";
        document.body.style.overflow = "";
        setIsModalOpen(false);
    };

    const handleOnClick = (
        paragrafIndex: number,
        sentenceIndex: number,
        answerIndex: number
    ) => {
        if (isMobile) {
            setSelectedSentence([paragrafIndex, sentenceIndex, answerIndex]);
            openModal();
        } else {
            if (
                selectedSentence.length === 0 ||
                selectedSentence[0] !== paragrafIndex ||
                selectedSentence[1] !== sentenceIndex
            ) {
                setSelectedSentence([
                    paragrafIndex,
                    sentenceIndex,
                    answerIndex,
                ]);
            }
        }
    };

    const renderContent = () => {
        const resultText = [] as React.ReactNode[];
        let answerIndex = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let countOfAnswers = 0;

        separatedContent.forEach((paragraph, paragraphIndex) => {
            const paragraphElements = [] as React.ReactNode[];

            paragraph.forEach((sentence, index) => {
                let lastIndex = 0;

                if (
                    !sentence.includes("{{#q}}{{#a}}") &&
                    !sentence.includes("{{/a}}{{/q}}")
                ) {
                    resultText.push(
                        <span
                            key={getStableKey(
                                componentId,
                                `text-task-${paragraphIndex}-s${index}`
                            )}
                        >
                            {sentence}{" "}
                        </span>
                    );
                } else {
                    const matches = [...sentence.matchAll(mustacheTemplate)];

                    matches.forEach((match, innerIndex) => {
                        const startIndex = match.index!;
                        const endIndex = startIndex + match[0].length;

                        if (startIndex > lastIndex) {
                            resultText.push(
                                <span
                                    key={getStableKey(
                                        componentId,
                                        `pre-task-${paragraphIndex}-s${index}-m${match.index}`
                                    )}
                                >
                                    {" "}
                                    {sentence.slice(lastIndex, startIndex)}{" "}
                                </span>
                            );
                        }

                        if (innerIndex > 0) countOfAnswers++;
                        resultText.push(
                            <div
                                key={getStableKey(
                                    componentId,
                                    `answer-p${paragraphIndex}-s${index}-m${match.index}`
                                )}
                                className={styles.input__container}
                                data-paragrafindex={paragraphIndex}
                                data-sentenceindex={index}
                                data-answerindex={answerIndex - countOfAnswers}
                                onClick={(e) =>
                                    handleOnClick(
                                        Number(
                                            e.currentTarget.dataset
                                                .paragrafindex
                                        ),
                                        Number(
                                            e.currentTarget.dataset
                                                .sentenceindex
                                        ),
                                        Number(
                                            e.currentTarget.dataset.answerindex
                                        )
                                    )
                                }
                            >
                                <input
                                    readOnly
                                    className={styles.input}
                                    value={answers[answerIndex] || ""}
                                />
                                {!answers[answerIndex] && (
                                    <span className={styles.underline} />
                                )}
                                <div
                                    className={styles.badge}
                                    style={{ width: "" }}
                                >
                                    {addBadge(answerIndex)}
                                </div>
                            </div>
                        );

                        answerIndex++;

                        lastIndex = endIndex;
                    });

                    countOfAnswers = 0;

                    if (lastIndex < sentence.length) {
                        resultText.push(
                            <span
                                key={getStableKey(
                                    componentId,
                                    `post-task-${paragraphIndex}-s${index}-m${sentence.length}`
                                )}
                            >
                                {" "}
                                {sentence.slice(lastIndex)}{" "}
                            </span>
                        );
                    }
                }
            });

            resultText.push(
                <p key={`para-task-${taskId}-p${paragraphIndex}`}>
                    {paragraphElements}
                </p>
            );
        });
        return (
            <div
                ref={contentRef}
                className="body-l"
                style={{
                    display: "inline-block",
                    lineHeight: "2.5rem",
                }}
            >
                {resultText}
            </div>
        );
    };

    const renderDescription = (
        selectedSentence:
            | [
                  paragrafIndex: number,
                  sentenseIndex: number,
                  answerIndex: number
              ]
            | []
    ) => {
        if (selectedSentence.length === 0)
            return <p className="body-s">{t("mulCheckInfo")}</p>;

        const paragrafIndex = selectedSentence[0];
        const sentenceIndex = selectedSentence[1];
        // eslint-disable-next-line prefer-const
        let answerIndex = selectedSentence[2];
        let countOfAnswers = 0;

        const resultText = [] as React.ReactNode[];

        let lastIndex = 0;

        separatedContent.forEach((par, parIndex) => {
            if (parIndex === paragrafIndex) {
                const matches = [
                    ...par[sentenceIndex].matchAll(mustacheTemplate),
                ];

                matches.forEach((match, innerIndex) => {
                    const startIndex = match.index!;
                    const endIndex = startIndex + match[0].length;

                    if (startIndex > lastIndex) {
                        resultText.push(
                            <span
                                key={getStableKey(
                                    componentId,
                                    `desc-task-${taskId}-p${parIndex}-s${sentenceIndex}-m${innerIndex}`
                                )}
                            >
                                {" "}
                                {par[sentenceIndex!].slice(
                                    lastIndex,
                                    startIndex
                                )}{" "}
                            </span>
                        );
                    }

                    if (innerIndex > 0) {
                        answerIndex!++;
                        countOfAnswers++;
                    }

                    resultText.push(
                        task?.questions[answerIndex].result ? (
                            <span
                                key={getStableKey(
                                    componentId,
                                    `descriptionInput-${taskId}-s${sentenceIndex}-m${answerIndex}`
                                )}
                                style={{ color: "#6ccf64" }}
                            >
                                {task?.questions[answerIndex!].rightAnswers ||
                                    ""}
                            </span>
                        ) : (
                            <span
                                key={`descriptionInput-${sentenceIndex}-${innerIndex}-${answerIndex}`}
                                style={{ color: "#F60000" }}
                            >
                                {task?.questions[answerIndex!].rightAnswers ||
                                    ""}
                            </span>
                        )
                    );

                    lastIndex = endIndex;
                });

                if (lastIndex < par[sentenceIndex!].length) {
                    resultText.push(
                        <span
                            key={getStableKey(
                                componentId,
                                `descriptionText-end-${taskId}-s${sentenceIndex}`
                            )}
                        >
                            {" "}
                            {par[sentenceIndex!].slice(lastIndex)}{" "}
                        </span>
                    );
                }
            }
        });

        const renderResult = (count: number) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const viev = (index: any) => {
                return (
                    <div key={`result-task-${taskId}-ans${index}`}>
                        <div>
                            {task?.questions[index].result ? (
                                <div className={styles.description__ico}>
                                    <CorrectIco />
                                    <span style={{ color: "#6ccf64" }}>
                                        {task?.questions[index!].rightAnswers ||
                                            ""}
                                    </span>
                                </div>
                            ) : (
                                <div className={styles.description__ico}>
                                    <IncorrextIco />
                                    <span style={{ color: "#F60000" }}>
                                        {task?.questions[index!].rightAnswers ||
                                            ""}
                                    </span>
                                </div>
                            )}
                        </div>

                        <p className="body-s">
                            {task?.questions[index].questionDescription}
                        </p>
                    </div>
                );
            };

            if (count === 0) {
                return viev(answerIndex);
            }

            const arr = [] as ReactNode[];
            for (let i = 0; i <= count; i++) {
                arr.push(viev(answerIndex - countOfAnswers + i));
            }
            return arr;
        };

        return (
            <div
                className="body-l"
                style={{
                    display: "inline-block",
                    lineHeight: "2.5rem",
                    width: "100%",
                }}
            >
                <div ref={selectedSentenceRef}>{resultText}</div>

                <Divider />

                <div
                    ref={descriptionRef}
                    style={
                        isMobile
                            ? undefined
                            : {
                                  height: `${descriptionHeight}px`,
                                  overflow: "auto",
                              }
                    }
                >
                    {renderResult(countOfAnswers)}
                </div>
            </div>
        );
    };

    return (
        <div>
            <h2 className="headlines-m" style={{ marginBottom: "1.5rem" }}>
                {`${t("exersice")} ${taskIndex}`}
            </h2>

            {isMobile && (
                <p className="body-s" style={{ paddingBottom: "1rem" }}>
                    {t("mulCheckInfo")}
                </p>
            )}

            <div className={styles.content__container}>
                <div className={styles.content__main}>{renderContent()}</div>

                {!isMobile && <div className={styles.divider} />}

                {!isMobile && (
                    <div className={styles.content__description}>
                        {renderDescription(selectedSentence)}
                    </div>
                )}

                {isMobile && (
                    <ModalMob
                        isOpen={isModalOpen}
                        onClose={() => {
                            closeModal();
                            setSelectedSentence([]);
                        }}
                        title={`${t("exersice")} ${taskIndex}`}
                        content={renderDescription(selectedSentence)}
                    >
                        <span style={{ display: "none" }} />
                    </ModalMob>
                )}
            </div>
        </div>
    );
};

export default MultipleCheck;
