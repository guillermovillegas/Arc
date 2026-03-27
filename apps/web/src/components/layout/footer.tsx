import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/providers" className="text-sm text-gray-600 hover:text-gray-900">Find Providers</Link></li>
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">For Providers</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/register?role=provider" className="text-sm text-gray-600 hover:text-gray-900">Join as Provider</Link></li>
              <li><Link href="/community" className="text-sm text-gray-600 hover:text-gray-900">Community</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ARC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
