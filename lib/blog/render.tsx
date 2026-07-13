import type { ReactNode } from "react";
import { TextLink } from "@/components/ui/text-link";

/**
 * Constrained-markdown renderer (04-tasks.md T54; 02 §PostProse). A small DETERMINISTIC parser
 * for the pinned subset ONLY — ## / ### headings, paragraphs, `-` and `1.` lists, `>` blockquote,
 * **bold**, *italic*, `inline code`, and [text](href) links. It emits React elements for that
 * subset and NOTHING else: it never reaches for a raw-HTML sink or an HTML parser, so any raw
 * HTML in a body is carried through as plain text (React-escaped), never injected. Links become
 * TextLink `inline` — internal hrefs (the /hizmetler#… and /iletisim spine) get client nav.
 * PostProse owns all the typography via descendant selectors; this file only builds structure.
 */

// Ordered alternation: inline code, link, bold (before italic), italic.
const INLINE_RE = /(`[^`]+`)|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;

function parseInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let token = 0;
  INLINE_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const raw = match[0];
    const key = `${keyBase}-t${token++}`;
    if (raw.startsWith("`")) {
      nodes.push(<code key={key}>{raw.slice(1, -1)}</code>);
    } else if (raw.startsWith("[")) {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(raw);
      nodes.push(
        link ? (
          <TextLink key={key} href={link[2]}>
            {link[1]}
          </TextLink>
        ) : (
          raw
        ),
      );
    } else if (raw.startsWith("**")) {
      nodes.push(<strong key={key}>{raw.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={key}>{raw.slice(1, -1)}</em>);
    }
    last = match.index + raw.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const UL_RE = /^- /;
const OL_RE = /^\d+\.\s/;

function isBlockStart(t: string): boolean {
  return t === "" || t.startsWith("## ") || t.startsWith("### ") || t.startsWith("> ") || UL_RE.test(t) || OL_RE.test(t);
}

export function renderMarkdown(body: string): ReactNode[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (trimmed === "") {
      i++;
    } else if (trimmed.startsWith("### ")) {
      blocks.push(<h3 key={key}>{parseInline(trimmed.slice(4), `h3-${key}`)}</h3>);
      key++;
      i++;
    } else if (trimmed.startsWith("## ")) {
      blocks.push(<h2 key={key}>{parseInline(trimmed.slice(3), `h2-${key}`)}</h2>);
      key++;
      i++;
    } else if (trimmed.startsWith("> ")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quote.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push(<blockquote key={key}>{parseInline(quote.join(" "), `bq-${key}`)}</blockquote>);
      key++;
    } else if (UL_RE.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && UL_RE.test(lines[i].trim())) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push(
        <ul key={key}>
          {items.map((item, j) => (
            <li key={j}>{parseInline(item, `ul-${key}-${j}`)}</li>
          ))}
        </ul>,
      );
      key++;
    } else if (OL_RE.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && OL_RE.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(OL_RE, ""));
        i++;
      }
      blocks.push(
        <ol key={key}>
          {items.map((item, j) => (
            <li key={j}>{parseInline(item, `ol-${key}-${j}`)}</li>
          ))}
        </ol>,
      );
      key++;
    } else {
      const para: string[] = [];
      while (i < lines.length && !isBlockStart(lines[i].trim())) {
        para.push(lines[i].trim());
        i++;
      }
      blocks.push(<p key={key}>{parseInline(para.join(" "), `p-${key}`)}</p>);
      key++;
    }
  }

  return blocks;
}
