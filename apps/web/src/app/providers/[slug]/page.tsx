import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SERVICE_CATEGORY_LABELS } from "@arc/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

interface Props {
  params: { slug: string };
}

async function getProvider(slug: string) {
  const res = await fetch(`${API_URL}/search/providers/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const provider = await getProvider(params.slug);
  if (!provider) return { title: "Provider Not Found - ARC" };

  const name = provider.businessName || `${provider.user.firstName} ${provider.user.lastName}`;
  return {
    title: `${name} - ARC`,
    description: provider.bio || `Book services with ${name} on ARC`,
    openGraph: {
      title: `${name} on ARC`,
      description: provider.bio || `Book beauty services with ${name}`,
      type: "profile",
    },
  };
}

export default async function ProviderProfilePage({ params }: Props) {
  const provider = await getProvider(params.slug);

  if (!provider) {
    return (
      <div className="flex min-h-screen flex-col bg-ivory-100">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-espresso-800">Provider Not Found</h1>
            <p className="mt-2 text-espresso-600">This profile doesn&apos;t exist or has been removed.</p>
            <Link href="/providers" className="mt-4 inline-block text-brass-600 hover:underline">
              Browse all providers
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const name = provider.businessName || `${provider.user.firstName} ${provider.user.lastName}`;

  return (
    <div className="flex min-h-screen flex-col bg-ivory-100">
      <Header />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Profile Header */}
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brass-100 text-3xl font-bold text-brass-600">
              {provider.user.firstName[0]}{provider.user.lastName[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-espresso-800">{name}</h1>
                  {provider.address && (
                    <p className="mt-1 text-espresso-600">{provider.address}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-brass-500 text-lg">★</span>
                    <span className="font-semibold text-espresso-800">{provider.averageRating.toFixed(1)}</span>
                    <span className="text-espresso-400">({provider.totalReviews} reviews)</span>
                    {provider.isVerified && (
                      <span className="rounded-full bg-brass-100 px-2 py-0.5 text-xs font-medium text-brass-700">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <Link href={`/book/${provider.id}`}>
                  <Button variant="accent" size="lg">Book Now</Button>
                </Link>
              </div>
              {provider.bio && <p className="mt-4 text-espresso-600">{provider.bio}</p>}
            </div>
          </div>

          {/* Services */}
          <section className="mt-12">
            <h2 className="font-serif text-xl font-bold text-espresso-800">Services</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {provider.services.map((service: { id: string; name: string; category: string; description: string | null; durationMinutes: number; priceInCents: number }) => (
                <Card key={service.id} padding="sm" className="border-espresso-200/60 bg-ivory-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-espresso-800">{service.name}</h3>
                      <p className="text-sm text-espresso-400">
                        {SERVICE_CATEGORY_LABELS[service.category as keyof typeof SERVICE_CATEGORY_LABELS] || service.category} &middot; {service.durationMinutes} min
                      </p>
                      {service.description && (
                        <p className="mt-1 text-sm text-espresso-600">{service.description}</p>
                      )}
                    </div>
                    <span className="text-lg font-semibold text-brass-600">
                      ${(service.priceInCents / 100).toFixed(2)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Portfolio */}
          {provider.portfolioItems?.length > 0 && (
            <section className="mt-12">
              <h2 className="font-serif text-xl font-bold text-espresso-800">Portfolio</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {provider.portfolioItems.map((item: { id: string; imageUrl: string; caption: string | null }) => (
                  <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg bg-ivory-200">
                    <img
                      src={item.imageUrl}
                      alt={item.caption || "Portfolio image"}
                      className="h-full w-full object-cover"
                    />
                    {item.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso-800/70 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="text-sm text-ivory-100">{item.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          {provider.reviews?.length > 0 && (
            <section className="mt-12">
              <h2 className="font-serif text-xl font-bold text-espresso-800">Reviews</h2>
              <div className="mt-4 space-y-4">
                {provider.reviews.map((review: { id: string; rating: number; text: string | null; createdAt: string; client: { firstName: string; lastName: string } }) => (
                  <Card key={review.id} padding="sm" className="border-espresso-200/60 bg-ivory-50">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-espresso-800">
                        {review.client.firstName} {review.client.lastName[0]}.
                      </span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-brass-500" : "text-espresso-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-espresso-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.text && <p className="mt-2 text-sm text-espresso-600">{review.text}</p>}
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
