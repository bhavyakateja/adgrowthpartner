import { z } from "zod";
import { db } from "@/lib/db";
import {
  escapeHtml,
  getAdminEmail,
  sendEmail,
} from "@/lib/email";

const applicationSchema = z.object({
  job_id: z.string().uuid(),
  job_title: z.string().trim().min(1),
  full_name: z.string().trim().min(2),
  email: z.string().trim().email(),
  country_code: z.string().min(1),
  phone: z.string().trim().min(4),
  resume_url: z.string().trim().url(),
  portfolio_url: z.union([z.string().trim().url(), z.literal("")]),
  message: z.string().trim().max(3000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = applicationSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid application details.",
        },
        { status: 400 },
      );
    }

    const values = parsed.data;

    const jobs = await db.orm.public.Job
      .where({
        id: values.job_id,
        status: "OPEN",
      })
      .all();

    const job = jobs[0];

    if (!job) {
      return Response.json(
        {
          success: false,
          error: "This position is no longer open.",
        },
        { status: 404 },
      );
    }

    await db.orm.public.JobApplication.create({
      jobId: job.id,
      jobTitle: job.title,
      fullName: values.full_name,
      email: values.email,
      countryCode: values.country_code,
      phone: values.phone,
      resumeUrl: values.resume_url,
      portfolioUrl: values.portfolio_url || null,
      message: values.message,
    });

    const name = escapeHtml(values.full_name);
    const email = escapeHtml(values.email);
    const jobTitle = escapeHtml(job.title);
    const message = escapeHtml(values.message);

    const emailResults = await Promise.allSettled([
      Promise.resolve().then(() =>
        sendEmail({
          to: getAdminEmail(),
          replyTo: values.email,
          subject: `New application for ${job.title}`,
          html: `<h2>New job application</h2><p><strong>Role:</strong> ${jobTitle}</p><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${escapeHtml(values.country_code)} ${escapeHtml(values.phone)}</p><p><strong>CV:</strong> <a href="${escapeHtml(values.resume_url)}">View resume</a></p><p><strong>Portfolio:</strong> ${escapeHtml(values.portfolio_url || "Not provided")}</p><p>${message}</p>`,
        }),
      ),
      Promise.resolve().then(() =>
        sendEmail({
          to: values.email,
          subject: `We received your application for ${job.title}`,
          html: `<p>Hi ${name},</p><p>Thanks for applying for the ${jobTitle} role at Ad Growth Partner. We have received your application and will be in touch if there is a fit.</p><p>Best,<br />Ad Growth Partner</p>`,
        }),
      ),
    ]);

    for (const result of emailResults) {
      if (result.status === "rejected") {
        console.error("APPLICATION EMAIL ERROR:", result.reason);
      }
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      {
        success: false,
        error: "Unable to submit application.",
      },
      { status: 500 },
    );
  }
}