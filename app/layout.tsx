import type { Metadata } from "next";

import "./globals.css";

import { SiteChrome } from "@/components/site/SiteChrome";
import { I18nProvider } from "@/lib/i18n";

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
        <I18nProvider>
          <SiteChrome>{children}</SiteChrome>
        </I18nProvider>
      </body>
    </html>
  );
}