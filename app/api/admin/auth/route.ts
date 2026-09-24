import { z } from "zod";
import { db } from "@/lib/db";
import {
    createSession,
    hashPassword,
    signOut,
    verifyPassword,
} from "@/lib/auth";

const schema = z.object({
    mode: z.enum(["signin", "signup"]),
    email: z.string().trim().toLowerCase().email().max(160),
    password: z.string().min(8).max(200),
});

export async function POST(request: Request) {
    try {
        const parsed = schema.safeParse(await request.json());

        if (!parsed.success) {
            return Response.json(
                { success: false, error: "Invalid email or password." },
                { status: 400 },
            );
        }

        const { mode, email, password } = parsed.data;
        const existing = await db.orm.public.AdminUser.where({ email }).all();
        const user = existing[0];

        if (mode === "signin") {
            if (!user || !(await verifyPassword(password, user.passwordHash))) {
                return Response.json(
                    {
                        success: false,
                        error:
                            "Those details didn't work. Check the email and password and try again.",
                    },
                    { status: 401 },
                );
            }

            const roles = await db.orm.public.UserRole.where({
                userId: user.id,
                role: "admin",
            }).all();

            if (roles.length === 0) {
                return Response.json(
                    { success: false, error: "This account is not authorized." },
                    { status: 403 },
                );
            }

            await createSession(user.id);
            return Response.json({ success: true, redirectTo: "/admin" });
        }

        if (user) {
            return Response.json(
                { success: false, error: "That account already exists." },
                { status: 409 },
            );
        }

        if ((await db.orm.public.AdminUser.all()).length > 0) {
            return Response.json(
                {
                    success: false,
                    error: "The first admin account has already been created.",
                },
                { status: 403 },
            );
        }

        const newUser = await db.orm.public.AdminUser.create({
            email,
            passwordHash: await hashPassword(password),
        });

        await db.orm.public.UserRole.create({
            userId: newUser.id,
            role: "admin",
        });

        await createSession(newUser.id);
        return Response.json({ success: true, redirectTo: "/admin" });
    } catch (error) {
        console.error("AUTH ERROR:", error);
        return Response.json(
            { success: false, error: "Unable to authenticate." },
            { status: 500 },
        );
    }
}

export async function DELETE() {
    await signOut();
    return Response.json({ success: true });
}
