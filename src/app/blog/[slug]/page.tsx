import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { DETAILED_BLOG_POSTS, DetailedBlogPost } from "@/data/blog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  Send,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import BlogCallout from "@/components/BlogCallout";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return DETAILED_BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = DETAILED_BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Guide Not Found" };

  return {
    title: `${post.title} | snehal.fyi`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = DETAILED_BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 max-w-3xl mx-auto space-y-10 font-sans">
      {/* Back button */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition bg-white/[0.05] hover:bg-white/10 px-3.5 py-1.5 rounded-full border border-white/[0.08]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Guides</span>
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

      {/* Main Body Article */}
      <article className="apple-glass rounded-3xl p-6 sm:p-10 text-neutral-200 space-y-10 border border-white/[0.08] shadow-2xl">
        {post.sections.map((section, idx) => (
          <div key={idx} className="space-y-4 pt-2 first:pt-0">
            {section.heading && (
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight pb-1 border-b border-white/[0.06]">
                {section.heading}
              </h2>
            )}

            {section.paragraphs && section.paragraphs.map((para, pIdx) => (
              <p key={pIdx} className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {para}
              </p>
            ))}

            {/* Structured Bullets */}
            {section.bullets && (
              <ul className="space-y-2.5 pt-1">
                {section.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Before vs After Comparisons */}
            {section.comparison && (
              <div className="space-y-3 pt-2">
                {section.comparison.map((comp, cIdx) => (
                  <div key={cIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-rose-500/[0.03] border border-rose-500/20 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{comp.badLabel}</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {comp.badText}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/20 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{comp.goodLabel}</span>
                      </div>
                      <p className="text-xs text-neutral-200 leading-relaxed font-medium">
                        {comp.goodText}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Callouts & Templates with Copy Button */}
            {section.callout && (
              <div className="pt-2">
                <BlogCallout title={section.callout.title} text={section.callout.text} />
              </div>
            )}
          </div>
        ))}

        {/* Action Callout for Free ATS Scanner */}
        {post.slug === "fresher-resume-blueprint-beat-ats" && (
          <div className="p-5 sm:p-6 rounded-2xl bg-blue-500/[0.04] border border-blue-500/20 space-y-3 mt-8">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Next Step</span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              Scan Your Resume Right Now (100% Free & Private)
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Our automated in-browser engine tests your resume against these exact criteria (Google X-Y-Z verbs, metric quantification, and section structure).
            </p>
            <div className="pt-1">
              <Link
                href="/ats-checker"
                className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-5 py-2.5 rounded-full transition shadow"
              >
                <span>Launch Free ATS Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Action Callout for Jobs */}
        {(post.slug === "linkedin-cold-dm-template-freshers" ||
          post.slug === "top-technical-questions-fresher-drives") && (
          <div className="p-5 sm:p-6 rounded-2xl bg-blue-500/[0.04] border border-blue-500/20 space-y-3 mt-8">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Placement Drives</span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              Browse Active Fresher Openings on snehal.fyi
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Verified openings with official career portal links for 2025, 2026, and 2027 batches.
            </p>
            <div className="pt-1">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-5 py-2.5 rounded-full transition shadow"
              >
                <span>Browse Active Openings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
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
              href="https://t.me/snehal_fyi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#1c1c1f] hover:bg-[#252529] text-white border border-white/10 text-xs font-semibold px-4 py-2 rounded-full active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Telegram (@snehal_fyi)</span>
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
