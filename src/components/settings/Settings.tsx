import { useOwnStore } from "@/store/storeProvider";
import SettingsSelect from "../settingsSelect/SettingsSelect";
import styles from "./settings.module.css";
import {
    InterfaceLanguageIco,
    LanguageLevelIco,
    LearningLanguageIco,
} from "@/assets/svg/icons";
import { useLanguageSync } from "@/utils/useLanguage";
import useTranslatedOptions from "@/utils/useTranslatedOptions";

const Settings = () => {
    const {
        onSelectChange,
        selectedLanguageLevel,
        languageLevelOptions,
        selectedInterfaceLanguage,
        interfaceLanguageOptions,
        selectedLearningLanguage,
        learningLanguageOptions,
    } = useOwnStore((state) => state);

    const { t } = useLanguageSync();

    return (
        <div className={styles.settingsMenu}>
            <div>
                <SettingsSelect
                    mode="default"
                    label={t("learning language")}
                    selectedOption={selectedLearningLanguage}
                    selectedOptionLabel={t(
                        `selectedLearningLanguage.${selectedLearningLanguage}`
                    )}
                    options={useTranslatedOptions(
                        learningLanguageOptions,
                        "learningLanguageOptions"
                    )}
                    onChangeSelect={onSelectChange}
                    changeField="selectedLearningLanguage"
                    ico={<LearningLanguageIco />}
                    activeIcon={<LearningLanguageIco fill="#fff" />}
                    shadow
                />
            </div>

            <div>
                <SettingsSelect
                    mode="default"
                    label={t("level of language")}
                    selectedOption={selectedLanguageLevel}
                    selectedOptionLabel={t(
                        `selectedLanguageLevel.${selectedLanguageLevel}`
                    )}
                    options={useTranslatedOptions(
                        languageLevelOptions,
                        "languageLevelOptions"
                    )}
                    onChangeSelect={onSelectChange}
                    changeField="selectedLanguageLevel"
                    ico={<LanguageLevelIco />}
                    activeIcon={<LanguageLevelIco fill="#fff" />}
                    shadow
                />
            </div>

            <div>
                <SettingsSelect
                    mode="default"
                    label={t("interface language")}
                    selectedOption={selectedInterfaceLanguage}
                    selectedOptionLabel={t(
                        `selectedInterfaceLanguage.${selectedInterfaceLanguage}`
                    )}
                    options={useTranslatedOptions(
                        interfaceLanguageOptions,
                        "interfaceLanguageOptions"
                    )}
                    onChangeSelect={onSelectChange}
                    changeField="selectedInterfaceLanguage"
                    ico={<InterfaceLanguageIco />}
                    activeIcon={<InterfaceLanguageIco fill="#fff" />}
                    shadow
                />
            </div>
        </div>
    );
};

export default Settings;
