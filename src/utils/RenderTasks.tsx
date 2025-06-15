"use client";

import ChooseTask from "@/components/tasks/choose/ChooseTask";
import FillTextTask from "@/components/tasks/fillText/FillTextTask";
import MediaTask from "@/components/tasks/media/MediaTask";
import TextTask from "@/components/tasks/text/TextTask";
import TrueFalseTask from "@/components/tasks/trueFalse/TrueFalse";
import WriteTask from "@/components/tasks/write/WriteTask";
import { ITaskData } from "@/models";

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
    tasks: ITaskData[];
}

export const RenderTasks: React.FC<renderTaskProps> = ({ tasks }) => {
    if (tasks) {
        const resultArr = [] as React.ReactNode[];
        tasks.forEach((task, index) => {
            switch (task.taskType) {
                case "MEDIA_TASK":
                    switch (task.content?.contentType) {
                        case "TEXT":
                            resultArr.push(
                                <TextTask
                                    key={index + task.taskId}
                                    content={
                                        (
                                            tasks[index].content as {
                                                contentSource: string;
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
                                <MediaTask
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
                                <MediaTask
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
                                <WriteTask
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
                        case "CHOOSE_TEMPLATE":
                            resultArr.push(
                                <FillTextTask
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

                        default:
                            break;
                    }
                    break;

                case "TRUE_FALSE":
                    resultArr.push(
                        <TrueFalseTask
                            key={index + task.taskId}
                            taskData={tasks[index]}
                            index={index + 1}
                        />
                    );
                    resultArr.push(<div className="divider" key={index} />);
                    break;

                case "CHOOSE_ANSWER":
                    resultArr.push(
                        <ChooseTask
                            key={index + task.taskId}
                            taskData={tasks[index]}
                            index={index + 1}
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
