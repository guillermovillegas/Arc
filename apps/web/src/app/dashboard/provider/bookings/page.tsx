"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Loader2,
  Clock,
  User,
  FileText,
  DollarSign,
  CalendarDays,
  CheckCircle2,
  PlayCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  notes: string | null;
  location: string | null;
  service: { name: string; category?: string; durationMinutes?: number } | null;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    email?: string;
    phone?: string;
  } | null;
}

type ProviderTab = "pending" | "confirmed" | "in_progress" | "completed" | "all";

const TAB_TO_API_STATUS: Record<ProviderTab, string> = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  in_progress: "IN_PROGRESS",
  completed: "COMPLETED",
  all: "",
};

const STATUS_BADGE_CLASSES: Record<string, string> = {
  PENDING: "border-brass-300 bg-brass-100 text-brass-700",
  CONFIRMED: "border-[#3b7a57]/30 bg-[#3b7a57]/10 text-[#3b7a57]",
  IN_PROGRESS: "border-[#2f6e9e]/30 bg-[#2f6e9e]/10 text-[#2f6e9e]",
  COMPLETED: "border-espresso-300 bg-espresso-100 text-espresso-600",
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

function clientName(booking: BookingItem): string {
  const first = booking.client?.firstName ?? "";
  const last = booking.client?.lastName ?? "";
  const full = `${first} ${last}`.trim();
  return full || "Unknown Client";
}

export default function ProviderBookingsPage() {
  const { accessToken } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProviderTab>("pending");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Detail dialog
  const [detailBooking, setDetailBooking] = useState<BookingItem | null>(null);

  // Cancel / decline dialog
  const [declineBooking, setDeclineBooking] = useState<BookingItem | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [declining, setDeclining] = useState(false);

  const loadBookings = useCallback(async () => {
    if (!accessToken) return;
    setError(null);
    setLoading(true);
    try {
      const apiStatus = TAB_TO_API_STATUS[activeTab];
      const params = apiStatus ? `?status=${apiStatus}` : "";
      const res = await api.get<{ data: BookingItem[] }>(
        `/bookings/provider${params}`,
        { token: accessToken }
      );
      setBookings(res.data);
    } catch {
      // Network error on initial load — degrade to empty state
    } finally {
      setLoading(false);
    }
  }, [accessToken, activeTab]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      // Pending first (nearest time first), rest by start time ascending
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }, [bookings]);

  async function updateStatus(bookingId: string, status: string) {
    if (!accessToken) return;
    setError(null);
    setUpdatingId(bookingId);
    try {
      await api.patch(
        `/bookings/${bookingId}/status`,
        { status },
        { token: accessToken }
      );
      await loadBookings();
    } catch {
      setError("Failed to update booking status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDecline() {
    if (!declineBooking || !accessToken) return;
    setDeclining(true);
    try {
      await api.patch(
        `/bookings/${declineBooking.id}/status`,
        { status: "CANCELLED", reason: declineReason || undefined },
        { token: accessToken }
      );
      setDeclineBooking(null);
      setDeclineReason("");
      await loadBookings();
    } catch {
      setError("Failed to decline booking. Please try again.");
    } finally {
      setDeclining(false);
    }
  }

  function handleTabChange(value: string) {
    setActiveTab(value as ProviderTab);
  }

  function renderActionButtons(booking: BookingItem) {
    const isUpdating = updatingId === booking.id;

    return (
      <div className="flex items-center gap-1">
        {booking.status === "PENDING" && (
          <>
            <Button
              size="sm"
              variant="accent"
              className="text-[0.875rem]"
              onClick={(e) => {
                e.stopPropagation();
                updateStatus(booking.id, "CONFIRMED");
              }}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              )}
              Confirm
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="text-[0.875rem]"
              onClick={(e) => {
                e.stopPropagation();
                setDeclineBooking(booking);
              }}
              disabled={isUpdating}
            >
              Decline
            </Button>
          </>
        )}
        {booking.status === "CONFIRMED" && (
          <>
            <Button
              size="sm"
              variant="primary"
              className="text-[0.875rem]"
              onClick={(e) => {
                e.stopPropagation();
                updateStatus(booking.id, "IN_PROGRESS");
              }}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <PlayCircle className="mr-1 h-3.5 w-3.5" />
              )}
              Start
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="text-[0.875rem]"
              onClick={(e) => {
                e.stopPropagation();
                setDeclineBooking(booking);
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </>
        )}
        {booking.status === "IN_PROGRESS" && (
          <Button
            size="sm"
            variant="accent"
            className="text-[0.875rem]"
            onClick={(e) => {
              e.stopPropagation();
              updateStatus(booking.id, "COMPLETED");
            }}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            )}
            Complete
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-heading text-espresso-800">Bookings</h1>
      <p className="mt-1 text-body-sm text-espresso-400">
        View and manage your upcoming and past appointments.
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

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-6"
      >
        <TabsList className="bg-ivory-100 border border-espresso-200/40 flex-wrap h-auto gap-0.5 p-1">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-espresso-800 data-[state=active]:text-ivory-100"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="confirmed"
            className="data-[state=active]:bg-espresso-800 data-[state=active]:text-ivory-100"
          >
            Confirmed
          </TabsTrigger>
          <TabsTrigger
            value="in_progress"
            className="data-[state=active]:bg-espresso-800 data-[state=active]:text-ivory-100"
          >
            In Progress
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-espresso-800 data-[state=active]:text-ivory-100"
          >
            Completed
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-espresso-800 data-[state=active]:text-ivory-100"
          >
            All
          </TabsTrigger>
        </TabsList>

        {/* All tab contents share the same table, so we use a single content area */}
        {(["pending", "confirmed", "in_progress", "completed", "all"] as const).map(
          (tab) => (
            <TabsContent key={tab} value={tab}>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-espresso-300" />
                </div>
              ) : sortedBookings.length === 0 ? (
                <div className="py-12 text-center">
                  <CalendarDays className="mx-auto h-10 w-10 text-espresso-300" />
                  <h3 className="mt-3 font-serif text-lg text-espresso-800">
                    No bookings found
                  </h3>
                  <p className="mt-1 text-sm text-espresso-400">
                    {tab === "pending"
                      ? "No pending requests right now."
                      : tab === "confirmed"
                        ? "No confirmed appointments."
                        : tab === "in_progress"
                          ? "No appointments in progress."
                          : tab === "completed"
                            ? "No completed appointments yet."
                            : "When clients book your services, their appointments will appear here."}
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-espresso-200/60 bg-ivory-50">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-espresso-200/40 hover:bg-transparent">
                        <TableHead className="text-espresso-600 font-medium">
                          Time
                        </TableHead>
                        <TableHead className="text-espresso-600 font-medium">
                          Client
                        </TableHead>
                        <TableHead className="text-espresso-600 font-medium hidden sm:table-cell">
                          Service
                        </TableHead>
                        <TableHead className="text-espresso-600 font-medium text-right hidden md:table-cell">
                          Price
                        </TableHead>
                        <TableHead className="text-espresso-600 font-medium">
                          Status
                        </TableHead>
                        <TableHead className="text-espresso-600 font-medium text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedBookings.map((booking) => (
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
                              {clientName(booking)}
                            </div>
                            {booking.client?.email && (
                              <div className="text-xs text-espresso-400">
                                {booking.client.email}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-espresso-700">
                            {booking.service?.name ?? "Unknown Service"}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-espresso-800 hidden md:table-cell">
                            {formatPrice(booking.totalPriceInCents)}
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
                          <TableCell
                            className="text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {renderActionButtons(booking)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          )
        )}
      </Tabs>

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
              {detailBooking?.service?.name ?? "Appointment"} &mdash;{" "}
              {detailBooking ? formatDate(detailBooking.startTime) : ""}
            </DialogDescription>
          </DialogHeader>
          {detailBooking && (
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-espresso-400" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-espresso-400">
                    Client
                  </p>
                  <p className="font-medium text-espresso-800">
                    {clientName(detailBooking)}
                  </p>
                  {detailBooking.client?.email && (
                    <p className="text-sm text-espresso-500">
                      {detailBooking.client.email}
                    </p>
                  )}
                  {detailBooking.client?.phone && (
                    <p className="text-sm text-espresso-500">
                      {detailBooking.client.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-espresso-400" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-espresso-400">
                    Service
                  </p>
                  <p className="font-medium text-espresso-800">
                    {detailBooking.service?.name ?? "Unknown Service"}
                  </p>
                  {(detailBooking.service?.category ||
                    detailBooking.service?.durationMinutes) && (
                    <p className="text-sm text-espresso-500">
                      {[
                        detailBooking.service.category,
                        detailBooking.service.durationMinutes
                          ? `${detailBooking.service.durationMinutes} min`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" \u00b7 ")}
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
                  <CalendarDays className="mt-0.5 h-4 w-4 text-espresso-400" />
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
                    Client Notes
                  </p>
                  <p className="mt-1 rounded-md bg-ivory-100 px-3 py-2 text-sm italic text-espresso-700">
                    {detailBooking.notes}
                  </p>
                </div>
              )}

              {/* Actions in detail dialog */}
              {(detailBooking.status === "PENDING" ||
                detailBooking.status === "CONFIRMED" ||
                detailBooking.status === "IN_PROGRESS") && (
                <div className="flex flex-wrap justify-end gap-2 border-t border-espresso-200/40 pt-4">
                  {detailBooking.status === "PENDING" && (
                    <>
                      <Button
                        variant="accent"
                        size="sm"
                        className="text-[0.875rem]"
                        disabled={updatingId === detailBooking.id}
                        onClick={() => {
                          updateStatus(detailBooking.id, "CONFIRMED");
                          setDetailBooking(null);
                        }}
                      >
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                        Confirm
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-[0.875rem]"
                        onClick={() => {
                          setDetailBooking(null);
                          setDeclineBooking(detailBooking);
                        }}
                      >
                        <XCircle className="mr-1 h-3.5 w-3.5" />
                        Decline
                      </Button>
                    </>
                  )}
                  {detailBooking.status === "CONFIRMED" && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-[0.875rem]"
                        disabled={updatingId === detailBooking.id}
                        onClick={() => {
                          updateStatus(detailBooking.id, "IN_PROGRESS");
                          setDetailBooking(null);
                        }}
                      >
                        <PlayCircle className="mr-1 h-3.5 w-3.5" />
                        Start
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-[0.875rem]"
                        onClick={() => {
                          setDetailBooking(null);
                          setDeclineBooking(detailBooking);
                        }}
                      >
                        <XCircle className="mr-1 h-3.5 w-3.5" />
                        Cancel
                      </Button>
                    </>
                  )}
                  {detailBooking.status === "IN_PROGRESS" && (
                    <Button
                      variant="accent"
                      size="sm"
                      className="text-[0.875rem]"
                      disabled={updatingId === detailBooking.id}
                      onClick={() => {
                        updateStatus(detailBooking.id, "COMPLETED");
                        setDetailBooking(null);
                      }}
                    >
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      Complete
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Decline / Cancel AlertDialog */}
      <AlertDialog
        open={declineBooking !== null}
        onOpenChange={(open) => {
          if (!open && !declining) {
            setDeclineBooking(null);
            setDeclineReason("");
          }
        }}
      >
        <AlertDialogContent className="border-espresso-200/60 bg-ivory-50">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-espresso-800">
              {declineBooking?.status === "PENDING"
                ? "Decline Booking"
                : "Cancel Booking"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-espresso-500">
              Are you sure you want to{" "}
              {declineBooking?.status === "PENDING" ? "decline" : "cancel"} the{" "}
              <span className="font-medium text-espresso-700">
                {declineBooking?.service?.name ?? ""}
              </span>{" "}
              appointment with{" "}
              <span className="font-medium text-espresso-700">
                {declineBooking ? clientName(declineBooking) : ""}
              </span>
              {declineBooking
                ? ` on ${formatDate(declineBooking.startTime)}`
                : ""}
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <label
              htmlFor="decline-reason"
              className="text-sm font-medium text-espresso-700"
            >
              Reason (optional)
            </label>
            <textarea
              id="decline-reason"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Let the client know why..."
              rows={3}
              className="flex w-full rounded-md border border-espresso-300 bg-ivory-50 px-3 py-2 text-sm text-espresso-800 placeholder:text-espresso-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={declining}
              className="border-espresso-300 text-espresso-700"
            >
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDecline();
              }}
              disabled={declining}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {declining ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Processing...
                </>
              ) : declineBooking?.status === "PENDING" ? (
                "Decline"
              ) : (
                "Cancel Booking"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
