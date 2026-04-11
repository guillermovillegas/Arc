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
    expect(badge.className).toContain("bg-neutral-900");
    expect(badge.className).toContain("text-white");
  });

  it("renders text content", () => {
    render(<Badge>Featured</Badge>);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  /* ─── All variants ───────────────────────────────────────────────────── */

  it("renders with variant=default", () => {
    render(<Badge variant="default">Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge.className).toContain("bg-neutral-900");
    expect(badge.className).toContain("text-white");
    expect(badge.className).toContain("border-transparent");
  });

  it("renders with variant=secondary", () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText("Secondary");
    expect(badge.className).toContain("bg-neutral-100");
    expect(badge.className).toContain("text-neutral-900");
    expect(badge.className).toContain("border-transparent");
  });

  it("renders with variant=outline", () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText("Outline");
    expect(badge.className).toContain("border-neutral-300");
    expect(badge.className).toContain("text-neutral-700");
  });

  it("renders with variant=destructive", () => {
    render(<Badge variant="destructive">Error</Badge>);
    const badge = screen.getByText("Error");
    expect(badge.className).toContain("bg-red-500");
    expect(badge.className).toContain("text-white");
    expect(badge.className).toContain("border-transparent");
  });

  /* ─── Base classes ───────────────────────────────────────────────────── */

  it("always renders with base inline-flex and rounded-lg classes", () => {
    render(<Badge>Base</Badge>);
    const badge = screen.getByText("Base");
    expect(badge.className).toContain("inline-flex");
    expect(badge.className).toContain("items-center");
    expect(badge.className).toContain("rounded-lg");
    expect(badge.className).toContain("font-medium");
  });

  it("includes focus ring classes for accessibility", () => {
    render(<Badge>Accessible</Badge>);
    const badge = screen.getByText("Accessible");
    expect(badge.className).toContain("focus:outline-none");
    expect(badge.className).toContain("focus:ring-2");
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
    // rounded-full should win over rounded-lg via tailwind-merge
    expect(badge.className).toContain("rounded-full");
    expect(badge.className).not.toContain("rounded-lg");
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
