import type { ReactNode } from "react";

export type LegalSection = {
  heading: string;
  body: string[];
};

type LegalPageProps = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  children?: ReactNode;
};

export function LegalPage({
  title,
  updated,
  intro,
  sections,
  children,
}: LegalPageProps) {
  return (
    <article>
      <header className="on-ink bg-ink text-cream">
        <div className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-28">
          <p className="label-mono text-cream/50">Legal</p>

          <h1 className="font-display mt-5 text-[11vw] leading-none tracking-tight uppercase md:text-[5.5vw]">
            {title}
          </h1>

          <p className="label-mono mt-6 text-cream/50">
            Last updated {updated}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[70ch]">
          <p className="text-xl leading-relaxed">{intro}</p>

          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl tracking-tight uppercase">
                  {section.heading}
                </h2>

                <div className="mt-3 space-y-3 text-muted-foreground">
                  {section.body.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {children}
        </div>
      </div>
    </article>
  );
}