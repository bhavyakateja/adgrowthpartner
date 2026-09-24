import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidateJobs } from "@/lib/data";

export async function GET() {
  try {
    await requireAdmin();

    const jobs = await db.orm.public.Job
      .orderBy((model) => model.createdAt.desc())
      .all();

    return Response.json({ success: true, jobs });
  } catch {
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    if (!body.id || !body.status) {
      return Response.json(
        { success: false, error: "Invalid request." },
        { status: 400 },
      );
    }

    const allowed = ["DRAFT", "OPEN", "CLOSED"];

    if (!allowed.includes(body.status)) {
      return Response.json(
        { success: false, error: "Invalid status." },
        { status: 400 },
      );
    }

    const jobs = await db.orm.public.Job
      .where({ id: body.id })
      .all();

    const existing = jobs[0];
    if (!existing) {
      return Response.json(
        { success: false, error: "Job not found." },
        { status: 404 },
      );
    }

    await db.orm.public.Job
      .where({ id: body.id })
      .update({
        status: body.status,
      });

    revalidateJobs(existing.slug);

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Unable to update job." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    if (!body.id) {
      return Response.json(
        { success: false, error: "Invalid request." },
        { status: 400 },
      );
    }

    const jobs = await db.orm.public.Job
      .where({ id: body.id })
      .all();

    const existing = jobs[0];

    await db.orm.public.Job
      .where({ id: body.id })
      .delete();

    revalidateJobs(existing?.slug);

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Unable to delete job." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    const {
      id,
      title,
      slug,
      location,
      employmentType,
      team,
      description,
      requirements,
      status,
    } = body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof slug !== "string" ||
      !slug.trim()
    ) {
      return Response.json(
        { success: false, error: "Title and slug are required." },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return Response.json(
        {
          success: false,
          error:
            "Slug must contain only lowercase letters, numbers and hyphens.",
        },
        { status: 400 },
      );
    }

    const allowed = ["DRAFT", "OPEN", "CLOSED"];

    if (!allowed.includes(status)) {
      return Response.json(
        { success: false, error: "Invalid status." },
        { status: 400 },
      );
    }

    const data = {
      title: title.trim(),
      slug: slug.trim(),
      location:
        typeof location === "string" ? location.trim() : "",
      employmentType:
        typeof employmentType === "string"
          ? employmentType.trim()
          : "",
      team:
        typeof team === "string" ? team.trim() : "",
      description:
        typeof description === "string"
          ? description.trim()
          : "",
      requirements:
        typeof requirements === "string"
          ? requirements.trim()
          : "",
      status,
    };

    if (id) {
      const jobs = await db.orm.public.Job
        .where({ id })
        .all();

      if (!jobs[0]) {
        return Response.json(
          { success: false, error: "Job not found." },
          { status: 404 },
        );
      }

      await db.orm.public.Job
        .where({ id })
        .update(data);

      revalidateJobs(data.slug);
      if (jobs[0].slug !== data.slug) {
        revalidateJobs(jobs[0].slug);
      }

      return Response.json({ success: true });
    }

    await db.orm.public.Job.create(data);
    revalidateJobs(data.slug);

    return Response.json(
      { success: true },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin careers POST error:", error);

    return Response.json(
      { success: false, error: "Unable to save job." },
      { status: 500 },
    );
  }
}