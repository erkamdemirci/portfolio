/**
 * Blog data model (04-tasks.md T51; 03 §Blog plan). TR-only surface (A11). Each post is a plain
 * data module exporting `{ meta, body }`: `body` is a constrained-markdown template literal (the
 * T54 renderer subset — ## / ### / paragraphs / - / 1. / > / **bold** / *italic* / [text](href)),
 * NOT MDX and NOT raw HTML. All v1 posts carry datePublished 2026-07-12 (honest launch date — no
 * fabricated backdating, 03 §Blog plan dates decision).
 */

export interface PostMeta {
  slug: string;
  title: string;
  /** launch day — every v1 post; shown as "12 Temmuz 2026" and used verbatim in Article JSON-LD. */
  datePublished: "2026-07-12";
  /** minutes, computed from the body word count (~200 wpm). */
  readingTime: number;
  /** ~155 chars — feeds both the PostCard one-liner and the post's meta description (T56). */
  excerpt: string;
  /** the money keyword woven into the H1/intro (03 §Blog plan). */
  targetQuery: string;
  /** the /hizmetler#<anchor> offering this post routes to (03 internal-link spine, F6). */
  serviceAnchor: string;
}

export interface Post {
  meta: PostMeta;
  body: string;
}
