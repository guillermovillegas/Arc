"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { BookingStatus } from "@arc/shared";

interface BookingItem {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  totalPriceInCents: number;
  location: string | null;
  service: { name: string; category: string; durationMinutes: number };
  providerProfile: {
    user: { firstName: string; lastName: string; avatarUrl: string | null };
  };
}

export default function ClientBookingsPage() {
  const { accessToken } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) loadBookings();
  }, [accessToken, filter]);

  async function loadBookings() {
    setError(null);
    try {
      const params = filter ? `?status=${filter}` : "";
      const res = await api.get<{ data: BookingItem[] }>(`/bookings/client${params}`, {
        token: accessToken!,
      });
      setBookings(res.data);
    } catch {
      setError("Failed to load bookings. Please try again.");
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    NO_SHOW: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[0.875rem] text-red-600">{error}</p>}

      <div className="mt-4 flex gap-2">
        {["", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
          <Button
            key={s}
            variant={filter === s ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
          >
            {s || "All"}
          </Button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {bookings.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No bookings found</p>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id} padding="sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{booking.service.name}</h3>
                  <p className="text-sm text-gray-600">
                    with {booking.providerProfile.user.firstName}{" "}
                    {booking.providerProfile.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.startTime).toLocaleDateString()} at{" "}
                    {new Date(booking.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {booking.location && (
                    <p className="text-sm text-gray-500">{booking.location}</p>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusColors[booking.status] || ""}`}
                  >
                    {booking.status}
                  </span>
                  <p className="mt-1 font-semibold text-gray-900">
                    ${(booking.totalPriceInCents / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
