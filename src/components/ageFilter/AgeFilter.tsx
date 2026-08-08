import styles from "./ageFilter.module.css";
import { CheckedIco, UncheckedIco } from "@/assets/svg/icons";
import { useFilterParam } from "@/utils/useFilterParam";

type searchComponentProps = {
  label: string;
  arr: string[];
};

const AgeFilter: React.FC<searchComponentProps> = ({ label, arr }) => {
  const { selectedValuesArray, updateParam } = useFilterParam("targetAgeGroup");

  const handleToggle = (value: string) => {
    const exists = selectedValuesArray.includes(value);
    const newValues = exists
      ? selectedValuesArray.filter((v) => v !== value)
      : [...selectedValuesArray, value];

    updateParam(newValues);
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
        {arr.map((option) => {
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
      </ul>
    </div>
  );
};

export default AgeFilter;
