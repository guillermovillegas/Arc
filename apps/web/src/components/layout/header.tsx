"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const NAV_LINKS = [
  { href: "/providers", label: "Discover" },
  { href: "/community", label: "Journal" },
  { href: "/about", label: "About" },
] as const;

function ArcMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 24 C 4 12, 12 4, 16 4 C 20 4, 28 12, 28 24"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="16" cy="24" r="1.75" fill="currentColor" />
    </svg>
  );
}

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-ivory-100/85 backdrop-blur-xl border-b border-espresso-200/40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <ArcMark className="h-7 w-7 text-espresso-800 transition-colors group-hover:text-brass-600" />
          <span className="font-serif text-[1.375rem] leading-none text-espresso-900 tracking-[0.01em]">
            Arc
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3.5 py-2 text-body-sm text-espresso-500 transition-colors hover:text-espresso-900"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-72 bg-ivory-100">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2.5">
                <ArcMark className="h-7 w-7 text-espresso-800" />
                <span className="font-serif text-[1.375rem] leading-none text-espresso-900 tracking-[0.01em]">
                  Arc
                </span>
              </SheetTitle>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <SheetClose key={href} asChild>
                  <Link
                    href={href}
                    className="rounded-xl px-3 py-2.5 text-body text-espresso-600 transition-colors hover:bg-ivory-200 hover:text-espresso-900"
                  >
                    {label}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            <div className="mt-6 flex flex-col gap-2">
              {user ? (
                <>
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={logout}
                    >
                      Sign Out
                    </Button>
                  </SheetClose>
                </>
              ) : (
                <>
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">Log in</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button className="w-full" asChild>
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
