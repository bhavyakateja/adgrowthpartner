import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { InsightForm } from "@/components/admin/InsightForm";

export default async function EditInsightPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [insights, categories] = await Promise.all([
        db.orm.public.Insight.where({ id }).all(),
        db.orm.public.Category.orderBy((model) => model.name.asc()).all(),
    ]);
    const insight = insights[0];

    if (!insight) notFound();

    return (
        <main className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-2xl font-semibold">Edit Insight</h1>

                <div className="mt-8">
                    <InsightForm initial={insight} categories={categories} />
                </div>
            </div>
        </main>
    );
}
