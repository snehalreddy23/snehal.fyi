import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommunityBanner from "@/components/CommunityBanner";
import { Analytics } from "@vercel/analytics/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b0f19",
};

export const metadata: Metadata = {
  title: "snehal.fyi | Fresher Jobs, Off-Campus Drives & Resume Playbook",
  description:
    "Curated off-campus drives, fresher tech & non-tech job updates, verified direct application links, and ATS resume tips for 2024, 2025, and 2026 batches.",
  keywords: [
    "fresher jobs",
    "off campus drive 2025",
    "fresher job updates",
    "snehal.fyi",
    "resume tips for freshers",
    "software engineer fresher jobs",
  ],
  authors: [{ name: "Snehal", url: "https://instagram.com/snehal.fyi" }],
  openGraph: {
    title: "snehal.fyi | Fresher Jobs & Off-Campus Drives",
    description:
      "Daily verified fresher jobs, high-paying internships, and ATS resume guides.",
    siteName: "snehal.fyi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <CommunityBanner />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
