import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { WorkForm } from "@/components/admin/WorkForm";

export default async function EditWorkPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const works = await db.orm.public.CaseStudy.where({ id }).all();
    const work = works[0];

    if (!work) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <h1 className="text-2xl font-semibold">Edit Work</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Update this case study.
                </p>

                <div className="mt-8">
                    <WorkForm initial={work} />
                </div>
            </div>
        </main>
    );
}
