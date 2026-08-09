import styles from "./ageFilter.module.css";
import { CheckedIco, UncheckedIco } from "@/assets/svg/icons";

type searchComponentProps = {
  label: string;
  arr: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
};

const AgeFilter: React.FC<searchComponentProps> = ({
  label,
  arr,
  selectedValues,
  onToggle,
}) => {
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
      </ul>
    </div>
  );
};

export default AgeFilter;
