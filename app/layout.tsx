import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

import { SiteChrome } from "@/components/site/SiteChrome";
import { I18nProvider } from "@/lib/i18n";
import IntroBootstrap from "@/components/intro/IntroBootstrap";
import IntroAnimation from "@/components/intro/IntroAnimation";
import { GoogleTranslateSync } from "@/components/site/GoogleTranslateSync";

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
  preload: false, // Prevents unused font preload warnings in dev
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: false, // Prevents unused font preload warnings in dev
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
  preload: false, // Prevents unused font preload warnings in dev
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
    // suppressHydrationWarning: IntroBootstrap sets <html data-intro="…"> before
    // React hydrates, which would otherwise log an attribute-mismatch warning.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${anton.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
      >
        {/* Must stay first: decides play/skip before anything below paints. */}
        <IntroBootstrap />
        <IntroAnimation />

        {/*
          Google Translate container.

          IMPORTANT: this must NOT be `display: none`. Google's script needs
          the element to actually be laid out to build its internal
          <select class="goog-te-combo">, which is what our language
          switcher drives. `display:none` here was the reason translation
          never worked at all — the combo box was simply never created.
          This is the standard visually-hidden (not display:none) pattern:
          present in layout, invisible on screen.
        */}
        <div
          id="google_translate_element"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        />

        {/*
          Order matters: the callback Google's script looks up on `window`
          must exist BEFORE that script loads and tries to call it. Define
          it first, then load the script that invokes it.
        */}
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              // Guard against double-init (Fast Refresh in dev, etc.)
              if (window.__gtInit) return;
              window.__gtInit = true;
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                autoDisplay: false
              }, 'google_translate_element');
            }
            window.googleTranslateElementInit = googleTranslateElementInit;
          `}
        </Script>
        <Script
          id="google-translate"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        {/* Reapplies a previously chosen language after route changes and
            on first mount if the widget was still loading. */}
        <GoogleTranslateSync />

        {/* Global Styles to suppress Google's intrusive banner and layout jumps */}
        <style>{`
          .goog-te-banner-frame.skiptranslate { display: none !important; }
          body { top: 0px !important; }
          .goog-tooltip { display: none !important; }
          .goog-tooltip:hover { display: none !important; }
          .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
        `}</style>

        <I18nProvider>
          <SiteChrome>{children}</SiteChrome>
        </I18nProvider>
      </body>
    </html>
  );
}