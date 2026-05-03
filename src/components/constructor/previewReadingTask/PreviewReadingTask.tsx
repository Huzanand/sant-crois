"use client"
import { EditorContent, useEditor } from "@tiptap/react";
import styles from "./previewReadingTask.module.css"
import { useLanguageSync } from "@/utils/useLanguage";
import StarterKit from "@tiptap/starter-kit";
import { TextWithTooltip } from "@/components/common/editor/extensions/TextWithTooltip";

const PreviewReadingTask: React.FC<{
    content: JSON;
    isTranscription?: boolean;
    index?: number;
}> = ({ content, index }) => {

    const { t } = useLanguageSync();

    const editor = useEditor({
        editable: false,
        content: content,
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
        <div className={styles.wrapper}>
            <h2 className="headlines-m" style={{ margin: "1.5rem 0" }}>
                {`${t("exercise")} ${index}`}
            </h2>

            <div className={styles.content}>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
};

export default PreviewReadingTask;
