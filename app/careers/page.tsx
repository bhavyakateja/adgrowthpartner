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
    <div className="w-full max-w-[100vw] overflow-x-hidden box-border">
      <header className="on-ink bg-ink text-cream w-full max-w-full box-border">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 py-16 sm:py-24 md:px-10 md:py-32 w-full box-border">
          <p className="label-mono text-cream/55">Careers</p>

          <h1 className="font-display mt-4 sm:mt-6 w-full text-3xl sm:text-5xl md:text-7xl lg:text-[5.5vw] leading-[1.1] tracking-tight uppercase break-words">
            Make work
            <br />
            <span className="chrome-type">worth signing</span>
          </h1>

          <p className="mt-6 sm:mt-8 max-w-[54ch] text-sm sm:text-lg text-cream/70 break-words">
            Small team, real ownership, no layers between the thinking and the
            shipping. We hire people who would rather solve the problem than
            protect the process.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-4 sm:px-6 py-16 sm:py-28 md:px-10 w-full max-w-full box-border overflow-hidden">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 w-full">
          <Reveal className="col-span-12 md:col-span-4 min-w-0 box-border">
            <h2 className="label-mono text-sunset">How we work</h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground break-words">
              Few meetings, written decisions, and a bias toward showing the
              work early rather than polishing it in private.
            </p>
          </Reveal>

          <Reveal className="col-span-12 md:col-span-4 min-w-0 box-border" delay={0.05}>
            <h2 className="label-mono text-sunset">What we look for</h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground break-words">
              Taste, curiosity and follow-through. Craft matters more than the
              length of a CV.
            </p>
          </Reveal>

          <Reveal className="col-span-12 md:col-span-4 min-w-0 box-border" delay={0.1}>
            <h2 className="label-mono text-sunset">What you get</h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground break-words">
              Direct client contact, room to make calls, and colleagues who
              will tell you the truth about your work.
            </p>
          </Reveal>
        </div>

        <h2 className="font-display mt-16 sm:mt-24 text-3xl sm:text-5xl md:text-[5vw] leading-tight tracking-tight uppercase break-words">
          Open Positions
        </h2>

        {jobs.length === 0 ? (
          <div className="mt-8 sm:mt-10 border-t border-border pt-8 sm:pt-10 w-full">
            <p className="max-w-[54ch] text-sm sm:text-lg text-muted-foreground break-words">
              We don&apos;t have an open position right now. If your work is
              unusually good, write to us anyway — we keep track of people
              we&apos;d like to work with.
            </p>

            <a
              href={`mailto:${SITE.email}?subject=Speculative%20application`}
              className="label-mono mt-6 inline-block bg-ink px-6 sm:px-7 py-3.5 sm:py-4 text-cream transition-colors hover:bg-sunset hover:text-ink text-xs sm:text-sm text-center"
            >
              Write to us
            </a>
          </div>
        ) : (
          <ul className="mt-8 sm:mt-10 border-t border-border w-full">
            {jobs.map((job, i) => (
              <Reveal as="li" key={job.slug} delay={i * 0.04} className="w-full">
                <Link
                  href={`/careers/${job.slug}`}
                  className="group grid grid-cols-12 items-baseline gap-3 sm:gap-4 border-b border-border py-6 sm:py-7 w-full box-border"
                >
                  <span className="font-display col-span-12 text-xl sm:text-3xl tracking-tight uppercase transition-colors group-hover:text-sunset md:col-span-6 break-words">
                    {job.title}
                  </span>

                  <span className="label-mono col-span-6 text-muted-foreground md:col-span-3 text-xs sm:text-sm">
                    {job.location}
                  </span>

                  <span className="label-mono col-span-6 text-muted-foreground md:col-span-3 md:text-right text-xs sm:text-sm">
                    {job.employmentType}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}