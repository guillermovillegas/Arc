import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Arc — Your connection to exceptional beauty",
  description:
    "Arc connects discerning clients with vetted barbers, nail artists, lash techs, and makeup professionals. At their studio or at your door.",
  openGraph: {
    title: "Arc — Your connection to exceptional beauty",
    description:
      "A refined way to book barbers, nail artists, lash techs, and makeup professionals.",
    type: "website",
    siteName: "Arc",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arc — Your connection to exceptional beauty",
    description:
      "A refined way to book barbers, nail artists, lash techs, and makeup professionals.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
