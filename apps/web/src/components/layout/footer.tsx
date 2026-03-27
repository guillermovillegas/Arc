import Link from "next/link";

const navigation = {
  platform: [
    { label: "Find Providers", href: "/providers" },
    { label: "How it Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/pricing" },
  ],
  providers: [
    { label: "Join as Provider", href: "/register?role=provider" },
    { label: "Community", href: "/community" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="section-width section-padding">
        {/* Main footer */}
        <div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <span className="text-base font-semibold tracking-tight text-neutral-900">ARC</span>
            </Link>
            <p className="mt-4 text-body-sm text-neutral-500 max-w-[200px]">
              Beauty services on the pull up. Book anywhere, anytime.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-caption font-medium uppercase tracking-wider text-neutral-400">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5">
              {navigation.platform.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-caption font-medium uppercase tracking-wider text-neutral-400">
              Providers
            </h4>
            <ul className="mt-4 space-y-2.5">
              {navigation.providers.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-caption font-medium uppercase tracking-wider text-neutral-400">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5">
              {navigation.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-caption font-medium uppercase tracking-wider text-neutral-400">
              Legal
            </h4>
            <ul className="mt-4 space-y-2.5">
              {navigation.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-200 py-6 sm:flex-row">
          <p className="text-caption text-neutral-400">
            &copy; {new Date().getFullYear()} ARC. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="#" className="text-neutral-400 transition-colors hover:text-neutral-600" aria-label="Twitter/X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link href="#" className="text-neutral-400 transition-colors hover:text-neutral-600" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
