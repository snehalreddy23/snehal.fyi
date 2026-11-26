import Image from "next/image";
import { Metadata } from "next";
import InstagramIcon from "@/components/InstagramIcon";
import { Send, ShieldCheck, Target, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Snehal Reddy | snehal.fyi",
  description: "About Snehal Reddy — Data Engineer (Snowflake) & Anurag University graduate.",
};

export default function AboutPage() {
  return (
    <div className="py-12 px-4 sm:px-6 max-w-3xl mx-auto space-y-12">
      {/* Hero */}
      <div className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          About snehal.fyi
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl">
          An independent platform dedicated to helping college students and freshers find verified off-campus opportunities.
        </p>
      </div>

      {/* Creator Card */}
      <div className="apple-glass rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-1 ring-white/10 relative bg-neutral-900 flex-shrink-0">
            <Image
              src="/snehal.jpg"
              alt="Snehal Reddy"
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-grow">
            <div>
              <h2 className="text-lg font-semibold text-white">Snehal Reddy</h2>
              <p className="text-xs text-neutral-400">
                Data Engineer (Snowflake) • Alumnus, Anurag University
              </p>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              I graduated from Anurag University and work as a Data Engineer specializing in Snowflake and cloud data pipelines.
            </p>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              During my college years, I saw how stressful off-campus placements can be with endless ghost applications and paid consultancy scams. I created <strong className="text-white">snehal.fyi</strong> to curate verified openings, provide direct application links, and share actionable ATS resume blueprints.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <a
                href="https://instagram.com/snehal.fyi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-full text-xs font-semibold transition"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Follow @snehal.fyi</span>
              </a>
              <a
                href="https://t.me/snehalfyi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-neutral-900 text-neutral-300 border border-white/10 px-4 py-2 rounded-full text-xs font-medium hover:text-white transition"
              >
                <Send className="w-3 h-3 text-sky-400" />
                <span>Telegram Alerts</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="apple-card rounded-2xl p-4 space-y-1.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xs font-semibold text-white">100% Free</h3>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Zero fees for job seekers. Never pay anyone for an interview call.
          </p>
        </div>

        <div className="apple-card rounded-2xl p-4 space-y-1.5">
          <Target className="w-5 h-5 text-blue-400" />
          <h3 className="text-xs font-semibold text-white">Official Links</h3>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Every listing directs you straight to company career portals.
          </p>
        </div>

        <div className="apple-card rounded-2xl p-4 space-y-1.5">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-xs font-semibold text-white">Instagram Automation</h3>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Comment on reels to receive links directly in your DMs.
          </p>
        </div>
      </div>
    </div>
  );
}
