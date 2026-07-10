import type { Lang } from "./routes";
import { en } from "./dictionaries/en";
import { tr } from "./dictionaries/tr";

const dictionaries = { tr, en };

export function getDictionary(lang: Lang) {
  return dictionaries[lang];
}

// `tr`/`en` are `as const`, so every leaf string is narrowed to its OWN literal value
// (e.g. footer.cells.studio.key is "stüdyo" on tr, "studio" on en) — fine for the
// source objects, but a shared prop type needs every leaf widened back to plain
// `string` so either locale's dictionary is assignable to the same component prop.
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : T extends object
      ? { -readonly [K in keyof T]: Widen<T[K]> }
      : T;

export type Dictionary = Widen<typeof tr>;
