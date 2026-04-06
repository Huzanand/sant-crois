"use client"

import { Textarea } from "../textarea/Textarea"
import styles from "./trueFalseQuestion.module.css"
import { OptionNavBlock } from "../optionNavBlock/OptionNavBlock"
import { IDraftQuestion } from "@/models"
import CustomRadioBtn from "@/components/common/customRadioBtn/CustomRadioBtn"

interface TrueFalseQuestionProps {
    question: IDraftQuestion,
    index: number,
    onUpdate: (questionId: string, patch: Partial<IDraftQuestion>) => void,
    onDelete: (questionId: string) => void,
    onMoveUp: (questionId: string) => void,
    onMoveDown: (questionId: string) => void
}

const TrueFalseQuestion = ({ question, index, onUpdate, onDelete: onQuestionDelete, onMoveUp, onMoveDown }: TrueFalseQuestionProps) => {

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.info}>
                    <p className='headlines-m b-500'>{`Question ${index + 1}`}</p>
                    <p className={`body-m ${styles.description}`}>Create a question or statement that will have one of the suggested answers below.</p>
                    <p className={`body-m ${styles.description} ${styles.addMargin}`}>There is only one correct option.</p>
                </div>

                <div className={styles.input_container}>
                    <Textarea value={question.questionText || ''} setValue={(value) => onUpdate(question.questionId, { questionText: value })} />
                    <div className={styles.controlBar}>
                        <CustomRadioBtn
                            id={`${question.questionId}-true`}
                            name={question.questionId}
                            label='True'
                            value={'true'}
                            isChecked={'true' === (question.rightAnswers?.[0] || '')}
                            handleChange={() => onUpdate(question.questionId, { rightAnswers: ['true'] })}
                            disabled={false}
                        />
                        <CustomRadioBtn
                            id={`${question.questionId}-false`}
                            name={question.questionId}
                            label='False'
                            value={'false'}
                            isChecked={'false' === (question.rightAnswers?.[0] || '')}
                            handleChange={() => onUpdate(question.questionId, { rightAnswers: ['false'] })}
                            disabled={false}
                        />
                        <CustomRadioBtn
                            id={`${question.questionId}-not`}
                            name={question.questionId}
                            label='Not Specified'
                            value={'not specified'}
                            isChecked={'not specified' === (question.rightAnswers?.[0] || '')}
                            handleChange={() => onUpdate(question.questionId, { rightAnswers: ['not specified'] })}
                            disabled={false}
                        />
                        <OptionNavBlock
                            id={question.questionId}
                            handleDelete={target => onQuestionDelete(target)}
                            handleUp={target => onMoveUp(target)}
                            handleDown={target => onMoveDown(target)}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.info}>
                    <p className='headlines-m b-500'>Correct answer explanation</p>
                    <p className={`body-m ${styles.description}`}>Optional</p>
                </div>

                <div className={styles.input_container}>
                    <Textarea value={question.questionDescription || ''} setValue={(value) => onUpdate(question.questionId, { questionDescription: value })} />
                </div>
            </div>
        </div >
    )
}

export default TrueFalseQuestion