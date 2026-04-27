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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) loadStats();
  }, [accessToken]);

  async function loadStats() {
    setError(null);
    try {
      const res = await api.get<{ data: Stats }>("/admin/stats", { token: accessToken! });
      setStats(res.data);
    } catch {
      setError("Failed to load stats. Please try again.");
    }
  }

  const cards = [
    { label: "Total Users", value: stats?.totalUsers || 0 },
    { label: "Professionals", value: stats?.totalProviders || 0 },
    { label: "Total Bookings", value: stats?.totalBookings || 0 },
    {
      label: "Platform Revenue",
      value: `$${((stats?.totalRevenue || 0) / 100).toFixed(2)}`,
    },
  ];

  return (
    <div className="bg-ivory-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-heading text-espresso-800">Admin Dashboard</h1>

        {error && <p className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Card key={card.label} className="border-espresso-200/60 bg-ivory-50 p-6">
              <p className="text-label text-espresso-400">{card.label}</p>
              <p className="mt-2 font-serif text-3xl text-espresso-800">{card.value}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
