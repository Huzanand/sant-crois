import styles from "./fillTextSelect.module.css";

interface ISelectProps {
    selectIndex: number;
    handleChange: (index: number, value: string) => void;
    options: string[];
    currentOption: string;
}

const FillTextSelect: React.FC<ISelectProps> = ({
    selectIndex,
    handleChange,
    options,
    currentOption,
}) => {
    return (
        <span className={styles.container}>
            <select
                className={styles.select}
                key={selectIndex}
                value={currentOption}
                onChange={(e) => handleChange(selectIndex, e.target.value)}
            >
                <option value="null" key={"nullOption" + selectIndex}></option>
                {options.map((option: string, optionIndex: number) => (
                    <option
                        value={option}
                        key={optionIndex}
                        className="buttons-s"
                    >
                        {option}
                    </option>
                ))}
            </select>
        </span>
    );
};

export default FillTextSelect;
