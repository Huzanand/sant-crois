import { useState, useEffect } from "react";
import styles from "./ageFilter.module.css";
import { CheckedIco, UncheckedIco } from "@/assets/svg/icons";

type searchComponentProps = {
    arr: string[];
    selectedFromArr: string[];
    setFunc: (selectedItems: string[]) => void;
    label: string;
};

const AgeFilter: React.FC<searchComponentProps> = ({
    arr,
    selectedFromArr,
    setFunc,
    label,
}) => {
    const [selectedItems, setSelectedItems] =
        useState<string[]>(selectedFromArr);

    useEffect(() => {
        setFunc(selectedItems);
    }, [selectedItems, setFunc]);

    const handleCheckboxChange = (item: string) => {
        setSelectedItems((prevSelected) => {
            const updatedSelected = prevSelected.includes(item)
                ? prevSelected.filter((selected) => selected !== item)
                : [...prevSelected, item];

            return updatedSelected;
        });
    };

    return (
        <div className={styles.container}>
            <p
                className="headlines-s"
                style={{ alignSelf: "flex-start", margin: "0px 0px -8px" }}
            >
                {label}
            </p>

            <ul className={styles.list}>
                {arr.map((option) => (
                    <li key={option} className={styles.listItem}>
                        <div
                            className={styles.checkboxContainer}
                            onClick={() => handleCheckboxChange(option)}
                        >
                            <div className={styles.checkbox}>
                                {selectedItems.includes(option) ? (
                                    <CheckedIco />
                                ) : (
                                    <UncheckedIco />
                                )}
                            </div>
                            <span className="body-m">{option}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AgeFilter;
