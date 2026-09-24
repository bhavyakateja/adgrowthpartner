"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

export function SiteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname.startsWith("/admin")) {
        return children;
    }

    return (
        <>
            <Nav />
            {children}
            <Footer />
        </>
    );
}
