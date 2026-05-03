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
    taskId: string;
    draftId: string
}

const ExersiceContainer: React.FC<props> = ({ title, children, exerciseType, draftId, taskId }) => {

    const [isOpen, setIsOpen] = useState(true);
    const [descriptionText, setDescriptionText] = useState<string>('');
    const [editorContent, setEditorContent] = useState<any>(null);
    const [exerciseVal, setExerciseVal] = useState<string>('');
    const [exerciseFile, setExerciseFile] = useState<string>('');

    const draft = useOwnStore(state => state.draft)
    const { updateConstructorMetadata } = useOwnStore(state => state)

    useEffect(() => {
        const task = draft.tasks.find((t) => taskId === t.taskId);
        if (!task) return;

        setDescriptionText(task.taskDescriptions?.["English"] || "");

        if (task.taskType === "MEDIA_TASK" && task.content) {
            if (['VIDEO', 'AUDIO'].includes(task.content.contentType)) {
                setExerciseVal(task.content.contentSource as string || "");
                setEditorContent(task.content.transcription || null);
            } else {
                setExerciseVal("");
                setEditorContent(task.content.contentSource || null);
            }
        } else if (['TRUE_FALSE', 'CHOOSE_ANSWER'].includes(task.taskType)) {
            setExerciseVal("");
            setEditorContent(task.content?.transcription || null);
        }

    }, [taskId, draft.tasks]);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    }

    const handleSaveAll = () => {
        const task = draft.tasks.find((t) => taskId === t.taskId);
        if (!task) return;

        const isMediaTask = ['TEXT', 'FILL_TEMPLATE', 'CHOOSE_TEMPLATE', 'VIDEO', 'AUDIO'].includes(exerciseType);
        const isTextInTranscriptions = ['VIDEO', 'AUDIO'].includes(exerciseType);

        const taskType = isMediaTask ? "MEDIA_TASK" : exerciseType;

        const baseTask = {
            ...task,
            taskId: taskId,
            taskType: taskType as any,
            taskDescriptions: {
                English: descriptionText,
                German: "",
                Russian: ""
            },
        };

        let newTask;

        if (isMediaTask && isTextInTranscriptions) {
            newTask = {
                ...baseTask,
                content: {
                    contentType: exerciseType as any,
                    transcription: editorContent,
                    contentSource: exerciseVal,
                    contentFile: exerciseFile ? exerciseFile : null,
                },
            };
        } else if (isMediaTask && !isTextInTranscriptions) {
            newTask = {
                ...baseTask,
                content: {
                    contentType: exerciseType as any,
                    transcription: null,
                    contentSource: editorContent,
                    contentFile: null,
                },
            };
        } else {
            newTask = {
                ...baseTask,
                content: task.content ? { ...task.content, transcription: editorContent } : null,
            };
        }

        const updatedTasks = draft.tasks.map(t => t.taskId === taskId ? newTask : t);

        updateConstructorMetadata({
            tasks: updatedTasks
        });
    };

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
                onUpdate: (data: any) => setEditorContent(data),
                initialContent: editorContent,
                draftId: draftId,
                id: taskId,
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
                                <ButtonPrimary><span className='buttons-l' style={{ color: '#fff' }}>Save</span></ButtonPrimary>
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