"use client";

import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { useLanguageSync } from "@/utils/useLanguage";
import { useEffect } from "react";
import { useOwnStore } from "@/store/storeProvider";
import { RenderTasks } from "@/utils/RenderTasks";
import { RenderHeaderOfLesson } from "@/utils/renderHeaderOfLesson/RenderHeaderOfLesson";
import { IAnswer, ICheckAnswers, IQuestion, IVirtualRoom } from "@/models";
import RoomInfo from "@/components/roomInfo/RoomInfo";

const Room = () => {
    const {
        virtualRoom,
        setVirtualRoom,
        setVRAnswers,
        setResults,
        userAnswers,
        setUserAnswers,
    } = useOwnStore((store) => store);

    const { roomId } = useParams();

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

    const router = useRouter();
    const { t } = useLanguageSync();

    const handleFinish = async () => {
        if (virtualRoom?.finished) router.push(`/rooms/${roomId}/results`);
        else {
            try {
                const res = await fetch(`/api/rooms/${roomId}/answers`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userAnswers),
                });

                const result = await res.json();

                setVRAnswers(result);
                router.push(`/rooms/${roomId}/results`);
            } catch (error) {
                console.error("Error posting answers:", error);
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            {virtualRoom && <RoomInfo />}

            <div className={styles.container_content}>
                <div className={styles.content}>
                    {virtualRoom && (
                        <RenderHeaderOfLesson
                            lesson={virtualRoom.roomExerciseDto}
                        />
                    )}

                    {virtualRoom && virtualRoom.roomExerciseDto.tasks && (
                        <RenderTasks
                            tasks={virtualRoom.roomExerciseDto.tasks}
                            readonly={virtualRoom.finished}
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
                            className={styles.btnSend}
                            onClick={handleFinish}
                        >
                            {virtualRoom?.finished
                                ? t("vr.seeResults")
                                : t("finishLesson")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Room;
