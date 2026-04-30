import type { Metadata, Viewport } from 'next';
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/svg/logo2.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://luxviajes.com',
    siteName: COMPANY_INFO.name,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: COMPANY_INFO.name,
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
        {/* Favicon adicional por si acaso */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/svg/logo2.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}