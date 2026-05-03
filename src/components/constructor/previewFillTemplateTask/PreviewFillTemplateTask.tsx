"use client";

import { FillInBlank } from "@/components/common/editor/extensions/FillInBlank";
import styles from "./previewFillTemplateTask.module.css";
import { IDraftTaskData } from "@/models";
import { useLanguageSync } from "@/utils/useLanguage";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useOwnStore } from "@/store/storeProvider";

type propsTypes = {
    taskData: IDraftTaskData;
    index: number;
    readonly?: boolean;
};

const PreviewFillTemplateTask: React.FC<propsTypes> = ({ taskData, index, readonly }) => {
    const { t } = useLanguageSync();
    const { selectedInterfaceLanguage } = useOwnStore((state) => state);

    const content = (taskData.content as { contentSource: JSON })
        ?.contentSource;

    const editor = useEditor({
        editable: false,
        content: content,
        extensions: [
            StarterKit,
            FillInBlank,
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
            <h2 className="headlines-m" style={{ margin: "1.5rem 0" }}>
                {`${t("exercise")} ${index}`}
            </h2>

            <p style={{ margin: "0 0 1.25rem", color: "var(--Blue-B500)" }}>
                {taskData.taskDescriptions[selectedInterfaceLanguage]}
            </p>

            <div className={styles.content}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default PreviewFillTemplateTask;
