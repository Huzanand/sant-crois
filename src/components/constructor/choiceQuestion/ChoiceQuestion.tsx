"use client"

import { Textarea } from "../textarea/Textarea"
import styles from "./choiceQuestion.module.css"
import ChooseQuestionItem from "../chooseQuestionItem/ChooseQuestionItem"
import { OptionNavBlock } from "../optionNavBlock/OptionNavBlock"
import { ButtonText } from "@/components/common/buttons/ButtonText"
import { AddBtnIco } from "@/assets/svg/icons"
import { IDraftQuestion } from "@/models"

interface ChoiceQuestionProps {
    question: IDraftQuestion,
    index: number,
    onUpdate: (questionId: string, patch: Partial<IDraftQuestion>) => void,
    onDelete: (questionId: string) => void,
    onMoveUp: (questionId: string) => void,
    onMoveDown: (questionId: string) => void,
}

const ChoiceQuestion = ({ question, index, onUpdate, onDelete: onQuestionDelete, onMoveUp, onMoveDown }: ChoiceQuestionProps) => {

    const handleOptionMoveUp = (index: number) => {
        if (index <= 0 || !question.options) return;

        const newOptions = [...question.options];
        [newOptions[index - 1], newOptions[index]] = [newOptions[index], newOptions[index - 1]];
        onUpdate(question.questionId, { options: newOptions });
    };

    const handleOptionMoveDown = (index: number) => {
        if (!question.options || index >= question.options.length - 1) return;

        const newOptions = [...question.options];
        [newOptions[index], newOptions[index + 1]] = [newOptions[index + 1], newOptions[index]];
        onUpdate(question.questionId, { options: newOptions });
    };

    const handleNewQuestionOption = () => {
        const currentOptions = question.options || [];

        if (currentOptions.length >= 5) return;

        onUpdate(question.questionId, {
            options: [...currentOptions, '']
        });
    };

    const handleOptionDelete = (indexToDelete: number) => {
        const optionValueToDelete = question.options?.[indexToDelete];
        const filteredOptions = question.options?.filter((_, i) => i !== indexToDelete);

        if (!filteredOptions) return;

        const isDeletingCorrect = question.rightAnswers?.includes(optionValueToDelete || "");

        onUpdate(question.questionId, {
            options: filteredOptions,
            rightAnswers: isDeletingCorrect ? [] : question.rightAnswers
        });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.info}>
                    <p className='headlines-m b-500'>{`Question ${index + 1}`}</p>
                    <p className={`body-m ${styles.description}`}>Create a question and several different answer options for it.</p>
                </div>

                <div className={styles.input_container}>
                    <Textarea value={question.questionText || ''} setValue={(value) => onUpdate(question.questionId, { questionText: value })} />
                    <div className={styles.nav_wrapper}>
                        <OptionNavBlock
                            id={question.questionId}
                            handleDelete={target => onQuestionDelete(target)}
                            handleUp={target => onMoveUp(target)}
                            handleDown={target => onMoveDown(target)}
                        />
                    </div>
                </div>
            </div>


            <div className={styles.answerContainer}>
                {question.options?.map((option, index) => (
                    <ChooseQuestionItem
                        key={`${question.questionId}-opt-${index}`}
                        optionId={index + ''}
                        name={'optionGroup' + question.questionId}
                        questionText={option || ''}
                        setQuestionText={(newValue) => {
                            const wasCorrect = question.rightAnswers?.[0] === option;

                            const updatedOptions = question.options?.map((val, i) =>
                                i === index ? newValue : val
                            );

                            onUpdate(question.questionId, {
                                options: updatedOptions,
                                rightAnswers: wasCorrect ? [newValue] : question.rightAnswers
                            });
                        }}
                        selectedAnswer={question.rightAnswers?.[0] || ''}
                        setSelectedAnswer={(value) => onUpdate(question.questionId, { rightAnswers: [value] })}
                        handleMoveUp={() => handleOptionMoveUp(index)}
                        handleMoveDown={() => handleOptionMoveDown(index)}
                        onDelete={() => handleOptionDelete(index)}
                    />
                ))}

                <div className={styles.newQuestBtn_container}>
                    <div className={styles.newQuestBtn}>
                        <ButtonText onClick={handleNewQuestionOption} disabled={(question.options?.length ?? 0) >= 5}><AddBtnIco /><span style={{ color: 'inherit' }}> New answer</span></ButtonText>
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
        </div>
    )
}

export default ChoiceQuestion