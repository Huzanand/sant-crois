"use client"

import styles from './customRadioBtn.module.css'
import { RadioBtn, RadioBtnChecked } from '@/assets/svg/icons';

interface RadioBtnProps {
    id: string;
    name: string;
    label: string
    value: string;
    isChecked: boolean;
    handleChange: (value: string) => void;
    disabled?: boolean;
}

const CustomRadioBtn = ({ id, name, label, value, isChecked, handleChange, disabled = false }: RadioBtnProps) => {

    return (
        <div className={`${styles.optionRadio} ${disabled ? styles.disabled : ''}`}>
            <label >
                <input
                    className={styles.radioInput}
                    type="radio"
                    id={id}
                    name={name}
                    value={value}
                    disabled={disabled}
                    onChange={() => handleChange(value)}
                    checked={isChecked}
                />
                {isChecked ? <RadioBtnChecked/> : <RadioBtn/>}
                <span className={`body-m ${styles.radioLabel}`}>{label}</span>
            </label>
        </div>
    );
};

export default CustomRadioBtn;