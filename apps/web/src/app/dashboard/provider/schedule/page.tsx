"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Slot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export default function ProviderSchedulePage() {
  const { accessToken } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Default schedule: Mon-Sat 9-6
    setSlots(
      [1, 2, 3, 4, 5, 6].map((day) => ({
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "18:00",
      })),
    );
  }, []);

  function toggleDay(day: number) {
    const exists = slots.find((s) => s.dayOfWeek === day);
    if (exists) {
      setSlots(slots.filter((s) => s.dayOfWeek !== day));
    } else {
      setSlots([...slots, { dayOfWeek: day, startTime: "09:00", endTime: "18:00" }]);
    }
  }

  function updateSlot(day: number, field: "startTime" | "endTime", value: string) {
    setSlots(slots.map((s) => (s.dayOfWeek === day ? { ...s, [field]: value } : s)));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await api.put("/availability", { slots }, { token: accessToken! });
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
      <p className="mt-1 text-gray-600">Set your weekly availability</p>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[0.875rem] text-red-600">{error}</p>}

      <Card className="mt-6">
        <div className="space-y-3">
          {DAYS.map((day, i) => {
            const slot = slots.find((s) => s.dayOfWeek === i);
            return (
              <div key={day} className="flex items-center gap-4">
                <label className="flex w-28 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!slot}
                    onChange={() => toggleDay(i)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-900">{day}</span>
                </label>
                {slot ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateSlot(i, "startTime", e.target.value)}
                      className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateSlot(i, "endTime", e.target.value)}
                      className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Unavailable</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Schedule"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
