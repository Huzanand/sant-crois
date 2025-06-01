import { useLanguageSync } from "./useLanguage";

const useTranslatedOptions = (optionArr: string[], translationKey: string) => {
    const { t } = useLanguageSync();

    const translated = optionArr.map((option: string) => ({
        value: option, // Keep original value ('A1')
        label: t(`${translationKey}.${option}`), // Translated label
    }));

    return translated;
};

export default useTranslatedOptions;
