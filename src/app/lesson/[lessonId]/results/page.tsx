"use client";

import styles from "./page.module.css";
import { useOwnStore } from "@/store/storeProvider";
import { useParams, useRouter } from "next/navigation";
import Recomendations from "@/components/recomendations/Recomandations";
import ResultsHeader from "@/components/settingsSelect/resultsHeader/ResultsHeader";
import { useEffect } from "react";
import { interceptorsStore } from "@/store/interceptorsStore";
import MultipleCheck from "@/components/checkAnswers/multipleCheck/MultipleCheck";
import SingleCheck from "@/components/checkAnswers/singleCheck/SingleCheck";
import { ILesson } from "@/models";
import Loader from "@/components/loader/Loader";
import { useLanguageSync } from "@/utils/useLanguage";

const Results = () => {
    const {
        lesson,
        relatedContents,
        clearRecomendations,
        userAnswers,
        sendUserAnswers,
        clearUserAnswers,
        results,
        clearResults,
    } = useOwnStore((store) => store);

    const { loading, error } = interceptorsStore((state) => state);
    const router = useRouter();
    const { lessonId } = useParams();
    const { t } = useLanguageSync();

    useEffect(() => {
        if (lessonId) {
            sendUserAnswers(lessonId as string);
        }
    }, [lessonId, sendUserAnswers]);

    const renderTasks = (lesson: ILesson) => {
        if (lesson) {
            const resultArr = [] as React.ReactNode[];

            lesson.tasks.forEach((task, index) => {
                switch (task.taskType) {
                    case "MEDIA_TASK":
                        switch (task.content!.contentType) {
                            case "CHOOSE_TEMPLATE":
                                resultArr.push(
                                    <MultipleCheck
                                        key={index}
                                        taskData={lesson.tasks[index]}
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
                                        taskData={lesson.tasks[index]}
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
                                taskData={lesson.tasks[index]}
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
                                taskData={lesson.tasks[index]}
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
            {loading && !error && <Loader />}

            {!loading && !error && (
                <div>
                    <ResultsHeader />

                    <div className={styles.container}>
                        {lesson && renderTasks(lesson)}

                        {relatedContents && relatedContents.length > 0 && (
                            <Recomendations content={relatedContents as []} />
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
                                    setTimeout(() => router.replace(`/`), 0);
                                }}
                            >
                                {t("btnBack")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;
