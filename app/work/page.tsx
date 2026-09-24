// import type { Metadata } from "next";
// import { db } from "@/lib/db";
// import WorkContent from "@/components/work/WorkContent";

// export const metadata: Metadata = {
//   title: "Work — Ad Growth Partner",
//   description:
//     "Selected case studies from Ad Growth Partner: the challenge, the approach, the execution and what changed.",
//   openGraph: {
//     title: "Work — Ad Growth Partner",
//     description: "Case studies across consumer, B2B and retail.",
//   },
// };

// export default async function WorkPage() {
//   const work = await db.orm.public.CaseStudy
//     .where({ published: true })
//     .select(
//       "slug",
//       "title",
//       "client",
//       "industry",
//       "summary",
//       "coverImage",
//       "year",
//     )
//     .all();

//   return <WorkContent work={work} />;
// }

// Public Work is intentionally disabled for the initial launch.
export default function WorkPage() {
    return null;
}