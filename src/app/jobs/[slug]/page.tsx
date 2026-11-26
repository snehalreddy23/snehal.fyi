import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { JOBS_DATA } from "@/data/jobs";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Banknote,
  Calendar,
  ExternalLink,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Sparkles,
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
    <div className="pb-24 pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Openings</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="apple-glass rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl ${job.logoBg} flex items-center justify-center text-white font-bold text-2xl shadow-sm ring-1 ring-white/10 flex-shrink-0`}
            >
              {job.company.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-400">
                  {job.company}
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">
                  #{job.id}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                {job.role}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-white text-black hover:bg-neutral-200 font-semibold px-6 py-3 rounded-full text-xs sm:text-sm transition shadow w-full sm:w-auto"
            >
              <span>Apply on Official Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-white/[0.06] text-xs">
          <div className="apple-card p-3 rounded-xl space-y-1">
            <span className="text-neutral-500 text-[11px] block">Batch</span>
            <p className="font-semibold text-white">{job.batch.join(", ")}</p>
          </div>
          <div className="apple-card p-3 rounded-xl space-y-1">
            <span className="text-neutral-500 text-[11px] block">Compensation</span>
            <p className="font-semibold text-emerald-400">{job.salary}</p>
          </div>
          <div className="apple-card p-3 rounded-xl space-y-1">
            <span className="text-neutral-500 text-[11px] block">Location</span>
            <p className="font-semibold text-white truncate">{job.location}</p>
          </div>
          <div className="apple-card p-3 rounded-xl space-y-1">
            <span className="text-neutral-500 text-[11px] block">Deadline</span>
            <p className="font-semibold text-white">{job.deadline}</p>
          </div>
        </div>

        {/* Share */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-white/[0.06]">
          <span className="text-neutral-400">Share with college batchmates:</span>
          <JobShareButtons job={job} />
        </div>
      </div>

      {/* Snehal's Insider Application Advice */}
      <div className="apple-card rounded-2xl p-5 sm:p-6 space-y-2 border border-blue-500/20">
        <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Snehal's Advice for Applicants</span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          {job.snehalTips}
        </p>
      </div>

      {/* Eligibility */}
      <div className="apple-card rounded-2xl p-6 space-y-3">
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
      <div className="apple-card rounded-2xl p-6 space-y-4 text-xs sm:text-sm">
        <h2 className="font-semibold text-white text-sm">About The Role</h2>
        <p className="text-neutral-300 leading-relaxed">{job.description}</p>

        <h3 className="font-semibold text-white pt-2">Key Responsibilities</h3>
        <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
          {job.responsibilities.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>

        <h3 className="font-semibold text-white pt-2">Skills & Requirements</h3>
        <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
          {job.requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
      </div>

      {/* Selection Process */}
      <div className="apple-card rounded-2xl p-6 space-y-3">
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

      {/* Sticky Mobile Apply Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/[0.08] p-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white truncate">{job.company}</p>
          <p className="text-[11px] text-emerald-400 font-medium truncate">{job.salary}</p>
        </div>
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-black font-semibold text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5"
        >
          <span>Apply Now</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
