"use client"

import { ArrowDownIco } from "@/assets/svg/icons";
import styles from "./newExerciseDropdown.module.css"
import { useState } from "react";
import { useOwnStore } from "@/store/storeProvider";
import { ITaskData } from "@/models";

const NewExerciseDropdown = () => {

    const draft = useOwnStore(state => state.draft)
    const { updateConstructorMetadata } = useOwnStore(state => state)

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open)
    }

    const handleCreate = (exerciseType: string) => {
        const newTaskId = crypto.randomUUID();

        const isMediaTask = ['TEXT', 'VIDEO', 'AUDIO', 'FILL_TEMPLATE', 'CHOOSE_TEMPLATE'].includes(exerciseType);

        const newTask = {
            taskId: newTaskId,
            taskType: isMediaTask ? "MEDIA_TASK" : (exerciseType === 'TRUE_FALSE' ? 'TRUE_FALSE' : 'CHOOSE_ANSWER'),
            taskDescriptions: {
                English: "",
                German: "",
                Russian: ""
            },
            content: isMediaTask ? {
                contentType: exerciseType as any,
                transcription: null,
                contentSource: ""
            } : null,
            questions: !isMediaTask ? [] : null
        };

        updateConstructorMetadata({
            tasks: [...draft.tasks, newTask as ITaskData]
        });

        handleOpen()
    };


    return (
        <div className={styles.dropdown_container}>
            <div className={styles.dropdown}>

                <button className={styles.dropdown_btn} onClick={handleOpen}>
                    <span className={`buttons-l ${styles.dropdown_btn__title}`}>Add a new task</span>
                    <span className={open ? styles.arrow_active : styles.arrow_default}><ArrowDownIco fill="#fff" /></span>
                </button>

                <ul className={open ? `${styles.open} ${styles.dropdown_list}` : styles.dropdown_list}>
                    <li onClick={() => handleCreate('TEXT')}>
                        <button className={styles.dropdown_listItem__btn}>+ Reading exercise</button>
                    </li>

                    <li onClick={() => handleCreate('VIDEO')}>
                        <button className={styles.dropdown_listItem__btn}>+ Video exercise</button>
                    </li>

                    <li onClick={() => handleCreate('AUDIO')}>
                        <button className={styles.dropdown_listItem__btn}>+ Audio exercise</button>
                    </li>

                    <li onClick={() => handleCreate('FILL_TEMPLATE')}>
                        <button className={styles.dropdown_listItem__btn}>+ Fill-in-the-blank Text</button>
                    </li>

                    <li onClick={() => handleCreate('CHOOSE_TEMPLATE')}>
                        <button className={styles.dropdown_listItem__btn}>+ Choose-from-list Text</button>
                    </li>

                    <li onClick={() => handleCreate('TRUE_FALSE')}>
                        <button className={styles.dropdown_listItem__btn}>+ True/False Questions</button>
                    </li>

                    <li onClick={() => handleCreate('CHOOSE_ANSWER')}>
                        <button className={styles.dropdown_listItem__btn}>+ Select answer from options</button>
                    </li>
                </ul>
            </div>
        </div >
    )
}

export default NewExerciseDropdown;
