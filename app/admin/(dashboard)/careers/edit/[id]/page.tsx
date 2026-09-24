import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { JobForm } from "@/components/admin/JobForm";

export default async function EditJobPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const jobs = await db.orm.public.Job.where({ id }).all();
    const job = jobs[0];

    if (!job) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <h1 className="text-2xl font-semibold">Edit Job</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Update this career opening.
                </p>

                <div className="mt-8">
                    <JobForm initial={job} />
                </div>
            </div>
        </main>
    );
}
