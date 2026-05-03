"use client";

import PreviewAudioTask from "@/components/constructor/previewAudioTask/PreviewAudioTask";
import PreviewChooseTeplateTask from "@/components/constructor/previewChooseTeplateTask/PreviewChooseTeplateTask";
import PreviewFillTemplateTask from "@/components/constructor/previewFillTemplateTask/PreviewFillTemplateTask";
import PreviewReadingTask from "@/components/constructor/previewReadingTask/PreviewReadingTask";
import PreviewVideoTask from "@/components/constructor/previewVideoTask/PreviewVideoTask";
import ChooseTask from "@/components/tasks/choose/ChooseTask";
import TrueFalseTask from "@/components/tasks/trueFalse/TrueFalse";

import { IDraftTaskData, ITaskData } from "@/models";

<style jsx>{`
    .divider {
        width: 100%;
        height: 2px;
        border-radius: 1px;
        background: var(--Purple-P50);
        margin: 1.5rem 0;
    }
`}</style>;

interface renderTaskProps {
    tasks: IDraftTaskData[];
    readonly?: boolean;
}

export const RenderTasks: React.FC<renderTaskProps> = ({ tasks, readonly }) => {
    if (tasks) {
        const resultArr = [] as React.ReactNode[];

        tasks.forEach((task, index) => {
            switch (task.taskType) {
                case "MEDIA_TASK":
                    switch (task.content?.contentType) {
                        case "TEXT":
                            resultArr.push(
                                <PreviewReadingTask
                                    key={index + task.taskId}
                                    content={
                                        (
                                            tasks[index].content as {
                                                contentSource: JSON;
                                            }
                                        ).contentSource
                                    }
                                    index={index + 1}
                                />
                            );
                            resultArr.push(
                                <div
                                    className="divider"
                                    key={"divider-" + index + 1}
                                />
                            );
                            break;
                        case "VIDEO":
                            resultArr.push(
                                <PreviewVideoTask
                                    key={index + task.taskId}
                                    taskData={tasks[index]}
                                    index={index + 1}
                                />
                            );
                            resultArr.push(
                                <div
                                    className="divider"
                                    key={"divider-" + index}
                                />
                            );
                            break;
                        case "AUDIO":
                            resultArr.push(
                                <PreviewAudioTask
                                    key={index + task.taskId}
                                    taskData={tasks[index]}
                                    index={index + 1}
                                />
                            );
                            resultArr.push(
                                <div
                                    className="divider"
                                    key={"divider-" + index}
                                />
                            );
                            break;
                        case "FILL_TEMPLATE":
                            resultArr.push(
                                <PreviewFillTemplateTask
                                    key={index + task.taskId}
                                    taskData={tasks[index]}
                                    index={index + 1}
                                    readonly={readonly}
                                />
                            );
                            resultArr.push(
                                <div
                                    className="divider"
                                    key={"divider-" + index}
                                />
                            );
                            break;
                        case "CHOOSE_TEMPLATE":
                            resultArr.push(
                                <PreviewChooseTeplateTask
                                    key={index + task.taskId}
                                    taskData={tasks[index]}
                                    index={index + 1}
                                    readonly={readonly}
                                />
                            );
                            resultArr.push(
                                <div
                                    className="divider"
                                    key={"divider-" + index}
                                />
                            );
                            break;

                        default:
                            break;
                    }
                    break;

                case "TRUE_FALSE":
                    resultArr.push(
                        <TrueFalseTask
                            key={index + task.taskId}
                            taskData={tasks[index] as ITaskData}
                            index={index + 1}
                            isDraftPreview = {true}
                            readonly={readonly}

                        />
                    );
                    resultArr.push(<div className="divider" key={index} />);
                    break;

                case "CHOOSE_ANSWER":
                    resultArr.push(
                        <ChooseTask
                            key={index + task.taskId}
                            taskData={tasks[index] as ITaskData}
                            index={index + 1}
                            readonly={readonly}
                        />
                    );
                    resultArr.push(<div className="divider" key={index} />);
                    break;

                default:
                    break;
            }
        });

        return <div>{resultArr}</div>;
    } else return undefined;
};
