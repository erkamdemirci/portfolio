/**
 * Pre-hydration theme script (02-components.md §C4 behavior contract; 01 §Direction &
 * mode map — dark-first, localStorage, no-flash). Injected inline as the FIRST child of
 * <body>, before any rendered content, so it runs synchronously before first paint.
 *
 * Always writes `data-theme` explicitly (light when stored, dark otherwise) rather than
 * relying on the SSR-rendered default — this keeps the no-flash guarantee independent of
 * markup and matches the named decision that the operating system's color-scheme media
 * query is NEVER consulted (first visit is always the dark canonical unless the visitor
 * already chose light via the mode chip).
 */
export const THEME_SCRIPT =
  "(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){}})();";
