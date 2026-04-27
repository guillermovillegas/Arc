"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface EarningsData {
  totalEarnings: number;
  payments: {
    id: string;
    providerPayoutInCents: number;
    createdAt: string;
    booking: { startTime: string; service: { name: string } | null } | null;
  }[];
}

export default function ProviderEarningsPage() {
  const { accessToken } = useAuth();
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectingStripe, setConnectingStripe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) loadEarnings();
  }, [accessToken]);

  async function loadEarnings() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.get<{ data: EarningsData }>("/payments/earnings", { token: accessToken! });
      setEarnings(res.data);
    } catch {
      // Network error on initial load — degrade to empty state
    } finally {
      setLoading(false);
    }
  }

  async function setupStripe() {
    setError(null);
    setConnectingStripe(true);
    try {
      const res = await api.post<{ data: { url: string } }>("/payments/connect", {}, { token: accessToken! });
      window.location.href = res.data.url;
    } catch {
      setError("Failed to connect to Stripe. Please try again.");
    } finally {
      setConnectingStripe(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-heading text-espresso-800">Earnings</h1>
      <p className="mt-1 text-body-sm text-espresso-400">Track your revenue and manage your Stripe payout account.</p>

      {error && (
        <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-espresso-300" />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card className="border-espresso-200/60 bg-ivory-50 p-6">
              <p className="text-sm text-espresso-400">Total Earnings</p>
              <p className="mt-1 text-3xl font-bold text-espresso-800">
                ${earnings ? (earnings.totalEarnings / 100).toFixed(2) : "0.00"}
              </p>
            </Card>
            <Card className="border-espresso-200/60 bg-ivory-50 p-6">
              <p className="text-sm text-espresso-400">Stripe Payments</p>
              <Button
                variant="arc-outline"
                size="sm"
                className="mt-2"
                onClick={setupStripe}
                disabled={connectingStripe}
              >
                {connectingStripe ? "Connecting..." : "Manage Stripe Account"}
              </Button>
            </Card>
          </div>

          <h2 className="mt-8 font-serif text-subheading text-espresso-800">Payment History</h2>
          <div className="mt-4 space-y-3">
            {earnings?.payments.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-serif text-lg text-espresso-800">No payments yet</p>
                <p className="mt-1 text-sm text-espresso-400">Completed bookings and their payouts will appear here.</p>
              </div>
            ) : (
              earnings?.payments.map((payment) => (
                <Card key={payment.id} padding="sm" className="border-espresso-200/60 bg-ivory-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-espresso-800">{payment.booking?.service?.name ?? "Unknown Service"}</p>
                      <p className="text-sm text-espresso-400">
                        {payment.booking?.startTime
                          ? new Date(payment.booking.startTime).toLocaleDateString()
                          : "Unknown date"}
                      </p>
                    </div>
                    <span className="font-semibold text-[#3b7a57]">
                      +${(payment.providerPayoutInCents / 100).toFixed(2)}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
