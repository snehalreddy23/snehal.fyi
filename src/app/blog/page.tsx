import Link from "next/link";
import { Metadata } from "next";
import { BLOG_POSTS } from "@/data/blog";
import { FileText, ArrowRight, Clock, Calendar, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Fresher Resume Playbook & Career Tips | snehal.fyi",
  description:
    "ATS resume templates, cold DM frameworks for recruiters, and core interview questions for 2024, 2025, and 2026 freshers.",
};

export default function BlogArchivePage() {
  return (
    <div className="py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-xs text-emerald-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Fresher Advice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Resume Playbook & Career Guides
        </h1>
        <p className="max-w-xl mx-auto text-sm text-slate-300">
          Step-by-step guides to craft an ATS 90+ resume, send high-converting LinkedIn cold messages,
          and crack technical interview rounds.
        </p>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group bg-[#131b2e] hover:bg-[#162138] border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-200 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-900/50 font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug mb-3">
                {post.title}
              </h2>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">{post.date}</span>
              <span className="text-indigo-400 font-semibold flex items-center gap-1">
                Read Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
