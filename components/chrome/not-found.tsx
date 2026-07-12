import { Button } from "@/components/ui/button";
import { ArrowLink } from "@/components/ui/arrow-link";

/**
 * NotFound (02-components.md §NotFound; 03 §9 — replaces case/route-readout + g3-not-found).
 * A calm 404: heading (the document's only h1) + the attempted path echoed in Geist Mono
 * `--ink-soft` + two links (home ghost button, work arrow-link). The old "SİNYAL YOK" / "kayıtlı
 * ünite yok" machine conceit is dropped.
 */

interface NotFoundProps {
  heading: string;
  path: string;
  homeHref: string;
  homeLabel: string;
  workHref: string;
  workLabel: string;
  className?: string;
}

export function NotFound({ heading, path, homeHref, homeLabel, workHref, workLabel, className }: NotFoundProps) {
  return (
    <section className={`wrap py-[var(--pad-section)] ${className ?? ""}`}>
      <div className="max-w-[48ch]">
        <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-ink">{heading}</h1>
        {path && <p className="mono mt-4 text-[0.86rem] text-ink-soft">{path}</p>}
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Button variant="ghost" href={homeHref}>
            {homeLabel}
          </Button>
          <ArrowLink href={workHref}>{workLabel}</ArrowLink>
        </div>
      </div>
    </section>
  );
}
