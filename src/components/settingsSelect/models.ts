export interface DropdownProps {
    label?: string,
    options: {
        value: string;
        label: string
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
    toggleDropdown: (ref: React.RefObject<HTMLDivElement>,
        isActive: boolean,
        setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
        isOpen: boolean,
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) => void;
    handleTransitionEnd: (ref: React.RefObject<HTMLDivElement>,
        isOpen: boolean) => void;
    handleOptionClick: (option: string,
        options: [
            ref: React.RefObject<HTMLDivElement>,
            isActive: boolean,
            setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
            isOpen: boolean,
            setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
        ]) => void;
    isActive: boolean,
    isOpen: boolean,
}