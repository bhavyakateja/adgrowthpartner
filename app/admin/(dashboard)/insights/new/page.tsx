import { db } from "@/lib/db";
import { InsightForm } from "@/components/admin/InsightForm";

export default async function NewInsightPage() {
    const categories = await db.orm.public.Category
        .orderBy((model) => model.name.asc())
        .all();

    return (
        <main className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-2xl font-semibold">New Insight</h1>

                <div className="mt-8">
                    <InsightForm categories={categories} />
                </div>
            </div>
        </main>
    );
}
