import TextTask from "@/components/tasks/text/TextTask";
import styles from "./mediaTask.module.css";
import { ITaskData } from "@/models";
import { useOwnStore } from "@/store/storeProvider";
import { useLanguageSync } from "@/utils/useLanguage";

type propsTypes = {
    taskData: ITaskData;
    index: number;
};

const MediaTask: React.FC<propsTypes> = ({ taskData, index }) => {
    const { selectedLearningLanguage } = useOwnStore((state) => state);
    const mediaSrc = (taskData.content as { contentSource: string })
        ?.contentSource;
    const transcriptionText = (taskData.content as { transcription: string })
        ?.transcription;

    const { t } = useLanguageSync();

    function getYouTubeEmbedUrl(url: string) {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        const id = match && match[2].length === 11 ? match[2] : null;
        return `https://www.youtube.com/embed/${id}?controls=1`;
    }

    return (
        <div>
            <h2
                className="headlines-m"
                style={{ margin: "1.5rem 0", color: "var(--Blue-B500)" }}
            >
                {`${t("exersice")} ${index}`}
            </h2>

            <p style={{ margin: "0 0 1.25rem", color: "var(--Blue-B500)" }}>
                {taskData.taskDescriptions[selectedLearningLanguage]}
            </p>

            <div style={{ margin: "0 0 1.25rem" }}>
                <div>
                    {(taskData.content as { contentType: "AUDIO" | "VIDEO" })
                        .contentType === "VIDEO" && (
                        <iframe
                            className={styles.video}
                            src={getYouTubeEmbedUrl(
                                taskData.content!.contentSource
                            )}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        ></iframe>
                    )}
                </div>

                {(taskData.content as { contentType: "AUDIO" | "VIDEO" })
                    .contentType === "AUDIO" && (
                    <audio
                        src={mediaSrc}
                        controls
                        className={styles.audio}
                    ></audio>
                )}
            </div>

            <h3
                className="headlines-s"
                style={{ margin: "0 0 1.25rem", color: "var(--Blue-B500)" }}
            >
                {`${t("transcription")}:`}
            </h3>

            <TextTask content={transcriptionText} isTranscription />
        </div>
    );
};

export default MediaTask;
