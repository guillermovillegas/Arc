"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api-client";

export default function ClientProfilePage() {
  const { user, accessToken } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      await api.put("/providers/me", form, { token: accessToken! });
      setMessage("Profile updated!");
    } catch {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <Card className="mt-6 max-w-lg">
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
            <p className={`text-sm ${message.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
              {message}
            </p>
          )}

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
