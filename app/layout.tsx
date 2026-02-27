import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { LanguageProvider } from '@/lib/i18n/context';
import { getLocale } from '@/lib/i18n/server';
import ScrollRestorer from '@/components/ScrollRestorer';
import './globals.css';

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    style: ['normal', 'italic'],
    variable: '--font-montserrat',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Laura Guerrero — Marketing Strategist',
    description: 'Ayudo a marcas y negocios a crecer con estrategias de email marketing, SEO y e-commerce que generan resultados reales.',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();

    return (
        <html lang={locale}>
            <body className={`${montserrat.variable} antialiased`}>
                <LanguageProvider initialLocale={locale}>
                    <ScrollRestorer />
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}
