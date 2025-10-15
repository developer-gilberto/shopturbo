import localFont from 'next/font/local';
import './globals.css';
import { ShopProvider } from '@/context/shopContext';
import { Container } from '@/components/layout/container';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { ProductsProvider } from '@/context/productContext';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata = {
    title: 'ShopTurbo',
    description: 'Descomplique suas vendas.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-br">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ShopProvider>
                    <ProductsProvider>
                        <Header />
                        <Container>{children}</Container>
                        <Footer />
                    </ProductsProvider>
                </ShopProvider>
            </body>
        </html>
    );
}
