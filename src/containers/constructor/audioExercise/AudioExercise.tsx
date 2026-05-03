"use client"

import styles from './audioExercise.module.css';
import { useEffect, useState } from 'react';
import { UploadInputWithBtn } from '../../../components/constructor/uploadInputWithBtn/UploadInputWithBtn';
import TiptapEditor from '@/components/common/editor/TiptapEditor';
import { loadPersistedFile, persistFile } from '@/store/fileStorage';


const AudioExercise = ({ onUpdate, value = '', setValue, initialContent, taskId, draftId, file, setFile }: {
    onUpdate?: (data: any) => void,
    initialContent?: any,
    value?: string,
    setValue?: (val: string) => void,
    taskId: string,
    draftId: string,
    file?: File,
    setFile?: (file: File| Blob) => void
}) => {

    const [isRehydrated, setIsRehydrated] = useState(false);

    /// 1. UPDATE
    useEffect(() => {
        const init = async () => {
            const savedFile = await loadPersistedFile(draftId, taskId, 'audio');

            if (setFile && savedFile) {
                setFile(savedFile);
            }
            setIsRehydrated(true);
        };
        init();
    }, [taskId]);

    // 2. SAVE
    useEffect(() => {
        if (!isRehydrated || !taskId) return;

        if (file instanceof File || file === null) {
            persistFile(draftId, taskId, 'audio', file);
        }
    }, [file, taskId, isRehydrated]);

    // End audio hadlers

    return (
        <>
            <div className={styles.container}>
                <div className={styles.info}>
                    <p className='headlines-m b-500'>Audio file for listening</p>
                    <p className={`body-m ${styles.description}`}>Upload a file or add a link to it.</p>
                    <p className={`body-m ${styles.description} ${styles.addMargin}`}>Supported formats: MP3, WAV, OGG. Maximum file size 5MB</p>
                </div>

                <div className={styles.input_container}>
                    <UploadInputWithBtn
                        type="audio"
                        url={value}
                        setUrl={val => setValue?.(val)}
                        file={file}
                        setFile={(file) => setFile && setFile(file as File)}
                    />
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.info}>
                    <p className='headlines-m b-500'>Transcription</p>
                    <p className={`body-m ${styles.description}`}>Please add transcription if possible</p>
                </div>

                <div className={styles.input_container}>
                    <div className={styles.input_container__inner}>
                        <TiptapEditor editorMode='TEXT' initialContent={initialContent} onUpdate={(html: string, json: any) => onUpdate?.(json)} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AudioExercise