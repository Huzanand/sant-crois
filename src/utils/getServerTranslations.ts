// lib/i18n/serverTranslation.ts
type TranslationOptions = Record<string, string | number | boolean | undefined>;



export async function getServerTranslation(locale: string) {
    const i18next = (await import("i18next")).default;

    const resources = {
        English: { translation: (await import("../locales/English.json")).default },
        Ukrainian: { translation: (await import("../locales/Ukrainian.json")).default },
        French: { translation: (await import("../locales/French.json")).default },
        German: { translation: (await import("../locales/German.json")).default },
    };

    await i18next.init({
        resources,
        lng: locale,
        fallbackLng: "English",
        interpolation: { escapeValue: false },
    });

    const t = (key: string, options?: TranslationOptions) => i18next.t(key, options);
    return t;
}
