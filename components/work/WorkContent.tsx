"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Reveal } from "@/components/site/Reveal";

type WorkItem = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  coverImage: string | null;
  year: number | null;
};

type WorkContentProps = {
  work: WorkItem[];
};

export default function WorkContent({ work }: WorkContentProps) {
  const industries = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(work.map((item) => item.industry).filter(Boolean)),
      ),
    ],
    [work],
  );

  const [filter, setFilter] = useState("All");

  const visible =
    filter === "All"
      ? work
      : work.filter((item) => item.industry === filter);

  return (
    <>
      <header className="on-ink bg-ink text-cream">
        <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
          <p className="label-mono text-cream/55">Work</p>

          <h1 className="font-display mt-6 max-w-[18ch] text-[9vw] leading-[0.86] tracking-tight uppercase md:text-[5.5vw]">
            Proof over
            <br />
            <span className="chrome-type">promises</span>
          </h1>

          <p className="mt-8 max-w-[54ch] text-lg text-cream/70">
            A short list, deliberately. Each project below shows the reasoning
            as well as the output. [EDITABLE CONTENT]
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter work by industry"
        >
          {industries.map((industry) => (
            <button
              key={industry}
              type="button"
              onClick={() => setFilter(industry)}
              aria-pressed={filter === industry}
              className={`label-mono border px-4 py-2.5 transition-colors ${filter === industry
                  ? "border-ink bg-ink text-cream"
                  : "border-border text-muted-foreground hover:border-sunset hover:text-sunset"
                }`}
            >
              {industry}
            </button>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-16">
          {visible.map((item, index) => (
            <Reveal
              key={item.slug}
              delay={index * 0.04}
              className={
                index % 3 === 0
                  ? "col-span-12 md:col-span-7"
                  : "col-span-12 md:col-span-5 md:mt-16"
              }
            >
              <Link
                href={`/work/${item.slug}`}
                className="group block"
              >
                <div className="overflow-hidden bg-muted">
                  <img
                    src={
                      item.coverImage ??
                      "/assets/editorial-chrome.jpg"
                    }
                    alt={item.title}
                    loading={index < 2 ? "eager" : "lazy"}
                    className="aspect-[5/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="font-display text-3xl tracking-tight uppercase transition-colors group-hover:text-sunset md:text-4xl">
                    {item.title}
                  </h2>

                  <span className="label-mono text-muted-foreground">
                    {item.client} · {item.year}
                  </span>
                </div>

                <p className="mt-3 max-w-[56ch] text-muted-foreground">
                  {item.summary}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-16 text-muted-foreground">
            No projects in this category yet.
          </p>
        )}
      </div>
    </>
  );
}