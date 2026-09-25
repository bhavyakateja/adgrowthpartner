import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, requireAdmin } from "@/lib/auth";

const schema = z.object({
    email: z.string().trim().toLowerCase().email().max(160),
    password: z.string().min(8).max(200),
});

export async function POST(request: Request) {
    try {
        // 1. Verify that the requester is an authorized admin using your auth library
        await requireAdmin();
    } catch {
        return Response.json(
            { success: false, error: "Unauthorized. Please sign in." },
            { status: 401 },
        );
    }

    try {
        // 2. Validate request payload with Zod
        const parsed = schema.safeParse(await request.json());
        if (!parsed.success) {
            return Response.json(
                { success: false, error: "Invalid email or password (min 8 characters required)." },
                { status: 400 },
            );
        }

        const { email, password } = parsed.data;

        // 3. Check if the target email is already registered
        const existing = await db.orm.public.AdminUser.where({ email }).all();
        if (existing.length > 0) {
            return Response.json(
                { success: false, error: "An admin account with this email already exists." },
                { status: 409 },
            );
        }

        // 4. Create the new admin user and assign the admin role
        const newUser = await db.orm.public.AdminUser.create({
            email,
            passwordHash: await hashPassword(password),
        });

        await db.orm.public.UserRole.create({
            userId: newUser.id,
            role: "admin",
        });

        return Response.json({ 
            success: true, 
            message: `Admin account for ${email} created successfully.` 
        });
    } catch (error) {
        console.error("CREATE ADMIN ERROR:", error);
        return Response.json(
            { success: false, error: "Unable to create admin account." },
            { status: 500 },
        );
    }
}