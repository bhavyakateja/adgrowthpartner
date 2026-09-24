"use client";

import { useState } from "react";

type Application = {
  id: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  portfolioUrl: string | null;
  message: string;
  status: "NEW" | "REVIEWING" | "SHORTLISTED" | "REJECTED";
};

const statuses = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
] as const;

export function ApplicationsTable({
  applications: initial,
}: {
  applications: Application[];
}) {
  const [applications, setApplications] = useState(initial);

  async function updateStatus(
    id: string,
    status: Application["status"],
  ) {
    const response = await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (!response.ok) return;

    setApplications((current) =>
      current.map((application) =>
        application.id === id
          ? { ...application, status }
          : application,
      ),
    );
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
        No applications yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Applicant</th>
            <th className="px-4 py-3 text-left font-medium">Job</th>
            <th className="px-4 py-3 text-left font-medium">Email</th>
            <th className="px-4 py-3 text-left font-medium">Resume</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((application) => (
            <tr
              key={application.id}
              className="border-b last:border-0"
            >
              <td className="px-4 py-4 font-medium">
                {application.fullName}
              </td>

              <td className="px-4 py-4">
                {application.jobTitle}
              </td>

              <td className="px-4 py-4">
                {application.email}
              </td>

              <td className="px-4 py-4">
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  View
                </a>
              </td>

              <td className="px-4 py-4">
                <select
                  value={application.status}
                  onChange={(event) =>
                    updateStatus(
                      application.id,
                      event.target.value as Application["status"],
                    )
                  }
                  className="rounded-md border bg-background px-2 py-1.5 text-xs"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}