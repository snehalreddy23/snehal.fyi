import Link from "next/link";
import { Job } from "@/types";
import { MapPin, ArrowRight, ArrowUpRight } from "lucide-react";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="apple-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between group">
      <div>
        {/* Top row: Company initial badge + Company name + Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${job.logoBg} flex items-center justify-center text-white font-bold text-base shadow-sm ring-1 ring-white/10`}
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
              <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                <Link href={`/jobs/${job.slug}`}>{job.role}</Link>
              </h3>
            </div>
          </div>

          {job.badge && (
            <span
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
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
        <div className="flex flex-wrap items-center gap-2 my-3 text-xs">
          <span className="bg-white/[0.05] border border-white/[0.07] px-2.5 py-1 rounded-md text-neutral-300 font-medium">
            Batch {job.batch.join(", ")}
          </span>
          <span className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md text-emerald-300 font-semibold">
            {job.salary}
          </span>
          <span className="text-neutral-500 flex items-center gap-1 text-[11px]">
            <MapPin className="w-3 h-3" />
            {job.location}
          </span>
        </div>

        {/* Short description */}
        <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
        <span className="text-neutral-500 text-[11px]">
          Posted {job.postedDate}
        </span>

        <Link
          href={`/jobs/${job.slug}`}
          className="inline-flex items-center gap-1 text-white hover:text-blue-400 font-medium transition text-xs"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
