"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type JobData = {
  id?: string;
  title?: string;
  slug?: string;
  location?: string;
  employmentType?: string;
  team?: string;
  description?: string;
  requirements?: string;
  status?: "DRAFT" | "OPEN" | "CLOSED";
};

type JobFormProps = {
  initial?: JobData;
};

export function JobForm({ initial }: JobFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    location: initial?.location ?? "",
    employmentType: initial?.employmentType ?? "Full-time",
    team: initial?.team ?? "",
    description: initial?.description ?? "",
    requirements: initial?.requirements ?? "",
    status: initial?.status ?? "DRAFT",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/careers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: initial?.id,
          ...form,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save job");
      }

      router.push("/admin/careers");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save job",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Slug</label>
          <input
            required
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            placeholder="senior-developer"
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Location</label>
          <input
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Bengaluru, India"
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Employment Type</label>
          <input
            value={form.employmentType}
            onChange={(e) =>
              updateField("employmentType", e.target.value)
            }
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Team</label>
          <input
            value={form.team}
            onChange={(e) => updateField("team", e.target.value)}
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            value={form.status}
            onChange={(e) =>
              updateField("status", e.target.value)
            }
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          >
            <option value="DRAFT">Draft</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            required
            rows={10}
            value={form.description}
            onChange={(e) =>
              updateField("description", e.target.value)
            }
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Requirements</label>
          <textarea
            rows={10}
            value={form.requirements}
            onChange={(e) =>
              updateField("requirements", e.target.value)
            }
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : isEdit
              ? "Update Job"
              : "Create Job"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/careers")}
          className="rounded-lg border px-5 py-2 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}