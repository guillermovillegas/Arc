import Link from "next/link";
import {
  ArrowRight,
  Star,
  MapPin,
  CalendarDays,
  MessageSquare,
  CreditCard,
  Quote,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

/* ═══════════════════════════════════════════════════════════════════════════
   ARC — Editorial luxury marketplace
   Design language: LV flagship × Goyard craftsmanship × SKIMS minimalism
   Warm neutrals, serif display, editorial grid, signature arc motif
   ═══════════════════════════════════════════════════════════════════════════ */

/* ──────────────────────────── Data ─────────────────────────────────────── */

const CHAPTERS = [
  {
    number: "01",
    title: "Discover",
    body: "Browse vetted professionals by craft, location, and reputation. Real portfolios. Honest reviews. The full story of the artist before you book.",
  },
  {
    number: "02",
    title: "Reserve",
    body: "Live availability. Transparent pricing. Confirm in seconds. No phone tag. No guesswork. Just the time and the service you chose.",
  },
  {
    number: "03",
    title: "Pay with ease",
    body: "Secure in-app checkout. Deposits, receipts, and payouts all handled. No cash exchanges. No awkward invoices. Nothing to chase.",
  },
  {
    number: "04",
    title: "Enjoy the craft",
    body: "Visit their studio or receive service at your door. Exceptional beauty, delivered on your terms — and never on anyone else's schedule.",
  },
];

const CATEGORIES = [
  "Barbering",
  "Nails",
  "Lashes",
  "Makeup",
  "Braids",
  "Skincare",
] as const;

const PROVIDER_FEATURES = [
  {
    title: "Zero monthly fees",
    body: "List your craft, manage your clientele, and keep every booking free of subscription cost.",
  },
  {
    title: "Single transaction fee",
    body: "A small percentage when you're paid. Nothing else. Keep more of what you earn.",
  },
  {
    title: "One schedule",
    body: "Studio, chair, or on the road — manage every appointment from a single calendar.",
  },
  {
    title: "Instant payouts",
    body: "Funds move the moment a service is complete. No waiting. No wondering.",
  },
  {
    title: "Deposit protection",
    body: "Enforce your no-show policy the way you choose. Your time is your livelihood.",
  },
  {
    title: "A community of masters",
    body: "Join a circle of vetted professionals who care about the craft as much as you do.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Arc finally gave my craft the platform it deserves. Deposits ended my no-show problem the first week — and my clients tell me the booking feels luxurious.",
    name: "Marcus J.",
    role: "Master Barber",
    city: "Atlanta",
    initials: "MJ",
  },
  {
    quote:
      "I found my barber in under two minutes. Booked, paid, walked out with the cleanest fade of my life. Start to finish, it felt effortless.",
    name: "David R.",
    role: "Client",
    city: "Brooklyn",
    initials: "DR",
  },
  {
    quote:
      "My schedule finally runs itself. I get to focus on the art of the work instead of texting clients back and forth all day.",
    name: "Keisha T.",
    role: "Nail Artist",
    city: "Houston",
    initials: "KT",
  },
  {
    quote:
      "My bookings tripled my first month on Arc. The portfolio lets my work speak for itself — and it brings in exactly the clients I want.",
    name: "Aisha M.",
    role: "Lash Artist",
    city: "Dallas",
    initials: "AM",
  },
];

const STATS = [
  { value: "2.9%", label: "Transaction fee", caption: "No monthly cost" },
  { value: "< 30s", label: "Average reservation" },
  { value: "24 / 7", label: "On your schedule" },
  { value: "$0", label: "Subscription fees" },
];

/* ──────────────────────── Visual Components ────────────────────────────── */

function SectionLabel({
  number,
  children,
}: {
  number?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-label text-espresso-500">
      {number && (
        <span className="tabular-nums text-brass-600">{number}</span>
      )}
      <span className="h-px w-8 bg-espresso-300" />
      <span>{children}</span>
    </div>
  );
}

function ArcMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <path
        d="M10 100 C 10 30, 50 10, 60 10 C 70 10, 110 30, 110 100"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="60" cy="100" r="3" fill="currentColor" />
    </svg>
  );
}

/* ──────────────────────────── Page ─────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory-100 text-espresso-800">
      <Header />

      {/* ═══ Hero ═════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-ivory-100">
        <div className="absolute inset-0 bg-paper-grain opacity-60" />
        {/* Warm architectural glow — echoes LV storefront lighting */}
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(184,147,90,0.15)_0%,transparent_60%)] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:px-10 sm:pb-32 sm:pt-28 lg:px-16 lg:pt-36">
          {/* Top editorial meta bar */}
          <div className="mb-20 flex items-center justify-between border-b border-espresso-200/40 pb-6 sm:mb-28">
            <SectionLabel number="Volume I">The Arc Marketplace</SectionLabel>
            <span className="hidden text-label text-espresso-400 sm:inline">
              Est. 2026 · Anywhere
            </span>
          </div>

          {/* Main editorial grid — asymmetric, serif-led */}
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left: Vertical label */}
            <div className="hidden lg:col-span-1 lg:block">
              <div className="sticky top-32 flex h-full items-start">
                <span className="label-caps rotate-180 [writing-mode:vertical-rl]">
                  A refined way to book
                </span>
              </div>
            </div>

            {/* Center: Headline */}
            <div className="lg:col-span-7">
              <h1 className="font-serif text-[3.5rem] leading-[0.95] tracking-[-0.03em] text-espresso-900 sm:text-[4.5rem] lg:text-[5.75rem]">
                Exceptional
                <br />
                beauty,
                <br />
                <span className="italic text-brass-600">anywhere.</span>
              </h1>

              <p className="mt-10 max-w-xl text-body-lg text-espresso-600">
                Arc is the bridge between discerning clients and vetted masters
                of the craft. Barbers, nail artists, lash artists, makeup
                professionals — at their studio, or at your door.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button variant="arc" size="lg" className="group" asChild>
                  <Link href="/providers">
                    Find your artist
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button variant="arc-outline" size="lg" asChild>
                  <Link href="/register?role=provider">Offer your craft</Link>
                </Button>
              </div>
            </div>

            {/* Right: Provider card — museum presentation */}
            <div className="relative lg:col-span-4">
              <div className="absolute -top-6 right-0 text-label text-espresso-400">
                No. 001 / Featured
              </div>

              <div className="relative mt-8 overflow-hidden border border-espresso-200/60 bg-ivory-50 shadow-[0_1px_60px_-20px_rgba(28,23,18,0.12)]">
                {/* Portrait area — architectural gradient */}
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-ivory-300 via-ivory-200 to-brass-200" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(184,147,90,0.35)_0%,transparent_60%)]" />
                  {/* Initials monogram */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-[9rem] leading-none text-ivory-50/90">
                      M
                    </span>
                  </div>
                  {/* Vertical meta */}
                  <div className="absolute left-4 top-4 text-label text-espresso-700">
                    Atlanta · GA
                  </div>
                  <div className="absolute bottom-4 left-4 text-label text-espresso-700">
                    Since 2019
                  </div>
                </div>

                {/* Card body */}
                <div className="border-t border-espresso-200/60 p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-label text-espresso-400">
                        Master Barber
                      </p>
                      <h3 className="mt-1 font-serif text-[1.75rem] leading-none text-espresso-900">
                        Marcus Cuts
                      </h3>
                    </div>
                    <div className="flex items-baseline gap-1 text-espresso-800">
                      <Star className="h-3.5 w-3.5 fill-brass-500 text-brass-500" />
                      <span className="font-serif text-lg">4.9</span>
                      <span className="text-label text-espresso-400">/5</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      { name: "Classic Fade", time: "45 min", price: "$35" },
                      { name: "Haircut & Beard", time: "60 min", price: "$55" },
                      { name: "Line-up", time: "20 min", price: "$20" },
                    ].map((s, i) => (
                      <div
                        key={s.name}
                        className={`flex items-baseline justify-between ${
                          i < 2 ? "border-b border-espresso-200/40 pb-3" : ""
                        }`}
                      >
                        <div>
                          <p className="text-body-sm text-espresso-800">
                            {s.name}
                          </p>
                          <p className="text-label text-espresso-400">
                            {s.time}
                          </p>
                        </div>
                        <span className="font-serif text-espresso-900">
                          {s.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button variant="arc" className="mt-6 w-full" asChild>
                    <Link href="/providers">Reserve</Link>
                  </Button>
                </div>
              </div>

              {/* Floating "booking confirmed" — architectural chip */}
              <div className="absolute -left-6 bottom-16 hidden border border-espresso-200/60 bg-ivory-50 px-4 py-3 shadow-lg lg:block">
                <p className="text-label text-brass-600">Confirmed</p>
                <p className="mt-1 font-serif text-base text-espresso-900">
                  Today · 10:00
                </p>
              </div>
            </div>
          </div>

          {/* Stats — editorial specimen row */}
          <div className="mt-24 grid grid-cols-2 gap-px border-t border-espresso-200/40 bg-espresso-200/40 sm:mt-32 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-ivory-100 px-6 py-8">
                <p className="font-serif text-[2.5rem] leading-none tracking-tight text-espresso-900">
                  {stat.value}
                </p>
                <p className="mt-3 text-label text-espresso-500">
                  {stat.label}
                </p>
                {stat.caption && (
                  <p className="mt-1 text-label text-espresso-400 normal-case tracking-normal">
                    {stat.caption}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Category row — fine rule with serif entries */}
          <div className="mt-20 border-t border-espresso-200/40 pt-10 sm:mt-24">
            <div className="flex items-center justify-between">
              <SectionLabel>The Crafts</SectionLabel>
              <Link
                href="/providers"
                className="group flex items-center gap-2 text-label text-espresso-500 transition-colors hover:text-espresso-900"
              >
                View all
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
              {CATEGORIES.map((cat, i) => (
                <span
                  key={cat}
                  className="font-serif text-2xl text-espresso-900 sm:text-3xl"
                >
                  <span className="text-label align-top text-brass-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>{" "}
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Chapter: How it works ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-espresso-200/40 bg-ivory-50">
        <div className="mx-auto max-w-7xl px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel number="Chapter I">The Journey</SectionLabel>
              <h2 className="mt-6 font-serif text-[2.75rem] leading-[1] tracking-[-0.025em] text-espresso-900 sm:text-[3.5rem]">
                Four steps.
                <br />
                <span className="italic text-brass-600">Simply refined.</span>
              </h2>
              <p className="mt-8 max-w-md text-body-lg text-espresso-600">
                Booking a master of their craft should feel as refined as the
                service itself.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="divide-y divide-espresso-200/50 border-y border-espresso-200/50">
                {CHAPTERS.map((chapter) => (
                  <div
                    key={chapter.title}
                    className="group grid gap-6 py-10 sm:grid-cols-12 sm:gap-10"
                  >
                    <div className="sm:col-span-2">
                      <span className="font-serif text-3xl text-brass-600">
                        {chapter.number}
                      </span>
                    </div>
                    <div className="sm:col-span-10">
                      <h3 className="font-serif text-[1.75rem] leading-tight text-espresso-900">
                        {chapter.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-body text-espresso-600">
                        {chapter.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Mobile Showcase — architectural gallery ════════════════════════ */}
      <section className="relative overflow-hidden border-t border-espresso-200/40 bg-ivory-100">
        <div className="absolute inset-0 bg-paper-grain opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
          <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <SectionLabel number="Chapter II">The Instrument</SectionLabel>
              <h2 className="mt-6 font-serif text-[2.75rem] leading-[1] tracking-[-0.025em] text-espresso-900 sm:text-[3.5rem]">
                The craft, in
                <br />
                <span className="italic text-brass-600">your pocket.</span>
              </h2>
            </div>
            <p className="max-w-sm text-body text-espresso-600">
              Whether you&apos;re booking a master artisan or building your
              clientele, Arc is designed for how you live and work — at the
              studio, at home, or on the road.
            </p>
          </div>

          {/* Feature grid — sculptural cards on pedestals */}
          <div className="mt-20 grid gap-px border border-espresso-200/50 bg-espresso-200/50 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "i",
                icon: MapPin,
                title: "Discover",
                desc: "Vetted professionals. Real portfolios. Honest reviews.",
              },
              {
                num: "ii",
                icon: CalendarDays,
                title: "Reserve",
                desc: "Live availability. Transparent pricing. Effortless checkout.",
              },
              {
                num: "iii",
                icon: MessageSquare,
                title: "Connect",
                desc: "Direct messaging. Automatic reminders. Zero phone tag.",
              },
              {
                num: "iv",
                icon: CreditCard,
                title: "Transact",
                desc: "Secure payments. Deposits held. Payouts instant.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group relative bg-ivory-50 p-8 transition-colors hover:bg-ivory-100 sm:p-10"
              >
                <div className="flex items-start justify-between">
                  <f.icon className="h-5 w-5 text-espresso-700" strokeWidth={1.25} />
                  <span className="font-serif text-sm italic text-brass-600">
                    {f.num}
                  </span>
                </div>
                <h3 className="mt-10 font-serif text-2xl text-espresso-900">
                  {f.title}
                </h3>
                <p className="mt-3 text-body-sm text-espresso-500">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ For Professionals — dark chapter ═══════════════════════════════ */}
      <section className="relative overflow-hidden bg-espresso-900 text-ivory-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,147,90,0.15)_0%,transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(250,248,243,1) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 text-label text-brass-400">
                <span className="tabular-nums">Chapter III</span>
                <span className="h-px w-8 bg-brass-400/60" />
                <span>For Professionals</span>
              </div>
              <h2 className="mt-6 font-serif text-[2.75rem] leading-[1] tracking-[-0.025em] text-ivory-100 sm:text-[3.75rem]">
                Your craft,
                <br />
                <span className="italic text-brass-400">amplified.</span>
              </h2>
              <p className="mt-8 max-w-md text-body-lg text-ivory-300">
                No subscriptions. No monthly fees. Just a single transaction fee
                when you&apos;re paid. Keep more of what you earn — and build
                the business your craft deserves.
              </p>

              <div className="mt-10">
                <Button variant="brass" size="lg" className="group" asChild>
                  <Link href="/register?role=provider">
                    Begin your practice
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              <ArcMark className="mt-16 h-24 w-24 text-brass-500/60" />
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-px border border-ivory-100/10 bg-ivory-100/10 sm:grid-cols-2">
                {PROVIDER_FEATURES.map((f, i) => (
                  <div
                    key={f.title}
                    className="bg-espresso-900 p-8 transition-colors hover:bg-espresso-800"
                  >
                    <span className="font-serif text-sm italic text-brass-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 font-serif text-xl text-ivory-100">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-body-sm text-ivory-300">{f.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Testimonials — editorial pull quotes ═══════════════════════════ */}
      <section className="relative overflow-hidden border-t border-espresso-200/40 bg-ivory-100">
        <div className="mx-auto max-w-7xl px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel number="Chapter IV">Voices</SectionLabel>
              <h2 className="mt-6 font-serif text-[2.75rem] leading-[1] tracking-[-0.025em] text-espresso-900 sm:text-[3.5rem]">
                Trusted by
                <br />
                <span className="italic text-brass-600">
                  masters of the craft.
                </span>
              </h2>
              <p className="mt-8 max-w-md text-body text-espresso-600">
                Why discerning clients and elite professionals are choosing Arc
                for the services they care about most.
              </p>
            </div>

            <div className="grid gap-px border border-espresso-200/50 bg-espresso-200/50 lg:col-span-8 sm:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="flex flex-col justify-between bg-ivory-50 p-8 sm:p-10"
                >
                  <Quote
                    className="h-6 w-6 text-brass-500"
                    strokeWidth={1.5}
                  />
                  <blockquote className="mt-6 font-serif text-xl leading-snug text-espresso-900">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 border-t border-espresso-200/50 pt-5">
                    <div className="flex h-11 w-11 items-center justify-center border border-espresso-300 bg-ivory-200 font-serif text-sm text-espresso-800">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-serif text-base text-espresso-900">
                        {t.name}
                      </p>
                      <p className="text-label text-espresso-500">
                        {t.role} · {t.city}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Final CTA — colophon ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-espresso-200/40 bg-ivory-50">
        <div className="absolute inset-0 bg-paper-grain opacity-60" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,147,90,0.12)_0%,transparent_70%)] blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 py-32 text-center sm:py-40">
          <ArcMark className="mx-auto h-16 w-16 text-brass-600" />

          <p className="mt-10 text-label text-espresso-500">
            Your connection to exceptional beauty
          </p>
          <h2 className="mt-6 font-serif text-[3rem] leading-[0.95] tracking-[-0.025em] text-espresso-900 sm:text-[4.5rem]">
            Anytime.
            <br />
            <span className="italic text-brass-600">Anywhere.</span>
          </h2>

          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="arc" size="lg" className="group" asChild>
              <Link href="/register">
                Create your account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button variant="arc-outline" size="lg" asChild>
              <Link href="/providers">Explore professionals</Link>
            </Button>
          </div>

          <p className="mt-10 text-label text-espresso-400">
            Always free for clients · No subscription for professionals ·
            Cancel anytime
          </p>

          {/* Colophon — signed spec like the back of a book */}
          <div className="mt-20 border-t border-espresso-200/40 pt-8 text-label text-espresso-400">
            Arc · Volume I · Est. 2026 · A marketplace for the craft
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
