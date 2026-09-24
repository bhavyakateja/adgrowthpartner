import { db } from "@/lib/db";

export default async function AdminPage() {
  const [inquiries, insights, work, jobs, applications] = await Promise.all([
    db.orm.public.ContactInquiry.select("id").all(),
    db.orm.public.Insight.select("id").all(),
    db.orm.public.CaseStudy.select("id").all(),
    db.orm.public.Job.select("id").all(),
    db.orm.public.JobApplication.select("id").all(),
  ]);

  const stats = [
    { label: "Enquiries", value: inquiries.length, href: "/admin/enquiries" },
    { label: "Insights", value: insights.length, href: "/admin/insights" },
    { label: "Work", value: work.length, href: "/admin/work" },
    { label: "Jobs", value: jobs.length, href: "/admin/careers" },
    {
      label: "Applications",
      value: applications.length,
      href: "/admin/applications",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Overview of your website content and activity.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <a
            key={stat.href}
            href={stat.href}
            className="rounded-xl border bg-card p-5 transition-colors hover:bg-muted/50"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
          </a>
        ))}
      </div>
    </section>
  );
}