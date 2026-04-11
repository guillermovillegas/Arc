import Link from "next/link";

const navigation = {
  platform: [
    { label: "Discover", href: "/providers" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Pricing", href: "/pricing" },
  ],
  providers: [
    { label: "Join as professional", href: "/register?role=provider" },
    { label: "Journal", href: "/community" },
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

function ArcMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 24 C 4 12, 12 4, 16 4 C 20 4, 28 12, 28 24"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="16" cy="24" r="1.75" fill="currentColor" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-espresso-200/50 bg-ivory-100">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        {/* Main footer */}
        <div className="grid grid-cols-2 gap-8 py-20 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <ArcMark className="h-7 w-7 text-espresso-800" />
              <span className="font-serif text-[1.375rem] leading-none text-espresso-900 tracking-[0.01em]">
                Arc
              </span>
            </Link>
            <p className="mt-5 max-w-[220px] font-serif text-sm italic leading-relaxed text-espresso-500">
              Your connection to exceptional beauty, anytime, anywhere.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-label text-espresso-400">Platform</h4>
            <ul className="mt-5 space-y-3">
              {navigation.platform.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-espresso-600 transition-colors hover:text-espresso-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label text-espresso-400">For Professionals</h4>
            <ul className="mt-5 space-y-3">
              {navigation.providers.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-espresso-600 transition-colors hover:text-espresso-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label text-espresso-400">House</h4>
            <ul className="mt-5 space-y-3">
              {navigation.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-espresso-600 transition-colors hover:text-espresso-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label text-espresso-400">Legal</h4>
            <ul className="mt-5 space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-espresso-600 transition-colors hover:text-espresso-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colophon bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-espresso-200/50 py-8 sm:flex-row">
          <p className="text-label text-espresso-400">
            &copy; {new Date().getFullYear()} Arc &middot; Est. 2026 &middot; A marketplace for the craft
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="#"
              className="text-espresso-400 transition-colors hover:text-brass-600"
              aria-label="Twitter/X"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="text-espresso-400 transition-colors hover:text-brass-600"
              aria-label="Instagram"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
