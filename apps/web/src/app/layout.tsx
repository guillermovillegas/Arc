import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ARC - Beauty Services On The Pull Up",
  description:
    "Connect with top barbers, nail techs, makeup artists, and beauty professionals. Book on-demand or scheduled services. Mobile-friendly, house-call ready.",
  openGraph: {
    title: "ARC - Beauty Services On The Pull Up",
    description: "Find and book beauty professionals near you.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
