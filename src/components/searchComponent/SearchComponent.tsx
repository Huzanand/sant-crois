import { useMemo, useState, useEffect } from "react";
import styles from "./searchComponent.module.css";
import { CheckedIco, SearchIco, UncheckedIco } from "@/assets/svg/icons";
import { useLanguageSync } from "@/utils/useLanguage";

type searchComponentProps = {
    arr: string[];
    selectedFromArr: string[];
    setFunc: (selectedItems: string[]) => void;
    label: string;
};

const SearchComponent: React.FC<searchComponentProps> = ({
    arr,
    selectedFromArr,
    setFunc,
    label,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] =
        useState<string[]>(selectedFromArr);

    const [numberOfOptions, setNumberOfOptions] = useState<number>(5);

    const { t } = useLanguageSync();

    const filteredOptions = useMemo(() => {
        let filtered = searchTerm.trim()
            ? arr.filter((option) =>
                  option.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : arr;

        filtered = filtered.sort((a, b) => a.localeCompare(b, "ru"));

        if (selectedItems.length > 0) {
            filtered = filtered.sort((a, b) => {
                const aSelected = selectedItems.includes(a);
                const bSelected = selectedItems.includes(b);

                if (aSelected && !bSelected) return -1;
                if (!aSelected && bSelected) return 1;
                return a.localeCompare(b, "ru");
            });
        }

        return filtered;
    }, [searchTerm, arr, selectedItems]);

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

    const renderList = (options: string[], numberOfOptions: number) => {
        if (options.length === 0) {
            return (
                <li key={"no options"} className={styles.listItem}>
                    <div className={styles.checkboxContainer}>
                        <span className="body-m">{t("noOptions")}</span>
                    </div>
                </li>
            );
        }
        const list = [] as React.ReactNode[];

        options.map((option, i) => {
            if (i < numberOfOptions)
                list.push(
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
                );
        });

        return (
            <>
                {list}
                {numberOfOptions < options.length && (
                    <li
                        key={"load more button " + label}
                        className={`${styles.listItem} `}
                    >
                        <div
                            className={styles.checkboxContainer}
                            onClick={() =>
                                setNumberOfOptions(numberOfOptions + 5)
                            }
                        >
                            <span
                                className="buttons-m"
                                style={{ color: "#403294", fontSize: "16px" }}
                            >
                                {t("loadMore")}
                            </span>
                        </div>
                    </li>
                )}
            </>
        );
    };

    return (
        <div className={styles.container}>
            <p
                className="headlines-s"
                style={{
                    alignSelf: "flex-start",
                }}
            >
                {label}
            </p>

            <div className={styles.searchField}>
                <input
                    type="text"
                    placeholder="Text..."
                    maxLength={22}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span>
                    <SearchIco />
                </span>
            </div>

            <ul className={styles.list}>
                {renderList(filteredOptions, numberOfOptions)}
            </ul>
        </div>
    );
};

export default SearchComponent;
