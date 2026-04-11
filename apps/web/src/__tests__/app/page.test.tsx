import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/layout/header", () => ({
  Header: () =>
    React.createElement("header", { "data-testid": "header" }, "Header"),
}));
vi.mock("@/components/layout/footer", () => ({
  Footer: () =>
    React.createElement("footer", { "data-testid": "footer" }, "Footer"),
}));

import HomePage from "@/app/page";

describe("HomePage (Arc editorial)", () => {
  describe("Hero", () => {
    it("renders editorial headline", () => {
      render(React.createElement(HomePage));
      expect(screen.getAllByText(/exceptional/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/anywhere\./i).length).toBeGreaterThan(0);
    });

    it("renders primary CTAs with correct hrefs", () => {
      render(React.createElement(HomePage));
      expect(
        screen.getByRole("link", { name: /find your artist/i }),
      ).toHaveAttribute("href", "/providers");
      expect(
        screen.getByRole("link", { name: /offer your craft/i }),
      ).toHaveAttribute("href", "/register?role=provider");
    });

    it("lists the crafts", () => {
      render(React.createElement(HomePage));
      expect(screen.getByText("Barbering")).toBeInTheDocument();
      expect(screen.getByText("Nails")).toBeInTheDocument();
      expect(screen.getByText("Lashes")).toBeInTheDocument();
    });
  });

  describe("Stats", () => {
    it("renders all 4 stats", () => {
      render(React.createElement(HomePage));
      expect(screen.getByText("2.9%")).toBeInTheDocument();
      expect(screen.getByText("< 30s")).toBeInTheDocument();
      expect(screen.getByText("24 / 7")).toBeInTheDocument();
      expect(screen.getByText("$0")).toBeInTheDocument();
    });
  });

  describe("Chapter I — The Journey", () => {
    it("renders 4 chapters", () => {
      render(React.createElement(HomePage));
      // "Discover" appears in Chapter I and Chapter II instrument grid
      expect(screen.getAllByText("Discover").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Reserve").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Pay with ease")).toBeInTheDocument();
      expect(screen.getByText("Enjoy the craft")).toBeInTheDocument();
    });
  });

  describe("Chapter II — The Instrument", () => {
    it("renders the mobile showcase heading", () => {
      render(React.createElement(HomePage));
      expect(screen.getByText(/the craft, in/i)).toBeInTheDocument();
      expect(screen.getByText(/your pocket\./i)).toBeInTheDocument();
    });
  });

  describe("Chapter III — For Professionals", () => {
    it("renders provider heading and CTA", () => {
      render(React.createElement(HomePage));
      // "your craft" appears in hero subhead and provider headline
      expect(screen.getAllByText(/your craft,/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/amplified\./i)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /begin your practice/i }),
      ).toHaveAttribute("href", "/register?role=provider");
    });

    it("renders provider features", () => {
      render(React.createElement(HomePage));
      expect(screen.getByText("Zero monthly fees")).toBeInTheDocument();
      expect(screen.getByText("Instant payouts")).toBeInTheDocument();
      expect(screen.getByText("Deposit protection")).toBeInTheDocument();
    });
  });

  describe("Chapter IV — Voices", () => {
    it("renders testimonials", () => {
      render(React.createElement(HomePage));
      expect(
        screen.getByText(/deposits ended my no-show problem/i),
      ).toBeInTheDocument();
      expect(screen.getByText("Marcus J.")).toBeInTheDocument();
      expect(screen.getByText("Keisha T.")).toBeInTheDocument();
      expect(screen.getByText("Aisha M.")).toBeInTheDocument();
    });
  });

  describe("Final CTA", () => {
    it("renders colophon and primary actions", () => {
      render(React.createElement(HomePage));
      expect(screen.getByText(/anytime\./i)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /create your account/i }),
      ).toHaveAttribute("href", "/register");
      expect(
        screen.getByRole("link", { name: /explore professionals/i }),
      ).toHaveAttribute("href", "/providers");
    });
  });

  describe("Layout", () => {
    it("renders header and footer", () => {
      render(React.createElement(HomePage));
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });
  });
});
