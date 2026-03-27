export interface Availability {
  id: string;
  providerProfileId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "09:00" (HH:mm)
  endTime: string; // "17:00" (HH:mm)
}

export interface AvailabilityOverride {
  id: string;
  providerProfileId: string;
  date: string; // "2026-04-01" (YYYY-MM-DD)
  isBlocked: boolean;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
}

export interface TimeSlot {
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  available: boolean;
}
