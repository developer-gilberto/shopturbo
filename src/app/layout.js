"use client";

import localFont from "next/font/local";
import "./globals.css";
import { LoadingProvider } from "@/hooks/LoadingContext";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useState } from "react";
import { Loading } from "@/components/ui/loading";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

// export const metadata = {
//     title: "ShopTurbo",
//     description: "Seu gerenciador de vendas.",
// };

export default function RootLayout({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    // if (isLoading) return <Loading />

    return !isLoading ? (
        <LoadingProvider>
            <html lang="pt-br">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <Header />
                    <Container>{children}</Container>
                    <Footer />
                </body>
            </html>
        </LoadingProvider>
    ) : (
        <html lang="pt-br" className="flex justify-center items-center ">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-fit flex justify-center items-center `}
            >
                <Loading />
            </body>
        </html>
    );
}
