"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navigation = [
    { name: "Dashboard", href: "/admin" },
    { name: "Enquiries", href: "/admin/enquiries" },
    { name: "Insights", href: "/admin/insights" },
    { name: "Work", href: "/admin/work" },
    { name: "Careers", href: "/admin/careers" },
    { name: "Applications", href: "/admin/applications" },
    { name: "Admins", href: "/admin/admins" },
];

export function AdminShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [busy, setBusy] = useState(false);

    async function handleSignOut() {
        setBusy(true);

        await fetch("/api/admin/auth", {
            method: "DELETE",
        });

        router.replace("/admin/auth");
        router.refresh();
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/admin" className="text-xl font-semibold">
                        AGP Admin
                    </Link>

                    <div className="flex items-center gap-5">
                        <Link
                            href="/"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            View site
                        </Link>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            disabled={busy}
                            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
                        >
                            {busy ? "Signing out…" : "Sign out"}
                        </button>
                    </div>
                </div>
            </header>

            <nav className="border-b">
                <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-6">
                    {navigation.map((item) => {
                        const active =
                            item.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`whitespace-nowrap border-b-2 py-4 text-sm ${
                                    active
                                        ? "border-foreground text-foreground"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-6 py-8">
                {children}
            </main>
        </div>
    );
}