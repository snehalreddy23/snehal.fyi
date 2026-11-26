import Link from "next/link";
import InstagramIcon from "./InstagramIcon";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-black text-neutral-500 text-xs mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-white text-sm">
              snehal<span className="text-blue-500">.fyi</span>
            </span>
            <p className="text-neutral-400 text-xs mt-1">
              Curated by Snehal Reddy • Data Engineer (Snowflake) & Anurag University Alum
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-400">
            <Link href="/" className="hover:text-white transition">
              Jobs
            </Link>
            <Link href="/blog" className="hover:text-white transition">
              Resume Tips
            </Link>
            <Link href="/about" className="hover:text-white transition">
              About
            </Link>
            <a
              href="https://t.me/snehal.fyi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1 text-neutral-300"
            >
              <span>Telegram (@snehal.fyi)</span>
            </a>
            <a
              href="https://instagram.com/snehal.fyi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1 text-neutral-300"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@snehal.fyi</span>
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-600">
          <p>© 2026 snehal.fyi. All company logos & names belong to their respective owners.</p>
          <p>Direct official career links • Zero fees</p>
        </div>
      </div>
    </footer>
  );
}
