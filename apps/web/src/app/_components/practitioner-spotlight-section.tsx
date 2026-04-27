import Image from "next/image";

export function PractitionerSpotlightSection() {
  return (
    <section className="py-30 border-b border-smoke-700">
      <div className="max-w-[1480px] mx-auto px-14">
        <div className="flex justify-between items-end mb-16 pb-6 border-b border-taupe-500 gap-12 flex-col md:flex-row">
          <h3 className="font-display display-compressed text-[4rem] leading-[0.94] text-bone-100">
            <em className="font-editorial italic font-light text-champagne-400">
              The Salon
            </em>{" "}
            at home.
          </h3>
          <div className="font-mono text-mono text-taupe-300 leading-relaxed text-right">
            <strong className="text-bone-100 font-medium">14 PRACTITIONERS</strong>
            <br />
            CHICAGO ONLY
            <br />
            ACCEPTANCE · 4.6%
            <br />
            WAITLIST OPEN
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] border border-smoke-700 min-h-[560px]">
          <div className="relative bg-smoke-900 overflow-hidden">
            <Image
              src="/brand/photography/portrait-maeve.png"
              alt="Maeve Le Gal"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="p-16 px-14 flex flex-col justify-between bg-smoke-900">
            <span className="text-label uppercase tracking-[0.32em] text-taupe-300 font-medium">
              In Practice · № 01
            </span>
            <h3 className="font-display display-compressed text-[3.75rem] leading-[0.95] text-bone-100 mt-6">
              Maeve{" "}
              <em className="font-editorial italic font-light text-champagne-400">
                Le Gal.
              </em>
            </h3>
            <p className="font-editorial italic font-light text-[24px] leading-snug text-bone-200 my-8 max-w-[480px]">
              &ldquo;I cut hair for people who would rather lie down than stand at a salon for two hours. The work is the same. The chair is just yours.&rdquo;
            </p>
            <dl className="grid grid-cols-3 gap-8 pt-6 border-t border-taupe-500">
              <div>
                <dt className="text-label uppercase tracking-[0.3em] text-taupe-300 mb-1.5 font-medium">Trained</dt>
                <dd className="font-editorial italic text-body-lg text-bone-100">Cristophe, Paris</dd>
              </div>
              <div>
                <dt className="text-label uppercase tracking-[0.3em] text-taupe-300 mb-1.5 font-medium">Years</dt>
                <dd className="font-editorial italic text-body-lg text-bone-100">22</dd>
              </div>
              <div>
                <dt className="text-label uppercase tracking-[0.3em] text-taupe-300 mb-1.5 font-medium">Neighbourhood</dt>
                <dd className="font-editorial italic text-body-lg text-bone-100">West Loop</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
