"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/lib/auth";

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
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const nav = user?.role === "PROVIDER" ? providerNav : clientNav;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-56 border-r border-gray-200 bg-gray-50 lg:block">
          <nav className="space-y-1 p-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
