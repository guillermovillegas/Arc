import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge component", () => {
  /* ─── Default variant ────────────────────────────────────────────────── */

  it("renders with default variant when no variant is specified", () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText("New");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("bg-bone-100");
    expect(badge.className).toContain("text-smoke-900");
  });

  it("renders text content", () => {
    render(<Badge>Featured</Badge>);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  /* ─── All variants ───────────────────────────────────────────────────── */

  it("renders with variant=default", () => {
    render(<Badge variant="default">Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge.className).toContain("bg-bone-100");
    expect(badge.className).toContain("text-smoke-900");
    expect(badge.className).toContain("border-transparent");
  });

  it("renders with variant=muted", () => {
    render(<Badge variant="muted">Muted</Badge>);
    const badge = screen.getByText("Muted");
    expect(badge.className).toContain("bg-smoke-800");
    expect(badge.className).toContain("text-taupe-300");
    expect(badge.className).toContain("border-transparent");
  });

  it("renders with variant=outline", () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText("Outline");
    expect(badge.className).toContain("border-smoke-700");
    expect(badge.className).toContain("text-bone-200");
  });

  it("renders with variant=accent", () => {
    render(<Badge variant="accent">Accent</Badge>);
    const badge = screen.getByText("Accent");
    expect(badge.className).toContain("bg-champagne-400");
    expect(badge.className).toContain("text-smoke-900");
    expect(badge.className).toContain("border-transparent");
  });

  /* ─── Base classes ───────────────────────────────────────────────────── */

  it("always renders with base inline-flex and rounded-sm classes", () => {
    render(<Badge>Base</Badge>);
    const badge = screen.getByText("Base");
    expect(badge.className).toContain("inline-flex");
    expect(badge.className).toContain("items-center");
    expect(badge.className).toContain("rounded-sm");
    expect(badge.className).toContain("font-medium");
  });

  it("includes uppercase tracking classes for label style", () => {
    render(<Badge>Accessible</Badge>);
    const badge = screen.getByText("Accessible");
    expect(badge.className).toContain("uppercase");
    expect(badge.className).toContain("tracking-[0.28em]");
  });

  /* ─── Custom className merging ───────────────────────────────────────── */

  it("merges custom className with variant classes", () => {
    render(<Badge className="gap-2 text-lg">Custom</Badge>);
    const badge = screen.getByText("Custom");
    expect(badge.className).toContain("gap-2");
    expect(badge.className).toContain("text-lg");
    // Base class should still be present
    expect(badge.className).toContain("inline-flex");
  });

  it("allows custom className to override conflicting base classes via tailwind-merge", () => {
    render(<Badge className="rounded-full">Pill</Badge>);
    const badge = screen.getByText("Pill");
    // rounded-full should win over rounded-sm via tailwind-merge
    expect(badge.className).toContain("rounded-full");
    expect(badge.className).not.toContain("rounded-sm");
  });

  /* ─── Pass-through HTML attributes ───────────────────────────────────── */

  it("passes through data attributes", () => {
    render(<Badge data-testid="my-badge">Attr</Badge>);
    expect(screen.getByTestId("my-badge")).toBeInTheDocument();
  });

  it("renders as a div element", () => {
    render(<Badge data-testid="badge-el">Div</Badge>);
    expect(screen.getByTestId("badge-el").tagName).toBe("DIV");
  });
});
