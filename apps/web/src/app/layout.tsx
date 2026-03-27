import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARC — Beauty Services, On Demand",
  description:
    "Book barbers, nail techs, makeup artists, and beauty professionals. At their shop or at your door. No subscriptions, no phone tag — just book and go.",
  openGraph: {
    title: "ARC — Beauty Services, On Demand",
    description:
      "Book barbers, nail techs, makeup artists, and beauty professionals near you.",
    type: "website",
    siteName: "ARC",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARC — Beauty Services, On Demand",
    description:
      "Book barbers, nail techs, makeup artists, and beauty professionals near you.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
