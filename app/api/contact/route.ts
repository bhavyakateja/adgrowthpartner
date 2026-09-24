import { z } from "zod";
import { db } from "@/lib/db";
import {
  escapeHtml,
  getAdminEmail,
  sendEmail,
} from "@/lib/email";

const inquirySchema = z.object({
  organizationName: z.string().trim().min(2),
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  countryCode: z.string().min(1),
  phone: z.string().trim().min(4),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  goal: z.string().optional(),
  service: z.string().optional(),
  description: z.string().trim().min(20).max(1200),
  companyWebsite: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid enquiry details.",
        },
        { status: 400 },
      );
    }

    const values = parsed.data;

    // Honeypot — silently accept bot submissions.
    if (values.companyWebsite) {
      return Response.json({ success: true });
    }

    await db.orm.public.ContactInquiry.create({
      organizationName: values.organizationName,
      fullName: values.fullName,
      email: values.email,
      countryCode: values.countryCode,
      phone: values.phone,
      country: values.country ?? "",
      state: values.state ?? "",
      city: values.city ?? "",
      goal: values.goal ?? "",
      service: values.service ?? "",
      description: values.description,
    });

    const name = escapeHtml(values.fullName);
    const email = escapeHtml(values.email);
    const organization = escapeHtml(values.organizationName);
    const description = escapeHtml(values.description);
    const subject = `New enquiry from ${values.organizationName}`;

    const emailResults = await Promise.allSettled([
      Promise.resolve().then(() =>
        sendEmail({
          to: getAdminEmail(),
          replyTo: values.email,
          subject,
          html: `<h2>New website enquiry</h2><p><strong>Name:</strong> ${name}</p><p><strong>Organisation:</strong> ${organization}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${escapeHtml(values.countryCode)} ${escapeHtml(values.phone)}</p><p><strong>Goal:</strong> ${escapeHtml(values.goal ?? "")}</p><p><strong>Service:</strong> ${escapeHtml(values.service ?? "")}</p><p>${description}</p>`,
        }),
      ),
      Promise.resolve().then(() =>
        sendEmail({
          to: values.email,
          subject: "We received your enquiry",
          html: `<p>Hi ${name},</p><p>Thanks for starting a conversation with Ad Growth Partner. We have received your enquiry and will reply within two working days.</p><p>Best,<br />Ad Growth Partner</p>`,
        }),
      ),
    ]);

    for (const result of emailResults) {
      if (result.status === "rejected") {
        console.error("CONTACT EMAIL ERROR:", result.reason);
      }
    }

    return Response.json({
      success: true,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: "Unable to submit enquiry.",
      },
      { status: 500 },
    );
  }
}