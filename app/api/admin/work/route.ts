import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidateCaseStudies } from "@/lib/data";

export async function GET() {
  try {
    await requireAdmin();

    const work = await db.orm.public.CaseStudy
      .orderBy((model) => model.sortOrder.asc())
      .all();

    return Response.json({ success: true, work });
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

    if (!body.id || typeof body.published !== "boolean") {
      return Response.json(
        { success: false, error: "Invalid request." },
        { status: 400 },
      );
    }

    const work = await db.orm.public.CaseStudy
      .where({ id: body.id })
      .all();

    const existing = work[0];
    if (!existing) {
      return Response.json(
        { success: false, error: "Case study not found." },
        { status: 404 },
      );
    }

    await db.orm.public.CaseStudy
      .where({ id: body.id })
      .update({
        published: body.published,
      });

    revalidateCaseStudies(existing.slug);

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Unable to update case study." },
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

    const work = await db.orm.public.CaseStudy
      .where({ id: body.id })
      .all();

    const existing = work[0];

    await db.orm.public.CaseStudy
      .where({ id: body.id })
      .delete();

    revalidateCaseStudies(existing?.slug);

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Unable to delete case study." },
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
      client,
      industry,
      summary,
      challenge,
      approach,
      execution,
      results,
      services,
      coverImage,
      gallery,
      year,
      published,
    } = body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof slug !== "string" ||
      !slug.trim()
    ) {
      return Response.json(
        { error: "Title and slug are required" },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return Response.json(
        { error: "Slug must contain only lowercase letters, numbers and hyphens" },
        { status: 400 },
      );
    }

    const data = {
      title: title.trim(),
      slug: slug.trim(),
      client: typeof client === "string" ? client.trim() : "",
      industry: typeof industry === "string" ? industry.trim() : "",
      summary: typeof summary === "string" ? summary.trim() : "",
      challenge: typeof challenge === "string" ? challenge.trim() : "",
      approach: typeof approach === "string" ? approach.trim() : "",
      execution: typeof execution === "string" ? execution.trim() : "",
      results: typeof results === "string" ? results.trim() : "",
      services: Array.isArray(services)
        ? services.filter((item): item is string => typeof item === "string")
        : [],
      coverImage:
        typeof coverImage === "string" && coverImage.trim()
          ? coverImage.trim()
          : null,
      gallery: Array.isArray(gallery)
        ? gallery.filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0,
        )
        : [],
      year:
        typeof year === "number" && Number.isInteger(year)
          ? year
          : null,
      published: Boolean(published),
    };

    if (id) {
      const existing = await db.orm.public.CaseStudy
        .where({ id })
        .all();

      if (!existing[0]) {
        return Response.json(
          { error: "Work not found" },
          { status: 404 },
        );
      }

      await db.orm.public.CaseStudy
        .where({ id })
        .update(data);

      revalidateCaseStudies(data.slug);
      if (existing[0].slug !== data.slug) {
        revalidateCaseStudies(existing[0].slug);
      }

      return Response.json({ success: true });
    }

    await db.orm.public.CaseStudy.create(data);
    revalidateCaseStudies(data.slug);

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Admin work POST error:", error);

    return Response.json(
      { error: "Failed to save work" },
      { status: 500 },
    );
  }
}