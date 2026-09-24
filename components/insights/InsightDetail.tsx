import Link from "next/link";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  publishedAt: string | null;
  readingTime: number;
  category: {
    name: string;
  } | null;
};

type Props = {
  post: Post;
};

function formatDate(value: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function InsightDetail({ post }: Props) {
  const paragraphs = post.content
    .split(/\n{2,}/)
    .filter(Boolean);

  return (
    <article>
      <header className="on-ink bg-ink text-cream">
        <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-28">
          <Link
            href="/insights"
            className="label-mono text-cream/50 hover:text-sunset"
          >
            ← Insights
          </Link>

          <p className="label-mono mt-8 text-sunset">
            {post.category?.name ?? "Perspective"}
          </p>

          <h1 className="font-display mt-4 max-w-[18ch] text-[9vw] leading-[0.86] tracking-tight uppercase md:text-[5.5vw]">
            {post.title}
          </h1>

          <p className="label-mono mt-8 text-cream/55">
            {post.author} · {formatDate(post.publishedAt)} ·{" "}
            {post.readingTime ?? 4} min read
          </p>
        </div>
      </header>

      <img
        src={
          post.coverImage ??
          "/assets/editorial-chrome.jpg"
        }
        alt={post.title}
        className="aspect-[16/9] w-full object-cover"
      />

      <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[68ch]">
          <p className="text-2xl leading-snug tracking-tight">
            {post.excerpt}
          </p>

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground/85">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-14 border-t border-border pt-8">
            <Link
              href="/contact"
              className="label-mono inline-block bg-ink px-7 py-4 text-cream transition-colors hover:bg-sunset hover:text-ink"
            >
              Start a Conversation
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}