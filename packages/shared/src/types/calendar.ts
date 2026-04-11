export type CalendarProvider = "GOOGLE" | "ICS_FEED";

export interface CalendarConnection {
  id: string;
  userId: string;
  provider: CalendarProvider;
  externalId: string | null;
  feedUrl: string | null;
  lastSyncedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalEvent {
  id: string;
  calendarConnectionId: string;
  externalId: string;
  title: string | null;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
}
