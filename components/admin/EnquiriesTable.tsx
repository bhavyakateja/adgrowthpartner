"use client";

import { useState } from "react";

type Enquiry = {
  id: string;
  organizationName: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  goal: string | null;
  service: string | null;
  description: string | null;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED";
  createdAt: unknown;
};

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED"] as const;

export function EnquiriesTable({
  enquiries: initial,
}: {
  enquiries: Enquiry[];
}) {
  const [enquiries, setEnquiries] = useState(initial);

  async function updateStatus(id: string, status: Enquiry["status"]) {
    const response = await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (!response.ok) return;

    setEnquiries((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
        No enquiries yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Organization</th>
            <th className="px-4 py-3 text-left font-medium">Email</th>
            <th className="px-4 py-3 text-left font-medium">Service</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Date</th>
          </tr>
        </thead>

        <tbody>
          {enquiries.map((enquiry) => (
            <tr key={enquiry.id} className="border-b last:border-0">
              <td className="px-4 py-4">
                {enquiry.fullName || "—"}
              </td>

              <td className="px-4 py-4">
                {enquiry.organizationName}
              </td>

              <td className="px-4 py-4">
                {enquiry.email || "—"}
              </td>

              <td className="px-4 py-4">
                {enquiry.service || "—"}
              </td>

              <td className="px-4 py-4">
                <select
                  value={enquiry.status}
                  onChange={(event) =>
                    updateStatus(
                      enquiry.id,
                      event.target.value as Enquiry["status"],
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

              <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                {String(enquiry.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}