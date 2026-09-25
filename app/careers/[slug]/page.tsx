import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllOpenJobSlugs, getCachedJobBySlug } from "@/lib/data";
import JobDetail from "@/components/careers/JobDetail";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllOpenJobSlugs();
  return slugs.map((item) => ({ slug: item.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCachedJobBySlug(slug);

  if (!item) {
    return {
      title: "Unavailable — Ad Growth Partner",
      robots: {
        index: false,
      },
    };
  }

  const description = `${item.title} — ${item.location}, ${item.employmentType}. Apply to join Ad Growth Partner.`;

  return {
    title: `${item.title} — Careers — Ad Growth Partner`,
    description,
    openGraph: {
      title: `${item.title} — Ad Growth Partner`,
      description,
    },
  };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getCachedJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden box-border">
      <JobDetail
        job={{
          id: job.id,
          title: job.title,
          location: job.location,
          employmentType: job.employmentType,
          team: job.team,
          description: job.description,
          requirements: job.requirements,
        }}
      />
    </div>
  );
}