import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Button } from "@/components/ui/button";

describe("Button component", () => {
  /* ─── Default rendering ──────────────────────────────────────────────── */

  it("renders with default variant and size", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain("bg-neutral-900");
    expect(btn.className).toContain("h-10");
  });

  it("renders as a <button> element by default", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button").tagName).toBe("BUTTON");
  });

  /* ─── Variants ───────────────────────────────────────────────────────── */

  it("renders with variant=default", () => {
    render(<Button variant="default">Default</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-neutral-900");
    expect(btn.className).toContain("hover:bg-neutral-800");
  });

  it("renders with variant=primary", () => {
    render(<Button variant="primary">Primary</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-neutral-900");
    expect(btn.className).toContain("hover:bg-neutral-800");
  });

  it("renders with variant=secondary", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-neutral-100");
    expect(btn.className).toContain("hover:bg-neutral-200");
  });

  it("renders with variant=outline", () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("border");
    expect(btn.className).toContain("border-neutral-300");
  });

  it("renders with variant=ghost", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("hover:bg-neutral-100");
  });

  it("renders with variant=destructive", () => {
    render(<Button variant="destructive">Destructive</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-red-500");
    expect(btn.className).toContain("hover:bg-red-600");
  });

  it("renders with variant=link", () => {
    render(<Button variant="link">Link</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("underline-offset-4");
    expect(btn.className).toContain("hover:underline");
  });

  /* ─── Sizes ──────────────────────────────────────────────────────────── */

  it("renders with size=default (h-10)", () => {
    render(<Button size="default">Default size</Button>);
    expect(screen.getByRole("button").className).toContain("h-10");
  });

  it("renders with size=sm (h-8)", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button").className).toContain("h-8");
  });

  it("renders with size=lg (h-12)", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button").className).toContain("h-12");
  });

  it("renders with size=icon (h-10 w-10)", () => {
    render(<Button size="icon">I</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("h-10");
    expect(btn.className).toContain("w-10");
  });

  /* ─── asChild (Radix Slot) ───────────────────────────────────────────── */

  it("renders as child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link button</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/test");
    expect(link.className).toContain("bg-neutral-900");
  });

  /* ─── Ref forwarding ─────────────────────────────────────────────────── */

  it("forwards ref to the underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe("Ref test");
  });

  /* ─── Custom className ───────────────────────────────────────────────── */

  it("merges custom className with variant classes", () => {
    render(<Button className="my-custom-class">Custom</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("my-custom-class");
    expect(btn.className).toContain("inline-flex");
  });

  /* ─── onClick ────────────────────────────────────────────────────────── */

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  /* ─── Disabled state ─────────────────────────────────────────────────── */

  it("applies disabled attribute when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("has disabled styling class when disabled", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("disabled:opacity-40");
    expect(btn.className).toContain("disabled:pointer-events-none");
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  /* ─── Accessibility ──────────────────────────────────────────────────── */

  it("passes through aria attributes", () => {
    render(<Button aria-label="Close dialog">X</Button>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Close dialog",
    );
  });

  it("supports type attribute", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
