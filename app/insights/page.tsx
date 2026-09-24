import type { Metadata } from "next";
import { getCachedPublishedInsights } from "@/lib/data";
import InsightsContent from "@/components/insights/InsightsContent";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Insights — Ad Growth Partner",
    description:
        "Essays on demand, creative systems, measurement and marketing technology from the Ad Growth Partner team.",
    openGraph: {
        title: "Insights — Ad Growth Partner",
        description: "Perspectives on building demand that compounds.",
    },
};

export default async function InsightsPage() {
    const posts = await getCachedPublishedInsights();

    return <InsightsContent posts={posts} />;
}