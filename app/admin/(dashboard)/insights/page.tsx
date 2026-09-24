import { db } from "@/lib/db";
import { InsightsTable } from "@/components/admin/InsightsTable";

export default async function InsightsPage() {
    const insights = await db.orm.public.Insight
        .orderBy((model) => model.createdAt.desc())
        .all();

    return (
        <main className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-2xl font-semibold">Insights</h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Manage articles and publishing status.
                </p>

                <div className="mt-8">
                    <InsightsTable insights={insights} />
                </div>
            </div>
        </main>
    );
}
