"use client"

import { TitledInput } from "@/components/constructor/titledInput/TitledInput";
import styles from "./lessonInfo.module.css";
import TagInput from "@/components/constructor/tagInput/TagInput";
import { LessonInfoContainer } from "../lessonInfoContainer/LessonInfoContainer";
import { UploadInputWithBtn } from "@/components/constructor/uploadInputWithBtn/UploadInputWithBtn";
import { ParametersDropdown } from "@/components/constructor/parametersDropdown/ParametersDropdown";
import { Textarea } from "@/components/constructor/textarea/Textarea";
import { CollapseBtn } from "@/components/constructor/collapseBtn/CollapseBtn";
import { useEffect, useState } from "react";
import { useOwnStore } from "@/store/storeProvider";
import { loadPersistedFile, persistFile } from "@/store/fileStorage";

const LessonInfo = () => {

    const draft = useOwnStore(state => state.draft)
    const { updateConstructorMetadata } = useOwnStore(state => state)

    const [isOpen, setIsOpen] = useState(true);
    const [localTopics, setLocalTopics] = useState(draft.primaryTopics.join(', '));

    const handleOpen = () => {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            const topicsArray = localTopics
                .split(',')
                .map(t => t.trim())
                .filter(Boolean);

            const validatedTopics = topicsArray.slice(0, 5);

            if (JSON.stringify(draft.primaryTopics) !== JSON.stringify(topicsArray)) {
                updateConstructorMetadata({ primaryTopics: validatedTopics });
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [localTopics, updateConstructorMetadata, draft.primaryTopics]);


    //Cover handlers
    const [isRehydrated, setIsRehydrated] = useState(false);

    /// 1. UPDATE
    useEffect(() => {
        const init = async () => {
            // if (draft.id && !draft.coverFile) {
            const savedFile = await loadPersistedFile(draft.id, 'cover');

            if (savedFile) {
                updateConstructorMetadata({ coverFile: savedFile });
            }
            // }
            setIsRehydrated(true);
        };
        init();
    }, [draft.id]);

    // 2. SAVE
    useEffect(() => {
        if (!isRehydrated || !draft.id) return;

        if (draft.coverFile instanceof File || draft.coverFile === null) {
            persistFile(draft.id, 'cover', draft.coverFile);
        }
    }, [draft.coverFile, draft.id, isRehydrated]);

    // End cover hadlers

    return (
        <div className={styles.wrapper}>
            <div className={isOpen ? styles.container : styles.container_close}>
                <LessonInfoContainer title="Fill all headers fields">
                    <></>
                </LessonInfoContainer>

                <LessonInfoContainer title="Author" description="Author's name of the lesson" required>
                    <TitledInput value={draft?.author} setValue={(value) => updateConstructorMetadata({ author: value })} />
                </LessonInfoContainer>
                <LessonInfoContainer title="Title" description="Please provide a title for your lesson" required>
                    <TitledInput value={draft.header} setValue={(value) => updateConstructorMetadata({ header: value })} />
                </LessonInfoContainer>
                <LessonInfoContainer title="Main topic" description="The main rule of the language being studied" required>
                    <TitledInput
                        value={localTopics}
                        setValue={setLocalTopics}
                    />
                    {draft.primaryTopics.length > 4 && <span className="body-s red-r600" style={{ marginTop: '-1.5rem' }}>Max 5 primary topics! More topics will not be saved!</span>}
                </LessonInfoContainer>

                <LessonInfoContainer title="Tags" description="These are short tags that will help quickly find the lesson">
                    <TagInput selectedTags={draft.tags} setSelectetTags={(newTagsList) => updateConstructorMetadata({ tags: newTagsList })} />
                </LessonInfoContainer>

                <LessonInfoContainer title="Cover" description="Maximum file size 512KB acceptable formats PNG, JPEG">
                    <div>
                        <UploadInputWithBtn
                            type="image"
                            url={draft.coverUrl === null ? '' : draft.coverUrl}
                            setUrl={(url) => updateConstructorMetadata({ coverUrl: url })}
                            file={draft.coverFile}
                            setFile={(file) => updateConstructorMetadata({ coverFile: file })}
                        />
                    </div>
                </LessonInfoContainer>

                <LessonInfoContainer title="Exercise parameters" description="Help to navigate more easily when choosing a lesson" required>
                    <ParametersDropdown
                        label='Difficulty level'
                        parameters={['A1', 'A2', 'B1', 'B2', 'C1', 'C2']}
                        value={draft.languageLevel}
                        setValue={(value) => updateConstructorMetadata({ languageLevel: value })}
                    />
                    <ParametersDropdown
                        label='Language being studied'
                        parameters={["Ukrainian", "English", "French", "German"]}
                        value={draft.learningLanguage}
                        setValue={(value) => updateConstructorMetadata({ learningLanguage: value })}
                    />
                    <ParametersDropdown
                        label='Age group'
                        parameters={['ADULT', 'KIDS']}
                        value={draft.targetAgeGroup}
                        setValue={(value) => updateConstructorMetadata({ targetAgeGroup: value })}
                    />
                </LessonInfoContainer>

                <LessonInfoContainer title="Exercise description" description="Briefly describe what this lesson will be about">
                    <Textarea value={draft.exerciseDescriptions} setValue={(value) => updateConstructorMetadata({ exerciseDescriptions: value })} />
                </LessonInfoContainer>

                <CollapseBtn handleClick={handleOpen} open={isOpen} />
            </div>

            {!isOpen && (
                <LessonInfoContainer title="Lesson info">
                    <CollapseBtn handleClick={handleOpen} open={isOpen} />
                </LessonInfoContainer>
            )}
        </div>
    )
}

export default LessonInfo;