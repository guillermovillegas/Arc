"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Loader2,
  CalendarDays,
  Clock,
  MapPin,
  User,
  DollarSign,
  FileText,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";

interface BookingItem {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  totalPriceInCents: number;
  location: string | null;
  notes: string | null;
  service: { name: string; category: string; durationMinutes: number };
  providerProfile?: {
    user?: { firstName?: string; lastName?: string; avatarUrl?: string | null };
    businessName?: string;
  };
}

type TabFilter = "upcoming" | "past" | "cancelled";

const STATUS_BADGE_CLASSES: Record<string, string> = {
  PENDING: "border-brass-300 bg-brass-100 text-brass-700",
  CONFIRMED: "border-[#3b7a57]/30 bg-[#3b7a57]/10 text-[#3b7a57]",
  IN_PROGRESS: "border-brass-400 bg-brass-200 text-brass-800",
  COMPLETED: "border-[#3b7a57]/30 bg-[#3b7a57]/10 text-[#3b7a57]",
  CANCELLED: "border-espresso-300 bg-espresso-100 text-espresso-500",
  NO_SHOW: "border-espresso-300 bg-espresso-100 text-espresso-500",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

export default function ClientBookingsPage() {
  const { accessToken } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabFilter>("upcoming");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  // Detail dialog
  const [detailBooking, setDetailBooking] = useState<BookingItem | null>(null);

  // Cancel dialog
  const [cancelBooking, setCancelBooking] = useState<BookingItem | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const loadBookings = useCallback(async () => {
    if (!accessToken) return;
    setError(null);
    setLoading(true);
    try {
      const res = await api.get<{ data: BookingItem[] }>("/bookings/client", {
        token: accessToken,
      });
      setBookings(res.data);
    } catch {
      // Network error on initial load — degrade to empty state
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filteredBookings = useMemo(() => {
    const now = new Date();
    let filtered = bookings;

    // Tab filter
    if (activeTab === "upcoming") {
      filtered = filtered.filter(
        (b) =>
          new Date(b.startTime) >= now &&
          b.status !== "CANCELLED" &&
          b.status !== "NO_SHOW" &&
          b.status !== "COMPLETED"
      );
    } else if (activeTab === "past") {
      filtered = filtered.filter(
        (b) =>
          new Date(b.startTime) < now ||
          b.status === "COMPLETED" ||
          b.status === "NO_SHOW"
      );
      // exclude cancelled from past
      filtered = filtered.filter((b) => b.status !== "CANCELLED");
    } else if (activeTab === "cancelled") {
      filtered = filtered.filter((b) => b.status === "CANCELLED");
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(
        (b) =>
          new Date(b.startTime).toDateString() === dateFilter.toDateString()
      );
    }

    // Sort by startTime descending for past, ascending for upcoming
    filtered = [...filtered].sort((a, b) => {
      const diff =
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      return activeTab === "past" ? -diff : diff;
    });

    return filtered;
  }, [bookings, activeTab, dateFilter]);

  async function handleCancel() {
    if (!cancelBooking || !accessToken) return;
    setCancelling(true);
    try {
      await api.patch(
        `/bookings/${cancelBooking.id}/status`,
        { status: "CANCELLED" },
        { token: accessToken }
      );
      setCancelBooking(null);
      await loadBookings();
    } catch {
      setError("Failed to cancel booking. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  function canCancel(booking: BookingItem): boolean {
    return (
      booking.status === "PENDING" ||
      booking.status === "CONFIRMED"
    );
  }

  const providerName = (booking: BookingItem): string => {
    const first = booking.providerProfile?.user?.firstName ?? "";
    const last = booking.providerProfile?.user?.lastName ?? "";
    const full = `${first} ${last}`.trim();
    return full || "Unknown Provider";
  };

  return (
    <div>
      <h1 className="font-serif text-heading text-espresso-800">My Bookings</h1>
      <p className="mt-1 text-body-sm text-espresso-400">
        View and manage all your upcoming and past appointments.
      </p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabFilter)}
          className="w-full sm:w-auto"
        >
          <TabsList className="bg-ivory-100 border border-espresso-200/40">
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-espresso-800 data-[state=active]:text-ivory-100"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="data-[state=active]:bg-espresso-800 data-[state=active]:text-ivory-100"
            >
              Past
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="data-[state=active]:bg-espresso-800 data-[state=active]:text-ivory-100"
            >
              Cancelled
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {dateFilter
                ? dateFilter.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto border-espresso-200/60 bg-ivory-50 p-0"
            align="end"
          >
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={(d) => setDateFilter(d)}
            />
            {dateFilter && (
              <div className="border-t border-espresso-200/40 p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-espresso-400"
                  onClick={() => setDateFilter(undefined)}
                >
                  Clear date filter
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-espresso-300" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-12 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-espresso-300" />
          <h3 className="mt-3 font-serif text-subheading text-espresso-800">
            No bookings found
          </h3>
          <p className="mt-1 text-body-sm text-espresso-400">
            {activeTab === "upcoming"
              ? "You have no upcoming appointments. Browse providers to book a service."
              : activeTab === "past"
                ? "No past appointments to display."
                : "No cancelled bookings."}
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-espresso-200/60 bg-ivory-50">
          <Table>
            <TableHeader>
              <TableRow className="border-espresso-200/40 hover:bg-transparent">
                <TableHead className="text-espresso-600 font-medium">
                  Date & Time
                </TableHead>
                <TableHead className="text-espresso-600 font-medium">
                  Service
                </TableHead>
                <TableHead className="text-espresso-600 font-medium hidden sm:table-cell">
                  Provider
                </TableHead>
                <TableHead className="text-espresso-600 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-espresso-600 font-medium text-right">
                  Price
                </TableHead>
                <TableHead className="text-espresso-600 font-medium text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="border-espresso-200/30 cursor-pointer hover:bg-ivory-100/80"
                  onClick={() => setDetailBooking(booking)}
                >
                  <TableCell className="text-espresso-800">
                    <div className="font-medium">
                      {formatDate(booking.startTime)}
                    </div>
                    <div className="text-xs text-espresso-400">
                      {formatTime(booking.startTime)} &ndash;{" "}
                      {formatTime(booking.endTime)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-espresso-800">
                      {booking.service.name}
                    </div>
                    <div className="text-xs text-espresso-400">
                      {booking.service.durationMinutes} min
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-espresso-700">
                    {providerName(booking)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        STATUS_BADGE_CLASSES[booking.status] ??
                        "bg-espresso-100 text-espresso-500"
                      }
                    >
                      {statusLabel(booking.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-espresso-800">
                    {formatPrice(booking.totalPriceInCents)}
                  </TableCell>
                  <TableCell className="text-right">
                    {canCancel(booking) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-[0.875rem]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCancelBooking(booking);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={detailBooking !== null}
        onOpenChange={(open) => {
          if (!open) setDetailBooking(null);
        }}
      >
        <DialogContent className="border-espresso-200/60 bg-ivory-50 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-espresso-800">
              Booking Details
            </DialogTitle>
            <DialogDescription className="text-espresso-400">
              {detailBooking?.service?.name ?? "Appointment"} on{" "}
              {detailBooking ? formatDate(detailBooking.startTime) : ""}
            </DialogDescription>
          </DialogHeader>
          {detailBooking && (
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-espresso-400" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-espresso-400">
                    Service
                  </p>
                  <p className="font-medium text-espresso-800">
                    {detailBooking.service.name}
                  </p>
                  <p className="text-sm text-espresso-500">
                    {detailBooking.service.category} &middot;{" "}
                    {detailBooking.service.durationMinutes} min
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-espresso-400" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-espresso-400">
                    Provider
                  </p>
                  <p className="font-medium text-espresso-800">
                    {providerName(detailBooking)}
                  </p>
                  {detailBooking.providerProfile?.businessName && (
                    <p className="text-sm text-espresso-500">
                      {detailBooking.providerProfile.businessName}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-espresso-400" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-espresso-400">
                    Date & Time
                  </p>
                  <p className="font-medium text-espresso-800">
                    {formatDate(detailBooking.startTime)}
                  </p>
                  <p className="text-sm text-espresso-500">
                    {formatTime(detailBooking.startTime)} &ndash;{" "}
                    {formatTime(detailBooking.endTime)}
                  </p>
                </div>
              </div>

              {detailBooking.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-espresso-400" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-espresso-400">
                      Location
                    </p>
                    <p className="font-medium text-espresso-800">
                      {detailBooking.location}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <DollarSign className="mt-0.5 h-4 w-4 text-espresso-400" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-espresso-400">
                    Price
                  </p>
                  <p className="font-medium text-espresso-800">
                    {formatPrice(detailBooking.totalPriceInCents)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-md bg-ivory-100 px-3 py-2">
                <p className="text-xs font-medium uppercase tracking-wide text-espresso-400">
                  Status
                </p>
                <Badge
                  className={
                    STATUS_BADGE_CLASSES[detailBooking.status] ??
                    "bg-espresso-100 text-espresso-500"
                  }
                >
                  {statusLabel(detailBooking.status)}
                </Badge>
              </div>

              {detailBooking.notes && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-espresso-400">
                    Notes
                  </p>
                  <p className="mt-1 text-sm text-espresso-700">
                    {detailBooking.notes}
                  </p>
                </div>
              )}

              {canCancel(detailBooking) && (
                <div className="flex justify-end border-t border-espresso-200/40 pt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-[0.875rem]"
                    onClick={() => {
                      setDetailBooking(null);
                      setCancelBooking(detailBooking);
                    }}
                  >
                    <XCircle className="mr-1.5 h-3.5 w-3.5" />
                    Cancel Booking
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel AlertDialog */}
      <AlertDialog
        open={cancelBooking !== null}
        onOpenChange={(open) => {
          if (!open && !cancelling) setCancelBooking(null);
        }}
      >
        <AlertDialogContent className="border-espresso-200/60 bg-ivory-50">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-espresso-800">
              Cancel Booking
            </AlertDialogTitle>
            <AlertDialogDescription className="text-espresso-500">
              Are you sure you want to cancel your{" "}
              <span className="font-medium text-espresso-700">
                {cancelBooking?.service?.name ?? ""}
              </span>{" "}
              appointment
              {cancelBooking
                ? ` on ${formatDate(cancelBooking.startTime)} at ${formatTime(cancelBooking.startTime)}`
                : ""}
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={cancelling}
              className="border-espresso-300 text-espresso-700"
            >
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleCancel();
              }}
              disabled={cancelling}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {cancelling ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
