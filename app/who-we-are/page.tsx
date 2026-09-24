import type { Metadata } from "next";
import Link from "next/link";

import { PROCESS } from "@/lib/site";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "Who We Are — Ad Growth Partner",
  description:
    "A growth, creative and technology practice built around one belief: clarity compounds faster than volume.",
  openGraph: {
    title: "Who We Are — Ad Growth Partner",
    description: "What we believe and how we work.",
  },
};

const BELIEFS = [
  {
    title: "Clarity before cleverness",
    body: "A sharp position out-performs a clever execution. We do the unglamorous thinking first, then earn the right to be bold.",
  },
  {
    title: "Creative is a growth lever",
    body: "Media buys distribution; creative buys attention. We treat the idea as the highest-leverage variable in the model.",
  },
  {
    title: "Technology is part of the craft",
    body: "The site, the stack and the data pipeline are design decisions. We build them with the same care as the campaign.",
  },
  {
    title: "Numbers we can defend",
    body: "One definition of a conversion, one source of truth, and a written reason behind every decision we make with your budget.",
  },
];

export default function WhoWeArePage() {
  return (
    <>
      <header className="on-ink relative isolate overflow-hidden bg-ink text-cream">
        <div
          className="surface-horizon absolute inset-0 -z-10 opacity-80"
          aria-hidden
        />

        <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
          <p className="label-mono text-cream/55">Who we are</p>

          <h1 className="font-display mt-6 max-w-[18ch] text-[9vw] leading-[0.86] tracking-tight uppercase md:text-[5.5vw]">
            A small team
            <br />
            <span className="chrome-type">with one seam</span>
          </h1>

          <p className="mt-8 max-w-[56ch] text-lg text-cream/70">
            Strategy, creative and engineering sit in the same room and
            answer to the same number. There is no hand-off, because there is
            nowhere to hand off to.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-12 gap-10">
          <Reveal className="col-span-12 lg:col-span-7">
            <h2 className="font-display text-[8vw] leading-[0.9] tracking-tight uppercase md:text-[4vw]">
              Why we exist
            </h2>

            <div className="mt-8 max-w-[60ch] space-y-5 text-lg text-muted-foreground">
              <p>
                Most brands don&apos;t lack effort. They lack a single,
                coherent explanation of who they&apos;re for, why they win,
                and what happens to a rupee once it enters the system.
              </p>

              <p>
                Ad Growth Partner was built to hold that whole picture — the
                position, the work that expresses it, the technology that
                carries it, and the measurement that keeps everyone honest.
                [EDITABLE CONTENT]
              </p>
            </div>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-5" delay={0.08}>
            <img
              src="/assets/editorial-chrome.jpg"
              alt="Editorial composition representing the studio's visual language"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="surface-dusk">
        <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
          <h2 className="font-display text-[10vw] leading-none tracking-tight uppercase md:text-[5vw]">
            What we believe
          </h2>

          <div className="mt-12 grid grid-cols-12 gap-x-8 gap-y-12">
            {BELIEFS.map((belief, index) => (
              <Reveal
                key={belief.title}
                delay={index * 0.05}
                className="col-span-12 md:col-span-6"
              >
                <p className="label-mono text-sunset">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-3 text-2xl tracking-tight">
                  {belief.title}
                </h3>

                <p className="mt-3 max-w-[52ch] text-muted-foreground">
                  {belief.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
        <h2 className="font-display text-[10vw] leading-none tracking-tight uppercase md:text-[5vw]">
          How we work
        </h2>

        <ol className="mt-12 border-t border-border">
          {PROCESS.map((process) => (
            <Reveal
              as="li"
              key={process.step}
              className="grid grid-cols-12 gap-6 border-b border-border py-8"
            >
              <span className="label-mono col-span-12 text-sunset md:col-span-2">
                {process.step}
              </span>

              <h3 className="font-display col-span-12 text-3xl tracking-tight uppercase md:col-span-3">
                {process.title}
              </h3>

              <p className="col-span-12 max-w-[60ch] text-muted-foreground md:col-span-7">
                {process.body}
              </p>
            </Reveal>
          ))}
        </ol>

        <div className="mt-16 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="label-mono bg-ink px-7 py-4 text-cream transition-colors hover:bg-sunset hover:text-ink"
          >
            Start a Conversation
          </Link>

          <Link
            href="/careers"
            className="label-mono border border-ink/25 px-7 py-4 transition-colors hover:border-sunset hover:text-sunset"
          >
            Work with us
          </Link>
        </div>
      </section>
    </>
  );
}