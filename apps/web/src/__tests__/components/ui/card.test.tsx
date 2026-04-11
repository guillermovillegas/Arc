import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

describe("Card component", () => {
  /* ─── Card (root) ────────────────────────────────────────────────────── */

  it("renders children", () => {
    render(<Card>Card body text</Card>);
    expect(screen.getByText("Card body text")).toBeInTheDocument();
  });

  it("applies base styling classes", () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card.className).toContain("rounded-2xl");
    expect(card.className).toContain("border");
    expect(card.className).toContain("bg-white");
  });

  it("applies padding=sm", () => {
    render(
      <Card padding="sm" data-testid="card">
        Content
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("p-4");
  });

  it("applies padding=md", () => {
    render(
      <Card padding="md" data-testid="card">
        Content
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("p-6");
  });

  it("applies padding=lg", () => {
    render(
      <Card padding="lg" data-testid="card">
        Content
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("p-8");
  });

  it("does not add padding class when padding prop is omitted", () => {
    render(<Card data-testid="card">Content</Card>);
    const className = screen.getByTestId("card").className;
    expect(className).not.toContain("p-4");
    expect(className).not.toContain("p-6");
    expect(className).not.toContain("p-8");
  });

  it("merges custom className", () => {
    render(
      <Card className="shadow-xl" data-testid="card">
        Content
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card.className).toContain("shadow-xl");
    // Base classes still present
    expect(card.className).toContain("rounded-2xl");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes through additional HTML attributes", () => {
    render(
      <Card data-testid="card" role="region" aria-label="Product card">
        Content
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("role", "region");
    expect(card).toHaveAttribute("aria-label", "Product card");
  });
});

/* ─────────────────────────────────────────────────────────────────────────── */

describe("CardHeader component", () => {
  it("renders children", () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("applies default styling", () => {
    render(<CardHeader data-testid="header">Content</CardHeader>);
    const header = screen.getByTestId("header");
    expect(header.className).toContain("flex");
    expect(header.className).toContain("flex-col");
    expect(header.className).toContain("p-6");
  });

  it("merges custom className", () => {
    render(
      <CardHeader className="bg-gray-50" data-testid="header">
        Content
      </CardHeader>,
    );
    expect(screen.getByTestId("header").className).toContain("bg-gray-50");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardHeader ref={ref}>Content</CardHeader>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ─────────────────────────────────────────────────────────────────────────── */

describe("CardTitle component", () => {
  it("renders text content", () => {
    render(<CardTitle>My Title</CardTitle>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("applies font styling", () => {
    render(<CardTitle data-testid="title">Title</CardTitle>);
    const title = screen.getByTestId("title");
    expect(title.className).toContain("font-semibold");
    expect(title.className).toContain("tracking-tight");
  });

  it("merges custom className", () => {
    render(
      <CardTitle className="text-2xl" data-testid="title">
        Title
      </CardTitle>,
    );
    expect(screen.getByTestId("title").className).toContain("text-2xl");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardTitle ref={ref}>Title</CardTitle>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ─────────────────────────────────────────────────────────────────────────── */

describe("CardDescription component", () => {
  it("renders text content", () => {
    render(<CardDescription>A description</CardDescription>);
    expect(screen.getByText("A description")).toBeInTheDocument();
  });

  it("applies muted text styling", () => {
    render(
      <CardDescription data-testid="desc">Description</CardDescription>,
    );
    expect(screen.getByTestId("desc").className).toContain("text-neutral-500");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardDescription ref={ref}>Description</CardDescription>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ─────────────────────────────────────────────────────────────────────────── */

describe("CardContent component", () => {
  it("renders children", () => {
    render(<CardContent>Body text here</CardContent>);
    expect(screen.getByText("Body text here")).toBeInTheDocument();
  });

  it("applies padding with no top padding (p-6 pt-0)", () => {
    render(<CardContent data-testid="content">Content</CardContent>);
    const content = screen.getByTestId("content");
    expect(content.className).toContain("p-6");
    expect(content.className).toContain("pt-0");
  });

  it("merges custom className", () => {
    render(
      <CardContent className="gap-4" data-testid="content">
        Content
      </CardContent>,
    );
    expect(screen.getByTestId("content").className).toContain("gap-4");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Content</CardContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ─────────────────────────────────────────────────────────────────────────── */

describe("CardFooter component", () => {
  it("renders children", () => {
    render(<CardFooter>Footer actions</CardFooter>);
    expect(screen.getByText("Footer actions")).toBeInTheDocument();
  });

  it("applies flex layout and padding", () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);
    const footer = screen.getByTestId("footer");
    expect(footer.className).toContain("flex");
    expect(footer.className).toContain("items-center");
    expect(footer.className).toContain("p-6");
    expect(footer.className).toContain("pt-0");
  });

  it("merges custom className", () => {
    render(
      <CardFooter className="justify-end" data-testid="footer">
        Footer
      </CardFooter>,
    );
    expect(screen.getByTestId("footer").className).toContain("justify-end");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>Footer</CardFooter>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ─────────────────────────────────────────────────────────────────────────── */

describe("Card composition", () => {
  it("renders a fully composed card with all sub-components", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Product</CardTitle>
          <CardDescription>A great product</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Details here</p>
        </CardContent>
        <CardFooter>
          <button>Buy</button>
        </CardFooter>
      </Card>,
    );

    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("A great product")).toBeInTheDocument();
    expect(screen.getByText("Details here")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /buy/i })).toBeInTheDocument();
  });
});
