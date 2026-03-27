import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const FEATURES = [
  {
    title: "Find Your Pro",
    description: "Browse verified barbers, nail techs, makeup artists, and more by location, availability, and specialty.",
    icon: "search",
  },
  {
    title: "Book Instantly",
    description: "See real-time availability. Pick your service, choose a time, and confirm in seconds.",
    icon: "calendar",
  },
  {
    title: "Pay Securely",
    description: "Cashless payments through the app. No awkward Venmo requests. Tips included.",
    icon: "shield",
  },
  {
    title: "On The Pull Up",
    description: "House calls, mobile services, or visit their shop. Beauty comes to you.",
    icon: "map-pin",
  },
];

const PROVIDER_BENEFITS = [
  "Free to join - no monthly subscription",
  "Get discovered by new clients in your area",
  "Manage your schedule and avoid double bookings",
  "Accept payments and build your portfolio",
  "Connect with other professionals in the community",
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Beauty Services
            <span className="block text-accent-400">On The Pull Up</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-200">
            ARC connects you with top barbers, nail techs, makeup artists, and beauty
            professionals. Book on-demand, pay securely, and look your best - wherever you are.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/providers"
              className="inline-flex h-12 items-center rounded-lg bg-accent-500 px-8 text-lg font-semibold text-white transition-colors hover:bg-accent-600"
            >
              Book Now
            </Link>
            <Link
              href="/register?role=provider"
              className="inline-flex h-12 items-center rounded-lg border-2 border-white/30 px-8 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              Join as Provider
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            Getting your next cut, style, or treatment shouldn&apos;t be complicated.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <span className="text-xl font-bold">{i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Providers */}
      <section className="bg-gray-50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">For Providers</h2>
              <p className="mt-4 text-lg text-gray-600">
                Grow your business without the overhead. No subscriptions, no commitments -
                just more clients and easier scheduling.
              </p>
              <ul className="mt-8 space-y-4">
                {PROVIDER_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/register?role=provider"
                  className="inline-flex items-center rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="space-y-4">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square rounded-lg bg-gray-100" />
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">4.8 (47 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold">Ready to get started?</h2>
        <p className="mx-auto mt-4 max-w-xl text-brand-100">
          Whether you&apos;re looking for your next great barber or ready to grow your client
          base, ARC has you covered.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex h-12 items-center rounded-lg bg-white px-8 font-semibold text-brand-600 transition-colors hover:bg-brand-50"
          >
            Sign Up Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
