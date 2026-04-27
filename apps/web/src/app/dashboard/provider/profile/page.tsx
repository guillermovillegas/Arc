"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export default function ProviderProfilePage() {
  const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    bio: "",
    businessName: "",
    address: "",
    serviceRadius: "25",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  async function loadProfile() {
    setError(null);
    try {
      const res = await api.get<{ data: { bio?: string; businessName?: string; address?: string; serviceRadius?: number } }>("/providers/me", {
        token: accessToken!,
      });
      const data = res.data;
      setForm({
        bio: data?.bio ?? "",
        businessName: data?.businessName ?? "",
        address: data?.address ?? "",
        serviceRadius: String(data?.serviceRadius ?? 25),
      });
    } catch {
      // Network error on initial load — degrade to empty state
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError(null);
    try {
      await api.put(
        "/providers/me",
        {
          bio: form.bio || undefined,
          businessName: form.businessName || undefined,
          address: form.address || undefined,
          serviceRadius: parseFloat(form.serviceRadius),
        },
        { token: accessToken! },
      );
      setMessage("Profile updated!");
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-heading text-espresso-800">Provider Profile</h1>
      <p className="mt-1 text-body-sm text-espresso-400">Update your business details and let clients know who you are.</p>

      {error && (
        <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-espresso-300" />
        </div>
      ) : (
        <Card className="mt-6 max-w-lg border-espresso-200/60 bg-ivory-50">
          <div className="space-y-4 p-6">
            <Input
              label="Business Name"
              value={form.businessName}
              onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
              placeholder="e.g. Marcus Cuts"
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-espresso-800">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={4}
                className="mt-1 block w-full rounded-md border border-espresso-200 bg-ivory-50 px-3 py-2 text-sm text-espresso-800 placeholder:text-espresso-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:ring-offset-2"
                placeholder="Tell clients about yourself and your experience..."
              />
            </div>

            <Input
              label="Address / Location"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="City, State"
            />

            <Input
              label="Service Radius (miles)"
              type="number"
              value={form.serviceRadius}
              onChange={(e) => setForm((f) => ({ ...f, serviceRadius: e.target.value }))}
            />

            {message && (
              <p className="text-sm text-[#3b7a57]">
                {message}
              </p>
            )}

            <Button variant="primary" onClick={handleSave} disabled={loading || saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
