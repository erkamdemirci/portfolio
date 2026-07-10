import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useOdometer } from "./use-odometer";

/**
 * The ONE orchestrated moment (01-design-system.md §Motion): 0 -> value, 700ms
 * --ease-out, once per mount, real value server-rendered — JS only animates the
 * presentation. Reduced-motion (or a missing matchMedia) must render the final value
 * immediately with no timers attached at all (progressive-enhancement rule).
 */

function mockMatchMedia(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("useOdometer", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("reduced-motion: returns the final value immediately, no timers", () => {
    mockMatchMedia(true);
    const setTimeoutSpy = vi.spyOn(globalThis, "setInterval");
    const { result } = renderHook(() => useOdometer(42));
    expect(result.current).toBe(42);
    expect(setTimeoutSpy).not.toHaveBeenCalled();
    setTimeoutSpy.mockRestore();
  });

  it("animates 0 -> N within 700ms and stops exactly at N", () => {
    mockMatchMedia(false);
    vi.useFakeTimers();
    const { result } = renderHook(() => useOdometer(100));
    expect(result.current).toBe(0);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(result.current).toBe(100);
    // further time must not overshoot or restart
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe(100);
  });

  it("runs once — a re-render mid-animation does not restart the count", () => {
    mockMatchMedia(false);
    vi.useFakeTimers();
    const { result, rerender } = renderHook(() => useOdometer(100));
    act(() => {
      vi.advanceTimersByTime(350);
    });
    const midValue = result.current;
    expect(midValue).toBeGreaterThan(0);
    expect(midValue).toBeLessThan(100);
    rerender();
    act(() => {
      vi.advanceTimersByTime(16);
    });
    expect(result.current).toBeGreaterThanOrEqual(midValue);
  });
});
