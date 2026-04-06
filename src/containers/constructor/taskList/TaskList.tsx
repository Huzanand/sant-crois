"use client"

import styles from "./taskList.module.css"
import TaskOption from "@/components/constructor/taskOption/TaskOption"
import { useOwnStore } from "@/store/storeProvider"
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const EXERCISE_NAMES: Record<string, string> = {
    'TEXT': 'Reading Exercise',
    'VIDEO': 'Video Exercise',
    'AUDIO': 'Listening Exercise',
    'FILL_TEMPLATE': 'Fill-in-the-blank',
    'CHOOSE_TEMPLATE': 'Choose-from-list',
    'TRUE_FALSE': 'True/False Questions',
    'CHOOSE_ANSWER': 'Multiple Choice'
};

const TaskList = () => {

    const draft = useOwnStore(state => state.draft)
    const { updateConstructorMetadata } = useOwnStore(state => state)

    const getExerciseLabel = (type: string): string => {
        return EXERCISE_NAMES[type] || 'New Exercise';
    };

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = draft.tasks.findIndex(t => t.taskId === active.id);
            const newIndex = draft.tasks.findIndex(t => t.taskId === over.id);

            const newOrder = arrayMove(draft.tasks, oldIndex, newIndex);
            updateConstructorMetadata({ tasks: newOrder });
        }
    }

    return (
        <div style={{overflow: 'hidden'}}>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
                <SortableContext
                    items={draft.tasks.map(t => t.taskId)}
                    strategy={verticalListSortingStrategy}
                >
                    {draft.tasks.map((t, i) => {
                        const displayType = t.content?.contentType || t.taskType;

                        return (
                            <TaskOption
                                key={t.taskId}
                                number={i + 1}
                                id={t.taskId}
                                title={getExerciseLabel(displayType)}
                                onDelete={() => {
                                    const updatedTasks = draft.tasks.filter(task => task.taskId !== t.taskId);
                                    updateConstructorMetadata({ tasks: updatedTasks });
                                }}
                            />
                        );
                    })}
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default TaskList