
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
    if (typeof window !== "undefined") {
        const savedValue = localStorage.getItem(key);
        if (savedValue) {
            try {
                return JSON.parse(savedValue) as T;
            } catch (e) {
                console.error(`Error parsing localStorage item "${key}":`, e);
                return defaultValue;
            }
        }
    }
    return defaultValue;
};

export const setToLocalStorage = <T>(key: string, value: T): void => {
    if (typeof window !== "undefined") {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Error saving to localStorage item "${key}":`, e);
        }
    }
};
