"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";

export default function ClientProfilePage() {
  const { user, accessToken, isLoading } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError(null);
    try {
      await api.put("/providers/me", form, { token: accessToken! });
      setMessage("Profile updated!");
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-espresso-300" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-heading text-espresso-800">My Profile</h1>
      <p className="mt-1 text-body-sm text-espresso-400">
        Update your personal information and preferences.
      </p>

      {error && (
        <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="mt-6 max-w-lg border border-espresso-200/60 bg-ivory-50">
        <div className="space-y-4">
          <Input
            label="First Name"
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
          />
          <Input
            label="Last Name"
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
          />
          <Input label="Email" value={user?.email || ""} disabled />

          {message && (
            <p className="text-sm text-[#3b7a57]">{message}</p>
          )}

          <Button variant="arc" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
