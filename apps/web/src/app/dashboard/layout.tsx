"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const clientNav = [
  { label: "Bookings", href: "/dashboard/client/bookings" },
  { label: "Messages", href: "/dashboard/client/messages" },
  { label: "Profile", href: "/dashboard/client/profile" },
];

const providerNav = [
  { label: "Bookings", href: "/dashboard/provider/bookings" },
  { label: "Schedule", href: "/dashboard/provider/schedule" },
  { label: "Services", href: "/dashboard/provider/services" },
  { label: "Portfolio", href: "/dashboard/provider/portfolio" },
  { label: "Earnings", href: "/dashboard/provider/earnings" },
  { label: "Messages", href: "/dashboard/provider/messages" },
  { label: "Profile", href: "/dashboard/provider/profile" },
  { label: "Integrations", href: "/dashboard/provider/integrations" },
  { label: "Settings", href: "/dashboard/provider/settings" },
];

function SidebarNav({
  nav,
  pathname,
  onNavigate,
}: {
  nav: { label: string; href: string }[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-0.5 p-4">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={`block px-3 py-2 text-sm transition-colors ${
            pathname === item.href
              ? "bg-ivory-200 font-medium text-espresso-800"
              : "text-espresso-500 hover:bg-ivory-200 hover:text-espresso-800"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = user?.role === "PROVIDER" ? providerNav : clientNav;

  return (
    <div className="flex min-h-screen flex-col bg-ivory-100">
      <Header />
      <div className="flex flex-1">
        {/* Mobile nav toggle */}
        <div className="fixed bottom-4 right-4 z-40 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="primary" size="icon" className="h-12 w-12 rounded-full shadow-lg">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-espresso-200/60 bg-ivory-50 p-0">
              <SheetHeader className="border-b border-espresso-200/60 px-4 py-4">
                <SheetTitle className="font-serif text-subheading text-espresso-800">
                  Navigation
                </SheetTitle>
              </SheetHeader>
              <SidebarNav
                nav={nav}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden w-56 border-r border-espresso-200/60 bg-ivory-50 lg:block">
          <SidebarNav nav={nav} pathname={pathname} />
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
