"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./lessonPreview.module.css"
import { useOwnStore } from "@/store/storeProvider";
import { makeFirstLetterUppercase } from "@/utils/makeFirstLetterUppercase";
import { RenderTasks } from "@/utils/ConstructorRenderTasks";
import { loadPersistedCover } from "@/store/fileStorage";

const LessonPreview = () => {
    const draft = useOwnStore(state => state.draft);
    const { selectedInterfaceLanguage, selectedLearningLanguage } = useOwnStore(
        (store) => store
    );

    // const renderExDesk = useMemo((): string | undefined => {
    //     const descriptions = draft?.exerciseDescriptions;
    //     if (!descriptions) return undefined;

    //     // 1. Convert to unknown first, then to Record to allow string indexing
    //     const data = (descriptions as unknown) as Record<string, any>;

    //     const interfaceLang = makeFirstLetterUppercase(selectedInterfaceLanguage);
    //     const learningLang = makeFirstLetterUppercase(selectedLearningLanguage);

    //     // 2. Safe access
    //     const result = data[interfaceLang] || data[learningLang];

    //     return typeof result === 'string' ? result : undefined;
    // }, [draft.exerciseDescriptions, selectedInterfaceLanguage, selectedLearningLanguage]);

    const [coverSrc, setCoverSrc] = useState< string>('');

    useEffect(() => {

        let isMounted = true;
        let objectUrl: string | null = null;

        const formCoverURL = async () => {

            if (draft.coverUrl) {
                if (isMounted) setCoverSrc(draft.coverUrl);
            } else {
                const blob = await loadPersistedCover(draft.id);
                if (blob && isMounted) {
                    objectUrl = URL.createObjectURL(blob);
                    setCoverSrc(`url(${objectUrl})`);
                }
            }
        }

        formCoverURL();

        return () => {
            isMounted = false;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div
                    className={styles.header__item}
                    style={{
                        borderRadius: "10px",
                        backgroundImage: coverSrc as string,
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
                    <h1 className="headlines-l">{draft?.header}</h1>

                    <div className={styles.themes}>
                        <p className="body-l">
                            {draft?.primaryTopics[0] && draft.primaryTopics[0]}
                        </p>

                        {draft?.secondaryTopics && (
                            <p className="body-s">{draft.secondaryTopics[0]}</p>
                        )}
                    </div>

                    <div className={styles.tags}>
                        {draft?.tags?.map((tag, index) => (
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
                            style={{ color: "#3F3A65" }}
                        >
                            {/* {renderExDesk} */}
                            {draft.exerciseDescriptions}
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.content_container}>
                <RenderTasks tasks={draft?.tasks} />
            </div>
        </div>
    );
};

export default LessonPreview;