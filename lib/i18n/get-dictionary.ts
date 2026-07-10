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
// Array/tuple branch stays `readonly` (rather than widening to a mutable `Widen<U>[]`): the
// source dictionaries are always `as const`, so every array field (e.g. servicesPage.steps,
// servicesPage.details) is inferred as a readonly tuple on both `tr` and `en` — a readonly
// tuple is only assignable to a `readonly` array type, never a mutable one (T25).
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : T extends object
      ? { -readonly [K in keyof T]: Widen<T[K]> }
      : T;

export type Dictionary = Widen<typeof tr>;
