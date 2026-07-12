import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Button (02-components.md §Button). Variants: primary (evergreen CTA fill) / ghost
 * (hairline outline). Renders <a> when `href` is given (navigation), otherwise <button>
 * (actions). 44px touch floor, radius-ui, Hanken 500 .95rem. Hover is gated behind
 * `(hover:hover) and (pointer:fine)`; press is `scale(0.97)` gated behind motion-safe so
 * reduced-motion removes the movement (01 §Motion). The disabled contract exists for
 * completeness — links never render disabled on this brochure site (02 rule); only
 * <button> honors it.
 *
 * `accent` is a temporary build-green alias for `primary`: un-migrated M2/M3 page bodies
 * (app/[lang]/page.tsx, contact-band.tsx) still pass variant="accent" until T32/T38
 * switch them to "primary". Same evergreen fill either way.
 */

export type ButtonVariant = "primary" | "ghost" | "accent";

const BASE =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-ui border border-transparent px-[1.2rem] py-[0.62rem] font-body text-[0.95rem] font-medium leading-none transition-[background-color,border-color,color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)] motion-safe:active:[transform:scale(0.97)] disabled:cursor-not-allowed disabled:opacity-45 disabled:pointer-events-none";

const PRIMARY =
  "bg-ever text-paper [@media(hover:hover)_and_(pointer:fine)]:hover:bg-ever-hover";
const GHOST =
  "border-line bg-transparent text-ink [@media(hover:hover)_and_(pointer:fine)]:hover:border-ink-soft [@media(hover:hover)_and_(pointer:fine)]:hover:bg-paper-2";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: PRIMARY,
  accent: PRIMARY,
  ghost: GHOST,
};

interface ButtonOwnProps {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

type ButtonAsLink = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ButtonAsButton = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button({ variant = "primary", children, className, ...rest }: ButtonProps) {
  const classes = `${BASE} ${VARIANT_CLASSES[variant]} ${className ?? ""}`;

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as Omit<ButtonAsLink, keyof ButtonOwnProps>;
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        // prefetch={false}: T32 perf fix (see DEVIATIONS.md) — Next's default viewport
        // prefetching fires an RSC-payload fetch for every visible internal <Link>; on a
        // link-dense page this saturated the throttled Lighthouse mobile connection and
        // pushed LCP past the 2.5s budget. No user-facing navigation change.
        <Link href={href} prefetch={false} className={classes} {...anchorRest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as Omit<ButtonAsButton, keyof ButtonOwnProps>;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
