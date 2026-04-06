"use client"

import styles from "./taskOption.module.css"
import { DndIco, TrashCanIco } from "@/assets/svg/icons"
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface taskProps {
    number: number,
    id: string
    title: string,
    onDelete: (val: string) => void
}

const TaskOption: React.FC<taskProps> = ({ number, id, title, onDelete }) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,

        padding: '0.25rem',
        margin: '0.5rem 0',
        fontSize: '16px',
        fontWeight: '200',
        lineHeight: "140 %",
        color: '#231e49'
    };

    return (
        <div
            className={styles.container}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <div className={styles.content}>
                <span className="body-m">{`№${number}`}</span>
                <span className="body-m">{title}</span>
            </div>

            <div className={styles.ico_container}>
                <button
                    className={`${styles.ico} ${styles.trashIco}`}
                    onPointerDown={(e) => e.stopPropagation()} // Stop drag from taking over
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                >
                    <TrashCanIco />
                </button>

                <div className={styles.ico}>
                    <DndIco />
                </div>
            </div>
        </div>
    )
}

export default TaskOption