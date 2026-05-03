"use client"

import styles from "./previewVideoTask.module.css";
import { IDraftTaskData } from "@/models";
import { useOwnStore } from "@/store/storeProvider";
import { useLanguageSync } from "@/utils/useLanguage";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextWithTooltip } from "@/components/common/editor/extensions/TextWithTooltip";

type propsTypes = {
    taskData: IDraftTaskData;
    index: number;
};

const PreviewVideoTask: React.FC<propsTypes> = ({ taskData, index }) => {

    const { selectedLearningLanguage } = useOwnStore((state) => state);

    const mediaSrc = (taskData.content as { contentSource: string })
        ?.contentSource;

    const transcriptionText = (taskData.content as { transcription: JSON })
        ?.transcription;

    const { t } = useLanguageSync();

    function getYouTubeEmbedUrl(url: string) {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        const id = match && match[2].length === 11 ? match[2] : null;
        return `https://www.youtube.com/embed/${id}?controls=1`;
    }

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
                <div>
                    <iframe
                        className={styles.video}
                        src={getYouTubeEmbedUrl(mediaSrc)}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* {(taskData.content as { contentType: "AUDIO" | "VIDEO" })
                    .contentType === "AUDIO" && (
                    <audio
                        src={mediaSrc}
                        controls
                        className={styles.audio}
                    ></audio>
                )} */}
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

export default PreviewVideoTask;
