/**
 * PostMeta (02 §PostMeta). Publish date + reading time on one line, label-xs --ink-soft, "·"
 * separator — e.g. "12 Temmuz 2026 · 5 dk okuma". The date is parsed from its ISO parts (not
 * `new Date`, which would shift by timezone) and rendered in a semantic <time>.
 */

const TR_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
] as const;

/** "2026-07-12" → "12 Temmuz 2026" (TR long date, no leading zero). */
export function formatTrDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${TR_MONTHS[month - 1]} ${year}`;
}

interface PostMetaProps {
  datePublished: string;
  readingTime: number;
  className?: string;
}

export function PostMeta({ datePublished, readingTime, className }: PostMetaProps) {
  return (
    <p className={`text-[0.82rem] font-medium leading-[1.4] tracking-[0.01em] text-ink-soft ${className ?? ""}`}>
      <time dateTime={datePublished}>{formatTrDate(datePublished)}</time>
      {" · "}
      {readingTime} dk okuma
    </p>
  );
}
