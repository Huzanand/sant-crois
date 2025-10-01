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

    // Add clear user answers function

    const { roomId } = useParams();

    //here must be get request to another brakepoint => fetchVRLesson(roomID)

    useEffect(() => {
        fetchLessonById(roomId as string);
    }, [roomId, fetchLessonById]);

    ////////////////////////////////////////////////////////////////////

    const router = useRouter();
    const { t } = useLanguageSync();

    return (
        <div className={styles.wrapper}>
            {/* LESSON INFO || HEADER*/}
            <div className={styles.container_header}>
                <div className={styles.container_header__inner}>
                    <div className={styles.logo}>
                        <Logo />
                    </div>

                    {/* Put the name of student here */}

                    <div className={`${styles.greetengs} headlines-l`}>
                        Добро пожаловать, Виталий!
                    </div>

                    {/* ====================================== */}
                    <div className={`${styles.remaining_time}`}>
                        {/* Add translation */}

                        <span className="body-m">Комната существует: </span>

                        {/* ==================================== */}

                        {/* Add transtion for hours & variable of time */}
                        <span
                            style={{ whiteSpace: "nowrap" }}
                            className="headlines-s"
                        >
                            48 часов
                        </span>

                        {/* ===================================== */}
                    </div>
                </div>
            </div>

            <div className={styles.container_content}>
                <div className={styles.content}>
                    {/* Check, why there is no change interface language dropdown */}
                    {lesson && <RenderHeaderOfLesson lesson={lesson} />}
                    {/* =============================================== */}

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
                        {/* Add the sending user answer action creator */}
                        <button
                            className={styles.btnSend}
                            onClick={() => {
                                router.replace(`/`);
                            }}
                        >
                            {t("finishLesson")}
                        </button>
                        {/* ============================================== */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Room;
