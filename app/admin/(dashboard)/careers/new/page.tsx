import { JobForm } from "@/components/admin/JobForm";

export default function NewJobPage() {
    return (
        <main className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <h1 className="text-2xl font-semibold">New Job</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Create a new career opening.
                </p>

                <div className="mt-8">
                    <JobForm />
                </div>
            </div>
        </main>
    );
}
