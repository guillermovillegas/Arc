"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";

interface EarningsData {
  totalEarnings: number;
  payments: {
    id: string;
    providerPayoutInCents: number;
    createdAt: string;
    booking: { startTime: string; service: { name: string } };
  }[];
}

export default function ProviderEarningsPage() {
  const { accessToken } = useAuth();
  const [earnings, setEarnings] = useState<EarningsData | null>(null);

  useEffect(() => {
    if (accessToken) loadEarnings();
  }, [accessToken]);

  async function loadEarnings() {
    try {
      const res = await api.get<{ data: EarningsData }>("/payments/earnings", { token: accessToken! });
      setEarnings(res.data);
    } catch {
      // Handle error
    }
  }

  async function setupStripe() {
    try {
      const res = await api.post<{ data: { url: string } }>("/payments/connect", {}, { token: accessToken! });
      window.location.href = res.data.url;
    } catch {
      // Handle error
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-gray-500">Total Earnings</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            ${earnings ? (earnings.totalEarnings / 100).toFixed(2) : "0.00"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Stripe Payments</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={setupStripe}>
            Manage Stripe Account
          </Button>
        </Card>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-gray-900">Payment History</h2>
      <div className="mt-4 space-y-3">
        {earnings?.payments.length === 0 && (
          <p className="py-4 text-gray-500">No payments yet</p>
        )}
        {earnings?.payments.map((payment) => (
          <Card key={payment.id} padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{payment.booking.service.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(payment.booking.startTime).toLocaleDateString()}
                </p>
              </div>
              <span className="font-semibold text-green-600">
                +${(payment.providerPayoutInCents / 100).toFixed(2)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
