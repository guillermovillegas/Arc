"use client";

import { useAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) redirect("/login");
    if (!isLoading && user?.role === "PROVIDER") redirect("/dashboard/provider/bookings");
    if (!isLoading && user?.role === "CLIENT") redirect("/dashboard/client/bookings");
    if (!isLoading && user?.role === "ADMIN") redirect("/admin");
  }, [user, isLoading]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-gray-500">Loading dashboard...</div>
    </div>
  );
}
