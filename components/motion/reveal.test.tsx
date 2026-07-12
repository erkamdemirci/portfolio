import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "./reveal";

/**
 * Entrance reveal (01-design-system.md §Motion): opacity 0→1 + an 8px rise on the
 * --dur-reveal curve, per-item stagger via transition-delay, once at ~20% intersection.
 * Progressive enhancement is binding (io's measured failure class): content is fully
 * visible in server-rendered HTML; the
 * hidden pre-animation state is applied by JS only when JS runs, IntersectionObserver
 * exists, AND reduced-motion is off.
 */

function mockMatchMedia(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

describe("Reveal", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("no IntersectionObserver (io failure/no-JS class of browser): content stays visible, never hides", () => {
    mockMatchMedia(false);
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );
    expect(container.firstElementChild).not.toHaveClass("reveal-hidden");
  });

  it("hides only after mount when IntersectionObserver exists AND reduced-motion is off", () => {
    mockMatchMedia(false);
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    const { container } = render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );
    expect(container.firstElementChild).toHaveClass("reveal-hidden");
  });

  it("reduced-motion true: never hides, even with IntersectionObserver present", () => {
    mockMatchMedia(true);
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    const { container } = render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );
    expect(container.firstElementChild).not.toHaveClass("reveal-hidden");
  });
});
