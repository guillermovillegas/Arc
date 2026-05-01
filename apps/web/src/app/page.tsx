import { Topbar } from "@/components/layout/topbar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection } from "./_components/hero-section";
import { HowItWorksSection } from "./_components/how-it-works-section";
import { IdleCollectionSection } from "./_components/idle-collection-section";
import { ManifestoSection } from "./_components/manifesto-section";
import { PractitionerSpotlightSection } from "./_components/practitioner-spotlight-section";

export default function HomePage() {
  return (
    <>
      <Topbar />
      <SiteHeader />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <IdleCollectionSection />
        <ManifestoSection />
        <PractitionerSpotlightSection />
      </main>
      <SiteFooter />
    </>
  );
}
