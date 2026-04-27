"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Link2,
  Unlink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Rss,
  Loader2,
} from "lucide-react";

interface CalendarConnectionData {
  id: string;
  provider: "GOOGLE" | "ICS_FEED";
  externalId: string | null;
  feedUrl: string | null;
  lastSyncedAt: string | null;
  isActive: boolean;
  createdAt: string;
  _count: { externalEvents: number };
}

function CalendarSettingsPageInner() {
  const { accessToken } = useAuth();
  const searchParams = useSearchParams();
  const [connections, setConnections] = useState<CalendarConnectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [icsUrl, setIcsUrl] = useState("");
  const [icsLoading, setIcsLoading] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadConnections = useCallback(async () => {
    if (!accessToken) return;
    setError(null);
    try {
      const res = await api.get<{ data: CalendarConnectionData[] }>(
        "/calendar/connections",
        { token: accessToken },
      );
      setConnections(res.data);
    } catch {
      // Network error on initial load — degrade to empty state
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  // Show success message if redirected from Google OAuth
  useEffect(() => {
    if (searchParams.get("calendar") === "connected") {
      setSuccessMessage("Google Calendar connected successfully!");
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [searchParams]);

  async function connectGoogle() {
    setError(null);
    try {
      const res = await api.get<{ data: { url: string } }>(
        "/calendar/google/connect",
        { token: accessToken! },
      );
      window.location.href = res.data.url;
    } catch {
      setError("Failed to start Google Calendar connection.");
    }
  }

  async function addIcsFeed() {
    if (!icsUrl.trim()) return;
    setIcsLoading(true);
    setError(null);
    try {
      const res = await api.post<{ data: { eventsImported: number } }>(
        "/calendar/ics",
        { feedUrl: icsUrl },
        { token: accessToken! },
      );
      setIcsUrl("");
      setSuccessMessage(`Calendar feed connected! ${res.data.eventsImported} events imported.`);
      setTimeout(() => setSuccessMessage(null), 5000);
      await loadConnections();
    } catch {
      setError("Failed to add calendar feed. Check the URL and try again.");
    } finally {
      setIcsLoading(false);
    }
  }

  async function triggerSync(connectionId: string) {
    setSyncingId(connectionId);
    setError(null);
    try {
      await api.post(`/calendar/sync/${connectionId}`, {}, { token: accessToken! });
      setSuccessMessage("Calendar synced successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      await loadConnections();
    } catch {
      setError("Failed to sync calendar.");
    } finally {
      setSyncingId(null);
    }
  }

  async function disconnect(connectionId: string) {
    setError(null);
    try {
      await api.delete(`/calendar/connections/${connectionId}`, { token: accessToken! });
      await loadConnections();
    } catch {
      setError("Failed to disconnect calendar.");
    }
  }

  const googleConnection = connections.find((c) => c.provider === "GOOGLE");
  const icsConnection = connections.find((c) => c.provider === "ICS_FEED");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-heading text-espresso-800">
          Settings
        </h1>
        <p className="mt-1 text-body-sm text-espresso-400">
          Connect your existing calendars so bookings stay in sync.
        </p>
      </div>

      {/* Status messages */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-[#3b7a57]/10 px-4 py-3 text-[0.875rem] text-[#3b7a57]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-espresso-300" />
        </div>
      ) : (
        <>
          {/* --- Google Calendar ---------------------------------------- */}
          <Card className="border-espresso-200/60 bg-ivory-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brass-100">
                    <Calendar className="h-5 w-5 text-brass-600" />
                  </div>
                  <div>
                    <CardTitle className="text-espresso-800">Google Calendar</CardTitle>
                    <CardDescription className="text-espresso-400">
                      Two-way sync — external events block your ARC availability, and ARC bookings appear in Google Calendar.
                    </CardDescription>
                  </div>
                </div>
                {googleConnection && (
                  <Badge className="rounded-full gap-1.5 border-transparent bg-[#3b7a57]/10 text-[#3b7a57]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3b7a57]" />
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {googleConnection ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-ivory-100 px-4 py-3">
                    <div>
                      <p className="text-[0.875rem] font-medium text-espresso-800">
                        {googleConnection.externalId || "Primary calendar"}
                      </p>
                      <p className="text-[0.75rem] text-espresso-400">
                        {googleConnection._count?.externalEvents ?? 0} events synced
                        {googleConnection.lastSyncedAt &&
                          ` · Last synced ${new Date(googleConnection.lastSyncedAt).toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="arc-outline"
                        size="sm"
                        onClick={() => triggerSync(googleConnection.id)}
                        disabled={syncingId === googleConnection.id}
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${syncingId === googleConnection.id ? "animate-spin" : ""}`} />
                        Sync now
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => disconnect(googleConnection.id)}
                      >
                        <Unlink className="h-3.5 w-3.5" />
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button variant="arc" onClick={connectGoogle} className="gap-2">
                  <Link2 className="h-4 w-4" />
                  Connect Google Calendar
                </Button>
              )}
            </CardContent>
          </Card>

          {/* --- ICS Feed ---------------------------------------------- */}
          <Card className="border-espresso-200/60 bg-ivory-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brass-100">
                    <Rss className="h-5 w-5 text-brass-600" />
                  </div>
                  <div>
                    <CardTitle className="text-espresso-800">Calendar Feed (ICS)</CardTitle>
                    <CardDescription className="text-espresso-400">
                      Import events from Booksy, Vagaro, Acuity, or any app that exports an ICS/iCal feed. One-way sync (read only).
                    </CardDescription>
                  </div>
                </div>
                {icsConnection && (
                  <Badge className="rounded-full gap-1.5 border-transparent bg-[#3b7a57]/10 text-[#3b7a57]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3b7a57]" />
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {icsConnection ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-ivory-100 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.875rem] font-medium text-espresso-800">
                        {icsConnection.feedUrl}
                      </p>
                      <p className="text-[0.75rem] text-espresso-400">
                        {icsConnection._count?.externalEvents ?? 0} events imported
                        {icsConnection.lastSyncedAt &&
                          ` · Last synced ${new Date(icsConnection.lastSyncedAt).toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <Button
                        variant="arc-outline"
                        size="sm"
                        onClick={() => triggerSync(icsConnection.id)}
                        disabled={syncingId === icsConnection.id}
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${syncingId === icsConnection.id ? "animate-spin" : ""}`} />
                        Sync now
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => disconnect(icsConnection.id)}
                      >
                        <Unlink className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[0.75rem] text-espresso-400">
                    Find your calendar feed URL in your booking app&apos;s settings — usually under &quot;Calendar Export,&quot; &quot;Sync,&quot; or &quot;iCal.&quot;
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://calendar.booksy.com/feed/..."
                      value={icsUrl}
                      onChange={(e) => setIcsUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="brass"
                      onClick={addIcsFeed}
                      disabled={icsLoading || !icsUrl.trim()}
                      className="gap-2 shrink-0"
                    >
                      {icsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Rss className="h-4 w-4" />
                      )}
                      Import feed
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* --- How It Works ------------------------------------------ */}
          <Separator className="bg-espresso-200/60" />

          <div className="space-y-4">
            <h3 className="font-serif text-[1rem] font-semibold text-espresso-800">
              How calendar sync works
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Blocks your time",
                  desc: "Events from your external calendar automatically block those time slots in ARC. Clients only see truly available times.",
                },
                {
                  title: "Writes ARC bookings",
                  desc: "When a client books through ARC, the appointment appears in your Google Calendar automatically (Google Calendar only).",
                },
                {
                  title: "Syncs every 15 min",
                  desc: "Google Calendar syncs in real-time via push notifications. ICS feeds are checked every 15 minutes.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-espresso-200/60 bg-ivory-100 p-4"
                >
                  <p className="text-[0.875rem] font-medium text-espresso-800">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[0.75rem] text-espresso-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function CalendarSettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-espresso-400">Loading...</div>}>
      <CalendarSettingsPageInner />
    </Suspense>
  );
}
