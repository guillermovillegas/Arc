import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn() utility", () => {
  /* ─── Basic merging ──────────────────────────────────────────────────── */

  it("merges multiple class name strings", () => {
    const result = cn("px-4", "py-2", "text-sm");
    expect(result).toBe("px-4 py-2 text-sm");
  });

  it("returns an empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("handles a single class name", () => {
    expect(cn("px-4")).toBe("px-4");
  });

  /* ─── Conditional classes (clsx behaviour) ───────────────────────────── */

  it("filters out falsy values (false, null, undefined, 0, empty string)", () => {
    const result = cn("base", false && "hidden", null, undefined, 0, "", "end");
    expect(result).toBe("base end");
  });

  it("handles conditional class via boolean expression", () => {
    const isActive = true;
    const result = cn("btn", isActive && "btn-active");
    expect(result).toBe("btn btn-active");
  });

  it("supports object syntax for conditional classes", () => {
    const result = cn("base", { hidden: false, visible: true });
    expect(result).toBe("base visible");
  });

  it("supports array syntax", () => {
    const result = cn(["px-4", "py-2"]);
    expect(result).toBe("px-4 py-2");
  });

  /* ─── Tailwind conflict resolution (twMerge behaviour) ───────────────── */

  it("resolves conflicting padding classes by keeping the last one", () => {
    const result = cn("px-4", "px-6");
    expect(result).toBe("px-6");
  });

  it("resolves conflicting text-color classes", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("resolves conflicting background classes", () => {
    const result = cn("bg-white", "bg-neutral-100");
    expect(result).toBe("bg-neutral-100");
  });

  it("does not strip non-conflicting classes", () => {
    const result = cn("px-4", "py-2", "bg-white", "text-sm");
    expect(result).toBe("px-4 py-2 bg-white text-sm");
  });

  it("resolves conflicting rounded classes", () => {
    const result = cn("rounded-lg", "rounded-xl");
    expect(result).toBe("rounded-xl");
  });

  it("handles mixed conditional + conflicting classes", () => {
    const hasError = true;
    const result = cn(
      "border-neutral-300",
      hasError && "border-red-400",
    );
    expect(result).toBe("border-red-400");
  });
});
