import DropdownViewAbsolute from "./DropdawnVievAbsolute";
import DropdownViewDefault from "./DropdawnVievDefault";
import DropdownViewModal from "./DropdawnVievModal";

interface CustomSelectProps {
    mode: "default" | "absolute" | "modal";
    label?: string;
    options: {
        value: string;
        label: string;
    }[];
    selectedOption: string;
    selectedOptionLabel: string;
    onChangeSelect: (selectName: string, value: string) => void;
    changeField: string;
    border?: boolean;
    shadow?: boolean;
    isLessonPage?: boolean;
    ico: React.ReactNode;
    activeIcon: React.ReactNode;
    isSorting?: boolean;
}

const SettingsSelect: React.FC<CustomSelectProps> = ({
    mode,
    label,
    options,
    selectedOption,
    selectedOptionLabel,
    onChangeSelect,
    changeField,
    ico,
    activeIcon,
    border,
    shadow,
}) => {
    const toggleDropdown = (
        ref: React.RefObject<HTMLDivElement>,
        isActive: boolean,
        setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
        isOpen: boolean,
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        const container = ref.current;

        if (container) {
            if (mode !== "modal") {
                if (isOpen) {
                    const currentHeight = container.scrollHeight + "px";
                    container.style.height = currentHeight;

                    requestAnimationFrame(() => {
                        container.style.height = "0px";
                    });
                } else {
                    const scrollHeight = container.scrollHeight + "px";
                    container.style.height = scrollHeight;
                }
            }

            setIsActive(!isActive);
            setIsOpen(!isOpen);
        }
    };

    const handleTransitionEnd = (
        ref: React.RefObject<HTMLDivElement>,
        isOpen: boolean
    ) => {
        const container = ref.current;

        if (container) {
            if (isOpen) {
                container.style.height = "auto";
            } else {
                container.style.height = "0px";
            }
        }
    };

    const handleOptionClick = (
        option: string,
        options: [
            ref: React.RefObject<HTMLDivElement>,
            isActive: boolean,
            setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
            isOpen: boolean,
            setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
        ]
    ) => {
        onChangeSelect(changeField, option);
        toggleDropdown(...options);
    };

    if (mode === "modal")
        return (
            <DropdownViewModal
                label={label}
                options={options}
                selectedOption={selectedOption}
                selectedOptionLabel={selectedOptionLabel}
                onChangeSelect={onChangeSelect}
                changeField={changeField}
                ico={ico}
                activeIcon={activeIcon}
                shadow={shadow}
                border={border}
                toggleDropdown={toggleDropdown}
                handleTransitionEnd={handleTransitionEnd}
                handleOptionClick={handleOptionClick}
                isActive
                isOpen
            />
        );
    if (mode === "absolute")
        return (
            <DropdownViewAbsolute
                label={label}
                options={options}
                selectedOption={selectedOption}
                selectedOptionLabel={selectedOptionLabel}
                onChangeSelect={onChangeSelect}
                changeField={changeField}
                ico={ico}
                activeIcon={activeIcon}
                shadow={shadow}
                border={border}
                toggleDropdown={toggleDropdown}
                handleTransitionEnd={handleTransitionEnd}
                handleOptionClick={handleOptionClick}
                isActive
                isOpen
            />
        );
    return (
        <DropdownViewDefault
            label={label}
            options={options}
            selectedOption={selectedOption}
            selectedOptionLabel={selectedOptionLabel}
            onChangeSelect={onChangeSelect}
            changeField={changeField}
            ico={ico}
            activeIcon={activeIcon}
            shadow={shadow}
            border={border}
            toggleDropdown={toggleDropdown}
            handleTransitionEnd={handleTransitionEnd}
            handleOptionClick={handleOptionClick}
            isActive
            isOpen
        />
    );
};

export default SettingsSelect;
