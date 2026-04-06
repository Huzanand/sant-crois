"use client"

import styles from './readingExercise.module.css';
import TiptapEditor from '@/components/common/editor/TiptapEditor';

const ReadingExercise = ({ onUpdate, initialContent }: { onUpdate?: (json: any) => void, initialContent?: any }) => {

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <p className='headlines-m b-500'>Text or sentence for the assignment</p>
                <p className={`body-m ${styles.description}`}>Add text for work.</p>
                <p className={`body-m ${styles.description} ${styles.addMargin}`}>You can highlight words that need clarification. Idioms, phrases, slang, etc.</p>
            </div>

            <div className={styles.input_container}>
                <div className={styles.input_container__inner}>
                    <TiptapEditor editorMode='TEXT' initialContent={initialContent} onUpdate={(html: string, json: any) => onUpdate?.(json)} />
                </div>
            </div>
        </div>
    )
}

export default ReadingExercise