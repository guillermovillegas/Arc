"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MessageSquare,
  UserCircle,
  Scissors,
  BarChart3,
  Settings,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/lib/auth";

const quickLinks = {
  CLIENT: [
    {
      label: "Your Bookings",
      description: "View and manage your appointments",
      href: "/dashboard/client/bookings",
      icon: CalendarDays,
    },
    {
      label: "Messages",
      description: "Chat with your providers",
      href: "/dashboard/client/messages",
      icon: MessageSquare,
    },
    {
      label: "Profile",
      description: "Update your personal information",
      href: "/dashboard/client/profile",
      icon: UserCircle,
    },
  ],
  PROVIDER: [
    {
      label: "Bookings",
      description: "Manage incoming appointments",
      href: "/dashboard/provider/bookings",
      icon: CalendarDays,
    },
    {
      label: "Services",
      description: "Add and manage your offerings",
      href: "/dashboard/provider/services",
      icon: Scissors,
    },
    {
      label: "Earnings",
      description: "Track revenue and payouts",
      href: "/dashboard/provider/earnings",
      icon: BarChart3,
    },
    {
      label: "Messages",
      description: "Respond to client messages",
      href: "/dashboard/provider/messages",
      icon: MessageSquare,
    },
    {
      label: "Profile",
      description: "Edit your provider profile",
      href: "/dashboard/provider/profile",
      icon: UserCircle,
    },
    {
      label: "Settings",
      description: "Calendar sync and preferences",
      href: "/dashboard/provider/settings",
      icon: Settings,
    },
  ],
} as const;

export default function DashboardHomePage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const firstName = user?.firstName || "there";
  const role = user?.role === "PROVIDER" ? "PROVIDER" : "CLIENT";
  const links = quickLinks[role];

  const today = new Date();
  const greeting =
    today.getHours() < 12
      ? "Good morning"
      : today.getHours() < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-heading text-espresso-800">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1 text-body-sm text-espresso-400">
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto]">
        {/* Main content */}
        <div className="space-y-8">
          {/* Quick nav cards */}
          <div>
            <h2 className="text-label text-espresso-400">Quick Access</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} className="group">
                    <Card className="border-espresso-200/60 bg-ivory-50 p-4 transition-all hover:border-espresso-300 hover:shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-brass-100">
                          <Icon className="h-4 w-4 text-brass-700" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-medium text-espresso-800 group-hover:text-brass-700">
                            {link.label}
                          </h3>
                          <p className="mt-0.5 text-xs text-espresso-400">
                            {link.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Today's schedule (placeholder — wired to real API when available) */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-label text-espresso-400">
                Today&apos;s Schedule
              </h2>
              <Link
                href={
                  role === "PROVIDER"
                    ? "/dashboard/provider/bookings"
                    : "/dashboard/client/bookings"
                }
                className="flex items-center gap-1 text-xs text-brass-600 hover:text-brass-700"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <Card className="mt-3 border-espresso-200/60 bg-ivory-50 p-6">
              <div className="flex flex-col items-center py-6 text-center">
                <Clock className="h-8 w-8 text-espresso-200" />
                <p className="mt-3 font-serif text-lg text-espresso-800">
                  No appointments today
                </p>
                <p className="mt-1 text-sm text-espresso-400">
                  {role === "PROVIDER"
                    ? "Your schedule is clear. Bookings will appear here."
                    : "Book an appointment to get started."}
                </p>
                <Link
                  href={
                    role === "PROVIDER"
                      ? "/dashboard/provider/schedule"
                      : "/providers"
                  }
                  className="mt-4 text-sm font-medium text-brass-600 hover:text-brass-700"
                >
                  {role === "PROVIDER"
                    ? "Manage your schedule"
                    : "Find a professional"}
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar: Calendar + stats */}
        <div className="space-y-4 lg:w-[300px]">
          <Card className="border-espresso-200/60 bg-ivory-50 p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={{ before: new Date() }}
              className="mx-auto"
            />
          </Card>

          <Card className="border-espresso-200/60 bg-ivory-50 p-5">
            <h3 className="text-label text-espresso-400">This Month</h3>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-espresso-600">Bookings</span>
                <span className="font-serif text-lg text-espresso-800">
                  &mdash;
                </span>
              </div>
              <div className="h-px bg-espresso-200/40" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-espresso-600">
                  {role === "PROVIDER" ? "Revenue" : "Spent"}
                </span>
                <span className="font-serif text-lg text-espresso-800">
                  &mdash;
                </span>
              </div>
              <div className="h-px bg-espresso-200/40" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-espresso-600">Messages</span>
                <span className="font-serif text-lg text-espresso-800">
                  &mdash;
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
