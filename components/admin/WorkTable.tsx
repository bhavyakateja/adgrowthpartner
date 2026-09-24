"use client";

import Link from "next/link";
import { useState } from "react";

type Work = {
  id: string;
  title: string;
  client: string;
  industry: string;
  published: boolean;
};

export function WorkTable({ works: initial }: { works: Work[] }) {
  const [works, setWorks] = useState(initial);

  async function togglePublished(work: Work) {
    const response = await fetch("/api/admin/work", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: work.id,
        published: !work.published,
      }),
    });

    if (!response.ok) return;

    setWorks((current) =>
      current.map((item) =>
        item.id === work.id
          ? { ...item, published: !item.published }
          : item,
      ),
    );
  }

  async function deleteWork(id: string) {
    if (!confirm("Delete this work?")) return;

    const response = await fetch("/api/admin/work", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) return;

    setWorks((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/admin/work/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          New Work
        </Link>
      </div>

      {works.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
          No work yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Client</th>
                <th className="px-4 py-3 text-left font-medium">
                  Industry
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
              {works.map((work) => (
                <tr key={work.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">
                    {work.title}
                  </td>

                  <td className="px-4 py-3">
                    {work.client || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {work.industry || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {work.published ? "Published" : "Draft"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/work/edit/${work.id}`}
                        className="rounded-md border px-3 py-1.5 text-xs font-medium"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => togglePublished(work)}
                        className="rounded-md border px-3 py-1.5 text-xs font-medium"
                      >
                        {work.published ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteWork(work.id)}
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