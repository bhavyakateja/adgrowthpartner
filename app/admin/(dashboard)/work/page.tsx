import { db } from "@/lib/db";
import { WorkTable } from "@/components/admin/WorkTable";

export default async function WorkPage() {
    const work = await db.orm.public.CaseStudy
        .orderBy((model) => model.sortOrder.asc())
        .all();

    return (
        <main className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-2xl font-semibold">Work</h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Manage case studies and publishing status.
                </p>

                <div className="mt-8">
                    <WorkTable works={work} />
                </div>
            </div>
        </main>
    );
}
