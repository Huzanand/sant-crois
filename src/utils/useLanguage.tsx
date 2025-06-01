import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useOwnStore } from "@/store/storeProvider";

export const useLanguageSync = () => {
    const { selectedInterfaceLanguage } = useOwnStore((state) => state);
    const { i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage(selectedInterfaceLanguage);
    }, [selectedInterfaceLanguage, i18n]);

    return { t: i18n.t };
};
