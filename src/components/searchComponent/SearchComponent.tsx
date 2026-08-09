import { useMemo, useState } from "react";
import styles from "./searchComponent.module.css";
import { CheckedIco, SearchIco, UncheckedIco } from "@/assets/svg/icons";
import { useLanguageSync } from "@/utils/useLanguage";

type SearchComponentProps = {
  label: string;
  arr: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
};

const DEFAULT_OPTIONS_LIMIT = 5;

const SearchComponent: React.FC<SearchComponentProps> = ({
  label,
  arr,
  selectedValues,
  onToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [numberOfOptions, setNumberOfOptions] = useState<number>(
    DEFAULT_OPTIONS_LIMIT,
  );

  const { t, currentLanguage } = useLanguageSync();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setNumberOfOptions(DEFAULT_OPTIONS_LIMIT);
  };

  const filteredOptions = useMemo(() => {
    const locale = currentLanguage || "ru";

    const filtered = searchTerm.trim()
      ? arr.filter((option) =>
          option.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : [...arr];

    return filtered.sort((a, b) => {
      const aSelected = selectedValues.includes(a);
      const bSelected = selectedValues.includes(b);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      return a.localeCompare(b, locale);
    });
  }, [searchTerm, arr, selectedValues, currentLanguage]);

  const visibleOptions = filteredOptions.slice(0, numberOfOptions);
  const hasMore = numberOfOptions < filteredOptions.length;

  return (
    <div className={styles.container}>
      <p className="headlines-s" style={{ alignSelf: "flex-start" }}>
        {label}
      </p>

      <div className={styles.searchField}>
        <input
          type="text"
          placeholder="Text..."
          maxLength={22}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <span>
          <SearchIco />
        </span>
      </div>

      <ul className={styles.list}>
        {filteredOptions.length === 0 ? (
          <li className={styles.listItem}>
            <div className={styles.checkboxContainer}>
              <span className="body-m">{t("noOptions")}</span>
            </div>
          </li>
        ) : (
          <>
            {visibleOptions.map((option) => {
              const isChecked = selectedValues.includes(option);
              return (
                <li key={option} className={styles.listItem}>
                  <div
                    className={styles.checkboxContainer}
                    onClick={() => onToggle(option)}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onToggle(option);
                      }
                    }}
                  >
                    <div className={styles.checkbox}>
                      {isChecked ? <CheckedIco /> : <UncheckedIco />}
                    </div>
                    <span className="body-m">{option}</span>
                  </div>
                </li>
              );
            })}

            {hasMore && (
              <li className={styles.listItem}>
                <div
                  className={styles.checkboxContainer}
                  onClick={() => setNumberOfOptions(filteredOptions.length)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setNumberOfOptions(filteredOptions.length);
                    }
                  }}
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
        )}
      </ul>
    </div>
  );
};

export default SearchComponent;
