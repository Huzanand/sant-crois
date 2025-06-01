import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '@/locales/english.json';
import uaTranslations from '@/locales/ukrainian.json';
import ruTranslations from '@/locales/russian.json';
import frTranslations from '@/locales/french.json';

i18n.use(initReactI18next).init({
    resources: {
        english: { translation: enTranslations },
        ukrainian: { translation: uaTranslations },
        russian: { translation: ruTranslations },
        french: { translation: frTranslations },
    },
    lng: 'english',
    fallbackLng: 'english',
    interpolation: { escapeValue: false },
    react: {
        bindI18n: 'languageChanged',
        useSuspense: false,
    }
});

export default i18n;