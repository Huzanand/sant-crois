"use client";

import styles from "./page.module.css";
import { useOwnStore } from "@/store/storeProvider";
import { useParams, useRouter } from "next/navigation";
import Recomendations from "@/components/recomendations/Recomandations";
import ResultsHeader from "@/components/settingsSelect/resultsHeader/ResultsHeader";
import { useEffect } from "react";
import MultipleCheck from "@/components/checkAnswers/multipleCheck/MultipleCheck";
import SingleCheck from "@/components/checkAnswers/singleCheck/SingleCheck";
import { useLanguageSync } from "@/utils/useLanguage";
import Error404 from "@/components/error404/Error404";
import { IAnswer, ICheckAnswers, IQuestion, IVirtualRoom } from "@/models";

const Results = () => {
    const {
        virtualRoom,
        setVirtualRoom,
        setUserAnswers,
        relatedContents,
        clearRecomendations,
        userAnswers,
        clearUserAnswers,
        results,
        setResults,
        clearResults,
    } = useOwnStore((store) => store);

    const router = useRouter();
    const { roomId } = useParams();
    const { t } = useLanguageSync();

    useEffect(() => {
        if (!roomId) return;

        const fetchRoomData = async () => {
            try {
                const res = await fetch(`/api/rooms/${roomId}`);
                if (!res.ok) throw new Error("Failed to fetch room");
                const data: IVirtualRoom = await res.json();
                setVirtualRoom(data);
                if (data.finished) {
                    data.roomExerciseDto.tasks.forEach((t) => {
                        const newAnswer = {
                            taskId: t.taskId,
                            questions: [] as IQuestion[],
                        };
                        t.questions?.forEach((q) => {
                            const newQuestion = {
                                questionId: q.questionId,
                                userAnswer: q.userAnswer || "",
                            };
                            newAnswer.questions.push(newQuestion);
                        });
                        setUserAnswers(newAnswer as IAnswer);
                    });

                    const newResults = [] as ICheckAnswers[];
                    data.roomExerciseDto.tasks.forEach((t) => {
                        const newResult = {
                            taskId: t.taskId,
                            questions: [],
                        } as ICheckAnswers;
                        t.questions?.forEach((q) => {
                            const newResultItem = {
                                questionId: q.questionId!,
                                questionDescription: q.questionDescription!,
                                result: q.result!,
                                rightAnswers: q.rightAnswers || [""],
                            };
                            newResult.questions.push(newResultItem);
                        });
                        newResults.push(newResult);
                    });
                    setResults(newResults as ICheckAnswers[]);
                }
            } catch (error) {
                console.error("Error fetching room:", error);
            }
        };

        fetchRoomData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderTasks = (virtualRoom: IVirtualRoom) => {
        if (virtualRoom) {
            const resultArr = [] as React.ReactNode[];

            virtualRoom.roomExerciseDto.tasks.forEach((task, index) => {
                switch (task.taskType) {
                    case "MEDIA_TASK":
                        switch (task.content!.contentType) {
                            case "CHOOSE_TEMPLATE":
                                resultArr.push(
                                    <MultipleCheck
                                        key={index}
                                        taskData={
                                            virtualRoom.roomExerciseDto.tasks[
                                                index
                                            ]
                                        }
                                        index={index + 1}
                                        userAnswers={userAnswers}
                                        results={results}
                                        withOptions
                                    />
                                );
                                resultArr.push(
                                    <div
                                        key={"divider-" + index}
                                        className={styles.divider}
                                    />
                                );
                                break;
                            case "FILL_TEMPLATE":
                                resultArr.push(
                                    <MultipleCheck
                                        key={index}
                                        taskData={
                                            virtualRoom.roomExerciseDto.tasks[
                                                index
                                            ]
                                        }
                                        index={index + 1}
                                        userAnswers={userAnswers}
                                        results={results}
                                    />
                                );
                                resultArr.push(
                                    <div
                                        key={"divider-" + index}
                                        className={styles.divider}
                                    />
                                );
                                break;
                        }
                        break;
                    case "CHOOSE_ANSWER":
                        resultArr.push(
                            <SingleCheck
                                key={index}
                                type="CHOOSE_ANSWER"
                                taskData={
                                    virtualRoom.roomExerciseDto.tasks[index]
                                }
                                index={index + 1}
                                userAnswers={userAnswers}
                                results={results}
                            />
                        );
                        resultArr.push(
                            <div
                                key={"divider-" + index}
                                className={styles.divider}
                            />
                        );
                        break;
                    case "TRUE_FALSE":
                        resultArr.push(
                            <SingleCheck
                                key={index}
                                type="TRUE_FALSE"
                                taskData={
                                    virtualRoom.roomExerciseDto.tasks[index]
                                }
                                index={index + 1}
                                userAnswers={userAnswers}
                                results={results}
                            />
                        );
                        resultArr.push(
                            <div
                                key={"divider-" + index}
                                className={styles.divider}
                            />
                        );
                        break;

                    default:
                        break;
                }
            });

            return <div>{resultArr}</div>;
        } else return undefined;
    };

    return (
        <div className={styles.wrapper}>
            {!virtualRoom ? (
                <Error404 page="check" />
            ) : (
                <>
                    <div>
                        <ResultsHeader />

                        <div className={styles.container}>
                            {virtualRoom && renderTasks(virtualRoom)}

                            {relatedContents && relatedContents.length > 0 && (
                                <Recomendations
                                    content={relatedContents as []}
                                />
                            )}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "3rem",
                                }}
                            >
                                <button
                                    className={`${styles.btnHome}`}
                                    onClick={() => {
                                        clearRecomendations();
                                        clearUserAnswers();
                                        clearResults();
                                        router.replace(`/`);
                                    }}
                                >
                                    {t("btnBack")}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Results;
