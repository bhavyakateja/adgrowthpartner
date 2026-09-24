import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
    try {
        await requireAdmin();

        const enquiries = await db.orm.public.ContactInquiry
            .orderBy((model) => model.createdAt.desc())
            .all();

        return Response.json({
            success: true,
            enquiries,
        });
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

        const allowed = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED"];

        if (!allowed.includes(body.status)) {
            return Response.json(
                { success: false, error: "Invalid status." },
                { status: 400 },
            );
        }

        const enquiries = await db.orm.public.ContactInquiry
            .where({ id: body.id })
            .all();

        const enquiry = enquiries[0];

        if (!enquiry) {
            return Response.json(
                { success: false, error: "Enquiry not found." },
                { status: 404 },
            );
        }

        await db.orm.public.ContactInquiry
            .where({ id: body.id })
            .update({
                status: body.status,
            });

        return Response.json({ success: true });
    } catch {
        return Response.json(
            { success: false, error: "Unable to update enquiry." },
            { status: 500 },
        );
    }
}