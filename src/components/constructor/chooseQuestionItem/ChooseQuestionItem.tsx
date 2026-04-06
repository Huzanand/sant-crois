"use client"

import styles from './chooseQuestionItem.module.css'
import { Textarea } from '../textarea/Textarea'
import OptionItem from '../optionItem/OptionItem'

interface ChooseQuestionItemProps {
    optionId: string;
    name: string;
    selectedAnswer: string;
    setSelectedAnswer: (value: string) => void;
    questionText: string,
    setQuestionText: (value: string) => void,
    handleMoveUp: () => void
    handleMoveDown: () => void
    onDelete: () => void
}

const ChooseQuestionItem = ({ optionId, name, selectedAnswer, setSelectedAnswer, questionText, setQuestionText, handleMoveUp, handleMoveDown, onDelete }: ChooseQuestionItemProps) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.info}>
                    <p className='headlines-m b-500'>{`Answer ${+optionId + 1}`}</p>
                    <p className={`body-m ${styles.description}`}>
                        Only one answer option can be marked as "true"
                    </p>
                </div>

                <div className={styles.input_container}>
                    <Textarea value={questionText} setValue={value => setQuestionText(value)} />
                </div>
            </div>

            <div className={styles.navBlock}>
                <OptionItem
                    optionId={optionId}
                    name={name}
                    value={questionText}
                    checked={selectedAnswer === questionText}
                    setSelectedAnswer={(value) => setSelectedAnswer(value)}
                    handleMoveUp={handleMoveUp}
                    handleMoveDown={handleMoveDown}
                    handleDelete={onDelete}
                />
            </div>
        </div>
    )
}

export default ChooseQuestionItem