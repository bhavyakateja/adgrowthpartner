"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { PROCESS, SITE, SOLUTIONS } from "@/lib/site";
import { Reveal } from "@/components/site/Reveal";
import { HeroBackdrop } from "@/components/site/HeroBackdrop";

type InsightItem = {
  slug: string;
  title: string;
  readingTime: number;
  category: {
    name: string;
  } | null;
};

type HomeContentProps = {
  insights: InsightItem[];
};

function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="on-ink relative isolate overflow-hidden bg-ink text-cream">
      <div
        className="surface-horizon absolute inset-0 -z-10 opacity-90"
        aria-hidden
      />

      <HeroBackdrop className="pointer-events-none absolute inset-0 -z-10 opacity-65" />

      <div
        className={`orb-chrome absolute -top-24 -right-24 -z-10 hidden h-[34rem] w-[34rem] rounded-full opacity-50 md:block ${reduced ? "" : "animate-drift"
          }`}
        aria-hidden
      />

      <div className="mx-auto flex min-h-[86vh] max-w-[1500px] flex-col justify-end px-5 pt-24 pb-14 md:px-10 md:pb-20">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="label-mono text-cream/60"
        >
          {SITE.tagline}
        </motion.p>

        <h1 className="font-display mt-6 max-w-[18ch] text-6xl sm:text-8xl md:text-[11vw] lg:text-[9vw] leading-[0.86] tracking-tight uppercase">
          <motion.span
            className="block"
            initial={reduced ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.32, 0.72, 0, 1],
              delay: 0.05,
            }}
          >
            Demand
          </motion.span>

          <motion.span
            className="chrome-type block"
            initial={reduced ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.32, 0.72, 0, 1],
              delay: 0.14,
            }}
          >
            Engineered
          </motion.span>
        </h1>

        <div className="mt-10 grid grid-cols-12 items-end gap-6">
          <p className="col-span-12 max-w-[46ch] text-lg text-cream/70 md:col-span-6 md:text-xl">
            We build the model, the creative and the technology behind demand
            — then run it as one loop until the numbers move in the right
            direction for a reason we can name.
          </p>

          <div className="col-span-12 flex flex-wrap gap-3 md:col-span-6 md:justify-end">
            <Link
              href="/contact"
              className="label-mono group relative overflow-hidden bg-cream px-7 py-4 text-ink"
            >
              <span className="relative z-10">
                Start a Conversation
              </span>

              <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-300 group-hover:translate-y-0" />
            </Link>

            {/* Work is hidden from the public launch. */}
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = [
    "Creativity",
    "Strategy",
    "Technology",
    "Performance",
  ];

  return (
    <div className="on-ink overflow-hidden border-y border-cream/10 bg-ink py-4 text-cream">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {[...words, ...words, ...words, ...words].map(
          (word, index) => (
            <span
              key={`${word}-${index}`}
              className="label-mono flex items-center gap-10 text-cream/45"
            >
              {word}

              <span className="text-sunset">/</span>
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export default function HomeContent({ insights }: HomeContentProps) {
  return (
    <>
      <Hero />

      <Marquee />

      {/* Positioning */}
      <section className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="label-mono text-muted-foreground">
            01 — Position
          </p>

          <h2 className="font-display mt-6 max-w-[18ch] text-[9vw] leading-[0.86] tracking-tight uppercase md:text-[5.5vw]">
            Most growth problems are{" "}
            <span className="text-sunset">clarity</span> problems wearing a
            media budget.
          </h2>

          <p className="mt-8 max-w-[58ch] text-lg text-muted-foreground">
            We work with teams who want a partner accountable to the whole
            system — the position, the creative, the stack and the spend —
            rather than one slice of it.
          </p>
        </Reveal>
      </section>

      {/* Solutions */}
      <section className="on-ink bg-ink text-cream">
        <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-[11vw] leading-none tracking-tight uppercase md:text-[5vw]">
              Solutions
            </h2>

            <Link
              href="/solutions"
              className="label-mono text-cream/60 hover:text-sunset"
            >
              All solutions →
            </Link>
          </div>

          <ul className="mt-12 border-t border-cream/12">
            {SOLUTIONS.map((solution, index) => (
              <Reveal
                as="li"
                key={solution.slug}
                delay={index * 0.03}
              >
                <Link
                  href={`/solutions#${solution.slug}`}
                  className="group grid grid-cols-12 items-baseline gap-4 border-b border-cream/12 py-6 transition-colors hover:bg-cream/[0.04]"
                >
                  <span className="label-mono col-span-2 text-cream/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="font-display col-span-10 text-3xl tracking-tight uppercase transition-colors group-hover:text-sunset md:col-span-5 md:text-4xl">
                    {solution.title}
                  </span>

                  <span className="col-span-12 text-sm text-cream/55 md:col-span-5">
                    {solution.lead}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Selected Work is intentionally hidden from the public launch. */}

      {/* How We Work */}
      <section className="surface-dusk">
        <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
          <h2 className="font-display text-[11vw] leading-none tracking-tight uppercase md:text-[5vw]">
            How We Work
          </h2>

          <div className="mt-12 grid grid-cols-12 gap-x-8 gap-y-10">
            {PROCESS.map((process, index) => (
              <Reveal
                key={process.step}
                delay={index * 0.05}
                className="col-span-12 sm:col-span-6 lg:col-span-3"
              >
                <p className="label-mono text-sunset">
                  {process.step}
                </p>

                <h3 className="font-display mt-3 text-3xl tracking-tight uppercase">
                  {process.title}
                </h3>

                <p className="mt-3 text-sm text-muted-foreground">
                  {process.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[11vw] leading-none tracking-tight uppercase md:text-[5vw]">
            Insights
          </h2>

          <Link
            href="/insights"
            className="label-mono text-muted-foreground hover:text-sunset"
          >
            All insights →
          </Link>
        </div>

        <ul className="mt-12 border-t border-border">
          {insights.map((post, index) => (
            <Reveal
              as="li"
              key={post.slug}
              delay={index * 0.04}
            >
              <Link
                href={`/insights/${post.slug}`}
                className="group grid grid-cols-12 items-baseline gap-4 border-b border-border py-6"
              >
                <span className="label-mono col-span-12 text-muted-foreground md:col-span-2">
                  {post.category?.name ?? "Perspective"}
                </span>

                <span className="col-span-12 text-xl tracking-tight transition-colors group-hover:text-sunset md:col-span-7 md:text-2xl">
                  {post.title}
                </span>

                <span className="label-mono col-span-12 text-muted-foreground md:col-span-3 md:text-right">
                  {post.readingTime ?? 4} min read
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Final CTA */}
      <section className="on-ink relative isolate overflow-hidden bg-ink text-cream">
        <div
          className="surface-horizon absolute inset-0 -z-10 opacity-80"
          aria-hidden
        />

        <HeroBackdrop className="pointer-events-none absolute inset-0 -z-10 opacity-60" />

        <div className="mx-auto max-w-[1500px] px-5 py-28 md:px-10 md:py-40">
          <p className="label-mono text-cream/60">Next step</p>

          <h2 className="font-display mt-6 max-w-[18ch] text-[9vw] leading-[0.86] tracking-tight uppercase md:text-[5.5vw]">
            Let&apos;s build the
            <br />
            <span className="chrome-type">next chapter</span>
          </h2>

          <Link
            href="/contact"
            className="label-mono group relative mt-10 inline-block overflow-hidden bg-cream px-8 py-4 text-ink"
          >
            <span className="relative z-10">
              Start the Conversation
            </span>

            <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-300 group-hover:translate-y-0" />
          </Link>
        </div>
      </section>
    </>
  );
}