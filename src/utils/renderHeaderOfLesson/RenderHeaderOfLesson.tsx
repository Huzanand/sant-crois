"use client";

import { useOwnStore } from "@/store/storeProvider";
import { makeFirstLetterUppercase } from "../makeFirstLetterUppercase";
import styles from "./page.module.css";
import { ILesson } from "@/models";
import { useMemo } from "react";

interface renderHeaderOfLessonProps {
    lesson: ILesson;
}

export const RenderHeaderOfLesson: React.FC<renderHeaderOfLessonProps> = ({
    lesson,
}) => {
    const { selectedInterfaceLanguage, selectedLearningLanguage } = useOwnStore(
        (store) => store
    );

    const renderExDesk = useMemo(() => {
        if (!lesson?.exerciseDescriptions) return undefined;

        if (lesson.exerciseDescriptions[selectedInterfaceLanguage]) {
            return lesson.exerciseDescriptions[
                makeFirstLetterUppercase(selectedInterfaceLanguage)
            ];
        } else {
            return lesson.exerciseDescriptions[
                makeFirstLetterUppercase(selectedLearningLanguage)
            ];
        }
    }, [
        lesson.exerciseDescriptions,
        selectedInterfaceLanguage,
        selectedLearningLanguage,
    ]);

    return (
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
                        {lesson?.primaryTopics[0] && lesson.primaryTopics[0]}
                    </p>

                    {lesson?.secondaryTopics && (
                        <p className="body-s">{lesson.secondaryTopics[0]}</p>
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
                                borderRadius: "4px",
                                backgroundColor: "var(--Purple-P75)",
                                padding: "4px 8px",
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
                        {renderExDesk}
                    </p>
                </div>
            </div>
        </div>
    );
};
