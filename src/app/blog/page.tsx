import Link from "next/link";
import { Metadata } from "next";
import { BLOG_POSTS } from "@/data/blog";
import {
  FileText,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Fresher Career Playbook & Interview Blueprints | snehal.fyi",
  description:
    "Proven engineering guides for 2025, 2026, and 2027+ freshers: beat ATS filters, cold message recruiters, and crack off-campus interviews.",
};

export default function BlogArchivePage() {
  return (
    <div className="py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-12 font-sans">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-neutral-300">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Curated Engineering Advice • Zero Fluff</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          Fresher Career Playbook
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Field-tested frameworks to beat ATS filters, cold message recruiters, and crack off-campus interviews.
        </p>
      </div>

      {/* Free ATS Checker Banner Card */}
      <div className="apple-glass rounded-3xl p-6 sm:p-8 border border-blue-500/30 bg-blue-500/[0.03] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive In-Browser Tool</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Test Your Resume On Our Free ATS Scanner
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Audit your resume against core ATS standards or cross-match it directly against any specific Job Description in seconds.
          </p>
        </div>

        <Link
          href="/ats-checker"
          className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 font-semibold text-xs px-6 py-3 rounded-full transition shadow flex-shrink-0 active:scale-95"
        >
          <span>Audit Resume Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Curated Actionable Guides Grid */}
      <div className="space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-medium mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Curated Engineering Blueprints</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Actionable Career Guides
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Strictly research-backed advice from tech recruiters, engineering managers, and alumni.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group apple-card rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between hover:border-white/20 active:scale-[0.99]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] text-neutral-300 border border-white/[0.08] text-[11px] font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-neutral-500 text-[11px]">{post.date}</span>
                <span className="text-white group-hover:text-blue-400 font-medium flex items-center gap-1 text-xs transition">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
