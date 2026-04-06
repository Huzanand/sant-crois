"use client"

import { ArrowDownIco } from "@/assets/svg/icons";
import styles from "./collapseBtn.module.css";

interface btnProps {
    handleClick: React.MouseEventHandler<HTMLButtonElement>;
    open: boolean;
}

export const CollapseBtn: React.FC<btnProps> = ({ handleClick, open }) => {

    return (
        <div>
            <button className={styles.btn} onClick={handleClick}>
                <span className={`buttons-m  ${styles.btn_title}`}>Collapse all</span>
                <span className={open ? styles.arrow_active : styles.arrow_default}><ArrowDownIco fill="#403294"/></span>
            </button>
        </div>
    )
}