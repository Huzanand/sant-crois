"use client";


import styles from "./textArea.module.css"
import React, { useState } from "react";

interface props {
    value: string;
    setValue: (value: string) => void,
    placeholder?: string
}

export const Textarea = ({value, setValue, placeholder = "Enter details..."}: props) => {

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <textarea
                    className={`body-l blue-b500 ${styles.textarea}`}
                    placeholder={placeholder} 
                    value={value} 
                    onChange={e => setValue(e.target.value)}
                    rows={3}
                />
            </div>
            <div className={styles.counter}>
                {/* {value.length} characters */}
            </div>
        </div>
    );
};