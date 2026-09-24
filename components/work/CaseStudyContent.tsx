"use client";

import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";

type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  year: number | null;
  services: readonly string[];
  summary: string;
  challenge: string;
  approach: string;
  execution: string;
  results: string;
  coverImage: string | null;
  gallery: readonly string[];
};

type Props = {
  study: CaseStudy;
};

function Block({
  label,
  body,
}: {
  label: string;
  body: string;
}) {
  if (!body) return null;

  return (
    <Reveal className="grid grid-cols-12 gap-6 border-t border-border py-10">
      <p className="label-mono col-span-12 text-muted-foreground md:col-span-3">
        {label}
      </p>

      <p className="col-span-12 max-w-[62ch] text-lg md:col-span-9">
        {body}
      </p>
    </Reveal>
  );
}

function isVideo(url: string) {
  return (
    /\/video\/upload\//.test(url) ||
    /\.(mp4|webm|mov|m4v)(?:$|\?)/i.test(url)
  );
}

function Media({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  if (isVideo(src)) {
    return (
      <video
        src={src}
        aria-label={alt}
        controls
        playsInline
        preload="metadata"
        className={className}
      />
    );
  }

  return <img src={src} alt={alt} className={className} />;
}

export default function CaseStudyContent({ study }: Props) {
  return (
    <article>
      <header className="on-ink bg-ink text-cream">
        <div className="mx-auto max-w-375 px-5 py-24 md:px-10 md:py-28">
          <Link
            href="/work"
            className="label-mono text-cream/50 hover:text-sunset"
          >
            ← Work
          </Link>

          <h1 className="font-display mt-8 max-w-[18ch] text-[9vw] leading-[0.86] tracking-tight uppercase md:text-[5.5vw]">
            {study.title}
          </h1>

          <dl className="label-mono mt-10 grid grid-cols-2 gap-6 border-t border-cream/15 pt-6 text-cream/60 md:grid-cols-4">
            <div>
              <dt className="text-cream/35">Client</dt>
              <dd className="mt-2">{study.client}</dd>
            </div>

            <div>
              <dt className="text-cream/35">Industry</dt>
              <dd className="mt-2">{study.industry}</dd>
            </div>

            <div>
              <dt className="text-cream/35">Year</dt>
              <dd className="mt-2">{study.year}</dd>
            </div>

            <div>
              <dt className="text-cream/35">Services</dt>
              <dd className="mt-2">
                {study.services.join(", ")}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <Media
        src={study.coverImage ?? "/assets/editorial-chrome.jpg"}
        alt={study.title}
        className="aspect-video w-full object-cover"
      />

      <div className="mx-auto max-w-375 px-5 py-20 md:px-10 md:py-28">
        <p className="max-w-[30ch] text-3xl leading-tight tracking-tight md:text-5xl">
          {study.summary}
        </p>

        <div className="mt-16">
          <Block label="Challenge" body={study.challenge} />
          <Block label="Approach" body={study.approach} />
          <Block label="Execution" body={study.execution} />
          <Block label="Results" body={study.results} />
        </div>

        {study.gallery.length > 0 && (
          <div className="mt-16 grid grid-cols-12 gap-6">
            {study.gallery.map((src, index) => (
              <Media
                key={`${src}-${index}`}
                src={src}
                alt={`${study.title} — visual ${index + 1}`}
                className="col-span-12 aspect-4/3 w-full object-cover md:col-span-6"
              />
            ))}
          </div>
        )}

        <div className="mt-20 border-t border-border pt-10">
          <Link
            href="/contact"
            className="label-mono inline-block bg-ink px-7 py-4 text-cream transition-colors hover:bg-sunset hover:text-ink"
          >
            Start a Conversation
          </Link>
        </div>
      </div>
    </article>
  );
}