"use client";

import Footer from "@/components/footer/Footer";
import { StoreProvider } from "@/store/storeProvider";
import { useEffect, useState } from "react";
import { useOwnStore } from "@/store/storeProvider"; // Используем хук вместо прямого импорта Store
import dynamic from "next/dynamic";
import Script from "next/script";

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
            <LoadedContent>
                {children}
                <Script
                    id="clarity-script"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "s8owkv8zjn");
        `,
                    }}
                />
            </LoadedContent>
        </StoreProvider>
    );
}

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
