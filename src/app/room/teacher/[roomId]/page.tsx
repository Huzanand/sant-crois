"use client";

import Logo from "@/components/logo/Logo";
import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { useLanguageSync } from "@/utils/useLanguage";
import { useEffect } from "react";
import { useOwnStore } from "@/store/storeProvider";
import { RenderTasks } from "@/utils/RenderTasks";
import { RenderHeaderOfLesson } from "@/utils/renderHeaderOfLesson/RenderHeaderOfLesson";

const Room = () => {
    const { lesson, fetchLessonById } = useOwnStore((store) => store);

    const { roomId } = useParams();

    useEffect(() => {
        fetchLessonById(roomId as string);
    }, [roomId, fetchLessonById]);

    const router = useRouter();
    const { t } = useLanguageSync();

    return (
        <div className={styles.wrapper}>
            {/* LESSON INFO || HEADER*/}
            <div className={styles.container_header}>
                <div className={styles.container_header__inner}>
                    <Logo />
                    <div className={styles.room_info}>
                        <div className={`${styles.greetengs} headlines-l`}>
                            Урок закончен
                        </div>
                        <div className={`${styles.remaining_time}`}>
                            <span className="body-m">Статус: </span>
                            <span className="headlines-s">закончен</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.container_content}>
                <div className={styles.content}>
                    {lesson && <RenderHeaderOfLesson lesson={lesson} />}

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
                                router.replace(`/`);
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

export default Room;
