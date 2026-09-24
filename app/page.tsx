import type { Metadata } from "next";
import { getCachedHomeInsights } from "@/lib/data";
import HomeContent from "@/components/home/HomeContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ad Growth Partner — Growth, Creative & Technology Agency",
  description:
    "Strategy, creative, technology and performance built as one compounding demand system. Start a conversation with Ad Growth Partner.",
  openGraph: {
    title: "Ad Growth Partner — Demand systems that compound",
    description:
      "A growth, creative and digital technology partner for ambitious brands.",
  },
};

export default async function HomePage() {
  const insights = await getCachedHomeInsights();

  return <HomeContent insights={insights} />;
}