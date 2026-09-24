import { db } from "@/lib/db";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";

export default async function ApplicationsPage() {
  const applications = await db.orm.public.JobApplication
    .orderBy((model) => model.createdAt.desc())
    .all();

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold">Applications</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Review job applications.
        </p>

        <div className="mt-8">
          <ApplicationsTable applications={applications} />
        </div>
      </div>
    </main>
  );
}