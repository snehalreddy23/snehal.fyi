import Image from "next/image";
import InstagramIcon from "./InstagramIcon";
import { Send } from "lucide-react";

export default function SnehalProfileSection() {
  return (
    <section className="my-12 sm:my-16 max-w-3xl mx-auto px-4">
      <div className="apple-glass rounded-3xl p-5 sm:p-8 relative overflow-hidden border border-white/10 shadow-2xl">
        {/* Subtle top light highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
          {/* Small Tasteful Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-xl relative bg-neutral-900">
              <Image
                src="/snehal.jpg"
                alt="Snehal Reddy"
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 72px, 88px"
                priority
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-black" title="Active" />
          </div>

          {/* Details */}
          <div className="space-y-2.5 flex-grow">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-0.5">
                <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                  Snehal Reddy
                </h3>
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-white/5 text-neutral-300 border border-white/10">
                  Feel free to connect
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-medium">
                Data Engineer (Snowflake) • Anurag University Alum
              </p>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
              I built <strong className="text-white font-medium">snehal.fyi</strong> to cut through the noise of fresher hiring. Every job posted here is verified with direct official career links, zero paid consultancies, and real ATS resume tips.
            </p>

            {/* Clean Pill Badges & Buttons */}
            <div className="pt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <a
                href="https://instagram.com/snehal.fyi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-full text-xs font-semibold active:scale-95 transition shadow-sm"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Follow @snehal.fyi</span>
              </a>
              <a
                href="https://t.me/snehal.fyi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 px-4 py-2 rounded-full text-xs font-medium active:scale-95 transition"
              >
                <Send className="w-3 h-3 text-sky-400" />
                <span>Telegram (@snehal.fyi)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
