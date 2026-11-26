import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { BLOG_POSTS } from "@/data/blog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Send,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Guide Not Found" };

  return {
    title: `${post.title} | snehal.fyi`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 max-w-3xl mx-auto space-y-8 font-sans">
      {/* Back button */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition bg-white/[0.05] hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/[0.08]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Guides & Resources</span>
        </Link>
      </div>

      {/* Post Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] text-neutral-300 border border-white/[0.08] font-medium text-[11px]">
            {post.category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3 text-neutral-500" />
            {post.readTime}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3 text-neutral-500" />
            {post.date}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed border-l-2 border-blue-500 pl-4 py-0.5 italic">
          {post.excerpt}
        </p>
      </div>

      {/* Article Content */}
      <article className="apple-card rounded-3xl p-6 sm:p-10 text-neutral-200 text-xs sm:text-sm leading-relaxed space-y-6 border border-white/[0.08]">
        <div className="whitespace-pre-line prose prose-invert max-w-none text-neutral-300">
          {post.content}
        </div>

        {/* Contextual High-Value Action Card */}
        {post.slug === "fresher-resume-blueprint-beat-ats" && (
          <div className="p-5 rounded-2xl bg-blue-500/[0.05] border border-blue-500/20 space-y-3 mt-6">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Next Step</span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              Scan Your Resume Right Now (100% Free & Private)
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Our automated in-browser engine tests your resume against these exact 5 criteria (Google X-Y-Z verbs, metric quantification, and section structure).
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/ats-checker"
                className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-4 py-2 rounded-full transition shadow"
              >
                <span>Launch Free ATS Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://www.overleaf.com/latex/templates/jakes-resume/syzsqbzwjvdq"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#161618] hover:bg-[#1f1f23] text-neutral-300 hover:text-white border border-white/10 text-xs font-medium px-4 py-2 rounded-full transition"
              >
                <span>Open Jake's LaTeX Template</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {post.slug === "linkedin-cold-dm-template-freshers" && (
          <div className="p-5 rounded-2xl bg-blue-500/[0.05] border border-blue-500/20 space-y-3 mt-6">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready to Apply & Cold Message?</span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              Browse Active Fresher Openings on snehal.fyi
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Find verified Job IDs for Google, Amazon, TCS, Snowflake, and more to plug directly into this template.
            </p>
            <div className="pt-1">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-4 py-2 rounded-full transition shadow"
              >
                <span>Browse Verified Openings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {post.slug === "top-technical-questions-fresher-drives" && (
          <div className="p-5 rounded-2xl bg-blue-500/[0.05] border border-blue-500/20 space-y-3 mt-6">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Preparation Sheets</span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              Gold-Standard Problem Lists
            </h4>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-4 py-2 rounded-full transition shadow"
              >
                <span>Striver's SDE Sheet (191 Questions)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://neetcode.io/roadmap"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#161618] hover:bg-[#1f1f23] text-neutral-300 hover:text-white border border-white/10 text-xs font-medium px-4 py-2 rounded-full transition"
              >
                <span>NeetCode 150 Roadmap</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Community Callout */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] bg-[#121214] -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 sm:p-8 rounded-b-3xl space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold text-white tracking-tight">
              Get Fresher Hiring Alerts & Resume Blueprints
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We break down real ATS resumes, salary negotiations, and fresher off-campus updates daily.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <a
              href="https://t.me/snehalfyi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#1c1c1f] hover:bg-[#252529] text-white border border-white/10 text-xs font-semibold px-4 py-2 rounded-full active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Telegram (@snehal.fyi)</span>
            </a>
            <a
              href="https://instagram.com/snehal.fyi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-4 py-2 rounded-full active:scale-95 transition"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Follow @snehal.fyi</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
