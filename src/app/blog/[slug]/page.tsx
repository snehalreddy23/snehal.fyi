import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { BLOG_POSTS } from "@/data/blog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  FileText,
  CheckCircle2,
  Send,
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

  if (!post) {
    return {
      title: "Article Not Found | snehal.fyi",
    };
  }

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
    <div className="py-8 px-4 sm:px-6 max-w-3xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Guides</span>
        </Link>
      </div>

      {/* Post Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 font-medium">
            {post.category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {post.date}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed border-l-2 border-indigo-500 pl-4 italic">
          {post.excerpt}
        </p>
      </div>

      {/* Article Content */}
      <article className="bg-[#131b2e] border border-slate-800 rounded-3xl p-6 sm:p-10 text-slate-200 text-sm leading-relaxed space-y-6">
        <div className="whitespace-pre-line prose prose-invert max-w-none">
          {post.content}
        </div>

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
