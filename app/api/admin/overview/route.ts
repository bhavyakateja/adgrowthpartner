import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();

    const [
      inquiries,
      insights,
      jobs,
      applications,
    ] = await Promise.all([
      db.orm.public.ContactInquiry.all(),
      db.orm.public.Insight.select("id", "published").all(),
      db.orm.public.Job.select("id", "status").all(),
      db.orm.public.JobApplication.select("id").all(),
    ]);

    const recent = inquiries
      .sort(
        (a, b) =>
          String(b.createdAt).localeCompare(String(a.createdAt)),
      )
      .slice(0, 6);

    return Response.json({
      success: true,
      counts: {
        inquiries: inquiries.length,
        newInquiries: inquiries.filter((item) => item.status === "NEW").length,
        published: insights.filter((item) => item.published).length,
        drafts: insights.filter((item) => !item.published).length,
        openJobs: jobs.filter((item) => item.status === "OPEN").length,
        applications: applications.length,
      },
      recent,
    });
  } catch {
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }
}