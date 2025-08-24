import { useLanguageSync } from "./useLanguage";

const useTranslatedOptions = (optionArr: string[], translationKey: string) => {
    const { t } = useLanguageSync();

    const translated = optionArr.map((option: string) => ({
        value: option,
        label: t(`${translationKey}.${option}`),
    }));

    return translated;
};

export default useTranslatedOptions;
