
export interface IPersistentSettingsState {
    selectedLanguageLevel: string;
    languageLevelOptions: string[];
    selectedInterfaceLanguage: string;
    interfaceLanguageOptions: string[];
    selectedLearningLanguage: string;
    learningLanguageOptions: string[];
}

export interface IIpersistentSettingsActions {
    onSelectChange: (selectedLearningLanguage: string, value: string) => void,
}


export interface IPersistentSettingsSlice extends IPersistentSettingsState, IIpersistentSettingsActions { }