import { Container } from '@/components/layout/container';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { OrderProvider } from '@/context/orderContext';
import { ProductsProvider } from '@/context/productContext';
import { ProductPaginationProvider } from '@/context/productionPaginationContext';
import { ShopProvider } from '@/context/shopContext';
import localFont from 'next/font/local';
import './globals.css';

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
          <ProductPaginationProvider>
            <ProductsProvider>
              <OrderProvider>
                <Header />
                <Container>{children}</Container>
                <Footer />
              </OrderProvider>
            </ProductsProvider>
          </ProductPaginationProvider>
        </ShopProvider>
      </body>
    </html>
  );
}
