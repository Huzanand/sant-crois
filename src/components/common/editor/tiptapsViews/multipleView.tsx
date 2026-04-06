"use client"

import styles from '../tiptapEditor.module.css'
import Divider from '@/components/divider/Divider'
import { ArrowDownIco, CrossBorderedIco, IIco, TrashCanIco } from '@/assets/svg/icons'
import { TitledInput } from '@/components/constructor/titledInput/TitledInput'
import { ButtonSecondary } from '../../buttons/ButtonSecondary'
import { ButtonPrimary } from '../../buttons/ButtonPrimary'
import { ButtonText } from '../../buttons/ButtonText'
import { Textarea } from '@/components/constructor/textarea/Textarea'

interface viewProps {
    handleActionBtn: () => void,
    actionBtnActive: boolean,
    resetForm: () => void,
    answer: string,
    setAnswer: React.Dispatch<React.SetStateAction<string>>,
    options: string[],
    setOptions: React.Dispatch<React.SetStateAction<string[]>>,
    explanation: string,
    setExplanation: React.Dispatch<React.SetStateAction<string>>,
    handleSave: () => void
}

export const MultipleView = ({ handleActionBtn, actionBtnActive, resetForm, answer, setAnswer, options, setOptions, explanation, setExplanation, handleSave }: viewProps) => {

    const addOption = () => {
        setOptions([...options, '']);
    };

    const handleOptionChange = (value: string, index: number) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const removeOption = (indexToRemove: number) => {
        setOptions(options.filter((_, index) => index !== indexToRemove));
    };

    return (
        <>
            <div className={styles.actionBtn_container}>
                <button className={styles.actionBtn} onClick={handleActionBtn}>
                    <span className={`buttons-l ${styles.actionBtn_title}`}>Add blank</span>
                    <span className={actionBtnActive ? styles.arrow_active : styles.arrow_default}>
                        <ArrowDownIco />
                    </span>
                </button>

                <div className={styles.tooltip}>
                    <div className={styles.tooltip_btn}>
                        <IIco fill='#8777D9' />
                    </div>

                    <div className={styles.tooltip_expanded}>
                        <p className='body-s'>Select the word or sentence you would like to provide a separate explanation for and click this button.</p>
                        <br />
                        <p className={`body-s ${styles.addMargin}`}>If you pressed this button without selecting a specific word, please fill in the first word of the popup form.</p>
                    </div>
                </div>
            </div>

            <Divider />

            {actionBtnActive && (
                <div className={`${styles.actionBtn_expanded} ${styles.popover_open}`}>
                    <div className={styles.popover_header}>
                        <p className='headlines-m b-500'>Add blank</p>
                        <button className={styles.popover_closeM} onClick={resetForm}>
                            <CrossBorderedIco />
                        </button>
                    </div>

                    <div className={styles.popover_content}>
                        <p className='body-m'>Correct answer*</p>
                        <TitledInput value={answer} setValue={setAnswer} />
                    </div>

                    <div className={styles.popover_content}>
                        <p className='body-m'>Incorrect answers*</p>

                        <div className={styles.optionsListStack}>
                            {options.map((option, i) => (
                                <div key={i} className={styles.dynamicInputRow}>
                                    <div className={styles.inputFlex}>
                                        <TitledInput
                                            value={option}
                                            setValue={(val) => handleOptionChange(val, i)}
                                            placeholder={`Option ${i + 1}`}
                                        />
                                    </div>

                                    <button
                                        className={styles.deleteIconButton}
                                        onClick={() => removeOption(i)}
                                    >
                                        <TrashCanIco />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className={styles.addMoreWrapper}>
                            <ButtonText onClick={addOption}><span className='buttons-l blue-b500'>+ Add more</span></ButtonText>
                        </div>

                        <div className={styles.popover_content}>
                            <p className='body-m'>Correct answer explanation. Optional</p>
                            <Textarea value={explanation} setValue={setExplanation} placeholder='Add explanation'/>
                        </div>

                    </div>

                    <div className={styles.popover_btnContainer}>
                        <div style={{ width: '100px' }} onClick={resetForm}>
                            <ButtonSecondary><span className='buttons-l blue-b500'>Cancel</span></ButtonSecondary>
                        </div>
                        <div style={{ width: '100px' }} onClick={handleSave}>
                            <ButtonPrimary><span className='buttons-l' style={{color: '#fff'}}>Save</span></ButtonPrimary>
                        </div>
                    </div>
                </div>
            )}
        </>

    )
}