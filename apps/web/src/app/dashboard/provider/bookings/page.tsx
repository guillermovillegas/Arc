"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";

interface BookingItem {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  totalPriceInCents: number;
  notes: string | null;
  service: { name: string };
  client: { id: string; firstName: string; lastName: string; avatarUrl: string | null };
}

export default function ProviderBookingsPage() {
  const { accessToken } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (accessToken) loadBookings();
  }, [accessToken, filter]);

  async function loadBookings() {
    try {
      const params = filter ? `?status=${filter}` : "";
      const res = await api.get<{ data: BookingItem[] }>(`/bookings/provider${params}`, {
        token: accessToken!,
      });
      setBookings(res.data);
    } catch {
      // Handle error
    }
  }

  async function updateStatus(bookingId: string, status: string) {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status }, { token: accessToken! });
      loadBookings();
    } catch {
      // Handle error
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>

      <div className="mt-4 flex gap-2 flex-wrap">
        {["", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED"].map((s) => (
          <Button key={s} variant={filter === s ? "primary" : "outline"} size="sm" onClick={() => setFilter(s)}>
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
                    {booking.client.firstName} {booking.client.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.startTime).toLocaleDateString()} at{" "}
                    {new Date(booking.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {booking.notes && <p className="mt-1 text-sm text-gray-500 italic">{booking.notes}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-semibold">${(booking.totalPriceInCents / 100).toFixed(2)}</span>
                  <div className="flex gap-1">
                    {booking.status === "PENDING" && (
                      <>
                        <Button size="sm" onClick={() => updateStatus(booking.id, "CONFIRMED")}>
                          Confirm
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(booking.id, "CANCELLED")}>
                          Decline
                        </Button>
                      </>
                    )}
                    {booking.status === "CONFIRMED" && (
                      <Button size="sm" onClick={() => updateStatus(booking.id, "IN_PROGRESS")}>
                        Start
                      </Button>
                    )}
                    {booking.status === "IN_PROGRESS" && (
                      <Button size="sm" onClick={() => updateStatus(booking.id, "COMPLETED")}>
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
