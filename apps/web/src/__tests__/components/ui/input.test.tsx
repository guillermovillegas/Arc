import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Input } from "@/components/ui/input";

describe("Input component", () => {
  /* ─── Basic rendering ────────────────────────────────────────────────── */

  it("renders a basic input element", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders as an <input> element", () => {
    render(<Input data-testid="input" />);
    expect(screen.getByTestId("input").tagName).toBe("INPUT");
  });

  it("applies base styling classes", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input.className).toContain("rounded-none");
    expect(input.className).toContain("border-b");
    expect(input.className).toContain("bg-transparent");
  });

  /* ─── Ref forwarding ─────────────────────────────────────────────────── */

  it("forwards ref to the underlying input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("ref points directly to the input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current?.tagName).toBe("INPUT");
  });

  /* ─── onChange handler ───────────────────────────────────────────────── */

  it("calls onChange when the value changes", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} data-testid="input" />);
    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "hello" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("reflects typed value through the onChange event", () => {
    let capturedValue = "";
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      capturedValue = e.target.value;
    };
    render(<Input onChange={handleChange} data-testid="input" />);
    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "test input" },
    });
    expect(capturedValue).toBe("test input");
  });

  /* ─── Type attribute ─────────────────────────────────────────────────── */

  it("renders without explicit type attribute by default", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input.tagName).toBe("INPUT");
  });

  it("respects type=password", () => {
    render(<Input type="password" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "password");
  });

  it("respects type=email", () => {
    render(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "email");
  });

  /* ─── Custom className ───────────────────────────────────────────────── */

  it("merges custom className with base classes", () => {
    render(<Input className="my-class" data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input.className).toContain("my-class");
    expect(input.className).toContain("rounded-none");
  });

  /* ─── Disabled state ─────────────────────────────────────────────────── */

  it("supports disabled attribute", () => {
    render(<Input disabled data-testid="input" />);
    expect(screen.getByTestId("input")).toBeDisabled();
  });

  /* ─── Placeholder ────────────────────────────────────────────────────── */

  it("displays placeholder text", () => {
    render(<Input placeholder="Type here..." />);
    expect(screen.getByPlaceholderText("Type here...")).toBeInTheDocument();
  });
});
