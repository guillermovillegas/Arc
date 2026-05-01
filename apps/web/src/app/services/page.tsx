import { Topbar } from "@/components/layout/topbar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { IdleCollectionSection } from "@/app/_components/idle-collection-section";

export default function ServicesPage() {
  return (
    <>
      <Topbar />
      <SiteHeader />
      <main>
        <IdleCollectionSection />
      </main>
      <SiteFooter />
    </>
  );
}
