import "@testing-library/jest-dom/vitest";

// Node 22+ ships a built-in `globalThis.localStorage` accessor that is non-functional
// without `--localstorage-file` (its getter/setter/clear all throw or are undefined).
// In vitest's jsdom environment `window` is the same object as `globalThis`, so this
// broken native accessor shadows jsdom's Storage implementation for BOTH `localStorage`
// and `window.localStorage` — plain reassignment silently no-ops (it's an accessor
// property with no working setter). `Object.defineProperty` replaces the descriptor
// outright, which the runtime allows because the property is `configurable: true`.
// Minimal in-memory Web Storage polyfill — everything T09's theme persistence
// (and any future localStorage-based test) needs: getItem/setItem/removeItem/clear.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

Object.defineProperty(globalThis, "localStorage", {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
});
