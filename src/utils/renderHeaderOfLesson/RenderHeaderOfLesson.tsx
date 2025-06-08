"use client";

import { useOwnStore } from "@/store/storeProvider";
import { makeFirstLetterUppercase } from "../makeFirstLetterUppercase";
import styles from "./page.module.css";
import { ILesson } from "@/models";

interface renderHeaderOfLessonProps {
    lesson: ILesson;
}

export const RenderHeaderOfLesson: React.FC<renderHeaderOfLessonProps> = ({
    lesson,
}) => {
    const { selectedInterfaceLanguage } = useOwnStore((store) => store);

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
                        <p className="body-s">{lesson.primaryTopics[0]}</p>
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
                                backgroundColor: "var(--Purple-P75)",
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
    );
};
