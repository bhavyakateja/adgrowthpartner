import type { Metadata } from "next";
import { getCachedSolutionsCaseStudies } from "@/lib/data";
import SolutionsContent from "@/components/solutions/SolutionsContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Solutions — Ad Growth Partner",
  description:
    "Growth strategy, performance marketing, brand and creative, digital experiences, analytics and marketing technology — built as one connected system.",
  openGraph: {
    title: "Solutions — Ad Growth Partner",
    description: "Nine connected capabilities, one accountable growth system.",
  },
};

export default async function SolutionsPage() {
  const work = await getCachedSolutionsCaseStudies();

  return <SolutionsContent work={work} />;
}