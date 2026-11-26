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

        {/* Action Callout */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 bg-indigo-950/40 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 sm:p-8 rounded-b-3xl space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <InstagramIcon className="w-4 h-4 text-pink-400" />
            <span>Follow @snehal.fyi on Instagram</span>
          </div>
          <p className="text-xs text-slate-300">
            We break down real ATS resumes, salary negotiations, and fresher off-campus updates daily in bite-sized Reels.
          </p>
          <a
            href="https://instagram.com/snehal.fyi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow"
          >
            <span>Follow @snehal.fyi</span>
          </a>
        </div>
      </article>
    </div>
  );
}
