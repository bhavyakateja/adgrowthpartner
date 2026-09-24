"use client";

import Link from "next/link";
import { useState } from "react";

type Insight = {
  id: string;
  title: string;
  slug: string;
  author: string;
  published: boolean;
  createdAt: unknown;
};

export function InsightsTable({
  insights: initial,
}: {
  insights: Insight[];
}) {
  const [insights, setInsights] = useState(initial);

  async function togglePublished(insight: Insight) {
    const response = await fetch("/api/admin/insights", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: insight.id,
        published: !insight.published,
      }),
    });

    if (!response.ok) return;

    setInsights((current) =>
      current.map((item) =>
        item.id === insight.id
          ? { ...item, published: !item.published }
          : item,
      ),
    );
  }

  async function deleteInsight(id: string) {
    if (!confirm("Delete this insight?")) return;

    const response = await fetch("/api/admin/insights", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) return;

    setInsights((current) =>
      current.filter((item) => item.id !== id),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/admin/insights/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          New Insight
        </Link>
      </div>

      {insights.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
          No insights yet.
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
                  Author
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
              {insights.map((insight) => (
                <tr
                  key={insight.id}
                  className="border-b last:border-0"
                >
                  <td className="px-4 py-3 font-medium">
                    {insight.title}
                  </td>

                  <td className="px-4 py-3">
                    {insight.author || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {insight.published ? "Published" : "Draft"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/insights/edit/${insight.id}`}
                        className="rounded-md border px-3 py-1.5 text-xs font-medium"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => togglePublished(insight)}
                        className="rounded-md border px-3 py-1.5 text-xs font-medium"
                      >
                        {insight.published
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteInsight(insight.id)}
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