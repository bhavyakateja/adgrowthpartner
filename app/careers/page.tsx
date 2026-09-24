import type { Metadata } from "next";
import Link from "next/link";
import { getCachedOpenJobs } from "@/lib/data";
import { Reveal } from "@/components/site/Reveal";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Careers — Ad Growth Partner",
  description:
    "Open roles and how we work at Ad Growth Partner — a small team of strategists, makers and engineers.",
  openGraph: {
    title: "Careers — Ad Growth Partner",
    description: "Join a team that ships thinking, not decks.",
  },
};

export default async function CareersPage() {
  const jobs = await getCachedOpenJobs();

  return (
    <>
      <header className="on-ink bg-ink text-cream">
        <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
          <p className="label-mono text-cream/55">Careers</p>

          <h1 className="font-display mt-6 max-w-[18ch] text-[9vw] leading-[0.86] tracking-tight uppercase md:text-[5.5vw]">
            Make work
            <br />
            <span className="chrome-type">worth signing</span>
          </h1>

          <p className="mt-8 max-w-[54ch] text-lg text-cream/70">
            Small team, real ownership, no layers between the thinking and the
            shipping. We hire people who would rather solve the problem than
            protect the process.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          <Reveal className="col-span-12 md:col-span-4">
            <h2 className="label-mono text-sunset">How we work</h2>
            <p className="mt-4 text-muted-foreground">
              Few meetings, written decisions, and a bias toward showing the
              work early rather than polishing it in private.
            </p>
          </Reveal>

          <Reveal className="col-span-12 md:col-span-4" delay={0.05}>
            <h2 className="label-mono text-sunset">What we look for</h2>
            <p className="mt-4 text-muted-foreground">
              Taste, curiosity and follow-through. Craft matters more than the
              length of a CV.
            </p>
          </Reveal>

          <Reveal className="col-span-12 md:col-span-4" delay={0.1}>
            <h2 className="label-mono text-sunset">What you get</h2>
            <p className="mt-4 text-muted-foreground">
              Direct client contact, room to make calls, and colleagues who
              will tell you the truth about your work. [EDITABLE CONTENT]
            </p>
          </Reveal>
        </div>

        <h2 className="font-display mt-24 text-[10vw] leading-none tracking-tight uppercase md:text-[5vw]">
          Open Positions
        </h2>

        {jobs.length === 0 ? (
          <div className="mt-10 border-t border-border pt-10">
            <p className="max-w-[54ch] text-lg text-muted-foreground">
              We don&apos;t have an open position right now. If your work is
              unusually good, write to us anyway — we keep track of people
              we&apos;d like to work with.
            </p>

            <a
              href={`mailto:${SITE.email}?subject=Speculative%20application`}
              className="label-mono mt-6 inline-block bg-ink px-7 py-4 text-cream transition-colors hover:bg-sunset hover:text-ink"
            >
              Write to us
            </a>
          </div>
        ) : (
          <ul className="mt-10 border-t border-border">
            {jobs.map((job, i) => (
              <Reveal as="li" key={job.slug} delay={i * 0.04}>
                <Link
                  href={`/careers/${job.slug}`}
                  className="group grid grid-cols-12 items-baseline gap-4 border-b border-border py-7"
                >
                  <span className="font-display col-span-12 text-3xl tracking-tight uppercase transition-colors group-hover:text-sunset md:col-span-6">
                    {job.title}
                  </span>

                  <span className="label-mono col-span-6 text-muted-foreground md:col-span-3">
                    {job.location}
                  </span>

                  <span className="label-mono col-span-6 text-muted-foreground md:col-span-3 md:text-right">
                    {job.employmentType}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}