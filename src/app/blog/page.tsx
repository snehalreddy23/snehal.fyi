import Link from "next/link";
import { Metadata } from "next";
import { BLOG_POSTS } from "@/data/blog";
import { VERIFIED_RESOURCES } from "@/data/resources";
import {
  FileText,
  ArrowRight,
  Clock,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Fresher Career Playbook & Verified Resources | snehal.fyi",
  description:
    "Thoroughly researched, fluff-free career guides and verified free resources (Harvard Action Verbs, Jake's LaTeX ATS template, Google X-Y-Z formula, Striver SDE sheet).",
};

export default function BlogArchivePage() {
  return (
    <div className="py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-14 font-sans">
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
          Field-tested frameworks and verified resources to beat ATS filters, cold message recruiters, and crack technical rounds.
        </p>
      </div>

      {/* Free ATS Checker Banner Card */}
      <div className="apple-glass rounded-3xl p-6 sm:p-8 border border-blue-500/30 bg-blue-500/[0.03] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Tool</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Test Your Resume On Our Free ATS Scanner
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Scan your resume against 7 core ATS parameters or cross-match it directly against any target Job Description in seconds.
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

      {/* Curated Guides Grid */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Actionable Career Guides
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Strictly proven strategies from tech recruiters & software engineers.
            </p>
          </div>
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

      {/* Verified Free Resources Section */}
      <div className="space-y-5 pt-6 border-t border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Free & Verified</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Curated High-Value Resources
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Gold-standard tools, LaTeX templates, and coding roadmaps trusted by university placement cells worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {VERIFIED_RESOURCES.map((res) => (
            <a
              key={res.id}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-card rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
                    {res.source}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      res.badge === "Gold Standard"
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                        : res.badge === "Official"
                        ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                        : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                    }`}
                  >
                    {res.badge}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                  {res.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
                <span className="text-[11px] text-neutral-500">{res.category}</span>
                <span className="inline-flex items-center gap-1 text-white group-hover:text-blue-400 font-medium text-[11px] transition">
                  <span>Open Resource</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
