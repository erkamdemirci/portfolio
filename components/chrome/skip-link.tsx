/**
 * SkipLink (02-components.md §SkipLink). First focusable element in <body>; visually
 * hidden until focus, then revealed top-left as a paper chip (--line border, radius-ui,
 * Hanken 500). Kept a11y contract: first-focusable + `#main` target + reveal-on-focus.
 */

interface SkipLinkProps {
  label: string;
}

export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a
      href="#main"
      className="sr-only rounded-ui border border-line bg-paper px-[0.9rem] py-[0.55rem] font-medium text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-4 focus:z-[60]"
    >
      {label}
    </a>
  );
}
