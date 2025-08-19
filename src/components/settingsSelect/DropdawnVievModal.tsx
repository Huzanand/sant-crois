import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { DropdownProps } from "./models";
import styles from "./settingsSelect.module.css";
import { ArrowDownIco } from "@/assets/svg/icons";

type DropdownToggleParams = [
    containerRef: React.RefObject<HTMLDivElement>,
    isActive: boolean,
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
];

const DropdownViewModal: React.FC<DropdownProps> = ({
    label,
    options,
    selectedOption,
    selectedOptionLabel,
    toggleDropdown,
    handleOptionClick,
    ico,
    activeIcon,
    border,
    shadow,
}) => {
    // State remains unchanged as requested
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const dropdownToggleParams = useMemo(
        (): DropdownToggleParams => [
            containerRef,
            isActive,
            setIsActive,
            isOpen,
            setIsOpen,
        ],
        [isActive, isOpen]
    );

    const handleToggle = useCallback(() => {
        toggleDropdown(...dropdownToggleParams);
    }, [toggleDropdown, dropdownToggleParams]);

    const handleOverlayClick = useCallback(() => {
        handleToggle();
    }, [handleToggle]);

    useEffect(() => {
        const handleBodyScroll = () => {
            document.body.style.overflow = isOpen ? "hidden" : "";
            if (overlayRef.current) {
                overlayRef.current.style.opacity = isOpen ? "1" : "0";
                overlayRef.current.style.pointerEvents = isOpen
                    ? "auto"
                    : "none";
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                handleToggle();
            }
        };

        handleBodyScroll();

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, handleToggle]);

    const createOptionClickHandler = useCallback(
        (option: string) => {
            return () => handleOptionClick(option, dropdownToggleParams);
        },
        [handleOptionClick, dropdownToggleParams]
    );

    const renderOptions = useMemo(() => {
        return options.map((option, index) => {
            const isSelected = selectedOption === option.value;
            const labelClass = isSelected
                ? `${styles.label_checked} body-l `
                : `body-l`;

            return (
                <div className={styles.option} key={`option-${index}`}>
                    <label className={labelClass}>
                        <input
                            type="radio"
                            value={option.value}
                            checked={isSelected}
                            onChange={createOptionClickHandler(option.value)}
                        />
                        <span className={styles.custom_radioBtn} />

                        <p className={styles.text} style={{ width: "230px" }}>
                            {option.label}
                        </p>
                    </label>
                </div>
            );
        });
    }, [options, selectedOption, createOptionClickHandler]);

    const getSelectContainerClass = () => {
        let className = styles.select_container;
        if (isActive) className += ` ${styles.active}`;
        if (border) className += ` ${styles.border}`;
        if (shadow) className += ` ${styles.shadow}`;
        return className;
    };

    const getActiveTextClass = () => {
        return isActive
            ? `buttons-l ${styles.text} ${styles.active} `
            : "buttons-l";
    };

    return (
        <div className={styles.container} ref={modalRef}>
            {label && <p className={`headlines-s ${styles.label}`}>{label}</p>}

            <div className={getSelectContainerClass()} onClick={handleToggle}>
                <div className={styles.select_content}>
                    <div className={styles.icon_container}>
                        {isOpen ? activeIcon : ico}
                    </div>
                    <p className={getActiveTextClass()}>
                        {selectedOptionLabel}
                    </p>
                </div>
            </div>

            <div
                ref={overlayRef}
                className={styles.overlay}
                onClick={handleOverlayClick}
            />

            <div
                ref={containerRef}
                className={`${styles.option__container_modal} ${
                    isOpen ? styles.open_modal : ""
                }`}
            >
                <div className={styles.modal_header}>
                    <button
                        className={styles.back_button}
                        onClick={handleToggle}
                    >
                        <ArrowDownIco />
                    </button>
                    <h3
                        style={{ height: "40px", lineHeight: "40px" }}
                        className="headlines-m"
                    >
                        Сортировать по
                    </h3>
                </div>

                <div
                    className={styles.options_list}
                    // style={{ marginTop: "2rem" }}
                >
                    {renderOptions}
                </div>
            </div>
        </div>
    );
};

export default DropdownViewModal;
