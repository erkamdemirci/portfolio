/**
 * Pre-hydration theme script (02-components.md §C4 behavior contract; 01-design-system.md
 * §Direction & mode map — LIGHT canonical, localStorage, no-flash). Injected inline as the
 * FIRST child of <body>, before any rendered content, so it runs synchronously before first
 * paint.
 *
 * Always writes `data-theme` explicitly (dark when the visitor stored dark, light otherwise)
 * rather than relying on the SSR-rendered default — this keeps the no-flash guarantee
 * independent of markup and matches the named decision that the operating system's
 * color-scheme media query is NEVER consulted (first visit is always the light canonical
 * unless the visitor already chose dark via the mode chip; a stored dark preference still
 * wins over the light default).
 */
export const THEME_SCRIPT =
  "(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){}})();";
