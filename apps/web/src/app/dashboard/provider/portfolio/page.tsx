"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface PortfolioItemData {
  id: string;
  imageUrl: string;
  caption: string | null;
}

export default function ProviderPortfolioPage() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<PortfolioItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ imageUrl: "", caption: "" });

  useEffect(() => {
    if (accessToken) loadPortfolio();
  }, [accessToken]);

  async function loadPortfolio() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.get<{ data: PortfolioItemData[] }>("/providers/me/portfolio", {
        token: accessToken!,
      });
      setItems(res.data);
    } catch {
      // Network error on initial load — degrade to empty state
    } finally {
      setLoading(false);
    }
  }

  async function addItem() {
    setError(null);
    setSaving(true);
    try {
      await api.post("/providers/me/portfolio", {
        imageUrl: form.imageUrl,
        caption: form.caption || undefined,
      }, { token: accessToken! });
      setShowForm(false);
      setForm({ imageUrl: "", caption: "" });
      loadPortfolio();
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: string) {
    setError(null);
    setDeletingId(id);
    try {
      await api.delete(`/providers/me/portfolio/${id}`, { token: accessToken! });
      loadPortfolio();
    } catch {
      setError("Failed to delete portfolio item. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-heading text-espresso-800">Portfolio</h1>
          <p className="mt-1 text-body-sm text-espresso-400">Showcase your best work to attract new clients.</p>
        </div>
        <Button variant={showForm ? "arc-outline" : "arc"} onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add Item"}</Button>
      </div>

      {error && (
        <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {showForm && (
        <Card className="mt-4 border-espresso-200/60 bg-ivory-50">
          <div className="space-y-3 p-6">
            <Input
              label="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://..."
            />
            <Input
              label="Caption"
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
              placeholder="Optional caption"
            />
            <Button variant="brass" onClick={addItem} disabled={saving || !form.imageUrl.trim()}>
              {saving ? "Adding..." : "Add to Portfolio"}
            </Button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-espresso-300" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-serif text-lg text-espresso-800">No portfolio items yet</p>
          <p className="mt-1 text-sm text-espresso-400">Upload photos of your work to build your portfolio and attract clients.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg bg-ivory-200">
              <img src={item.imageUrl} alt={item.caption || ""} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-espresso-900/60 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex w-full items-center justify-between p-3">
                  <span className="text-sm text-ivory-100">{item.caption}</span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    disabled={deletingId === item.id}
                    className="text-sm text-red-300 hover:text-red-100 disabled:opacity-50"
                  >
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
