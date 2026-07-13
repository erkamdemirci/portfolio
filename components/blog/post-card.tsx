import Link from "next/link";
import { PostMeta } from "./post-meta";

/**
 * PostCard (02 §PostCard). The whole card is the link → PostMeta + title (display-3, h2 per the
 * 03 §7 index outline) + a one-line excerpt. Rendered as --line divider rows (the ProductCard
 * `row` rhythm). Hover (gated) underlines the title; press scale(.985); focus ring on the <a>.
 */

interface PostCardProps {
  href: string;
  title: string;
  datePublished: string;
  readingTime: number;
  excerpt: string;
}

export function PostCard({ href, title, datePublished, readingTime, excerpt }: PostCardProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="group figure block border-t border-line py-[clamp(20px,3vw,32px)] motion-safe:active:[transform:scale(0.985)]"
    >
      <PostMeta datePublished={datePublished} readingTime={readingTime} />
      <h2 className="mt-3 font-display text-[clamp(1.35rem,2vw,1.7rem)] leading-[1.2] text-ink underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[var(--dur-fast)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:decoration-line">
        {title}
      </h2>
      <p className="mt-2 max-w-[64ch] overflow-hidden text-ellipsis whitespace-nowrap text-[0.9rem] leading-[1.5] text-ink-soft">
        {excerpt}
      </p>
    </Link>
  );
}
