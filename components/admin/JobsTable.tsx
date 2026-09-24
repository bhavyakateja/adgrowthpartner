"use client";

import Link from "next/link";
import { useState } from "react";

type Job = {
  id: string;
  title: string;
  location: string;
  employmentType: string;
  team: string;
  status: "DRAFT" | "OPEN" | "CLOSED";
};

export function JobsTable({ jobs: initial }: { jobs: Job[] }) {
  const [jobs, setJobs] = useState(initial);

  async function updateStatus(
    job: Job,
    status: Job["status"],
  ) {
    const response = await fetch("/api/admin/careers", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: job.id,
        status,
      }),
    });

    if (!response.ok) return;

    setJobs((current) =>
      current.map((item) =>
        item.id === job.id ? { ...item, status } : item,
      ),
    );
  }

  async function deleteJob(id: string) {
    if (!confirm("Delete this job?")) return;

    const response = await fetch("/api/admin/careers", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) return;

    setJobs((current) =>
      current.filter((item) => item.id !== id),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/admin/careers/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
          No jobs yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Location
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Team
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b last:border-0"
                >
                  <td className="px-4 py-3 font-medium">
                    {job.title}
                  </td>

                  <td className="px-4 py-3">
                    {job.location || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {job.employmentType || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {job.team || "—"}
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={job.status}
                      onChange={(e) =>
                        updateStatus(
                          job,
                          e.target.value as Job["status"],
                        )
                      }
                      className="rounded-md border bg-background px-2 py-1 text-xs"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="OPEN">Open</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/careers/edit/${job.id}`}
                        className="rounded-md border px-3 py-1.5 text-xs font-medium"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => deleteJob(job.id)}
                        className="rounded-md border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}