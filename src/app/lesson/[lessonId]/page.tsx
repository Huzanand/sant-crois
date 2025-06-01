"use client";

import styles from "./page.module.css";
import { useEffect } from "react";
import { useOwnStore } from "@/store/storeProvider";
// import ProgressBar from "@/components/progressbar/ProgressBar";

import MediaTask from "@/components/tasks/media/MediaTask";
import ChooseTask from "@/components/tasks/choose/ChooseTask";
import TrueFalseTask from "@/components/tasks/trueFalse/TrueFalse";
import WriteTask from "@/components/tasks/write/WriteTask";
import FillTextTask from "@/components/tasks/fillText/FillTextTask";
import { useParams } from "next/navigation";
import TextTask from "@/components/tasks/text/TextTask";
import LessonInfo from "@/components/lessonInfo/LessonInfo";
import { useRouter } from "next/navigation";
import { makeFirstLetterUppercase } from "@/utils/makeFirstLetterUppercase";
import { useLanguageSync } from "@/utils/useLanguage";

const Lesson = () => {
    const {
        lesson,
        selectedInterfaceLanguage,
        fetchLessonById,
        fetchRecomendations,
        clearRecomendations,
    } = useOwnStore((store) => store);
    const { lessonId } = useParams();
    const router = useRouter();

    const { t } = useLanguageSync();

    useEffect(() => {
        fetchLessonById(lessonId as string);
    }, [lessonId, fetchLessonById]);

    useEffect(() => {
        if (
            Array.isArray(lesson?.relatedContents) &&
            lesson.relatedContents.length > 0
        ) {
            fetchRecomendations(lesson.relatedContents);
        }
    }, [fetchRecomendations, lesson?.relatedContents, clearRecomendations]);

    // const progressBarData = new Array(lesson?.tasks.length).fill("0");

    const renderTasks = () => {
        if (lesson && lesson.tasks) {
            const resultArr = [] as React.ReactNode[];
            lesson.tasks.forEach((task, index) => {
                switch (task.taskType) {
                    case "MEDIA_TASK":
                        switch (task.content?.contentType) {
                            case "TEXT":
                                resultArr.push(
                                    <TextTask
                                        key={index + task.taskId}
                                        content={
                                            (
                                                lesson.tasks[index].content as {
                                                    transcription: string;
                                                }
                                            ).transcription
                                        }
                                        index={index + 1}
                                    />
                                );
                                resultArr.push(
                                    <div
                                        className={styles.divider}
                                        key={"divider-" + index + 1}
                                    />
                                );
                                break;
                            case "VIDEO":
                                resultArr.push(
                                    <MediaTask
                                        key={index + task.taskId}
                                        taskData={lesson.tasks[index]}
                                        index={index + 1}
                                    />
                                );
                                resultArr.push(
                                    <div
                                        className={styles.divider}
                                        key={"divider-" + index}
                                    />
                                );
                                break;
                            case "AUDIO":
                                resultArr.push(
                                    <MediaTask
                                        key={index + task.taskId}
                                        taskData={lesson.tasks[index]}
                                        index={index + 1}
                                    />
                                );
                                resultArr.push(
                                    <div
                                        className={styles.divider}
                                        key={"divider-" + index}
                                    />
                                );
                                break;
                            case "FILL_TEMPLATE":
                                resultArr.push(
                                    <WriteTask
                                        key={index + task.taskId}
                                        taskData={lesson.tasks[index]}
                                        index={index + 1}
                                    />
                                );
                                resultArr.push(
                                    <div
                                        className={styles.divider}
                                        key={"divider-" + index}
                                    />
                                );
                                break;
                            case "CHOOSE_TEMPLATE":
                                resultArr.push(
                                    <FillTextTask
                                        key={index + task.taskId}
                                        taskData={lesson.tasks[index]}
                                        index={index + 1}
                                    />
                                );
                                resultArr.push(
                                    <div
                                        className={styles.divider}
                                        key={"divider-" + index}
                                    />
                                );
                                break;

                            default:
                                break;
                        }
                        break;

                    case "TRUE_FALSE":
                        resultArr.push(
                            <TrueFalseTask
                                key={index + task.taskId}
                                taskData={lesson.tasks[index]}
                                index={index + 1}
                            />
                        );
                        resultArr.push(
                            <div className={styles.divider} key={index} />
                        );
                        break;

                    case "CHOOSE_ANSWER":
                        resultArr.push(
                            <ChooseTask
                                key={index + task.taskId}
                                taskData={lesson.tasks[index]}
                                index={index + 1}
                            />
                        );
                        resultArr.push(
                            <div className={styles.divider} key={index} />
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
            <LessonInfo />

            <div className={styles.container}>
                {/*<ProgressBar data={progressBarData} />*/}

                <div className={styles.content}>
                    <div className={styles.header}>
                        <div
                            className={styles.header__item}
                            style={{
                                borderRadius: "10px",
                                backgroundImage: `url(${lesson?.cover})`,
                                backgroundColor: " #E7E7E7",
                                backgroundPosition: "50%",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                width: "100%",
                                aspectRatio: "16 / 9",
                                marginBottom: "2rem",
                            }}
                        />

                        <div className={styles.header__item}>
                            <h1 className="headlines-l">{lesson?.header}</h1>

                            <div className={styles.themes}>
                                <p className="body-l">
                                    {lesson?.primaryTopics[0] &&
                                        lesson.primaryTopics[0]}
                                </p>

                                {lesson?.secondaryTopics && (
                                    <p className="body-s">
                                        {lesson.primaryTopics[0]}
                                    </p>
                                )}
                            </div>

                            <div className={styles.tags}>
                                {lesson?.tags?.map((tag, index) => (
                                    <div
                                        key={tag + index}
                                        className="body-s"
                                        style={{
                                            color: "var(--Blue-B500)",
                                            textAlign: "center",
                                            padding: "0 4px",
                                            borderRadius: "4px",
                                            backgroundColor:
                                                "var(--Purple-P75)",
                                        }}
                                    >
                                        {tag}
                                    </div>
                                ))}
                            </div>

                            <div className={styles.desc}>
                                <p
                                    className="body-l"
                                    style={{
                                        color: "#3F3A65",
                                        // marginBottom: "3rem",
                                    }}
                                >
                                    {lesson?.exerciseDescriptions &&
                                        lesson.exerciseDescriptions[
                                            makeFirstLetterUppercase(
                                                selectedInterfaceLanguage
                                            )
                                        ]}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.divider} />

                    {lesson && renderTasks()}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "3rem",
                        }}
                    >
                        <button
                            className={styles.btnSend}
                            onClick={() => {
                                router.push(`/lesson/${lessonId}/results`);
                            }}
                        >
                            {t("finishLesson")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lesson;
