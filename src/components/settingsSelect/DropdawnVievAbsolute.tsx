import { useRef, useState } from "react";
import { DropdownProps } from "./models";
import styles from "./settingsSelect.module.css";
import { ArrowDownIco } from "@/assets/svg/icons";

// FIRST OPEN WITHOUT ANIMATION!

const DropdownViewAbsolute: React.FC<DropdownProps> = ({
    label,
    options,
    selectedOption,
    selectedOptionLabel,
    toggleDropdown,
    handleTransitionEnd,
    handleOptionClick,
    ico,
    activeIcon,
    border,
    shadow,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className={styles.container}>
            {label && <p className={`headlines-s ${styles.label}`}>{label}</p>}

            <div
                className={`
                    ${
                        isActive
                            ? `${styles.select_container} ${styles.active}`
                            : styles.select_container
                    } 
                    ${border ? styles.border : undefined} 
                    ${shadow ? styles.shadow : undefined}
                `}
                onClick={() =>
                    toggleDropdown(
                        containerRef,
                        isActive,
                        setIsActive,
                        isOpen,
                        setIsOpen
                    )
                }
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "4px",
                    }}
                >
                    <div style={{ width: "24px", height: "24px" }}>
                        {isOpen ? activeIcon : ico}
                    </div>
                    <p
                        className={
                            isActive
                                ? `buttons-l ${styles.text} ${styles.active}`
                                : `buttons-l ${styles.text}`
                        }
                    >
                        {selectedOptionLabel}
                    </p>
                </div>

                <div className={styles.icon_appearance}>
                    <ArrowDownIco fill={isActive ? "#fff" : undefined} />
                </div>
            </div>

            <div
                ref={containerRef}
                className={`${styles.option__container_absolute} ${
                    isOpen ? styles.open_absolute : ""
                }`}
                onTransitionEnd={() =>
                    handleTransitionEnd(containerRef, isOpen)
                }
            >
                {options.map((option, index) => (
                    <div className={styles.option} key={index}>
                        <label
                            className={
                                selectedOption === option.value
                                    ? `${styles.label_checked} body-m`
                                    : "body-m"
                            }
                        >
                            <input
                                type="radio"
                                value={option.value}
                                onChange={() =>
                                    handleOptionClick(option.value, [
                                        containerRef,
                                        isActive,
                                        setIsActive,
                                        isOpen,
                                        setIsOpen,
                                    ])
                                }
                                checked={selectedOption === option.value}
                            />
                            <span className={styles.custom_radioBtn} />
                            <span className={styles.text}>{option.label}</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DropdownViewAbsolute;
