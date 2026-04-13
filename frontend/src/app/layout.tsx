import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { Header, Footer } from '@/components/common';
import { COMPANY_INFO } from '@/constants';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: `${COMPANY_INFO.name} - ${COMPANY_INFO.tagline}`,
  description: COMPANY_INFO.description,
  keywords: 'viajes, agencia de viajes, paquetes internacionales, turismo',
  authors: [{ name: COMPANY_INFO.name }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://luxviajes.com',
    siteName: COMPANY_INFO.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${manrope.variable} scroll-smooth`}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
