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
    <div className="space-y-8">
      {/* Search & Segmented Controls Container */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company (Google, Amazon), role, or Job ID..."
            className="w-full bg-[#161618] hover:bg-[#1a1a1d] focus:bg-[#1a1a1d] border border-white/[0.08] focus:border-white/20 text-white pl-11 pr-10 py-3 rounded-2xl text-sm placeholder-neutral-500 transition-all outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 p-1 rounded-full text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Apple Segmented Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Batch Selector */}
          <div className="inline-flex items-center bg-[#161618] p-1 rounded-xl border border-white/[0.06] text-xs font-medium">
            <span className="text-neutral-500 px-2.5 text-[11px]">Batch:</span>
            {batches.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBatch(b)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedBatch === b
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {b === "All" ? "All Grads" : b}
              </button>
            ))}
          </div>

          {/* Type Selector */}
          <div className="inline-flex items-center bg-[#161618] p-1 rounded-xl border border-white/[0.06] text-xs font-medium">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedType === t
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-white/[0.06]">
        <span>
          Showing <strong className="text-white font-medium">{filteredJobs.length}</strong> verified opportunities
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-neutral-400 hover:text-white underline text-xs"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Job Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#161618] rounded-3xl border border-white/[0.08] p-8 space-y-3">
          <p className="text-base font-semibold text-white">No openings found</p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try resetting your filters or search terms to see all available recent grad opportunities.
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
