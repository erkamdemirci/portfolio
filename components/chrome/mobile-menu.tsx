"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";
import { Button } from "@/components/ui/button";
import { LocaleChip } from "./locale-chip";

/**
 * MobileMenu (02-components.md §MobileMenu). A 44×44 icon trigger (Menu→X) and a portaled
 * full-viewport paper panel: wordmark + close → large nav links (Blog is TR-only, A11) →
 * primary CTA → LocaleChip. Below the header's 850px collapse the header hands its nav to
 * this menu (see header.tsx for why the breakpoint is 850, not the mockup's 620).
 *
 * BINDING keyboard/ARIA/focus contract — do NOT alter: focus-trap, `inert` on the rest of
 * the page, `Escape` to close, and body scroll-lock (the useEffect + close() below). Only
 * visuals/tokens are restyled here.
 */

const MENU_ID = "site-menu";

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  lang: Lang;
  dict: Dictionary;
  navItems: NavItem[];
  contactHref: string;
}

// The blog is a TR-only surface (A11); its index lives at /blog.
const BLOG_HREF = "/blog";

export function MobileMenu({ lang, dict, navItems, contactHref }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    firstLinkRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // inert every body-level sibling except the panel itself and whichever container
    // holds the trigger button (so the trigger stays focusable to receive focus back).
    const panelNode = panelRef.current;
    const triggerNode = triggerRef.current;
    const inertedNodes: Element[] = [];
    Array.from(document.body.children).forEach((child) => {
      if (panelNode && (child === panelNode || child.contains(panelNode))) return;
      if (triggerNode && (child === triggerNode || child.contains(triggerNode))) return;
      child.setAttribute("inert", "");
      inertedNodes.push(child);
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerNode?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelNode) return;
      const focusables = panelNode.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      inertedNodes.forEach((node) => node.removeAttribute("inert"));
    };
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  const triggerLabel = lang === "tr" ? "Menü" : "Menu";
  const closeLabel = lang === "tr" ? "Kapat" : "Close";

  const linkClasses =
    "border-b border-line py-4 text-[1.5rem] font-medium text-ink [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink-soft";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => setOpen((value) => !value)}
        className="grid h-11 w-11 place-items-center rounded-ui border border-line bg-paper text-ink transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] motion-safe:active:[transform:scale(0.97)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-ink-soft min-[850px]:hidden"
      >
        <span className="sr-only">{triggerLabel}</span>
        <Menu aria-hidden="true" size={18} strokeWidth={1.5} />
      </button>

      {mounted &&
        createPortal(
          <div
            id={MENU_ID}
            ref={panelRef}
            className={`fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper transition-opacity duration-[var(--dur-fast)] ease-[var(--ease-out)] ${
              open ? "" : "hidden pointer-events-none opacity-0"
            }`}
          >
            <div className="wrap flex h-16 shrink-0 items-center justify-between">
              <span className="inline-flex items-baseline gap-2 text-[1.06rem] font-bold tracking-[-0.01em] text-ink">
                {dict.wordmark.name}
                <span className="text-[0.86rem] font-normal text-ink-soft">
                  {dict.wordmark.descriptor}
                </span>
              </span>
              <button
                type="button"
                onClick={close}
                className="grid h-11 w-11 place-items-center rounded-ui text-ink transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] motion-safe:active:[transform:scale(0.97)] [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink-soft"
              >
                <span className="sr-only">{closeLabel}</span>
                <X aria-hidden="true" size={18} strokeWidth={1.5} />
              </button>
            </div>

            <nav aria-label="Mobile" className="wrap flex flex-1 flex-col pb-8">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  prefetch={false}
                  onClick={close}
                  className={linkClasses}
                >
                  {item.label}
                </Link>
              ))}

              {lang === "tr" && (
                <Link href={BLOG_HREF} prefetch={false} onClick={close} className={linkClasses}>
                  {dict.nav.blog}
                </Link>
              )}

              <Button variant="primary" href={contactHref} onClick={close} className="mt-8 w-full">
                {dict.nav.cta}
              </Button>

              <div className="mt-6">
                <LocaleChip dict={dict.localeChip} />
              </div>
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
