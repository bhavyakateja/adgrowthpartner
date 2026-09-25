import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

import { SiteChrome } from "@/components/site/SiteChrome";
import { I18nProvider } from "@/lib/i18n";
import IntroAnimation from '@/components/intro/IntroAnimation';

import {
  Anton,
  Space_Grotesk,
  Space_Mono,
} from "next/font/google";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ad Growth Partner — Growth, Creative & Technology",
  description:
    "Ad Growth Partner builds demand systems that compound: strategy, creative, technology and performance in one team.",
  authors: [{ name: "Ad Growth Partner" }],
  icons: {
    icon: "/assets/logo.png",
  },
  openGraph: {
    title: "Ad Growth Partner",
    description:
      "Growth, creative and digital technology built as one system.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${anton.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
      >
        {/* Hidden Google Translate Element required for background widget script */}
        <div id="google_translate_element" style={{ display: "none" }} />

        {/* Google Translate Scripts */}
        <Script
          id="google-translate"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                autoDisplay: false
              }, 'google_translate_element');
            }
            window.googleTranslateElementInit = googleTranslateElementInit;
          `}
        </Script>

        {/* Global Styles to suppress Google's intrusive banner and layout jumps */}
        <style>{`
          .goog-te-banner-frame.skiptranslate { display: none !important; }
          body { top: 0px !important; }
          .goog-tooltip { display: none !important; }
          .goog-tooltip:hover { display: none !important; }
          .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
        `}</style>

        <IntroAnimation />
        <I18nProvider>
          <SiteChrome>{children}</SiteChrome>
        </I18nProvider>
      </body>
    </html>
  );
}