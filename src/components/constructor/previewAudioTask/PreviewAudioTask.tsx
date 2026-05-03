"use client"

import styles from "./previewAudioTask.module.css";
import { IDraftTaskData } from "@/models";
import { useOwnStore } from "@/store/storeProvider";
import { useLanguageSync } from "@/utils/useLanguage";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextWithTooltip } from "@/components/common/editor/extensions/TextWithTooltip";
import { useEffect, useState } from "react";
import { loadPersistedFile } from "@/store/fileStorage";

type propsTypes = {
    taskData: IDraftTaskData;
    index: number;
};

const PreviewAudioTask: React.FC<propsTypes> = ({ taskData, index }) => {


    const { selectedLearningLanguage, draft } = useOwnStore((state) => state);

    const [audioSrc, setAudioSrc] = useState<null | string>(null);

    useEffect(() => {
        let isMounted = true;
        let objectUrl: string | null = null;

        const initAudio = async () => {
            if (taskData.content?.contentSource) {
                if (isMounted) setAudioSrc(taskData.content.contentSource as string);
            } else {
                const blob = await loadPersistedFile(draft.id, taskData.taskId, 'audio');
                if (blob && isMounted) {
                    objectUrl = URL.createObjectURL(blob);
                    setAudioSrc(objectUrl);
                }
            }
        };

        initAudio();

        return () => {
            isMounted = false;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [taskData.taskId, taskData.content?.contentSource]);


    const transcriptionText = (taskData.content as { transcription: JSON })
        ?.transcription;

    const { t } = useLanguageSync();

    const editor = useEditor({
        editable: false,
        content: transcriptionText,
        extensions: [
            StarterKit,
            TextWithTooltip,
        ],
        editorProps: {
            attributes: {
                class: styles.tiptap_content,
            },
        },
        immediatelyRender: false,
    })

    return (
        <div>
            <h2
                className="headlines-m"
                style={{ margin: "1.5rem 0", color: "var(--Blue-B500)" }}
            >
                {`${t("exercise")} ${index}`}
            </h2>

            <p style={{ margin: "0 0 1.25rem", color: "var(--Blue-B500)" }}>
                {taskData.taskDescriptions[selectedLearningLanguage]}
            </p>

            <div style={{ margin: "0 0 1.25rem" }}>
                {!audioSrc && (
                    <p style={{ margin: "0 0 1.25rem", color: "var(--Blue-B500)" }}>
                        Audio is not added
                    </p>
                )}
                {audioSrc && (
                    <audio controls className={styles.audio}>
                        <source src={audioSrc}></source>
                    </audio>
                )}
            </div>

            <h3
                className="headlines-s"
                style={{ margin: "0 0 1.25rem", color: "var(--Blue-B500)" }}
            >
                {`${t("transcription")}:`}
            </h3>

            <div className={styles.content}>
                <EditorContent editor={editor} />
            </div>

        </div>
    );
};

export default PreviewAudioTask;
