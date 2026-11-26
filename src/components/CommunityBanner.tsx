import { Send, ArrowRight } from "lucide-react";

export default function CommunityBanner() {
  return (
    <div className="bg-[#0c0c0e] border-b border-white/[0.06] text-neutral-300 text-xs py-2 px-4">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span className="text-white font-medium">Recent Grads (2025, 2026, 2027+):</span>
          <span className="text-neutral-400 hidden sm:inline">
            Direct off-campus application alerts daily
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://t.me/snehalfyi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-white transition flex items-center gap-1.5 text-[11px] font-medium"
          >
            <Send className="w-3 h-3 text-sky-400" />
            <span>Telegram Channel (@snehal.fyi)</span>
            <ArrowRight className="w-3 h-3 text-neutral-500" />
          </a>
        </div>
      </div>
    </div>
  );
}
