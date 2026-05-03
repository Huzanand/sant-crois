import Divider from "@/components/divider/Divider"
import ExersiceContainer from "../exersiceContainer/ExersiceContainer"
import LessonInfo from "../lessonInfo/LessonInfo"
import styles from "./constructorContent.module.css"
import VideoExercise from "@/containers/constructor/videoExercise/VideoExercise"
import AudioExercise from "../audioExercise/AudioExercise"
import ReadingExercise from "../readingExercise/ReadingExercise"
import FillInBlankExercise from "../fillInBlancExercise/FillInBlankExercise"
import MultipleChoiceExercise from "../multipleChoiceExercise/MultipleChoiceExercise"
import ChoiceExercise from "../choiceExercise/ChoiceExercise"
import { useOwnStore } from "@/store/storeProvider"
import { useEffect } from "react"
import { cleanOrphanedFiles } from "@/store/fileStorage"
import { IDraftTaskData } from "@/models"

const ConstructorContent = () => {
    const draft = useOwnStore(state => state.draft)

    useEffect(() => {
        if (draft.id) {
            cleanOrphanedFiles(draft.id);
        }
    }, []);


    const renderTasks = (tasks: IDraftTaskData[]) => {
        if (!tasks) return null;

        return (
            <div>
                {tasks.map((task) => {
                    switch (task.taskType) {
                        case "MEDIA_TASK":
                            switch (task.content?.contentType) {
                                case "TEXT":
                                    return (
                                        <ExersiceContainer title="Reading type" exerciseType="TEXT" draftId={draft.id} taskId={task.taskId} key={task.taskId}>
                                            <ReadingExercise />
                                        </ExersiceContainer>
                                    );
                                case "VIDEO":
                                    return (
                                        <ExersiceContainer title="Video Exercise" exerciseType='VIDEO' draftId={draft.id} taskId={task.taskId} key={task.taskId}>
                                            <VideoExercise />
                                        </ExersiceContainer>
                                    );
                                case "AUDIO":
                                    return (
                                        <ExersiceContainer title="Audio Exercise" exerciseType="AUDIO" draftId={draft.id} taskId={task.taskId} key={task.taskId}>
                                            <AudioExercise draftId={draft.id} taskId={task.taskId} />
                                        </ExersiceContainer>
                                    );
                                case "FILL_TEMPLATE":
                                    return (
                                        <ExersiceContainer title="Fill in blancs" exerciseType="FILL_TEMPLATE" draftId={draft.id} taskId={task.taskId} key={task.taskId}>
                                            <FillInBlankExercise />
                                        </ExersiceContainer>
                                    );
                                case "CHOOSE_TEMPLATE":
                                    return (
                                        <ExersiceContainer title="Select from options" exerciseType="CHOOSE_TEMPLATE" draftId={draft.id} taskId={task.taskId} key={task.taskId}>
                                            <MultipleChoiceExercise />
                                        </ExersiceContainer>
                                    );
                                default:
                                    return null;
                            }

                        case "CHOOSE_ANSWER":
                            return (
                                <ExersiceContainer title="Multiple Choice" exerciseType="CHOOSE_ANSWER" draftId={draft.id} taskId={task.taskId} key={task.taskId}>
                                    <ChoiceExercise type="CHOOSE_ANSWER" taskId={task.taskId} />
                                </ExersiceContainer>
                            );
                        case "TRUE_FALSE":
                            return (
                                <ExersiceContainer title="True/False Questions" exerciseType='TRUE_FALSE' draftId={draft.id} taskId={task.taskId} key={task.taskId}>
                                    <ChoiceExercise type='TRUE_FALSE' taskId={task.taskId} />
                                </ExersiceContainer>
                            );
                        default:
                            return null;
                    }
                })}
            </div>
        );
    };

    return (
        <div>
            <LessonInfo />

            <Divider margin="2rem 0" />

            {renderTasks(draft.tasks)}
        </div>
    )
}

export default ConstructorContent