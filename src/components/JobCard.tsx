import Link from "next/link";
import { Job } from "@/types";
import { MapPin, ArrowRight, Sparkles } from "lucide-react";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="apple-card rounded-2xl p-4 sm:p-6 flex flex-col justify-between group active:scale-[0.99] transition-transform">
      <div>
        {/* Top row: Company initial badge + Company name + Badge */}
        <div className="flex items-start justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl ${job.logoBg} flex items-center justify-center text-white font-bold text-base shadow-sm ring-1 ring-white/10 flex-shrink-0`}
            >
              {job.company.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-neutral-400 truncate">
                  {job.company}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono flex-shrink-0">
                  #{job.id}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                <Link href={`/jobs/${job.slug}`}>{job.role}</Link>
              </h3>
            </div>
          </div>

          {job.badge && (
            <span
              className={`text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                job.badge === "Hot"
                  ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                  : job.badge === "Urgent"
                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              }`}
            >
              {job.badge}
            </span>
          )}
        </div>

        {/* Clean Meta Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 my-2.5 text-xs">
          <span className="bg-white/[0.05] border border-white/[0.07] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-neutral-300 font-medium text-[11px] sm:text-xs">
            Batch {job.batch.join(", ")}
          </span>
          <span className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-emerald-300 font-semibold text-[11px] sm:text-xs">
            {job.salary}
          </span>
          <span className="text-neutral-500 flex items-center gap-1 text-[11px]">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate max-w-[120px]">{job.location}</span>
          </span>
        </div>

        {/* Short description */}
        <p className="text-xs text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
        <span className="text-neutral-500 text-[11px]">
          Posted {job.postedDate}
        </span>

        <div className="flex items-center gap-3">
          <Link
            href={`/ats-checker?job=${job.slug}`}
            className="inline-flex items-center gap-1 text-neutral-400 hover:text-blue-400 font-medium transition text-[11px] py-1"
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>ATS Match</span>
          </Link>
          <Link
            href={`/jobs/${job.slug}`}
            className="inline-flex items-center gap-1 text-white hover:text-blue-400 font-medium transition text-xs py-1"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
