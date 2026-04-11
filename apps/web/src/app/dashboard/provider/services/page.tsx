"use client";

import { useState, useEffect, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { SERVICE_CATEGORY_LABELS } from "@arc/shared";

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
    try {
      const res = await api.get<{ data: ServiceItem[] }>("/services/mine", { token: accessToken! });
      setServices(res.data);
    } catch {
      setError("Failed to load services. Please try again.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
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
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Service"}
        </Button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[0.875rem] text-red-600">{error}</p>}

      {showForm && (
        <Card className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
            <Button type="submit">Add Service</Button>
          </form>
        </Card>
      )}

      <div className="mt-6 space-y-3">
        {services.map((service) => (
          <Card key={service.id} padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-500">
                  {SERVICE_CATEGORY_LABELS[service.category as keyof typeof SERVICE_CATEGORY_LABELS]} &middot;{" "}
                  {service.durationMinutes} min
                </p>
              </div>
              <div className="text-right">
                <span className="font-semibold">${(service.priceInCents / 100).toFixed(2)}</span>
                <span
                  className={`ml-2 text-xs ${service.isActive ? "text-green-600" : "text-gray-400"}`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
