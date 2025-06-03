"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { useEffect, useState } from "react";

export default function I18nWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const checkReady = () => {
            if (i18n.isInitialized) {
                setIsReady(true);
            }
        };

        checkReady();

        if (!i18n.isInitialized) {
            i18n.on("initialized", checkReady);
            return () => i18n.off("initialized", checkReady);
        }
    }, []);

    if (!isReady) {
        return (
            <div className="fixed inset-0 flex items-center justify-center"></div>
        );
    }

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
