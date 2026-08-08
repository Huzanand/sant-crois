import { useMemo, useState } from "react";
import styles from "./searchComponent.module.css";
import { CheckedIco, SearchIco, UncheckedIco } from "@/assets/svg/icons";
import { useLanguageSync } from "@/utils/useLanguage";
import { useFilterParam } from "@/utils/useFilterParam";

type SearchComponentProps = {
  label: string;
  arr: string[];
  paramKey: string;
};

const DEFAULT_OPTIONS_LIMIT = 5;

const SearchComponent: React.FC<SearchComponentProps> = ({
  label,
  arr,
  paramKey,
}) => {
  // state of search input
  const [searchTerm, setSearchTerm] = useState("");

  // receive selected items from url and update them
  const { selectedValuesArray, updateParam } = useFilterParam(paramKey);

  // limit of options to show
  const [numberOfOptions, setNumberOfOptions] = useState<number>(
    DEFAULT_OPTIONS_LIMIT,
  );

  // language sync
  const { t, currentLanguage } = useLanguageSync();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setNumberOfOptions(DEFAULT_OPTIONS_LIMIT); // Reset pagination when searching
  };

  // filter func to show options based on search input and selected items AND ALPHABETICAL ORDER
  const filteredOptions = useMemo(() => {
    const locale = currentLanguage || "ru";

    // 1. Filter items without mutating original prop
    const filtered = searchTerm.trim()
      ? arr.filter((option) =>
          option.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : [...arr];

    // 2. Sort by selection status first, then alphabetically
    return filtered.sort((a, b) => {
      const aSelected = selectedValuesArray.includes(a);
      const bSelected = selectedValuesArray.includes(b);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      return a.localeCompare(b, locale);
    });
  }, [searchTerm, arr, selectedValuesArray, currentLanguage]);

  // update selected items state based on url param
  // toggle options handler
  const handleToggle = (value: string) => {
    const exists = selectedValuesArray.includes(value);
    const newValues = exists
      ? selectedValuesArray.filter((v) => v !== value)
      : [...selectedValuesArray, value];

    updateParam(newValues);
  };

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
              const isChecked = selectedValuesArray.includes(option);
              return (
                <li key={option} className={styles.listItem}>
                  <div
                    className={styles.checkboxContainer}
                    onClick={() => handleToggle(option)}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleToggle(option);
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
