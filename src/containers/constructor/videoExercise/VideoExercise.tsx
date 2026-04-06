"use client"

import styles from './videoExercise.module.css';
import { UploadInputWithBtn } from '../../../components/constructor/uploadInputWithBtn/UploadInputWithBtn';
import TiptapEditor from '@/components/common/editor/TiptapEditor';

const VideoExercise = ({ onUpdate, value = '', setValue, initialContent }: {
    onUpdate?: (data: any) => void,
    initialContent?: any,
    value?: string,
    setValue?: (val: string) => void
}) => {

    return (
        <>
            <div className={styles.container}>
                <div className={styles.info}>
                    <p className='headlines-m b-500'>Link to video</p>
                    <p className={`body-m ${styles.description}`}>Paste link to your YouTube video</p>
                </div>

                <div className={styles.input_container}>
                    <UploadInputWithBtn
                        type="video"
                        url={value}
                        setUrl={val => setValue?.(val)}
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

export default VideoExercise