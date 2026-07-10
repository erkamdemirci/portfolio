"use client";

import { useEffect, useState } from "react";

/**
 * C25 mono readout line (02-components.md §C25; 03 §G3). Server renders the GENERIC path
 * placeholder (so no-JS visitors still see a complete, on-brand telemetry line — the
 * progressive-enhancement rule, 01 §Motion); once mounted, a client-only effect swaps in the
 * real requested path via `window.location.pathname` (not `usePathname()` — that hook has no
 * reliably matched route to report inside a not-found boundary). The mid-string "→" here is a
 * plain typographic arrow inside an inert HTTP-log-style line, not a link/button label, so it
 * is NOT the Lucide icon Amendment A5 governs (that rule is scoped to trailing arrows on
 * actionable link/button text).
 */

interface RouteReadoutProps {
  genericPath: string;
  note: string;
  className?: string;
}

export function RouteReadout({ genericPath, note, className }: RouteReadoutProps) {
  const [path, setPath] = useState(genericPath);

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  return (
    <p className={`font-mono text-[0.8125rem] leading-[1.7] tracking-[0.06em] text-steel ${className ?? ""}`}>
      GET {path} → 404 · {note}
    </p>
  );
}
