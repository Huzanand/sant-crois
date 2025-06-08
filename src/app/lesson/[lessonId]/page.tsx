"use client";

import styles from "./page.module.css";
import { useEffect } from "react";
import { useOwnStore } from "@/store/storeProvider";
// import ProgressBar from "@/components/progressbar/ProgressBar";

import { useParams } from "next/navigation";
import LessonInfo from "@/components/lessonInfo/LessonInfo";
import { useRouter } from "next/navigation";
import { makeFirstLetterUppercase } from "@/utils/makeFirstLetterUppercase";
import { useLanguageSync } from "@/utils/useLanguage";
import { RenderTasks } from "@/utils/RenderTasks";

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

                    {lesson && lesson.tasks && (
                        <RenderTasks tasks={lesson.tasks} />
                    )}

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
