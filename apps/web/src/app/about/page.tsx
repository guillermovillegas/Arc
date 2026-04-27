import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About — Arc",
  description:
    "Arc is the bridge between discerning clients and exceptional beauty professionals. A marketplace built around the craft.",
};

const PILLARS = [
  {
    number: "01",
    title: "Quality & craftsmanship",
    body: "Every professional on Arc is vetted. We elevate the standard of beauty services by connecting clients with artisans who are passionate about their craft and committed to excellence.",
  },
  {
    number: "02",
    title: "Convenience & flexibility",
    body: "Seamless booking and on-demand services that fit modern lifestyles. At the studio, at home, or on the road — beauty on your terms.",
  },
  {
    number: "03",
    title: "Community & connection",
    body: "A trusted ecosystem where professionals thrive and clients can discover the best talent in their city. The artistry of beauty, shared.",
  },
  {
    number: "04",
    title: "Simplicity & sophistication",
    body: "An intuitive, uncluttered, aesthetically considered experience. Premium without being precious. Effortless without being careless.",
  },
  {
    number: "05",
    title: "Professional empowerment",
    body: "We give the artists the tools and visibility they need to build the business their craft deserves — and we never take a subscription.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory-100 text-espresso-800">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ivory-100">
        <div className="absolute inset-0 bg-paper-grain opacity-60" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(184,147,90,0.12)_0%,transparent_60%)] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-28 sm:px-10 sm:pt-36 lg:px-16">
          <div className="mb-16 flex items-center justify-between border-b border-espresso-200/40 pb-6 sm:mb-24">
            <div className="flex items-center gap-3 text-label text-espresso-500">
              <span className="tabular-nums text-brass-600">Volume I</span>
              <span className="h-px w-8 bg-espresso-300" />
              <span>About the House</span>
            </div>
            <span className="hidden text-label text-espresso-400 sm:inline">
              Est. 2026 · Anywhere
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h1 className="font-serif text-[3rem] leading-[0.95] tracking-[-0.03em] text-espresso-900 sm:text-[4.5rem] lg:text-[5.5rem]">
                A bridge between
                <br />
                <span className="italic text-brass-600">craft and clientele.</span>
              </h1>
              <p className="mt-10 max-w-2xl text-body-lg text-espresso-600">
                Arc was founded on a simple conviction: the artistry of a
                master barber, a nail artist, a lash technician, a makeup
                professional — deserves a platform as refined as the work
                itself. We built one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="border-t border-espresso-200/40 bg-ivory-50">
        <div className="mx-auto max-w-7xl px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 text-label text-espresso-500">
                <span className="tabular-nums text-brass-600">Chapter I</span>
                <span className="h-px w-8 bg-espresso-300" />
                <span>The Manifesto</span>
              </div>
              <h2 className="mt-6 font-serif text-[2.5rem] leading-[1] tracking-[-0.025em] text-espresso-900 sm:text-[3.25rem]">
                Five principles,
                <br />
                <span className="italic text-brass-600">one standard.</span>
              </h2>
              <p className="mt-8 max-w-md text-body text-espresso-600">
                We believe beauty is a craft. And we believe craft deserves
                reverence — in how it&apos;s discovered, how it&apos;s booked,
                and how it&apos;s paid for.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="divide-y divide-espresso-200/50 border-y border-espresso-200/50">
                {PILLARS.map((p) => (
                  <div
                    key={p.title}
                    className="grid gap-6 py-10 sm:grid-cols-12 sm:gap-10"
                  >
                    <div className="sm:col-span-2">
                      <span className="font-serif text-3xl text-brass-600">
                        {p.number}
                      </span>
                    </div>
                    <div className="sm:col-span-10">
                      <h3 className="font-serif text-[1.75rem] leading-tight text-espresso-900">
                        {p.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-body text-espresso-600">
                        {p.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="relative overflow-hidden bg-espresso-900 text-ivory-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,147,90,0.18)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-6 py-32 text-center sm:py-40">
          <div className="flex items-center justify-center gap-3 text-label text-brass-400">
            <span className="tabular-nums">Chapter II</span>
            <span className="h-px w-8 bg-brass-400/60" />
            <span>The Promise</span>
          </div>
          <p className="mt-12 font-serif text-[2rem] italic leading-[1.15] text-ivory-100 sm:text-[3rem]">
            &ldquo;Your connection to exceptional beauty,
            <br />
            anytime, anywhere.&rdquo;
          </p>
          <p className="mt-10 text-label text-brass-400">— The Arc House</p>

          <div className="mt-16 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="accent" size="lg" className="group" asChild>
              <Link href="/providers">
                Find your artist
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/register?role=provider">Offer your craft</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
