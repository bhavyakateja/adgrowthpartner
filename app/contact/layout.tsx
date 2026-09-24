import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Ad Growth Partner",
  description:
    "Start a conversation with Ad Growth Partner. We build demand systems that compound: strategy, creative, technology and performance.",
  openGraph: {
    title: "Contact — Ad Growth Partner",
    description: "Start a conversation with Ad Growth Partner.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
