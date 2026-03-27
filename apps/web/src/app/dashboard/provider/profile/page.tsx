"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";

export default function ProviderProfilePage() {
  const { user, accessToken } = useAuth();
  const [form, setForm] = useState({
    bio: "",
    businessName: "",
    address: "",
    serviceRadius: "25",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
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
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Provider Profile</h1>

      <Card className="mt-6 max-w-lg">
        <div className="space-y-4">
          <Input
            label="Business Name"
            value={form.businessName}
            onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
            placeholder="e.g. Marcus Cuts"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={4}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
            <p className={`text-sm ${message.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
              {message}
            </p>
          )}

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
