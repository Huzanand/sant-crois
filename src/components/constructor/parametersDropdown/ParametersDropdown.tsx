"use client"

import { ArrowDownIco } from "@/assets/svg/icons";
import styles from "./parametersDropdown.module.css";
import { useState } from "react";

interface dropdownProps<T extends string> {
    label: string,
    parameters: T[],
    value: T,
    setValue: (value: T) => void
}

export const ParametersDropdown = <T extends string>({
    label,
    parameters,
    value,
    setValue
}: dropdownProps<T>) => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open)
    }

    return (
        <div className={styles.container}>
            <p className="body-l">{label}</p>

            <div className={styles.dropdown_container}>
                <div className={styles.dropdown}>

                    <button className={styles.dropdown_btn} onClick={handleOpen}>
                        <span className={`buttons-l  ${styles.dropdown_btn__title}`}>{value}</span>
                        <span className={open ? styles.arrow_active : styles.arrow_default}><ArrowDownIco /></span>
                    </button>

                    <ul className={open ? `${styles.open} ${styles.dropdown_list}` : styles.dropdown_list}>
                        {parameters.map((parameter, index) => (
                            <li key={parameter + index} value={parameter} onClick={(e) => { handleOpen(); setValue(parameter) }}>
                                <button className={styles.dropdown_listItem__btn}>{parameter}</button>
                            </li>
                        ))}


                    </ul>
                </div>
            </div>
        </div>
    )
}