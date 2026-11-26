"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface BlogCalloutProps {
  title: string;
  text: string;
}

export default function BlogCallout({ title, text }: BlogCalloutProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isTemplate = title.toLowerCase().includes("template");

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#161618] border border-white/[0.08] space-y-3 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>{title}</span>
        </h4>
        {isTemplate && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 bg-white/[0.08] hover:bg-white/15 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium px-3 py-1.5 rounded-full transition active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Template</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Template</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line font-mono bg-black/40 p-4 rounded-xl border border-white/[0.04]">
        {text}
      </div>
    </div>
  );
}
