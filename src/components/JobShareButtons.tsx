"use client";

import { useState } from "react";
import { Job } from "@/types";
import { Share2, Check, MessageCircle, Send } from "lucide-react";

export default function JobShareButtons({ job }: { job: Job }) {
  const [copied, setCopied] = useState(false);

  const getJobUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/jobs/${job.slug}`;
    }
    return `https://snehal-fyi.vercel.app/jobs/${job.slug}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getJobUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const whatsappShareText = encodeURIComponent(
    `🚨 Hiring Alert for Freshers (${job.batch.join(", ")} batch)!\n\n` +
      `🏢 Company: ${job.company}\n` +
      `💼 Role: ${job.role}\n` +
      `💰 CTC: ${job.salary}\n` +
      `📍 Location: ${job.location}\n\n` +
      `Direct Apply Link 👉 ${getJobUrl()}\n\n` +
      `Shared via snehal.fyi (@snehal.fyi on Instagram)`
  );

  const telegramShareText = encodeURIComponent(
    `🚨 Hiring Alert: ${job.company} is hiring for ${job.role} (${job.salary})!\n\nApply directly: ${getJobUrl()}\n\nJoin our Telegram channel for direct alerts: @snehal_fyi`
  );

  return (
    <div className="flex items-center gap-2">
      {/* WhatsApp Share */}
      <a
        href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-medium transition"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </a>

      {/* Telegram Share */}
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(
          getJobUrl()
        )}&text=${telegramShareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 px-3 py-1.5 rounded-xl font-medium transition"
        title="Share on Telegram"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Telegram</span>
      </a>

      {/* Copy Link Button */}
      <button
        onClick={copyToClipboard}
        className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl font-medium transition"
        title="Copy Link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
