import { db } from "@/lib/db";
import { JobsTable } from "@/components/admin/JobsTable";

export default async function CareersPage() {
    const jobs = await db.orm.public.Job
        .orderBy((model) => model.createdAt.desc())
        .all();

    return (
        <main className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-2xl font-semibold">Careers</h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Manage job openings.
                </p>

                <div className="mt-8">
                    <JobsTable jobs={jobs} />
                </div>
            </div>
        </main>
    );
}
