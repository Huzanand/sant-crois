import "../styles/globals.css";
import ServerLayout from "./server-layout";
import ClientLayout from "./client-layout";
import { StrictMode } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StrictMode>
            <ServerLayout>
                <ClientLayout>{children}</ClientLayout>
            </ServerLayout>
        </StrictMode>
    );
}
