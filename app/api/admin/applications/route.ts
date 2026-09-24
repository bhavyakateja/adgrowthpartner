import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();

    const applications = await db.orm.public.JobApplication
      .orderBy((model) => model.createdAt.desc())
      .all();

    return Response.json({ success: true, applications });
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

    const allowed = ["NEW", "REVIEWING", "SHORTLISTED", "REJECTED"];

    if (!allowed.includes(body.status)) {
      return Response.json(
        { success: false, error: "Invalid status." },
        { status: 400 },
      );
    }

    const applications = await db.orm.public.JobApplication
      .where({ id: body.id })
      .all();

    if (!applications[0]) {
      return Response.json(
        { success: false, error: "Application not found." },
        { status: 404 },
      );
    }

    await db.orm.public.JobApplication
      .where({ id: body.id })
      .update({
        status: body.status,
      });

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Unable to update application." },
      { status: 500 },
    );
  }
}