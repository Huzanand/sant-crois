import Divider from '@/components/divider/Divider'
import styles from '../tiptapEditor.module.css'
import { ArrowDownIco, CrossBorderedIco, IIco } from '@/assets/svg/icons'
import { TitledInput } from '@/components/constructor/titledInput/TitledInput'
import { Textarea } from '@/components/constructor/textarea/Textarea'
import { ButtonSecondary } from '../../buttons/ButtonSecondary'
import { ButtonPrimary } from '../../buttons/ButtonPrimary'

interface viewProps {
    handleActionBtn: () => void,
    actionBtnActive: boolean,
    resetForm: () => void,
    label: string,
    setLabel: React.Dispatch<React.SetStateAction<string>>,
    info: string,
    setInfo: React.Dispatch<React.SetStateAction<string>>,
    handleSave: () => void
}

export const TooltipView = ({ handleActionBtn, actionBtnActive, resetForm, label, setLabel, info, setInfo, handleSave }: viewProps) => (
    <>
        <div className={styles.actionBtn_container}>
            <button className={styles.actionBtn} onClick={handleActionBtn}>
                <span className={`buttons-l ${styles.actionBtn_title}`}>Add clarification</span>
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
                    <p className='headlines-m b-500'>Add clarification</p>
                    <button className={styles.popover_closeM} onClick={resetForm}>
                        <CrossBorderedIco />
                    </button>
                </div>

                <div className={styles.popover_content}>
                    <p className='body-m'>Explained word or expression</p>
                    <TitledInput value={label} setValue={setLabel} />
                </div>

                <div className={styles.popover_content}>
                    <p className='body-m'>Description of the concept</p>
                    <Textarea value={info} setValue={setInfo} />
                </div>

                <div className={styles.popover_btnContainer}>
                    <div style={{ width: '100px' }} onClick={resetForm}>
                        <ButtonSecondary><span className='buttons-l blue-b500'>Cancel</span></ButtonSecondary>
                    </div>
                    <div style={{ width: '100px' }} onClick={handleSave}>
                        <ButtonPrimary title='Save' />
                    </div>
                </div>
            </div>
        )}
    </>

)