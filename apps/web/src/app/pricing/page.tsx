import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Pricing — Arc",
  description:
    "Transparent pricing for clients and professionals. No subscriptions. No hidden fees. Just a small transaction fee when you're paid.",
};

const CLIENT_FEATURES = [
  "Unlimited reservations",
  "Direct messaging with your professional",
  "Secure in-app payments",
  "Automatic receipts and reminders",
  "Review and rate the craft",
  "Favorite the artists you trust",
];

const PROFESSIONAL_FEATURES = [
  "Unlimited listings and services",
  "One calendar — studio, chair, or on the road",
  "Automatic deposits and no-show protection",
  "Instant payouts after every service",
  "Portfolio, reviews, and verified badge",
  "Client messaging and direct broadcasts",
  "Real-time earnings and analytics",
  "Access to the Arc professional community",
];

const FAQS = [
  {
    q: "Does Arc charge a monthly subscription?",
    a: "Never. Arc is free to use for both clients and professionals. We only make money when you do — a single transaction fee per completed booking.",
  },
  {
    q: "How does the 2.9% transaction fee work?",
    a: "When a client pays for a service, Arc takes a 2.9% fee from the transaction. You receive the rest instantly. No hidden costs, no surprises, no invoicing on your part.",
  },
  {
    q: "Are there any setup fees?",
    a: "None. You can list your craft, build your portfolio, and accept your first reservation without paying anything up front.",
  },
  {
    q: "What about payment processing?",
    a: "Payment processing is included in the transaction fee. Arc handles PCI compliance, chargebacks, and payouts — you focus on the craft.",
  },
  {
    q: "Can I enforce a cancellation or no-show policy?",
    a: "Yes. You set the policy: grace period, cancellation window, and the fee (flat, percentage, or held deposit). Arc charges the client automatically per your terms.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory-100 text-espresso-800">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ivory-100">
        <div className="absolute inset-0 bg-paper-grain opacity-60" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(184,147,90,0.12)_0%,transparent_60%)] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-28 sm:px-10 sm:pt-36 lg:px-16">
          <div className="mb-16 flex items-center justify-between border-b border-espresso-200/40 pb-6 sm:mb-24">
            <div className="flex items-center gap-3 text-label text-espresso-500">
              <span className="tabular-nums text-brass-600">Volume I</span>
              <span className="h-px w-8 bg-espresso-300" />
              <span>Pricing</span>
            </div>
            <span className="hidden text-label text-espresso-400 sm:inline">
              Transparent · Fair · Free to join
            </span>
          </div>

          <div className="max-w-4xl">
            <h1 className="font-serif text-[3rem] leading-[0.95] tracking-[-0.03em] text-espresso-900 sm:text-[4.5rem] lg:text-[5.5rem]">
              No subscriptions.
              <br />
              <span className="italic text-brass-600">One small fee.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-body-lg text-espresso-600">
              Arc is free for clients and free to join for professionals. We
              only make money when you do — a single 2.9% transaction fee when
              a service is paid.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="border-t border-espresso-200/40 bg-ivory-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
          <div className="grid gap-px border border-espresso-200/50 bg-espresso-200/50 lg:grid-cols-2">
            {/* Client card */}
            <div className="bg-ivory-50 p-10 sm:p-14">
              <div className="flex items-center gap-3 text-label text-espresso-500">
                <span className="tabular-nums text-brass-600">For Clients</span>
                <span className="h-px w-8 bg-espresso-300" />
              </div>
              <h2 className="mt-6 font-serif text-[3rem] leading-none text-espresso-900">
                Free
              </h2>
              <p className="mt-3 text-body text-espresso-500">
                Forever. For every client. No card required to join.
              </p>

              <div className="my-10 h-px bg-espresso-200/60" />

              <ul className="space-y-4">
                {CLIENT_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-brass-600"
                      strokeWidth={2}
                    />
                    <span className="text-body text-espresso-700">{f}</span>
                  </li>
                ))}
              </ul>

              <Button variant="arc" size="lg" className="mt-10 w-full group" asChild>
                <Link href="/register">
                  Create your account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>

            {/* Professional card — featured */}
            <div className="relative bg-espresso-900 p-10 text-ivory-200 sm:p-14">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,147,90,0.15)_0%,transparent_55%)]" />
              <div className="relative">
                <div className="flex items-center gap-3 text-label text-brass-400">
                  <span className="tabular-nums">For Professionals</span>
                  <span className="h-px w-8 bg-brass-400/60" />
                </div>
                <h2 className="mt-6 font-serif text-[3rem] leading-none text-ivory-100">
                  2.9%
                </h2>
                <p className="mt-3 text-body text-ivory-300">
                  Per transaction. Nothing else. No monthly fees, ever.
                </p>

                <div className="my-10 h-px bg-ivory-100/20" />

                <ul className="space-y-4">
                  {PROFESSIONAL_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-brass-400"
                        strokeWidth={2}
                      />
                      <span className="text-body text-ivory-200">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="brass" size="lg" className="mt-10 w-full group" asChild>
                  <Link href="/register?role=provider">
                    Begin your practice
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-espresso-200/40 bg-ivory-100">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 text-label text-espresso-500">
                <span className="tabular-nums text-brass-600">Chapter I</span>
                <span className="h-px w-8 bg-espresso-300" />
                <span>The Fine Print</span>
              </div>
              <h2 className="mt-6 font-serif text-[2.5rem] leading-[1] tracking-[-0.025em] text-espresso-900 sm:text-[3.25rem]">
                Questions,
                <br />
                <span className="italic text-brass-600">answered plainly.</span>
              </h2>
            </div>

            <div className="lg:col-span-8">
              <div className="divide-y divide-espresso-200/50 border-y border-espresso-200/50">
                {FAQS.map((faq, i) => (
                  <div key={faq.q} className="grid gap-6 py-8 sm:grid-cols-12 sm:gap-10">
                    <div className="sm:col-span-2">
                      <span className="font-serif text-xl text-brass-600">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="sm:col-span-10">
                      <h3 className="font-serif text-xl text-espresso-900">
                        {faq.q}
                      </h3>
                      <p className="mt-3 max-w-2xl text-body text-espresso-600">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
