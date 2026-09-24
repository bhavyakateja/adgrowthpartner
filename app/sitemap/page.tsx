import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCachedSitemapData } from "@/lib/data";
import { POLICY_LINKS, SOLUTIONS } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sitemap — Ad Growth Partner",
  description:
    "Every page on the Ad Growth Partner website, in one place.",
  openGraph: {
    title: "Sitemap — Ad Growth Partner",
    description: "Find any page on this site.",
  },
};

export default async function SitemapPage() {
  const { work, insights, jobs } = await getCachedSitemapData();

  return (
    <>
      <header className="on-ink bg-ink text-cream">
        <div className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-28">
          <p className="label-mono text-cream/50">Sitemap</p>

          <h1 className="font-display mt-5 text-[12vw] leading-none tracking-tight uppercase md:text-[6vw]">
            Everything, listed
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[80ch]">
          <Accordion defaultValue={["main"]}>
            <AccordionItem value="main">
              <AccordionTrigger className="font-display text-2xl uppercase">
                Main pages
              </AccordionTrigger>

              <AccordionContent>
                <ul className="space-y-2 py-2">
                  {[
                    ["/", "Home"],
                    ["/solutions", "Solutions"],
                    ["/work", "Work"],
                    ["/insights", "Insights"],
                    ["/who-we-are", "Who we are"],
                    ["/careers", "Careers"],
                    ["/contact", "Contact"],
                  ].map(([href, label]) => (
                    <li key={href}>
                      <Link href={href} className="hover:text-sunset">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="solutions">
              <AccordionTrigger className="font-display text-2xl uppercase">
                Solutions
              </AccordionTrigger>

              <AccordionContent>
                <ul className="space-y-2 py-2">
                  {SOLUTIONS.map((solution) => (
                    <li key={solution.slug}>
                      <Link
                        href={`/solutions#${solution.slug}`}
                        className="hover:text-sunset"
                      >
                        {solution.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="work">
              <AccordionTrigger className="font-display text-2xl uppercase">
                Case studies
              </AccordionTrigger>

              <AccordionContent>
                <ul className="space-y-2 py-2">
                  {work.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/work/${item.slug}`}
                        className="hover:text-sunset"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="insights">
              <AccordionTrigger className="font-display text-2xl uppercase">
                Insights
              </AccordionTrigger>

              <AccordionContent>
                <ul className="space-y-2 py-2">
                  {insights.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/insights/${post.slug}`}
                        className="hover:text-sunset"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="careers">
              <AccordionTrigger className="font-display text-2xl uppercase">
                Open roles
              </AccordionTrigger>

              <AccordionContent>
                <ul className="space-y-2 py-2">
                  {jobs.length === 0 && (
                    <li className="text-muted-foreground">
                      No open roles right now.
                    </li>
                  )}

                  {jobs.map((job) => (
                    <li key={job.slug}>
                      <Link
                        href={`/careers/${job.slug}`}
                        className="hover:text-sunset"
                      >
                        {job.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="legal">
              <AccordionTrigger className="font-display text-2xl uppercase">
                Legal
              </AccordionTrigger>

              <AccordionContent>
                <ul className="space-y-2 py-2">
                  {POLICY_LINKS.map((link) => (
                    <li key={link.to}>
                      <Link href={link.to} className="hover:text-sunset">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <p className="mt-12 text-sm text-muted-foreground">
            Looking for the machine-readable version?{" "}
            <Link
              href="/sitemap.xml"
              className="text-sunset underline underline-offset-4"
            >
              sitemap.xml
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}