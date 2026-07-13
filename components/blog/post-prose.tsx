import { renderMarkdown } from "@/lib/blog/render";

/**
 * PostProse (02 §PostProse). The article typography scope: it wraps the render.tsx output and
 * styles the allowed elements by tag via descendant selectors — h2 (display-3), h3 (Hanken 700
 * 1.1rem), p (17px/1.65, ≤68ch), ul/ol, blockquote (--line-strong left rule + italic serif),
 * inline code (.mono on a --paper-2 chip). Links are already TextLink `inline` (from the renderer),
 * so no `[&_a]` rule here. No raw-HTML injection sink — the renderer emits React elements only.
 */

const PROSE = [
  "max-w-[68ch]",
  "[&>*:first-child]:mt-0",
  // headings
  "[&_h2]:mt-[2em] [&_h2]:font-display [&_h2]:text-[clamp(1.5rem,2.2vw,2rem)] [&_h2]:leading-[1.15] [&_h2]:text-ink [&_h2]:text-balance",
  "[&_h3]:mt-[1.5em] [&_h3]:font-body [&_h3]:font-bold [&_h3]:text-[1.1rem] [&_h3]:leading-[1.35] [&_h3]:text-ink",
  // paragraphs
  "[&_p]:mt-[1.1em] [&_p]:text-[1.0625rem] [&_p]:leading-[1.65] [&_p]:text-ink [&_p]:text-pretty",
  // lists
  "[&_ul]:mt-[1.1em] [&_ul]:list-disc [&_ul]:pl-[1.4em] [&_ol]:mt-[1.1em] [&_ol]:list-decimal [&_ol]:pl-[1.4em]",
  "[&_li]:mt-[0.5em] [&_li]:text-[1.0625rem] [&_li]:leading-[1.6] [&_li]:text-ink [&_li]:marker:text-ink-soft",
  // blockquote — --line-strong left rule + italic serif
  "[&_blockquote]:mt-[1.2em] [&_blockquote]:border-l-[3px] [&_blockquote]:border-line-strong [&_blockquote]:pl-[1.1em] [&_blockquote]:font-display [&_blockquote]:text-[1.15rem] [&_blockquote]:italic [&_blockquote]:leading-[1.5] [&_blockquote]:text-ink",
  // inline emphasis + code chip on --paper-2
  "[&_strong]:font-semibold [&_strong]:text-ink",
  "[&_code]:rounded-xs [&_code]:bg-paper-2 [&_code]:px-[0.35em] [&_code]:py-[0.1em] [&_code]:font-mono [&_code]:text-[0.9em]",
].join(" ");

export function PostProse({ body }: { body: string }) {
  return <div className={PROSE}>{renderMarkdown(body)}</div>;
}
