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
      : rest.filter((post) => post.category?.name === filter);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                               */}
      {/* ------------------------------------------------------------------ */}

      <header className="on-ink bg-ink text-cream">
        <div
          className="
            mx-auto w-full max-w-[1500px]
            px-5 py-24
            sm:px-6
            md:px-10 md:py-28
            lg:py-32
          "
        >
          <p className="label-mono text-cream/55">Insights</p>

          <h1
            className="
              font-display
              mt-6
              max-w-[18ch]
              text-[13vw]
              leading-[0.86]
              tracking-tight
              uppercase
              sm:text-[10vw]
              md:text-[7vw]
              lg:text-[5.5vw]
            "
          >
            Thinking,
            <br />
            <span className="chrome-type">written down</span>
          </h1>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* CONTENT                                                            */}
      {/* ------------------------------------------------------------------ */}

      <main
        className="
          mx-auto w-full max-w-[1500px]
          px-5 py-12
          sm:px-6 sm:py-14
          md:px-10 md:py-20
          lg:py-24
        "
      >
        {/* ---------------------------------------------------------------- */}
        {/* FEATURED ARTICLE                                                 */}
        {/* ---------------------------------------------------------------- */}

        {featured && (
          <Reveal>
            <Link
              href={`/insights/${featured.slug}`}
              className="
                group
                grid
                grid-cols-1
                gap-8
                border-b border-border
                pb-12
                sm:gap-10 sm:pb-14
                lg:grid-cols-12 lg:gap-8
                lg:pb-14
              "
            >
              {/* Image */}

              <div
                className="
                  col-span-1
                  min-w-0
                  overflow-hidden
                  bg-muted
                  lg:col-span-7
                "
              >
                <img
                  src={
                    featured.coverImage ??
                    "/assets/editorial-chrome.jpg"
                  }
                  alt={featured.title}
                  className="
                    block
                    aspect-[16/10]
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-[1.03]
                  "
                />
              </div>

              {/* Content */}

              <div
                className="
                  col-span-1
                  flex
                  min-w-0
                  flex-col
                  justify-center
                  lg:col-span-5
                "
              >
                <p className="label-mono text-sunset">
                  Featured · {featured.category?.name ?? "Perspective"}
                </p>

                <h2
                  className="
                    font-display
                    mt-4
                    text-[clamp(2.25rem,8vw,3.5rem)]
                    leading-[0.92]
                    tracking-tight
                    uppercase
                    sm:text-[clamp(2.5rem,6vw,4rem)]
                    lg:text-[clamp(3rem,4vw,4.5rem)]
                  "
                >
                  {featured.title}
                </h2>

                <p
                  className="
                    mt-5
                    max-w-[52ch]
                    text-sm
                    leading-relaxed
                    text-muted-foreground
                    sm:text-base
                  "
                >
                  {featured.excerpt}
                </p>

                <p className="label-mono mt-6 text-muted-foreground">
                  {featured.author} · {formatDate(featured.publishedAt)} ·{" "}
                  {featured.readingTime ?? 4} min
                </p>
              </div>
            </Link>
          </Reveal>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* CATEGORY FILTERS                                                  */}
        {/* ---------------------------------------------------------------- */}

        {categories.length > 1 && (
          <div
            className="
              mt-10
              flex
              gap-2
              overflow-x-auto
              pb-2
              sm:mt-12
              sm:flex-wrap
              sm:overflow-visible
              sm:pb-0
            "
            role="group"
            aria-label="Filter insights"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                aria-pressed={filter === category}
                className={`
                  label-mono
                  shrink-0
                  border
                  px-4
                  py-2.5
                  whitespace-nowrap
                  transition-colors
                  ${
                    filter === category
                      ? "border-ink bg-ink text-cream"
                      : "border-border text-muted-foreground hover:border-sunset hover:text-sunset"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* ARTICLE GRID                                                      */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            mt-10
            grid
            grid-cols-1
            gap-x-6
            gap-y-12
            sm:mt-12
            sm:grid-cols-2
            sm:gap-y-14
            lg:grid-cols-3
            lg:gap-y-16
          "
        >
          {visible.map((post, index) => (
            <Reveal
              key={post.slug}
              delay={index * 0.04}
              className="min-w-0"
            >
              <Link
                href={`/insights/${post.slug}`}
                className="group block min-w-0"
              >
                {/* Image */}

                <div className="overflow-hidden bg-muted">
                  <img
                    src={
                      post.coverImage ??
                      "/assets/editorial-chrome.jpg"
                    }
                    alt={post.title}
                    loading="lazy"
                    className="
                      block
                      aspect-[4/3]
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-[1.04]
                    "
                  />
                </div>

                {/* Category */}

                <p className="label-mono mt-4 text-sunset">
                  {post.category?.name ?? "Perspective"}
                </p>

                {/* Title */}

                <h3
                  className="
                    mt-2
                    text-xl
                    leading-[1.05]
                    tracking-tight
                    transition-colors
                    group-hover:text-sunset
                    sm:text-2xl
                  "
                >
                  {post.title}
                </h3>

                {/* Excerpt */}

                <p
                  className="
                    mt-2
                    text-sm
                    leading-relaxed
                    text-muted-foreground
                  "
                >
                  {post.excerpt}
                </p>

                {/* Meta */}

                <p className="label-mono mt-4 text-muted-foreground">
                  {formatDate(post.publishedAt)} ·{" "}
                  {post.readingTime ?? 4} min
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* EMPTY STATE                                                       */}
        {/* ---------------------------------------------------------------- */}

        {posts.length === 0 && (
          <p className="text-muted-foreground">
            The first articles are being written.
          </p>
        )}
      </main>
    </>
  );
}