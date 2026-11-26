import { Send, ArrowRight } from "lucide-react";

export default function CommunityBanner() {
  return (
    <aside aria-label="Announcement" className="bg-[#0c0c0e] border-b border-white/[0.06] text-neutral-300 text-xs py-2 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
          <span className="text-white font-medium text-[11px] sm:text-xs truncate">
            Recent Grads 2025–2027+
          </span>
          <span className="text-neutral-500 hidden md:inline text-[11px]">
            • Direct off-campus hiring alerts
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="https://t.me/snehalfyi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-white transition flex items-center gap-1 text-[11px] font-medium bg-white/[0.06] px-2.5 py-0.5 rounded-full"
          >
            <Send className="w-2.5 h-2.5 text-sky-400" />
            <span>Telegram</span>
            <ArrowRight className="w-2.5 h-2.5 text-neutral-500" />
          </a>
        </div>
      </div>
    </aside>
  );
}
