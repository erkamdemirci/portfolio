import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/**
 * C7 — Button (02-components.md §C7).
 * Variants: accent (filled CTA) / ghost (outline). Renders <a> when `href` is given
 * (navigation), otherwise <button> (actions). Disabled contract exists for completeness —
 * links never render disabled on this brochure site (02 rule); only <button> honors it.
 */

export type ButtonVariant = "accent" | "ghost";

const BASE =
  "inline-flex items-center justify-center rounded font-semibold text-[0.95rem] leading-[1.6] px-5 py-3 whitespace-nowrap transition-[background-color,border-color,color] duration-[var(--dur-fast)] ease-[var(--ease)] active:translate-y-px max-[640px]:px-4 max-[640px]:text-[0.9rem]";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  accent:
    "bg-amber text-on-amber border border-transparent hover:bg-amber-hi disabled:bg-carbon-2 disabled:text-steel disabled:border-line disabled:cursor-not-allowed disabled:hover:bg-carbon-2 disabled:active:translate-y-0",
  ghost:
    "bg-transparent text-bright border border-line-strong hover:border-amber disabled:bg-carbon-2 disabled:text-steel disabled:border-line disabled:cursor-not-allowed disabled:hover:border-line disabled:active:translate-y-0",
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

export function Button({ variant = "accent", children, className, ...rest }: ButtonProps) {
  const classes = `${BASE} ${VARIANT_CLASSES[variant]} ${className ?? ""}`;

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as Omit<ButtonAsLink, keyof ButtonOwnProps>;
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link href={href} className={classes} {...anchorRest}>
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
