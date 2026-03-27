"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";

interface PortfolioItemData {
  id: string;
  imageUrl: string;
  caption: string | null;
}

export default function ProviderPortfolioPage() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<PortfolioItemData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ imageUrl: "", caption: "" });

  useEffect(() => {
    if (accessToken) loadPortfolio();
  }, [accessToken]);

  async function loadPortfolio() {
    try {
      const res = await api.get<{ data: PortfolioItemData[] }>("/providers/me/portfolio", {
        token: accessToken!,
      });
      setItems(res.data);
    } catch {
      // Handle error
    }
  }

  async function addItem() {
    try {
      await api.post("/providers/me/portfolio", {
        imageUrl: form.imageUrl,
        caption: form.caption || undefined,
      }, { token: accessToken! });
      setShowForm(false);
      setForm({ imageUrl: "", caption: "" });
      loadPortfolio();
    } catch {
      // Handle error
    }
  }

  async function deleteItem(id: string) {
    try {
      await api.delete(`/providers/me/portfolio/${id}`, { token: accessToken! });
      loadPortfolio();
    } catch {
      // Handle error
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add Item"}</Button>
      </div>

      {showForm && (
        <Card className="mt-4">
          <div className="space-y-3">
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
            <Button onClick={addItem}>Add to Portfolio</Button>
          </div>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img src={item.imageUrl} alt={item.caption || ""} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex w-full items-center justify-between p-3">
                <span className="text-sm text-white">{item.caption}</span>
                <button onClick={() => deleteItem(item.id)} className="text-sm text-red-300 hover:text-red-100">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
