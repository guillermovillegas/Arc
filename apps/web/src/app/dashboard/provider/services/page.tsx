"use client";

import { useState, useEffect, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { SERVICE_CATEGORY_LABELS } from "@arc/shared";
import { Loader2 } from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  durationMinutes: number;
  priceInCents: number;
  isActive: boolean;
}

export default function ProviderServicesPage() {
  const { accessToken } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "HAIRCUT",
    durationMinutes: "45",
    priceInCents: "",
  });

  useEffect(() => {
    if (accessToken) loadServices();
  }, [accessToken]);

  async function loadServices() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.get<{ data: ServiceItem[] }>("/services/mine", { token: accessToken! });
      setServices(res.data);
    } catch {
      // Network error on initial load — degrade to empty state
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.post(
        "/services",
        {
          name: form.name,
          description: form.description || undefined,
          category: form.category,
          durationMinutes: parseInt(form.durationMinutes),
          priceInCents: Math.round(parseFloat(form.priceInCents) * 100),
        },
        { token: accessToken! },
      );
      setShowForm(false);
      setForm({ name: "", description: "", category: "HAIRCUT", durationMinutes: "45", priceInCents: "" });
      loadServices();
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-heading text-espresso-800">My Services</h1>
          <p className="mt-1 text-body-sm text-espresso-400">Add and manage the services you offer to clients.</p>
        </div>
        <Button variant={showForm ? "arc-outline" : "arc"} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Service"}
        </Button>
      </div>

      {error && (
        <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {showForm && (
        <Card className="mt-4 border-espresso-200/60 bg-ivory-50">
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <Input
              label="Service Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Classic Fade"
              required
            />
            <Input
              label="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Optional description"
            />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-espresso-800">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-espresso-200 bg-ivory-50 px-3 py-2 text-sm text-espresso-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:ring-offset-2"
                >
                  {Object.entries(SERVICE_CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Duration (min)"
                type="number"
                value={form.durationMinutes}
                onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))}
                min={15}
                required
              />
              <Input
                label="Price ($)"
                type="number"
                step="0.01"
                value={form.priceInCents}
                onChange={(e) => setForm((f) => ({ ...f, priceInCents: e.target.value }))}
                placeholder="35.00"
                required
              />
            </div>
            <Button variant="brass" type="submit" disabled={saving}>
              {saving ? "Adding..." : "Add Service"}
            </Button>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-espresso-300" />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {services.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-serif text-lg text-espresso-800">No services yet</p>
              <p className="mt-1 text-sm text-espresso-400">Add your first service so clients can start booking with you.</p>
            </div>
          ) : (
            services.map((service) => (
              <Card key={service.id} padding="sm" className="border-espresso-200/60 bg-ivory-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-espresso-800">{service.name}</h3>
                    <p className="text-sm text-espresso-400">
                      {SERVICE_CATEGORY_LABELS[service.category as keyof typeof SERVICE_CATEGORY_LABELS]} &middot;{" "}
                      {service.durationMinutes} min
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-espresso-800">${(service.priceInCents / 100).toFixed(2)}</span>
                    <span
                      className={`ml-2 inline-flex rounded-lg px-2 py-0.5 text-caption font-medium ${service.isActive ? "bg-[#3b7a57]/10 text-[#3b7a57]" : "bg-espresso-100 text-espresso-400"}`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
