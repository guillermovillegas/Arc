"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { Loader2, Clock, CalendarDays } from "lucide-react";

const DAYS = [
  { short: "Sun", full: "Sunday" },
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
];

interface Slot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export default function ProviderSchedulePage() {
  const { accessToken } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  useEffect(() => {
    setSlots(
      [1, 2, 3, 4, 5, 6].map((day) => ({
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "18:00",
      })),
    );
    setLoading(false);
  }, []);

  function toggleDay(day: number) {
    const exists = slots.find((s) => s.dayOfWeek === day);
    if (exists) {
      setSlots(slots.filter((s) => s.dayOfWeek !== day));
    } else {
      setSlots([
        ...slots,
        { dayOfWeek: day, startTime: "09:00", endTime: "18:00" },
      ]);
    }
  }

  function updateSlot(
    day: number,
    field: "startTime" | "endTime",
    value: string,
  ) {
    setSlots(
      slots.map((s) => (s.dayOfWeek === day ? { ...s, [field]: value } : s)),
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await api.put("/availability", { slots }, { token: accessToken! });
      setSaved(true);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const activeDays = new Set(slots.map((s) => s.dayOfWeek));

  function dayHasAvailability(date: Date) {
    return activeDays.has(date.getDay());
  }

  return (
    <div>
      <h1 className="font-serif text-heading text-espresso-800">Schedule</h1>
      <p className="mt-1 text-body-sm text-espresso-400">
        Set your weekly availability so clients know when to book.
      </p>

      {error && (
        <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {saved && (
        <div className="mt-4 border border-[#3b7a57]/20 bg-[#3b7a57]/10 px-4 py-3 text-sm text-[#3b7a57]">
          Schedule saved successfully.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-espresso-300" />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto]">
          {/* Weekly availability grid */}
          <Card className="border-espresso-200/60 bg-ivory-50">
            <div className="border-b border-espresso-200/60 px-6 py-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brass-600" />
                <h2 className="font-serif text-lg text-espresso-800">
                  Weekly Hours
                </h2>
              </div>
              <p className="mt-1 text-xs text-espresso-400">
                Toggle days on/off and set your working hours.
              </p>
            </div>

            <div className="divide-y divide-espresso-200/40 p-0">
              {DAYS.map((day, i) => {
                const slot = slots.find((s) => s.dayOfWeek === i);
                const isActive = !!slot;
                return (
                  <div
                    key={day.short}
                    className={`flex items-center gap-4 px-6 py-3.5 transition-colors ${
                      isActive ? "bg-ivory-50" : "bg-ivory-100/50"
                    }`}
                  >
                    <button
                      onClick={() => toggleDay(i)}
                      className={`flex h-8 w-20 items-center justify-center text-xs font-medium tracking-wide transition-colors ${
                        isActive
                          ? "bg-espresso-800 text-ivory-100"
                          : "border border-espresso-200 text-espresso-400 hover:border-espresso-400"
                      }`}
                    >
                      {day.short.toUpperCase()}
                    </button>

                    {isActive ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            updateSlot(i, "startTime", e.target.value)
                          }
                          className="rounded-md border border-espresso-200 bg-ivory-50 px-2.5 py-1.5 text-sm text-espresso-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:ring-offset-2"
                        />
                        <span className="text-xs text-espresso-300">—</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            updateSlot(i, "endTime", e.target.value)
                          }
                          className="rounded-md border border-espresso-200 bg-ivory-50 px-2.5 py-1.5 text-sm text-espresso-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:ring-offset-2"
                        />
                      </div>
                    ) : (
                      <span className="text-xs italic text-espresso-300">
                        Unavailable
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-espresso-200/60 px-6 py-4">
              <p className="text-xs text-espresso-400">
                {slots.length} of 7 days active
              </p>
              <Button
                variant="arc"
                onClick={handleSave}
                disabled={loading || saving}
              >
                {saving ? "Saving\u2026" : "Save Schedule"}
              </Button>
            </div>
          </Card>

          {/* Calendar preview */}
          <Card className="border-espresso-200/60 bg-ivory-50 p-4 lg:w-[300px]">
            <div className="mb-3 flex items-center gap-2 px-2">
              <CalendarDays className="h-4 w-4 text-brass-600" />
              <h2 className="font-serif text-sm text-espresso-800">
                Availability Preview
              </h2>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{
                available: dayHasAvailability,
                unavailable: (date: Date) => !dayHasAvailability(date),
              }}
              modifiersClassNames={{
                available: "font-medium",
                unavailable: "opacity-30",
              }}
              disabled={{ before: new Date() }}
              className="mx-auto"
            />
            {selectedDate && (
              <div className="mt-3 border-t border-espresso-200/40 px-2 pt-3">
                <p className="text-xs text-espresso-400">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {dayHasAvailability(selectedDate) ? (
                  <p className="mt-1 text-sm font-medium text-[#3b7a57]">
                    {slots.find(
                      (s) => s.dayOfWeek === selectedDate.getDay(),
                    )?.startTime}{" "}
                    —{" "}
                    {slots.find(
                      (s) => s.dayOfWeek === selectedDate.getDay(),
                    )?.endTime}
                  </p>
                ) : (
                  <p className="mt-1 text-sm italic text-espresso-300">
                    Not available
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
