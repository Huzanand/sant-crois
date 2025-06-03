// "use client";

// import i18n from "@/i18n/i18n";
// import { I18nextProvider } from "react-i18next";
// import Footer from "@/components/footer/Footer";
// import { StoreProvider, useOwnStore } from "@/store/storeProvider";
// import bg from "../assets/backgroundMain.png";
// import { useEffect, useState } from "react";
// import { Store } from "@/store/store";

// export default function ClientLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     const [isReady, setIsReady] = useState(false);
//     const store = Store();

//     useEffect(() => {
//         // Check if both store exists and i18n is initialized
//         const checkReady = () => {
//             if (store && i18n.isInitialized) {
//                 setIsReady(true);
//             }
//         };

//         checkReady();

//         // If i18n isn't ready yet, wait for initialization
//         if (!i18n.isInitialized) {
//             i18n.on("initialized", checkReady);
//             return () => i18n.off("initialized", checkReady);
//         }
//     }, [store]);

//     if (!isReady) {
//         return (
//             <div className="fixed inset-0 flex items-center justify-center"></div>
//         );
//     }

//     return (
//         <StoreProvider>
//             <I18nextProvider i18n={i18n}>
//                 <div
//                     className="min-h-screen flex flex-col"
//                     style={{
//                         background: `url(${bg.src}) center/cover no-repeat`,
//                     }}
//                 >
//                     <main className="flex-1">{children}</main>
//                     <Footer />
//                 </div>
//             </I18nextProvider>
//         </StoreProvider>
//     );
// }

"use client";

import i18n from "@/i18n/i18n";
import { I18nextProvider } from "react-i18next";
import Footer from "@/components/footer/Footer";
import { StoreProvider } from "@/store/storeProvider";
import bg from "../assets/backgroundMain.png";
import { useEffect, useState } from "react";
import { useOwnStore } from "@/store/storeProvider"; // Используем хук вместо прямого импорта Store

export default function ClientLayout({
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

    useEffect(() => {
        loadFromLocalStorage(); // Загружаем данные после монтирования
    }, [loadFromLocalStorage]);

    return (
        <I18nextProvider i18n={i18n}>
            <div
                className="min-h-screen flex flex-col"
                style={{
                    background: `url(${bg.src}) center/cover no-repeat`,
                }}
            >
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </I18nextProvider>
    );
}
