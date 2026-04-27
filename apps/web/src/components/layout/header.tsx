"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  const navLinks = [
    { href: "/providers", label: "Discover" },
    { href: "/community", label: "Journal" },
    { href: "/about", label: "About" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-espresso-200/40 bg-ivory-100/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-5 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <ArcMark className="h-6 w-6 text-espresso-800 transition-colors group-hover:text-brass-600" />
          <span className="font-serif text-xl leading-none text-espresso-900 tracking-[0.01em]">
            Arc
          </span>
        </Link>

        {/* Desktop Nav — centered */}
        <nav className="hidden flex-1 items-center gap-0.5 md:flex">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || (href === "/dashboard" && isDashboard);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 text-[0.8125rem] transition-colors ${
                  isActive
                    ? "font-medium text-espresso-900"
                    : "text-espresso-400 hover:text-espresso-800"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions — right */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Button variant="outline" size="sm" onClick={logout}>
              Sign Out
            </Button>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 text-[0.8125rem] text-espresso-400 transition-colors hover:text-espresso-800"
              >
                Sign in
              </Link>
              <Button variant="primary" size="sm" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="ml-auto md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72 bg-ivory-100">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ArcMark className="h-6 w-6 text-espresso-800" />
                  <span className="font-serif text-xl leading-none text-espresso-900">
                    Arc
                  </span>
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-6 flex flex-col gap-0.5">
                {navLinks.map(({ href, label }) => (
                  <SheetClose key={href} asChild>
                    <Link
                      href={href}
                      className="px-3 py-2.5 text-[0.9375rem] text-espresso-600 transition-colors hover:bg-ivory-200 hover:text-espresso-900"
                    >
                      {label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-2">
                {user ? (
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={logout}
                    >
                      Sign Out
                    </Button>
                  </SheetClose>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login">Sign in</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="primary" className="w-full" asChild>
                        <Link href="/register">Get Started</Link>
                      </Button>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
