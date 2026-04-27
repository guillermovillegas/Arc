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
    expect(input.className).toContain("rounded-md");
    expect(input.className).toContain("border");
    expect(input.className).toContain("bg-background");
  });

  /* ─── Label ──────────────────────────────────────────────────────────── */

  it("renders a label when label prop is provided", () => {
    render(<Input label="Email" id="email-input" />);
    const label = screen.getByText("Email");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("for", "email-input");
  });

  it("does not render a label when label prop is omitted", () => {
    render(<Input id="no-label" data-testid="input" />);
    expect(screen.queryByRole("label")).not.toBeInTheDocument();
  });

  it("label has correct styling", () => {
    render(<Input label="Name" id="name" />);
    const label = screen.getByText("Name");
    expect(label.className).toContain("font-medium");
    expect(label.className).toContain("text-foreground");
  });

  /* ─── Error state ────────────────────────────────────────────────────── */

  it("displays error message when error prop is provided", () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("does not display error text when error prop is omitted", () => {
    render(<Input data-testid="input" />);
    // No <p> with error styling should exist
    const wrapper = screen.getByTestId("input").parentElement;
    const paragraphs = wrapper?.querySelectorAll("p");
    expect(paragraphs?.length ?? 0).toBe(0);
  });

  it("applies error border styling when error is set", () => {
    render(<Input error="Invalid" data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input.className).toContain("border-red-500");
  });

  it("error message has red text styling", () => {
    render(<Input error="Something went wrong" />);
    const errorText = screen.getByText("Something went wrong");
    expect(errorText.className).toContain("text-red-600");
  });

  it("shows both label and error simultaneously", () => {
    render(<Input label="Password" error="Too short" id="pw" />);
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Too short")).toBeInTheDocument();
  });

  /* ─── Ref forwarding ─────────────────────────────────────────────────── */

  it("forwards ref to the underlying input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("ref points to the input, not the wrapper div", () => {
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
    // The component doesn't set type explicitly; browsers default to "text"
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
    expect(input.className).toContain("rounded-md");
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
