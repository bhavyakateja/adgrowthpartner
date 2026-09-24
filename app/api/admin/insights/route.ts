import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidateInsights } from "@/lib/data";

export async function GET() {
  try {
    await requireAdmin();

    const insights = await db.orm.public.Insight
      .orderBy((model) => model.createdAt.desc())
      .all();

    return Response.json({ success: true, insights });
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

    const insights = await db.orm.public.Insight
      .where({ id: body.id })
      .all();

    const existing = insights[0];
    if (!existing) {
      return Response.json(
        { success: false, error: "Insight not found." },
        { status: 404 },
      );
    }

    await db.orm.public.Insight
      .where({ id: body.id })
      .update({
        published: body.published,
      });

    revalidateInsights(existing.slug);

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Unable to update insight." },
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

    const insights = await db.orm.public.Insight
      .where({ id: body.id })
      .all();

    const existing = insights[0];

    await db.orm.public.Insight
      .where({ id: body.id })
      .delete();

    revalidateInsights(existing?.slug);

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Unable to delete insight." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    if (!body.title || !body.slug || !body.content) {
      return Response.json(
        { success: false, error: "Title, slug and content are required." },
        { status: 400 },
      );
    }

    const data = {
      title: body.title.trim(),
      slug: body.slug.trim(),
      excerpt: body.excerpt?.trim() || "",
      content: body.content.trim(),
      coverImage: body.coverImage?.trim() || null,
      author: body.author?.trim() || "Ad Growth Partner",
      categoryId: body.categoryId || null,
      readingTime: Number(body.readingTime) || 4,
      seoTitle: body.seoTitle?.trim() || null,
      seoDescription: body.seoDescription?.trim() || null,
      published: Boolean(body.published),
    };

    if (body.id) {
      const existing = await db.orm.public.Insight
        .where({ id: body.id })
        .all();

      if (!existing[0]) {
        return Response.json(
          { success: false, error: "Insight not found." },
          { status: 404 },
        );
      }

      await db.orm.public.Insight
        .where({ id: body.id })
        .update(data);

      revalidateInsights(data.slug);
      if (existing[0].slug !== data.slug) {
        revalidateInsights(existing[0].slug);
      }
    } else {
      await db.orm.public.Insight.create(data);
      revalidateInsights(data.slug);
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Unable to save insight." },
      { status: 500 },
    );
  }
}