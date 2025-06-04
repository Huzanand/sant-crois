"use client";

import Footer from "@/components/footer/Footer";
import { StoreProvider } from "@/store/storeProvider";
import { useEffect, useState } from "react";
import { useOwnStore } from "@/store/storeProvider"; // Используем хук вместо прямого импорта Store
import dynamic from "next/dynamic";

const I18nWrapper = dynamic(() => import("@/i18n/i18nWrapper"), {
    ssr: false,
});

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <StoreProvider>
            <LoadedContent>{children}</LoadedContent>
        </StoreProvider>
    );
}

// Отдельный компонент для работы с состоянием ПОСЛЕ инициализации провайдера
function LoadedContent({ children }: { children: React.ReactNode }) {
    const loadFromLocalStorage = useOwnStore(
        (state) => state.loadFromLocalStorage
    );

    const [bgUrl, setBgUrl] = useState<string | null>(null);

    useEffect(() => {
        loadFromLocalStorage();
        import("../assets/backgroundMain.png").then((mod) =>
            setBgUrl(mod.default.src)
        );
    }, [loadFromLocalStorage]);
    return (
        <I18nWrapper>
            <div
                className="min-h-screen flex flex-col"
                style={
                    typeof window !== "undefined"
                        ? {
                              background: `url(${bgUrl}) center/cover no-repeat`,
                          }
                        : undefined
                }
            >
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </I18nWrapper>
    );
}
