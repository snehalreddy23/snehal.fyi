"use client";

import { useState, useMemo } from "react";
import { Job } from "@/types";
import JobCard from "./JobCard";
import { Search, X } from "lucide-react";

export default function JobFeed({ initialJobs }: { initialJobs: Job[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");

  const batches = ["All", "2025", "2026", "2027+"];
  const types = ["All", "Full-Time", "Internship"];

  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.id.includes(searchTerm) ||
        job.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBatch =
        selectedBatch === "All" || job.batch.includes(selectedBatch);

      const matchesType =
        selectedType === "All" || job.jobType === selectedType;

      return matchesSearch && matchesBatch && matchesType;
    });
  }, [initialJobs, searchTerm, selectedBatch, selectedType]);

  const hasActiveFilters = searchTerm !== "" || selectedBatch !== "All" || selectedType !== "All";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBatch("All");
    setSelectedType("All");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search & Mobile-Optimized Filter Bar */}
      <div className="space-y-3">
        {/* Search Bar - 16px text-base on mobile prevents iOS zoom */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-neutral-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company (Google, Amazon), skill, or Job ID..."
            className="w-full bg-[#161618] border border-white/[0.08] focus:border-white/25 text-white pl-11 pr-10 py-3 rounded-2xl text-base sm:text-sm placeholder-neutral-500 transition-all outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 p-1 rounded-full text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Horizontal Native-Scrolling Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* Batches Pill Group */}
          <div className="inline-flex items-center bg-[#161618] p-1 rounded-xl border border-white/[0.06] text-xs font-medium flex-shrink-0">
            <span className="text-neutral-500 px-2 text-[11px]">Batch:</span>
            {batches.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBatch(b)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedBatch === b
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {b === "All" ? "All Grads" : b}
              </button>
            ))}
          </div>

          {/* Type Pill Group */}
          <div className="inline-flex items-center bg-[#161618] p-1 rounded-xl border border-white/[0.06] text-xs font-medium flex-shrink-0">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedType === t
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-neutral-400 hover:text-white underline text-xs whitespace-nowrap px-2 flex-shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
        <span>
          Showing <strong className="text-white font-medium">{filteredJobs.length}</strong> opportunities
        </span>
        <span className="text-[11px] text-neutral-500 hidden sm:inline">
          Direct career portal links
        </span>
      </div>

      {/* Job Grid - Single column on phone, 2 cols on tablet, 3 on desktop */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#161618] rounded-3xl border border-white/[0.08] p-6 space-y-3">
          <p className="text-base font-semibold text-white">No openings found</p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try resetting your search query to see all available fresher opportunities.
          </p>
          <button
            onClick={clearFilters}
            className="inline-block bg-white text-black text-xs font-semibold px-4 py-2 rounded-full hover:bg-neutral-200 transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
