import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../locales/English.json';
import ukTranslations from '../locales/Ukrainian.json';
import ruTranslations from '../locales/Russian.json';
import frTranslations from '../locales/French.json';
import deTranslations from '../locales/German.json'

i18n.use(initReactI18next).init({
    resources: {
        English: { translation: enTranslations },
        Ukrainian: { translation: ukTranslations },
        German: { translation: deTranslations },
        ru: { translation: ruTranslations },
        French: { translation: frTranslations },
    },
    lng: 'English',
    fallbackLng: 'English',
    interpolation: { escapeValue: false },
    react: {
        bindI18n: 'languageChanged',
        useSuspense: false,
    }
});

export default i18n;