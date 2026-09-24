import { WorkForm } from "@/components/admin/WorkForm";

export default function NewWorkPage() {
    return (
        <main className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <h1 className="text-2xl font-semibold">New Work</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Create a new case study.
                </p>

                <div className="mt-8">
                    <WorkForm />
                </div>
            </div>
        </main>
    );
}
