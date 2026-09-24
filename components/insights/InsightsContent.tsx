"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Reveal } from "@/components/site/Reveal";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  author: string;
  publishedAt: string | null;
  readingTime: number;
  category: {
    name: string;
  } | null;
};

type Props = {
  posts: Post[];
};

function formatDate(value: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function InsightsContent({ posts }: Props) {
  const [featured, ...rest] = posts;

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          posts
            .map((post) => post.category?.name)
            .filter(Boolean) as string[],
        ),
      ),
    ],
    [posts],
  );

  const [filter, setFilter] = useState("All");

  const visible =
    filter === "All"
      ? rest
      : rest.filter(
        (post) => post.category?.name === filter,
      );

  return (
    <>
      <header className="on-ink bg-ink text-cream">
        <div className="mx-auto max-w-375 px-5 py-24 md:px-10 md:py-32">
          <p className="label-mono text-cream/55">Insights</p>

          <h1 className="font-display mt-6 max-w-[18ch] text-[9vw] leading-[0.86] tracking-tight uppercase md:text-[5.5vw]">
            Thinking,
            <br />
            <span className="chrome-type">written down</span>
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-375 px-5 py-16 md:px-10 md:py-24">
        {featured && (
          <Reveal>
            <Link
              href={`/insights/${featured.slug}`}
              className="group grid grid-cols-12 gap-8 border-b border-border pb-14"
            >
              <div className="col-span-12 overflow-hidden bg-muted md:col-span-7">
                <img
                  src={
                    featured.coverImage ??
                    "/assets/editorial-chrome.jpg"
                  }
                  alt={featured.title}
                  className="aspect-16/10 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              <div className="col-span-12 flex flex-col justify-center md:col-span-5">
                <p className="label-mono text-sunset">
                  Featured ·{" "}
                  {featured.category?.name ?? "Perspective"}
                </p>

                <h2 className="font-display mt-4 text-4xl leading-[0.95] tracking-tight uppercase md:text-5xl">
                  {featured.title}
                </h2>

                <p className="mt-4 max-w-[46ch] text-muted-foreground">
                  {featured.excerpt}
                </p>

                <p className="label-mono mt-6 text-muted-foreground">
                  {featured.author} ·{" "}
                  {formatDate(featured.publishedAt)} ·{" "}
                  {featured.readingTime ?? 4} min
                </p>
              </div>
            </Link>
          </Reveal>
        )}

        {categories.length > 1 && (
          <div
            className="mt-12 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter insights"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                aria-pressed={filter === category}
                className={`label-mono border px-4 py-2.5 transition-colors ${filter === category
                    ? "border-ink bg-ink text-cream"
                    : "border-border text-muted-foreground hover:border-sunset hover:text-sunset"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-14">
          {visible.map((post, index) => (
            <Reveal
              key={post.slug}
              delay={index * 0.04}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            >
              <Link
                href={`/insights/${post.slug}`}
                className="group block"
              >
                <div className="overflow-hidden bg-muted">
                  <img
                    src={
                      post.coverImage ??
                      "/assets/editorial-chrome.jpg"
                    }
                    alt={post.title}
                    loading="lazy"
                    className="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>

                <p className="label-mono mt-4 text-sunset">
                  {post.category?.name ?? "Perspective"}
                </p>

                <h3 className="mt-2 text-2xl leading-snug tracking-tight group-hover:text-sunset">
                  {post.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>

                <p className="label-mono mt-4 text-muted-foreground">
                  {formatDate(post.publishedAt)} ·{" "}
                  {post.readingTime ?? 4} min
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-muted-foreground">
            The first articles are being written.
          </p>
        )}
      </div>
    </>
  );
}