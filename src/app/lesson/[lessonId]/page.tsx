"use client";

import styles from "./page.module.css";
import { useEffect } from "react";
import { useOwnStore } from "@/store/storeProvider";
// import ProgressBar from "@/components/progressbar/ProgressBar";

import { useParams } from "next/navigation";
import LessonInfo from "@/components/lessonInfo/LessonInfo";
import { useRouter } from "next/navigation";
import { useLanguageSync } from "@/utils/useLanguage";
import { RenderTasks } from "@/utils/RenderTasks";
import { RenderHeaderOfLesson } from "@/utils/renderHeaderOfLesson/RenderHeaderOfLesson";
import InDev from "@/components/inDev/InDev";
import { interceptorsStore } from "@/store/interceptorsStore";
import Error404 from "@/components/error404/Error404";

const Lesson = () => {
    const {
        lesson,
        fetchLessonById,
        fetchRecomendations,
        clearRecomendations,
    } = useOwnStore((store) => store);

    const error = interceptorsStore((state) => state.error);

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

    return (
        <div className={styles.wrapper}>
            {error ? (
                <Error404 page="lesson" />
            ) : (
                <>
                    <InDev />

                    <LessonInfo />

                    <div className={styles.container}>
                        <div className={styles.content}>
                            {lesson && <RenderHeaderOfLesson lesson={lesson} />}

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
                                        router.push(
                                            `/lesson/${lessonId}/results`
                                        );
                                    }}
                                >
                                    {t("finishLesson")}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Lesson;
