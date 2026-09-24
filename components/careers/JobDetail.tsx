"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PhoneField } from "@/components/site/PhoneField";

type Job = {
  id: string;
  title: string;
  location: string;
  employmentType: string;
  team: string;
  description: string;
  requirements: string;
};

const schema = z.object({
  full_name: z.string().trim().min(2, "Tell us your name"),
  email: z.string().trim().email("Enter a valid email"),
  country_code: z.string().min(1),
  phone: z.string().trim().min(4, "Enter a valid phone number"),
  resume_url: z
    .string()
    .trim()
    .url("Add a link to your CV (PDF, Drive, Dropbox)"),
  portfolio_url: z.union([
    z.string().trim().url("Enter a valid link"),
    z.literal(""),
  ]),
  message: z.string().trim().max(3000),
});

type FormValues = z.infer<typeof schema>;

const field =
  "mt-2 w-full border-0 border-b border-input bg-transparent px-0 py-3 text-base outline-none focus:border-sunset";

export default function JobDetail({ job }: { job: Job }) {
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      email: "",
      country_code: "+91",
      phone: "",
      resume_url: "",
      portfolio_url: "",
      message: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch("/api/careers/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          job_id: job.id,
          job_title: job.title,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Application failed");
      }

      setDone(true);
    } catch {
      toast.error("We couldn't send your application. Please try again.");
    }
  };

  return (
    <>
      <header className="on-ink bg-ink text-cream">
        <div className="mx-auto max-w-375 px-5 py-24 md:px-10 md:py-28">
          <Link
            href="/careers"
            className="label-mono text-cream/50 hover:text-sunset"
          >
            ← Careers
          </Link>

          <h1 className="font-display mt-8 max-w-[18ch] text-[9vw] leading-[0.86] tracking-tight uppercase md:text-[5.5vw]">
            {job.title}
          </h1>

          <p className="label-mono mt-8 text-cream/60">
            {job.location} · {job.employmentType}
            {job.team ? ` · ${job.team}` : ""}
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-375 grid-cols-12 gap-x-12 gap-y-16 px-5 py-20 md:px-10 md:py-28">
        <div className="col-span-12 lg:col-span-7">
          <h2 className="label-mono text-muted-foreground">The role</h2>

          <div className="mt-4 space-y-5 text-lg leading-relaxed">
            {(job.description ?? "")
              .split(/\n{2,}/)
              .filter(Boolean)
              .map((p, i) => (
                <p key={i}>{p}</p>
              ))}
          </div>

          {job.requirements && (
            <>
              <h2 className="label-mono mt-12 text-muted-foreground">
                What we&apos;re looking for
              </h2>

              <ul className="mt-4 space-y-3">
                {job.requirements
                  .split("\n")
                  .filter(Boolean)
                  .map((r, i) => (
                    <li
                      key={i}
                      className="border-t border-border pt-3 text-lg"
                    >
                      {r.replace(/^[-•]\s*/, "")}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="border border-border p-6 md:p-8">
            <h2 className="font-display text-3xl tracking-tight uppercase">
              Apply
            </h2>

            {done ? (
              <p className="mt-6 text-muted-foreground">
                Thank you — your application is with us. If it&apos;s a fit,
                you&apos;ll hear from a person, not a template.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mt-6 space-y-6"
              >
                <div>
                  <label
                    htmlFor="full_name"
                    className="label-mono text-muted-foreground"
                  >
                    Full name
                  </label>

                  <input
                    id="full_name"
                    className={field}
                    {...register("full_name")}
                  />

                  {errors.full_name && (
                    <p className="mt-2 text-sm text-destructive">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="label-mono text-muted-foreground"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    className={field}
                    {...register("email")}
                  />

                  {errors.email && (
                    <p className="mt-2 text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <PhoneField
                  code={watch("country_code")}
                  phone={watch("phone")}
                  onCodeChange={(value: string) =>
                    setValue("country_code", value, {
                      shouldValidate: true,
                    })
                  }
                  onPhoneChange={(value: string) =>
                    setValue("phone", value, {
                      shouldValidate: true,
                    })
                  }
                  error={errors.phone?.message}
                />

                <div>
                  <label
                    htmlFor="resume_url"
                    className="label-mono text-muted-foreground"
                  >
                    CV link
                  </label>

                  <input
                    id="resume_url"
                    placeholder="https://"
                    className={field}
                    {...register("resume_url")}
                  />

                  {errors.resume_url && (
                    <p className="mt-2 text-sm text-destructive">
                      {errors.resume_url.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="portfolio_url"
                    className="label-mono text-muted-foreground"
                  >
                    Portfolio link (optional)
                  </label>

                  <input
                    id="portfolio_url"
                    placeholder="https://"
                    className={field}
                    {...register("portfolio_url")}
                  />

                  {errors.portfolio_url && (
                    <p className="mt-2 text-sm text-destructive">
                      {errors.portfolio_url.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="label-mono text-muted-foreground"
                  >
                    Anything you want us to read first
                  </label>

                  <textarea
                    id="message"
                    rows={4}
                    className={field}
                    {...register("message")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="label-mono w-full bg-ink px-7 py-4 text-cream transition-colors hover:bg-sunset hover:text-ink disabled:opacity-60"
                >
                  {isSubmitting ? "Sending…" : "Send application"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}