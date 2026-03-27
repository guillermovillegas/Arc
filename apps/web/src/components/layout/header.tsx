"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="section-width flex h-16 items-center justify-between section-padding">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900">
            <span className="text-sm font-bold text-white tracking-tight">A</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-neutral-900">ARC</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/providers"
            className="rounded-lg px-3.5 py-2 text-body-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Find Providers
          </Link>
          <Link
            href="/community"
            className="rounded-lg px-3.5 py-2 text-body-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Community
          </Link>
          <Link
            href="/about"
            className="rounded-lg px-3.5 py-2 text-body-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            About
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100 md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {mobileOpen ? (
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <>
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-neutral-200/60 bg-white px-5 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              href="/providers"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2.5 text-body text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            >
              Find Providers
            </Link>
            <Link
              href="/community"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2.5 text-body text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            >
              Community
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2.5 text-body text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            >
              About
            </Link>
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Dashboard</Button>
                </Link>
                <Button variant="ghost" className="w-full" onClick={() => { logout(); setMobileOpen(false); }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
