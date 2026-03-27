"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";

interface Stats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (accessToken) loadStats();
  }, [accessToken]);

  async function loadStats() {
    try {
      const res = await api.get<{ data: Stats }>("/admin/stats", { token: accessToken! });
      setStats(res.data);
    } catch {
      // Handle error
    }
  }

  const cards = [
    { label: "Total Users", value: stats?.totalUsers || 0 },
    { label: "Providers", value: stats?.totalProviders || 0 },
    { label: "Total Bookings", value: stats?.totalBookings || 0 },
    {
      label: "Platform Revenue",
      value: `$${((stats?.totalRevenue || 0) / 100).toFixed(2)}`,
    },
  ];

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Card key={card.label}>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
