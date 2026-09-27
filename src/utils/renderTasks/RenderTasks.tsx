"use client";

import ChooseTask from "@/components/tasks/choose/ChooseTask";
import FillTextTask from "@/components/tasks/fillText/FillTextTask";
import MediaTask from "@/components/tasks/media/MediaTask";
import TextTask from "@/components/tasks/text/TextTask";
import TrueFalseTask from "@/components/tasks/trueFalse/TrueFalse";
import WriteTask from "@/components/tasks/write/WriteTask";
import { ITaskData } from "@/models";

interface RenderTaskProps {
  tasks: ITaskData[];
  readonly?: boolean;
}

const RenderTask = ({
  task,
  index,
  readonly,
}: {
  task: ITaskData;
  index: number;
  readonly?: boolean;
}) => {
  switch (task.taskType) {
    case "MEDIA_TASK":
      switch (task.content?.contentType) {
        case "TEXT":
          return (
            <TextTask
              content={
                (
                  task.content as {
                    contentSource: string;
                  }
                ).contentSource
              }
              index={index + 1}
            />
          );

        case "VIDEO":
        case "AUDIO":
          return <MediaTask taskData={task} index={index + 1} />;

        case "FILL_TEMPLATE":
          return (
            <WriteTask taskData={task} index={index + 1} readonly={readonly} />
          );

        case "CHOOSE_TEMPLATE":
          return (
            <FillTextTask
              taskData={task}
              index={index + 1}
              readonly={readonly}
            />
          );

        default:
          return null;
      }

    case "TRUE_FALSE":
      return (
        <TrueFalseTask taskData={task} index={index + 1} readonly={readonly} />
      );

    case "CHOOSE_ANSWER":
      return (
        <ChooseTask taskData={task} index={index + 1} readonly={readonly} />
      );

    default:
      return null;
  }
};

export const RenderTasks: React.FC<RenderTaskProps> = ({ tasks, readonly }) => {
  return (
    <div>
      {tasks.map((task, index) => (
        <div key={task.taskId}>
          <RenderTask task={task} index={index} readonly={readonly} />

          <div
            className="divider"
            style={{
              width: "100%",
              height: "2px",
              borderRadius: "1px",
              background: "var(--Purple-P50)",
              margin: "1.5rem 0",
            }}
          />
        </div>
      ))}
    </div>
  );
};
