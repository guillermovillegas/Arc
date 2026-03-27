import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/* ──────────────────────────── Icons (inline SVG for zero deps) ─────────── */

function IconSearch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/* ──────────────────────────── Data ─────────────────────────────────────── */

const STEPS = [
  {
    icon: <IconSearch />,
    title: "Browse",
    description: "Search by location, service, or availability. See portfolios and real reviews.",
  },
  {
    icon: <IconCalendar />,
    title: "Book",
    description: "Pick your service, choose a time slot, and confirm in seconds. No phone tag.",
  },
  {
    icon: <IconShield />,
    title: "Pay",
    description: "Secure in-app payments. No cash awkwardness, no chasing invoices.",
  },
  {
    icon: <IconMapPin />,
    title: "Show up",
    description: "Meet at their shop or get service at your door. Beauty on your terms.",
  },
];

const PROVIDER_FEATURES = [
  "Free to list — zero monthly fees",
  "Accept bookings while you sleep",
  "Get paid instantly after service",
  "Build your portfolio and reputation",
  "Manage your schedule in one place",
  "Join a community of professionals",
];

const TESTIMONIALS = [
  {
    quote: "I stopped losing clients to no-shows the week I switched. The deposit feature changed everything.",
    name: "Marcus J.",
    role: "Barber, Atlanta",
    rating: 5,
  },
  {
    quote: "Found my new barber in 2 minutes. Booked, paid, got a fresh fade — all from my couch.",
    name: "David R.",
    role: "Client",
    rating: 5,
  },
  {
    quote: "The scheduling alone is worth it. I used to waste an hour a day texting clients back and forth.",
    name: "Keisha T.",
    role: "Nail Tech, Houston",
    rating: 5,
  },
];

const STATS = [
  { value: "2.9%", label: "Transaction fee", sublabel: "No monthly cost" },
  { value: "< 30s", label: "Average booking time" },
  { value: "24/7", label: "Availability management" },
  { value: "0", label: "Subscription fees" },
];

/* ──────────────────────────── Page ─────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        {/* Radial fade */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,white_70%)]" />

        <div className="relative section-width section-padding pb-24 pt-20 sm:pb-32 sm:pt-28 lg:pb-40 lg:pt-36">
          <div className="mx-auto max-w-3xl text-center">
            {/* Pill badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              <span className="text-caption font-medium text-neutral-600">
                Now available in your city
              </span>
            </div>

            <h1 className="text-display-lg sm:text-display-xl text-neutral-900">
              Beauty services,{" "}
              <span className="text-gradient">on demand</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-body-lg text-neutral-500">
              Book barbers, nail techs, makeup artists, and more — at their shop or at
              your door. No phone tag. No guessing. Just book and go.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/providers"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-neutral-900 px-7 text-body font-medium text-white transition-all hover:bg-neutral-800 active:bg-neutral-950 sm:h-14 sm:px-8 sm:text-body-lg"
              >
                Book a provider
                <span className="transition-transform group-hover:translate-x-0.5">
                  <IconArrowRight />
                </span>
              </Link>
              <Link
                href="/register?role=provider"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-neutral-300 px-7 text-body font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-400 sm:h-14 sm:px-8 sm:text-body-lg"
              >
                List your services
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:mt-24 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white px-6 py-5 text-center">
                <p className="text-heading text-neutral-900">{stat.value}</p>
                <p className="mt-0.5 text-caption text-neutral-500">{stat.label}</p>
                {stat.sublabel && (
                  <p className="text-caption text-neutral-400">{stat.sublabel}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="border-t border-neutral-200 bg-neutral-50">
        <div className="section-width section-padding py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-caption font-medium uppercase tracking-wider text-neutral-400">
              How it works
            </p>
            <h2 className="mt-3 text-display text-neutral-900">
              Four steps. Zero friction.
            </h2>
            <p className="mt-4 text-body-lg text-neutral-500">
              Getting your next cut, style, or treatment shouldn&apos;t take more effort than ordering coffee.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="group relative rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-sm"
              >
                {/* Step number */}
                <span className="absolute right-5 top-5 text-caption font-medium text-neutral-300">
                  0{i + 1}
                </span>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                  {step.icon}
                </div>
                <h3 className="mt-5 text-subheading text-neutral-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-body-sm text-neutral-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Provider showcase (mock UI) ──────────────────────────── */}
      <section className="border-t border-neutral-200">
        <div className="section-width section-padding py-24 sm:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left: copy */}
            <div>
              <p className="text-caption font-medium uppercase tracking-wider text-neutral-400">
                For providers
              </p>
              <h2 className="mt-3 text-display text-neutral-900">
                Your business,{" "}
                <span className="text-neutral-400">simplified</span>
              </h2>
              <p className="mt-4 text-body-lg text-neutral-500">
                No subscriptions. No monthly fees. Just a small transaction fee
                when you get paid. Keep more of what you earn.
              </p>

              <ul className="mt-10 space-y-4">
                {PROVIDER_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
                      <IconCheck />
                    </span>
                    <span className="text-body text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Link
                  href="/register?role=provider"
                  className="group inline-flex items-center gap-2 text-body font-medium text-neutral-900 transition-colors hover:text-neutral-600"
                >
                  Start for free
                  <span className="transition-transform group-hover:translate-x-1">
                    <IconArrowRight />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right: mock provider card */}
            <div className="relative">
              {/* Decorative dot grid */}
              <div className="absolute -right-4 -top-4 h-24 w-24 bg-[radial-gradient(#d4d4d4_1.5px,transparent_1.5px)] bg-[size:12px_12px] opacity-60" />

              <div className="relative rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)]">
                {/* Provider header */}
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-lg font-semibold text-neutral-700">
                    MJ
                  </div>
                  <div className="flex-1">
                    <h4 className="text-subheading text-neutral-900">Marcus Cuts</h4>
                    <p className="mt-0.5 text-body-sm text-neutral-500">Atlanta, GA</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5 text-neutral-900">
                        <IconStar /><IconStar /><IconStar /><IconStar /><IconStar />
                      </div>
                      <span className="text-body-sm text-neutral-400">4.8 (47)</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-neutral-900 px-4 py-2 text-body-sm font-medium text-white">
                    Book
                  </div>
                </div>

                {/* Separator */}
                <div className="my-6 h-px bg-neutral-100" />

                {/* Services */}
                <div className="space-y-3">
                  {[
                    { name: "Classic Fade", time: "45 min", price: "$35" },
                    { name: "Haircut & Beard", time: "60 min", price: "$50" },
                    { name: "Beard Trim", time: "20 min", price: "$20" },
                  ].map((service) => (
                    <div
                      key={service.name}
                      className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3"
                    >
                      <div>
                        <p className="text-body-sm font-medium text-neutral-900">
                          {service.name}
                        </p>
                        <p className="text-caption text-neutral-400">{service.time}</p>
                      </div>
                      <span className="text-body-sm font-semibold text-neutral-900">
                        {service.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Portfolio grid */}
                <div className="mt-6">
                  <p className="text-caption font-medium text-neutral-400">Portfolio</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────── */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="section-width section-padding py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-caption font-medium uppercase tracking-wider text-neutral-400">
              What people say
            </p>
            <h2 className="mt-3 text-display text-neutral-900">
              Trusted by providers & clients
            </h2>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:mt-20 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-neutral-200 bg-white p-6"
              >
                <div className="flex gap-0.5 text-neutral-900">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <IconStar key={i} />
                  ))}
                </div>
                <blockquote className="mt-4 text-body text-neutral-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-caption font-semibold text-neutral-600">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-neutral-900">{t.name}</p>
                    <p className="text-caption text-neutral-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────────────────── */}
      <section className="border-t border-neutral-200">
        <div className="section-width section-padding py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-display text-neutral-900">
              Ready to get started?
            </h2>
            <p className="mt-4 text-body-lg text-neutral-500">
              Whether you&apos;re booking your next fade or building your client base,
              ARC makes it effortless.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex h-14 items-center gap-2 rounded-xl bg-neutral-900 px-8 text-body-lg font-medium text-white transition-all hover:bg-neutral-800 active:bg-neutral-950"
              >
                Create free account
                <span className="transition-transform group-hover:translate-x-0.5">
                  <IconArrowRight />
                </span>
              </Link>
              <Link
                href="/providers"
                className="inline-flex h-14 items-center rounded-xl border border-neutral-300 px-8 text-body-lg font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-400"
              >
                Browse providers
              </Link>
            </div>

            <p className="mt-6 text-body-sm text-neutral-400">
              Free forever for clients. No subscription for providers.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
