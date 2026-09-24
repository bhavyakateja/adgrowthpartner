import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    try {
        await requireAdmin();
    } catch {
        redirect("/admin/auth");
    }

    return <AdminShell>{children}</AdminShell>;
}
