import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
    getAllPublishedInsightSlugs,
    getCachedInsightBySlug,
} from "@/lib/data";
import InsightDetail from "@/components/insights/InsightDetail";

export const revalidate = 3600;

export async function generateStaticParams() {
    const slugs = await getAllPublishedInsightSlugs();
    return slugs.map((item) => ({ slug: item.slug }));
}

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getCachedInsightBySlug(slug);

    if (!post) {
        return {
            title: "Unavailable — Ad Growth Partner",
            robots: {
                index: false,
            },
        };
    }

    const title =
        post.seoTitle ??
        `${post.title} — Insights — Ad Growth Partner`;

    const description =
        post.seoDescription ?? post.excerpt ?? "";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
        },
    };
}

export default async function InsightPage({ params }: Props) {
    const { slug } = await params;
    const post = await getCachedInsightBySlug(slug);

    if (!post) {
        notFound();
    }

    return <InsightDetail post={post} />;
}