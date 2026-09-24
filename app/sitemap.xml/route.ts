import { getCachedSitemapData } from "@/lib/data";
import { SOLUTIONS } from "@/lib/site";

export const revalidate = 3600;

const STATIC_PATHS = [
    "/",
    "/solutions",
    "/work",
    "/insights",
    "/who-we-are",
    "/careers",
    "/contact",
    "/sitemap",
    "/privacy-policy",
    "/terms-and-conditions",
    "/cookie-policy",
];

function escapeXml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export async function GET(request: Request) {
    const origin = new URL(request.url).origin;

    const { work, insights, jobs } = await getCachedSitemapData();

    const urls: { loc: string; lastmod?: string }[] = [
        ...STATIC_PATHS.map((path) => ({
            loc: `${origin}${path}`,
        })),

        ...SOLUTIONS.map((solution) => ({
            loc: `${origin}/solutions#${solution.slug}`,
        })),

        ...work.map((item) => ({
            loc: `${origin}/work/${item.slug}`,
            lastmod: item.updatedAt ? String(item.updatedAt) : undefined,
        })),

        ...insights.map((item) => ({
            loc: `${origin}/insights/${item.slug}`,
            lastmod: item.updatedAt ? String(item.updatedAt) : undefined,
        })),

        ...jobs.map((job) => ({
            loc: `${origin}/careers/${job.slug}`,
            lastmod: job.updatedAt ? String(job.updatedAt) : undefined,
        })),
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
            .map(
                (url) =>
                    `  <url><loc>${escapeXml(url.loc)}</loc>${url.lastmod
                        ? `<lastmod>${escapeXml(url.lastmod)}</lastmod>`
                        : ""
                    }</url>`,
            )
            .join("\n")}
</urlset>`;

    return new Response(body, {
        headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
        },
    });
}