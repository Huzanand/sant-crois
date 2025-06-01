"use client";

import { useState } from "react";
import styles from "./tooltip.module.css";

interface TooltipProps {
    children: React.ReactNode;
    title?: string;
    content?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style?: any;
    underline?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
    children,
    title,
    content,
    style,
    underline
}) => {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    return (
        <div className={styles.tooltip_container}>
            <span className={underline ? "body-m--underline" : "body-m"}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {children}
            </span>

            <div
                className={`${styles.tooltip} ${
                    showTooltip ? styles.open : undefined
                }`}
                style={style}
            >
                {title ? (
                    <h4 className="headlines-s">
                        {title}
                    </h4>
                ) : undefined}
                {content ? <p className="body-s">{content}</p> : undefined}
            </div>
        </div>
    );
};

export default Tooltip;
