import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin sign in — Ad Growth Partner",
    description: "Internal sign in for Ad Growth Partner staff.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
