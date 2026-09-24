import { db } from "@/lib/db";
import { EnquiriesTable } from "@/components/admin/EnquiriesTable";

export default async function EnquiriesPage() {
    const enquiries = await db.orm.public.ContactInquiry
        .orderBy((model) => model.createdAt.desc())
        .all();

    return (
        <main className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-2xl font-semibold">Enquiries</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Manage contact enquiries.
                </p>

                <div className="mt-8">
                    <EnquiriesTable enquiries={enquiries} />
                </div>
            </div>
        </main>
    );
}
