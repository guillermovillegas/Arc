"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { SERVICE_CATEGORY_LABELS, ServiceCategory } from "@arc/shared";

interface Provider {
  id: string;
  slug: string;
  bio: string | null;
  businessName: string | null;
  averageRating: number;
  totalReviews: number;
  distance: number | null;
  user: { firstName: string; lastName: string; avatarUrl: string | null };
  services: { name: string; category: string; priceInCents: number }[];
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProviders();
  }, [category]);

  async function loadProviders() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (search) params.set("q", search);

      const res = await api.get<{ data: { items: Provider[] } }>(`/search/providers?${params}`);
      setProviders(res.data.items);
    } catch {
      setError("Failed to search providers.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900">Find a Provider</h1>
          <p className="mt-2 text-gray-600">Browse beauty professionals near you</p>

          {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[0.875rem] text-red-600">{error}</p>}

          {/* Filters */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search by name, specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadProviders()}
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              {Object.entries(SERVICE_CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <Button onClick={loadProviders}>Search</Button>
          </div>

          {/* Results */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                </Card>
              ))
            ) : providers.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500">
                No providers found. Try adjusting your search.
              </div>
            ) : (
              providers.map((provider) => (
                <Link key={provider.id} href={`/providers/${provider.slug}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 font-bold">
                        {provider.user.firstName[0]}{provider.user.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {provider.businessName || `${provider.user.firstName} ${provider.user.lastName}`}
                        </h3>
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-700">{provider.averageRating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">({provider.totalReviews})</span>
                        </div>
                        {provider.bio && (
                          <p className="mt-2 line-clamp-2 text-sm text-gray-600">{provider.bio}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {provider.services.slice(0, 3).map((s) => (
                            <span
                              key={s.name}
                              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                        {provider.distance !== null && (
                          <p className="mt-2 text-xs text-gray-500">
                            {provider.distance.toFixed(1)} mi away
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
