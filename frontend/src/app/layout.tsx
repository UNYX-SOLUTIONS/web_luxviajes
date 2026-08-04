import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { Header, Footer } from "@/components/common";
import { COMPANY_INFO } from "@/constants";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Luxviajes - Agencia de Viajes",
  description: COMPANY_INFO.description,

  applicationName: "Luxviajes",

  keywords: [
    "luxviajes",
    "agencia de viajes",
    "viajes internacionales",
    "visas",
    "turismo",
  ],

  authors: [{ name: "Luxviajes" }],

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://luxviajes.com",
    siteName: "Luxviajes",
    title: "Luxviajes - Agencia de Viajes",
    description: COMPANY_INFO.description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Luxviajes",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Luxviajes - Agencia de Viajes",
    description: COMPANY_INFO.description,
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
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
        <meta name="application-name" content="Luxviajes" />
        <meta name="apple-mobile-web-app-title" content="Luxviajes" />
        <meta name="og:site_name" content="Luxviajes" />
        {/* Favicon adicional por si acaso */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <Header />
          <main className="grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
