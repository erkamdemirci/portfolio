import type { Lang } from "./routes";
import { en } from "./dictionaries/en";
import { tr } from "./dictionaries/tr";

const dictionaries = { tr, en };

export function getDictionary(lang: Lang) {
  return dictionaries[lang];
}

export type Dictionary = typeof tr;
