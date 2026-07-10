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
 * C6 — Mobile menu (02-components.md §C6, binding keyboard/ARIA/focus contract).
 * Trigger stays inline in G1 (the visual anchor point); the overlay panel is portaled
 * to <body> as a full-viewport layer so `inert` can be applied to the REST of the page
 * (everything outside both the panel and the trigger's own container) without needing a
 * ref threaded down from Header. Panel: repeats the G1 row (wordmark + close X) → C3
 * links stacked → C7-accent CTA → the C5 locale chip (C4 stays in the bar — never
 * duplicated here, per 03 §G1).
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

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex h-5 w-5 items-center justify-center text-bright transition-colors duration-[var(--dur-base)] ease-[var(--ease)] before:absolute before:-inset-3 before:content-[''] hover:text-amber-text active:translate-y-px min-[850px]:hidden"
      >
        <span className="sr-only">{triggerLabel}</span>
        <Menu aria-hidden="true" size={20} strokeWidth={1.5} />
      </button>

      {mounted &&
        createPortal(
          <div
            id={MENU_ID}
            ref={panelRef}
            className={`fixed inset-0 z-50 flex flex-col overflow-y-auto bg-carbon transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)] ${
              open ? "" : "hidden pointer-events-none opacity-0"
            }`}
          >
            <div className="wrap flex h-16 shrink-0 items-center justify-between">
              <span className="inline-flex items-baseline gap-3 text-[1.1rem] font-bold tracking-[-0.01em] text-bright">
                <i
                  aria-hidden="true"
                  className="h-[9px] w-[9px] self-center rounded-[2px] bg-amber-mark"
                />
                {dict.wordmark.name}
              </span>
              <button
                type="button"
                onClick={close}
                className="relative inline-flex h-5 w-5 items-center justify-center text-bright before:absolute before:-inset-3 before:content-['']"
              >
                <span className="sr-only">{closeLabel}</span>
                <X aria-hidden="true" size={20} strokeWidth={1.5} />
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
                  className="border-b border-line py-4 text-[1.5rem] font-semibold tracking-[-0.02em] text-bright active:translate-y-px"
                >
                  {item.label}
                </Link>
              ))}

              <Button variant="accent" href={contactHref} onClick={close} className="mt-8 w-full">
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
