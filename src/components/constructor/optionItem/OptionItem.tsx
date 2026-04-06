"use client"

import styles from "./optionItem.module.css"
import CustomRadioBtn from "@/components/common/customRadioBtn/CustomRadioBtn"
import { OptionNavBlock } from "../optionNavBlock/OptionNavBlock"

interface props {
    optionId: string
    name: string;
    value: string;
    checked: boolean;
    setSelectedAnswer: (value: string) => void;
    handleMoveUp: () => void
    handleMoveDown: () => void
    handleDelete: () => void
}

const OptionItem = ({ optionId, name, value, checked, setSelectedAnswer, handleMoveUp, handleMoveDown, handleDelete }: props) => {

    return (
        <div className={styles.wrapper}>
            <div className={styles.answerBlock}>
                <CustomRadioBtn
                    id={optionId}
                    name={name}
                    label='True'
                    value={value}
                    isChecked={checked}
                    handleChange={() => setSelectedAnswer(value)}
                    disabled={false}
                />
            </div>

            <OptionNavBlock handleDelete={handleDelete} handleUp={handleMoveUp} handleDown={handleMoveDown} />
        </div>
    )
}

export default OptionItem;