import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "../locales/English.json";
import ukTranslations from "../locales/Ukrainian.json";
import frTranslations from "../locales/French.json";
import deTranslations from "../locales/German.json";

const resources = {
    English: { translation: enTranslations },
    Ukrainian: { translation: ukTranslations },
    French: { translation: frTranslations },
    German: { translation: deTranslations },
};

if (typeof window !== "undefined" && !i18n.isInitialized) {
    i18n.use(initReactI18next).init({
        resources,
        lng: "English",
        fallbackLng: "English",
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
    });
}

export async function initI18n(locale: string) {
    const i18nextServer = (await import("i18next")).default;

    await i18nextServer.init({
        resources,
        lng: locale,
        fallbackLng: "English",
        interpolation: { escapeValue: false },
    });

    return i18nextServer;
}

export default i18n;
