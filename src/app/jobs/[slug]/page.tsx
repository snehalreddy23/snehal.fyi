import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { JOBS_DATA } from "@/data/jobs";
import {
  MapPin,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Send,
} from "lucide-react";
import JobShareButtons from "@/components/JobShareButtons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return JOBS_DATA.map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = JOBS_DATA.find((j) => j.slug === slug);

  if (!job) {
    return {
      title: "Job Not Found | snehal.fyi",
    };
  }

  return {
    title: `${job.role} at ${job.company} (${job.batch.join(", ")}) | snehal.fyi`,
    description: `Apply for ${job.role} at ${job.company}. CTC: ${job.salary}. Batch: ${job.batch.join(", ")}.`,
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = JOBS_DATA.find((j) => j.slug === slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="pb-28 pt-4 sm:pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-5 sm:space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Openings</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="apple-glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${job.logoBg} flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-sm ring-1 ring-white/10 flex-shrink-0`}
            >
              {job.company.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-400">
                  {job.company}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  #{job.id}
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5 leading-snug">
                {job.role}
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/ats-checker?job=${job.slug}`}
              className="inline-flex items-center justify-center gap-1.5 bg-[#161618] hover:bg-[#1f1f23] text-neutral-200 hover:text-white border border-white/10 font-semibold px-4 py-2.5 rounded-full text-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Scan ATS Match</span>
            </Link>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-white text-black hover:bg-neutral-200 font-semibold px-6 py-2.5 rounded-full text-xs sm:text-sm transition shadow"
            >
              <span>Apply on Official Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/[0.06] text-xs">
          <div className="apple-card p-2.5 sm:p-3 rounded-xl space-y-0.5">
            <span className="text-neutral-500 text-[10px] sm:text-[11px] block">Eligible Batch</span>
            <p className="font-semibold text-white text-xs sm:text-sm truncate">{job.batch.join(", ")}</p>
          </div>
          <div className="apple-card p-2.5 sm:p-3 rounded-xl space-y-0.5">
            <span className="text-neutral-500 text-[10px] sm:text-[11px] block">Compensation</span>
            <p className="font-semibold text-emerald-400 text-xs sm:text-sm truncate">{job.salary}</p>
          </div>
          <div className="apple-card p-2.5 sm:p-3 rounded-xl space-y-0.5">
            <span className="text-neutral-500 text-[10px] sm:text-[11px] block">Location</span>
            <p className="font-semibold text-white text-xs sm:text-sm truncate">{job.location}</p>
          </div>
          <div className="apple-card p-2.5 sm:p-3 rounded-xl space-y-0.5">
            <span className="text-neutral-500 text-[10px] sm:text-[11px] block">Deadline</span>
            <p className="font-semibold text-white text-xs sm:text-sm truncate">{job.deadline}</p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs border-t border-white/[0.06]">
          <span className="text-neutral-400 text-[11px]">Share with college WhatsApp groups:</span>
          <JobShareButtons job={job} />
        </div>
      </div>

      {/* Snehal's Insider Application Advice */}
      <div className="apple-card rounded-2xl p-4 sm:p-6 space-y-2.5 border border-blue-500/20 bg-blue-500/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Snehal's Insider Advice for Applicants</span>
          </div>
          <Link
            href={`/ats-checker?job=${job.slug}`}
            className="text-[11px] font-medium text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
          >
            <span>Scan resume for this job</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          {job.snehalTips}
        </p>
      </div>

      {/* Eligibility */}
      <div className="apple-card rounded-2xl p-5 sm:p-6 space-y-3">
        <h2 className="text-sm font-semibold text-white">Eligibility Criteria</h2>
        <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
          {job.eligibility.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Role Details */}
      <div className="apple-card rounded-2xl p-5 sm:p-6 space-y-3.5 text-xs sm:text-sm">
        <h2 className="font-semibold text-white text-sm">About The Role</h2>
        <p className="text-neutral-300 leading-relaxed">{job.description}</p>

        <h3 className="font-semibold text-white pt-1">Key Responsibilities</h3>
        <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
          {job.responsibilities.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>

        <h3 className="font-semibold text-white pt-1">Skills & Requirements</h3>
        <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
          {job.requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
      </div>

      {/* Selection Process */}
      <div className="apple-card rounded-2xl p-5 sm:p-6 space-y-3">
        <h2 className="text-sm font-semibold text-white">Selection Process</h2>
        <div className="space-y-2">
          {job.selectionProcess.map((round, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/[0.05] text-xs"
            >
              <div className="w-5 h-5 rounded-full bg-white/10 text-neutral-300 font-medium flex items-center justify-center text-[11px] flex-shrink-0">
                {i + 1}
              </div>
              <span className="text-neutral-200">{round}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Telegram Community Callout */}
      <div className="apple-card rounded-2xl p-5 sm:p-6 border border-white/[0.08] bg-[#121214] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sky-400">
            <Send className="w-3 h-3" />
            <span>Never miss an off-campus drive</span>
          </div>
          <h3 className="text-sm font-semibold text-white">
            Join 10,000+ Freshers on Telegram (@snehal.fyi)
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Direct official application links for 2025–2027 batches, posted seconds after they go live.
          </p>
        </div>
        <a
          href="https://t.me/snehalfyi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#1c1c1f] hover:bg-[#252529] text-white border border-white/10 px-5 py-2.5 rounded-full text-xs font-semibold flex-shrink-0 transition active:scale-95 shadow-sm"
        >
          <Send className="w-3 h-3 text-sky-400" />
          <span>Join @snehal.fyi</span>
        </a>
      </div>

      {/* Sticky Mobile Apply Bar - Safe Area Inset Aware for iPhones */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0c0c0e]/95 backdrop-blur-2xl border-t border-white/[0.08] px-4 py-3 pb-6 flex items-center justify-between gap-2.5 shadow-2xl">
        <Link
          href={`/ats-checker?job=${job.slug}`}
          className="flex-shrink-0 bg-[#161618] hover:bg-[#1f1f23] text-neutral-200 border border-white/10 font-medium text-xs px-3.5 py-2.5 rounded-full flex items-center gap-1.5 active:scale-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>ATS Check</span>
        </Link>
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-white text-black font-semibold text-xs px-4 py-2.5 rounded-full flex items-center justify-center gap-1.5 active:scale-95 transition shadow-sm text-center"
        >
          <span>Apply on Official Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
