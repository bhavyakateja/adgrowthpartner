import { cache } from "react";
import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";

export type CachedInsight = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  publishedAt: string | null;
  readingTime: number;
  seoTitle: string | null;
  seoDescription: string | null;
  category: {
    name: string;
  } | null;
};

export type CachedJob = {
  id: string;
  title: string;
  slug: string;
  location: string;
  employmentType: string;
  team: string;
  description: string;
  requirements: string;
  status: string;
  createdAt: string;
};

export type CachedCaseStudy = {
  slug: string;
  title: string;
  industry: string;
  services: readonly string[];
  updatedAt?: string | null;
};

/**
 * Fetch top published insights for the Home page
 */
export const getCachedHomeInsights = cache(
  unstable_cache(
    async () => {
      const rows = await db.orm.public.Insight
        .where({ published: true })
        .orderBy((item) => item.publishedAt.desc())
        .include("category")
        .all();

      return rows.slice(0, 3).map((item) => ({
        slug: item.slug,
        title: item.title,
        readingTime: item.readingTime,
        category: item.category
          ? {
              name: item.category.name,
            }
          : null,
      }));
    },
    ["home-insights"],
    {
      revalidate: 3600,
      tags: ["insights"],
    },
  ),
);

/**
 * Fetch all published insights for the Insights index page
 */
export const getCachedPublishedInsights = cache(
  unstable_cache(
    async () => {
      const rows = await db.orm.public.Insight
        .where({ published: true })
        .orderBy((item) => item.publishedAt.desc())
        .include("category")
        .all();

      return rows.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        author: post.author,
        publishedAt: post.publishedAt ? String(post.publishedAt) : null,
        readingTime: post.readingTime,
        category: post.category
          ? {
              name: post.category.name,
            }
          : null,
      }));
    },
    ["published-insights"],
    {
      revalidate: 3600,
      tags: ["insights"],
    },
  ),
);

/**
 * Fetch a single insight by slug.
 * Wrapped with React cache so generateMetadata and InsightPage never perform duplicate queries.
 */
export const getCachedInsightBySlug = cache(
  async (slug: string): Promise<CachedInsight | null> => {
    const fetcher = unstable_cache(
      async (s: string) => {
        const rows = await db.orm.public.Insight
          .where({
            slug: s,
            published: true,
          })
          .include("category")
          .all();

        const post = rows[0];
        if (!post) return null;

        return {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          author: post.author,
          publishedAt: post.publishedAt ? String(post.publishedAt) : null,
          readingTime: post.readingTime,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          category: post.category
            ? {
                name: post.category.name,
              }
            : null,
        };
      },
      [`insight-${slug}`],
      {
        revalidate: 3600,
        tags: ["insights", `insight-${slug}`],
      },
    );

    return fetcher(slug);
  },
);

/**
 * Get all published insight slugs for generateStaticParams
 */
export const getAllPublishedInsightSlugs = cache(
  unstable_cache(
    async () => {
      const rows = await db.orm.public.Insight
        .where({ published: true })
        .select("slug")
        .all();

      return rows.map((row) => ({ slug: row.slug }));
    },
    ["insight-slugs"],
    {
      revalidate: 3600,
      tags: ["insights"],
    },
  ),
);

/**
 * Fetch all open jobs for the Careers index page
 */
export const getCachedOpenJobs = cache(
  unstable_cache(
    async () => {
      const rows = await db.orm.public.Job
        .where({ status: "OPEN" })
        .orderBy((job) => job.createdAt.desc())
        .all();

      return rows.map((job) => ({
        id: job.id,
        title: job.title,
        slug: job.slug,
        location: job.location,
        employmentType: job.employmentType,
        team: job.team,
        description: job.description,
        requirements: job.requirements,
        status: job.status,
        createdAt: String(job.createdAt),
      }));
    },
    ["open-jobs"],
    {
      revalidate: 3600,
      tags: ["jobs"],
    },
  ),
);

/**
 * Fetch a single open job by slug.
 * Deduplicated via React cache for generateMetadata and JobPage.
 */
export const getCachedJobBySlug = cache(
  async (slug: string): Promise<CachedJob | null> => {
    const fetcher = unstable_cache(
      async (s: string) => {
        const rows = await db.orm.public.Job
          .where({ slug: s, status: "OPEN" })
          .all();

        const job = rows[0];
        if (!job) return null;

        return {
          id: job.id,
          title: job.title,
          slug: job.slug,
          location: job.location,
          employmentType: job.employmentType,
          team: job.team,
          description: job.description,
          requirements: job.requirements,
          status: job.status,
          createdAt: String(job.createdAt),
        };
      },
      [`job-${slug}`],
      {
        revalidate: 3600,
        tags: ["jobs", `job-${slug}`],
      },
    );

    return fetcher(slug);
  },
);

/**
 * Get all open job slugs for generateStaticParams
 */
export const getAllOpenJobSlugs = cache(
  unstable_cache(
    async () => {
      const rows = await db.orm.public.Job
        .where({ status: "OPEN" })
        .select("slug")
        .all();

      return rows.map((row) => ({ slug: row.slug }));
    },
    ["job-slugs"],
    {
      revalidate: 3600,
      tags: ["jobs"],
    },
  ),
);

/**
 * Fetch case studies for Solutions page
 */
export const getCachedSolutionsCaseStudies = cache(
  unstable_cache(
    async () => {
      const rows = await db.orm.public.CaseStudy
        .where({ published: true })
        .select("slug", "title", "industry", "services")
        .all();

      return rows.map((item) => ({
        slug: item.slug,
        title: item.title,
        industry: item.industry,
        services: item.services,
      }));
    },
    ["solutions-case-studies"],
    {
      revalidate: 3600,
      tags: ["case-studies"],
    },
  ),
);

/**
 * Fetch sitemap data for both /sitemap page and /sitemap.xml route
 */
export const getCachedSitemapData = cache(
  unstable_cache(
    async () => {
      const [work, insights, jobs] = await Promise.all([
        db.orm.public.CaseStudy
          .where({ published: true })
          .select("slug", "title", "updatedAt")
          .all(),
        db.orm.public.Insight
          .where({ published: true })
          .select("slug", "title", "updatedAt")
          .all(),
        db.orm.public.Job
          .where({ status: "OPEN" })
          .select("slug", "title", "updatedAt")
          .all(),
      ]);

      return {
        work: work.map((w) => ({
          slug: w.slug,
          title: w.title,
          updatedAt: w.updatedAt ? String(w.updatedAt) : null,
        })),
        insights: insights.map((i) => ({
          slug: i.slug,
          title: i.title,
          updatedAt: i.updatedAt ? String(i.updatedAt) : null,
        })),
        jobs: jobs.map((j) => ({
          slug: j.slug,
          title: j.title,
          updatedAt: j.updatedAt ? String(j.updatedAt) : null,
        })),
      };
    },
    ["sitemap-data"],
    {
      revalidate: 3600,
      tags: ["sitemap", "insights", "jobs", "case-studies"],
    },
  ),
);

/**
 * On-demand cache revalidation for Insights
 */
export function revalidateInsights(slug?: string) {
  try {
    revalidateTag("insights", "max");
  } catch {}
  try {
    revalidatePath("/");
    revalidatePath("/insights");
    revalidatePath("/sitemap");
    revalidatePath("/sitemap.xml");
    if (slug) {
      revalidatePath(`/insights/${slug}`);
    }
  } catch {}
}

/**
 * On-demand cache revalidation for Jobs / Careers
 */
export function revalidateJobs(slug?: string) {
  try {
    revalidateTag("jobs", "max");
  } catch {}
  try {
    revalidatePath("/careers");
    revalidatePath("/sitemap");
    revalidatePath("/sitemap.xml");
    if (slug) {
      revalidatePath(`/careers/${slug}`);
    }
  } catch {}
}

/**
 * On-demand cache revalidation for Case Studies / Work
 */
export function revalidateCaseStudies(slug?: string) {
  try {
    revalidateTag("case-studies", "max");
  } catch {}
  try {
    revalidatePath("/solutions");
    revalidatePath("/sitemap");
    revalidatePath("/sitemap.xml");
    if (slug) {
      revalidatePath(`/work/${slug}`);
    }
  } catch {}
}

