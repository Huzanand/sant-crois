"use client"

import { Textarea } from "@/components/constructor/textarea/Textarea"
import styles from "./exersiceContainer.module.css"
import Divider from "@/components/divider/Divider"
import React, { useEffect, useState } from "react"
import { CollapseBtn } from "@/components/constructor/collapseBtn/CollapseBtn"
import { ButtonPrimary } from "@/components/common/buttons/ButtonPrimary"
import { FileIco } from "@/assets/svg/icons"
import { useOwnStore } from "@/store/storeProvider"

interface props {
    title: string,
    children: React.ReactNode,
    exerciseType: 'TEXT' | 'FILL_TEMPLATE' | 'CHOOSE_TEMPLATE' | 'VIDEO' | 'AUDIO' | 'TRUE_FALSE' | 'CHOOSE_ANSWER';
    id: string
}

const ExersiceContainer: React.FC<props> = ({ title, children, exerciseType, id }) => {

    const [isOpen, setIsOpen] = useState(true);
    const [descriptionText, setDescriptionText] = useState<string>('');
    const [editorContent, setEditorContent] = useState<any>(null);
    const [exerciseVal, setExerciseVal] = useState<string>('');
    const [exerciseFile, setExerciseFile] = useState<string>('');

    const draft = useOwnStore(state => state.draft)
    const { updateConstructorMetadata } = useOwnStore(state => state)

    useEffect(() => {
        const task = draft.tasks.find((t) => id === t.taskId);
        if (!task) return;

        setDescriptionText(task.taskDescriptions?.["English"] || "");

        if (task.taskType === "MEDIA_TASK" && task.content) {
            if (['VIDEO', 'AUDIO'].includes(task.content.contentType)) {
                setExerciseVal(task.content.contentSource || "");
                setEditorContent(task.content.transcription || null);
            } else {
                setEditorContent(task.content.transcription || null);
                setExerciseVal("");
            }
        }

        else if (['TRUE_FALSE', 'CHOOSE_ANSWER'].includes(task.taskType)) {
            setEditorContent(task.content?.transcription || null);
            setExerciseVal("");
        }

    }, [id, draft.tasks]);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    }

    const handleSaveAll = () => {
        const baseTask = {
            taskId: id,
            taskType: "MEDIA_TASK" as const,
            taskDescriptions: {
                English: descriptionText,
                German: "",
                Russian: ""
            },
            questions: null
        };

        let newTask;

        const isMediaTask = ['TEXT', 'FILL_TEMPLATE', 'CHOOSE_TEMPLATE', 'VIDEO', 'AUDIO'].includes(exerciseType);

        if (isMediaTask) {
            newTask = {
                ...baseTask,
                content: {
                    contentType: exerciseType as any,
                    transcription: editorContent,
                    contentSource: exerciseVal,
                    contentFile: exerciseFile ? exerciseFile : null,
                }
            };
        } else {
            newTask = {
                ...baseTask,
                content: null
            };
        }

        const existingTasks = [...draft.tasks];
        const taskIndex = existingTasks.findIndex(t => t.taskId === id);

        const updatedTasks = taskIndex > -1
            ? existingTasks.map((t, i) => i === taskIndex ? newTask : t)
            : [...existingTasks, newTask];

        updateConstructorMetadata({
            tasks: updatedTasks
        });

    };

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
                onUpdate: (data: any) => setEditorContent(data),
                initialContent: editorContent,
                id: id,
                value: exerciseVal,
                setValue: setExerciseVal,
                file: exerciseFile,
                setFile: setExerciseFile
            });
        }
        return child;
    });

    return (
        <>
            <div className={isOpen ? styles.wrapper : styles.wrapper_close}>
                <div className={isOpen ? styles.container : styles.container_close}>
                    <div className={styles.info}>
                        <p className='headlines-m b-500'>{title}</p>
                        <p className={`body-m ${styles.description}`}>Please fill out the following fields</p>
                    </div>

                    <div className={`${styles.input_container} flex-row flex-ac flex-jcend`}>
                        <div className={`${styles.saveIco}`} onClick={handleSaveAll}>
                            <FileIco />
                        </div>
                    </div>
                </div>

                <div className={styles.container}>
                    <div className={styles.info}>
                        <p className='headlines-m b-500'>Task</p>
                        <p className={`body-m ${styles.description}`}>Describe what the student <br /> should do</p>
                        <p className={`body-m ${styles.description} ${styles.addMargin}`}>You can provide special instructions for execution</p>
                    </div>
                    <Textarea value={descriptionText} setValue={setDescriptionText} />
                </div>

                <div className={`${styles.container} ${styles.children_container}`}>
                    {childrenWithProps}
                </div>

                <>
                    <div className={styles.container}>
                        <div className={styles.info} />

                        <div className={`${styles.input_container} flex-row flex-ac`}>
                            <div>
                                <CollapseBtn handleClick={handleOpen} open={isOpen} />
                            </div>
                            <div className={styles.buttonContainer} onClick={handleSaveAll}>
                                <ButtonPrimary><span className='buttons-l' style={{color: '#fff'}}>Save</span></ButtonPrimary>
                            </div>

                        </div>
                    </div>

                    <Divider margin="0rem 0 2rem" />
                </>
            </div>

            {
                !isOpen &&
                (
                    <>
                        <div className={styles.container}>
                            <div className={styles.info}>
                                <p className='headlines-m b-500'>{title}</p>
                                <p className={`body-m ${styles.description}`}>Please fill out the following fields</p>
                            </div>

                            <div className={`${styles.input_container} flex-row flex-ac`}>
                                <div>
                                    <CollapseBtn handleClick={handleOpen} open={isOpen} />
                                </div>
                                <div className={`${styles.buttonContainer} ${styles.saveIco}`}>
                                    <FileIco />
                                </div>
                            </div>

                        </div>
                        <Divider margin="2rem 0rem" />
                    </>
                )
            }
        </>
    )
}

export default ExersiceContainer