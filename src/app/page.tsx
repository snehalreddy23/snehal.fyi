import Link from "next/link";
import { JOBS_DATA } from "@/data/jobs";
import { BLOG_POSTS } from "@/data/blog";
import JobFeed from "@/components/JobFeed";
import InstagramIcon from "@/components/InstagramIcon";
import SnehalProfileSection from "@/components/SnehalProfileSection";
import {
  ArrowRight,
  ShieldCheck,
  Send,
  Zap,
  CheckCircle2,
  FileText,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Apple-Style Minimalist Hero Section */}
      <section className="pt-16 sm:pt-24 pb-6 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6">
        {/* Subtle status pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161618] border border-white/[0.08] text-xs text-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Recent Grads & College Students • 2025, 2026, 2027+</span>
        </div>

        {/* Apple Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.035em] text-white leading-[1.08] max-w-3xl mx-auto">
          Career moves for recent grads. <br />
          <span className="text-neutral-500 font-normal">
            Direct links. No middleman.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Daily verified off-campus drives, high-paying internships, and ATS resume blueprints for 2025, 2026, and 2027+ batches.
        </p>

        {/* Feature Highlights */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-5 text-xs text-neutral-400">
          <Link
            href="/ats-checker"
            className="inline-flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3.5 py-1.5 rounded-full font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Free ATS Resume Checker →</span>
          </Link>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
            100% Free Direct Apply
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-white" />
            Instant Instagram DMs
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-white" />
            Zero Consultancies
          </span>
        </div>
      </section>

      {/* Main Job Feed Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Latest Openings
          </h2>
          <span className="text-xs text-neutral-500">
            Batches 2025, 2026, 2027+
          </span>
        </div>

        <JobFeed initialJobs={JOBS_DATA} />
      </section>

      {/* Instagram DM Feature Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="apple-glass rounded-3xl p-6 sm:p-10 border border-white/[0.08] shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram Automated DMs</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Comment on any Reel → Link in your DM in 5s
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                When you see any hiring reel on <strong className="text-white font-medium">@snehal.fyi</strong>, comment the word <strong className="text-white font-medium">"APPLY"</strong> or the 3-digit Job ID (e.g. 101). We automatically send the direct application link straight to your Instagram inbox in seconds.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 flex-shrink-0">
              <a
                href="https://instagram.com/snehal.fyi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-5 py-2.5 rounded-full text-xs font-semibold transition"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Follow @snehal.fyi</span>
              </a>
              <a
                href="https://t.me/snehal_fyi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#161618] hover:bg-[#1c1c1f] text-white border border-white/10 px-5 py-2.5 rounded-full text-xs font-medium transition"
              >
                <Send className="w-3 h-3 text-sky-400" />
                <span>Join Telegram (@snehal_fyi)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Playbook Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Resume & Career Playbook
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Field-tested guides to beat ATS filters and cold message recruiters.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-xs text-neutral-400 hover:text-white transition flex items-center gap-1 font-medium"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="apple-card rounded-2xl p-6 flex flex-col justify-between group"
            >
              <div>
                <span className="text-[11px] font-medium text-neutral-400">
                  {post.category} • {post.readTime}
                </span>
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-base mt-2 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400 font-medium">
                <span>Read guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Small, Tasteful Creator Section at the very bottom */}
      <SnehalProfileSection />

      {/* Clean Minimalist FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-neutral-400">
            Answers to common questions about snehal.fyi.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Is applying to jobs on snehal.fyi free?",
              a: "Yes, 100% free. Every single application button takes you directly to the official company career portal. We never charge job seekers any fees.",
            },
            {
              q: "Which batches are eligible?",
              a: "We curate postings specifically for Recent Grads & College Students — primarily 2025, 2026, and 2027+ batches across engineering, BCA, MCA, and general degree streams.",
            },
            {
              q: "How does the Instagram automation work?",
              a: "When you comment 'APPLY' or the 3-digit Job ID on any Reel from @snehal.fyi, our automated system delivers the exact application URL straight to your Instagram DMs in seconds.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="apple-card rounded-2xl p-4 sm:p-5 space-y-1.5"
            >
              <h3 className="font-medium text-white text-sm">
                {item.q}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
