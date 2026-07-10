/**
 * C1 — Skip link (02-components.md §C1). First focusable element in <body>; visually
 * hidden until :focus-visible, then fixed top-left with the accent-fill button treatment.
 */

interface SkipLinkProps {
  label: string;
}

export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a
      href="#main"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded focus-visible:bg-amber focus-visible:px-5 focus-visible:py-3 focus-visible:text-[0.95rem] focus-visible:font-semibold focus-visible:text-on-amber"
    >
      {label}
    </a>
  );
}
