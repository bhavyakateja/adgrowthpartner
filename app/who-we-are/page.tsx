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
    <div className="w-full max-w-[100vw] overflow-x-hidden box-border">
      {/* Header Section */}
      <header className="on-ink relative isolate overflow-hidden bg-ink text-cream w-full max-w-full box-border">
        <div
          className="surface-horizon absolute inset-0 -z-10 opacity-80 pointer-events-none"
          aria-hidden
        />

        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 py-16 sm:py-24 md:px-10 md:py-32 w-full box-border">
          <p className="label-mono text-cream/55">Who we are</p>

          <h1 className="font-display mt-4 sm:mt-6 w-full text-3xl sm:text-5xl md:text-7xl lg:text-[5.5vw] leading-[1.1] tracking-tight uppercase break-words">
            A small team
            <br />
            <span className="chrome-type">with one seam</span>
          </h1>

          <p className="mt-6 sm:mt-8 max-w-[56ch] text-sm sm:text-lg text-cream/75 break-words">
            Strategy, creative and engineering sit in the same room and
            answer to the same number. There is no hand-off, because there is
            nowhere to hand off to.
          </p>
        </div>
      </header>

      {/* Why We Exist Section */}
      <section className="mx-auto max-w-[1500px] px-4 sm:px-6 py-16 sm:py-24 md:px-10 md:py-32 w-full max-w-full box-border overflow-hidden">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-center w-full">
          <Reveal className="col-span-12 lg:col-span-7 box-border min-w-0">
            <h2 className="font-display text-2xl sm:text-4xl md:text-[4vw] leading-[1.1] tracking-tight uppercase break-words">
              Why we exist
            </h2>

            <div className="mt-6 sm:mt-8 max-w-[60ch] space-y-4 sm:space-y-5 text-sm sm:text-lg text-muted-foreground break-words">
              <p>
                Most brands don&apos;t lack effort. They lack a single,
                coherent explanation of who they&apos;re for, why they win,
                and what happens to a rupee once it enters the system.
              </p>

              <p>
                Ad Growth Partner was built to hold that whole picture — the
                position, the work that expresses it, the technology that
                carries it, and the measurement that keeps everyone honest.
              </p>
            </div>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-5 mt-4 lg:mt-0 box-border w-full min-w-0" delay={0.08}>
            <div className="w-full overflow-hidden rounded-md">
              <img
                src="/assets/editorial-chrome.png"
                alt="Editorial composition representing the studio's visual language"
                loading="lazy"
                className="h-[220px] sm:h-[380px] lg:h-[450px] w-full object-cover max-w-full block"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What We Believe Section */}
      <section className="surface-dusk w-full max-w-full box-border overflow-hidden">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 py-16 sm:py-24 md:px-10 md:py-32 w-full box-border">
          <h2 className="font-display text-2xl sm:text-4xl md:text-[5vw] leading-tight tracking-tight uppercase break-words">
            What we believe
          </h2>

          <div className="mt-8 sm:mt-12 grid grid-cols-12 gap-x-6 gap-y-10 sm:gap-y-12 w-full">
            {BELIEFS.map((belief, index) => (
              <Reveal
                key={belief.title}
                delay={index * 0.05}
                className="col-span-12 md:col-span-6 box-border min-w-0"
              >
                <p className="label-mono text-sunset">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-2 sm:mt-3 text-lg sm:text-2xl tracking-tight font-medium break-words">
                  {belief.title}
                </h3>

                <p className="mt-2 sm:mt-3 max-w-[52ch] text-xs sm:text-base text-muted-foreground break-words">
                  {belief.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="mx-auto max-w-[1500px] px-4 sm:px-6 py-16 sm:py-24 md:px-10 md:py-32 w-full max-w-full box-border overflow-hidden">
        <h2 className="font-display text-2xl sm:text-4xl md:text-[5vw] leading-tight tracking-tight uppercase break-words">
          How we work
        </h2>

        <ol className="mt-8 sm:mt-12 border-t border-border w-full">
          {PROCESS.map((process) => (
            <Reveal
              as="li"
              key={process.step}
              className="grid grid-cols-12 gap-3 sm:gap-6 border-b border-border py-6 sm:py-8 items-start md:items-center w-full box-border min-w-0"
            >
              <span className="label-mono col-span-12 text-sunset md:col-span-2">
                {process.step}
              </span>

              <h3 className="font-display col-span-12 text-xl sm:text-3xl tracking-tight uppercase md:col-span-3 break-words">
                {process.title}
              </h3>

              <p className="col-span-12 max-w-[60ch] text-xs sm:text-base text-muted-foreground md:col-span-7 break-words">
                {process.body}
              </p>
            </Reveal>
          ))}
        </ol>

        <div className="mt-12 sm:mt-16 flex flex-wrap gap-4 w-full">
          <Link
            href="/contact"
            className="label-mono bg-ink px-6 sm:px-7 py-3.5 sm:py-4 text-cream transition-colors hover:bg-sunset hover:text-ink text-center text-xs sm:text-sm"
          >
            Start a Conversation
          </Link>

          <Link
            href="/careers"
            className="label-mono border border-ink/25 px-6 sm:px-7 py-3.5 sm:py-4 transition-colors hover:border-sunset hover:text-sunset text-center text-xs sm:text-sm"
          >
            Work with us
          </Link>
        </div>
      </section>
    </div>
  );
}