"use client";

import Link from "next/link";
import { useState } from "react";

import { SOLUTIONS } from "@/lib/site";
import { Reveal } from "@/components/site/Reveal";

type WorkItem = {
  slug: string;
  title: string;
  industry: string;
  services: readonly string[];
};

type SolutionsContentProps = {
  work: WorkItem[];
};

export default function SolutionsContent({
  work,
}: SolutionsContentProps) {
  const [active, setActive] = useState<string>(SOLUTIONS[0].slug);

  const current =
    SOLUTIONS.find((solution) => solution.slug === active) ??
    SOLUTIONS[0];

  const related = work.filter((item) =>
    (item.services ?? []).some(
      (service) =>
        service.toLowerCase() === current.title.toLowerCase(),
    ),
  );

  return (
    <>
      <header className="on-ink bg-ink text-cream">
        <div className="mx-auto max-w-375 px-5 py-24 md:px-10 md:py-32">
          <p className="label-mono text-cream/55">Solutions</p>

          <h1 className="font-display mt-6 max-w-[18ch] text-[9vw] leading-[0.86] tracking-tight uppercase md:text-[5.5vw]">
            One system,
            <br />
            <span className="chrome-type">nine disciplines</span>
          </h1>

          <p className="mt-8 max-w-[54ch] text-lg text-cream/70">
            We don&apos;t sell services in isolation. Each capability below
            exists because a growth system fails without it — pick where it
            hurts and we&apos;ll start there.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-375 grid-cols-12 gap-x-4 px-5 py-20 md:gap-x-8 md:px-10 md:py-28 lg:gap-x-10">
        <nav
          aria-label="Solutions"
          className="col-span-12 min-w-0 w-full max-w-full lg:col-span-4"
        >
          <ul className="min-w-0 w-full max-w-full border-t border-border lg:sticky lg:top-24">
            {SOLUTIONS.map((solution, index) => (
              <li
                key={solution.slug}
                id={solution.slug}
                className="scroll-mt-24 min-w-0 border-b border-border"
              >
                <button
                  type="button"
                  onClick={() => setActive(solution.slug)}
                  aria-current={
                    active === solution.slug ? "true" : undefined
                  }
                  className={`flex min-w-0 w-full items-baseline gap-4 py-4 text-left transition-colors ${active === solution.slug
                    ? "text-sunset"
                    : "hover:text-sunset"
                    }`}
                >
                  <span className="label-mono text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="font-display min-w-0 wrap-break-word text-2xl tracking-tight uppercase">
                    {solution.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <section
          key={current.slug}
          className="col-span-12 mt-14 lg:col-span-8 lg:mt-0"
        >
          <Reveal>
            <h2 className="font-display text-[10vw] leading-[0.9] tracking-tight uppercase md:text-[4.5vw]">
              {current.title}
            </h2>

            <p className="mt-4 max-w-[48ch] text-xl text-sunset">
              {current.lead}
            </p>

            <dl className="mt-12 space-y-10 border-t border-border pt-10">
              <div>
                <dt className="label-mono text-muted-foreground">
                  The problem
                </dt>

                <dd className="mt-3 max-w-[62ch] text-lg">
                  {current.problem}
                </dd>
              </div>

              <div>
                <dt className="label-mono text-muted-foreground">
                  Our approach
                </dt>

                <dd className="mt-3 max-w-[62ch] text-lg">
                  {current.approach}
                </dd>
              </div>

              <div>
                <dt className="label-mono text-muted-foreground">
                  Outcomes
                </dt>

                <dd className="mt-3">
                  <ul className="grid gap-2 sm:grid-cols-3">
                    {current.outcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="border-t border-sunset/60 pt-3 text-sm"
                      >
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            {related.length > 0 && (
              <div className="mt-12 border-t border-border pt-8">
                <p className="label-mono text-muted-foreground">
                  Relevant work
                </p>

                <ul className="mt-4 space-y-2">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/work/${item.slug}`}
                        className="text-lg hover:text-sunset"
                      >
                        {item.title}{" "}
                        <span className="text-muted-foreground">
                          — {item.industry}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href="/contact"
              className="label-mono mt-12 inline-block bg-ink px-7 py-4 text-cream transition-colors hover:bg-sunset hover:text-ink"
            >
              Start a Conversation
            </Link>
          </Reveal>
        </section>
      </div>
    </>
  );
}