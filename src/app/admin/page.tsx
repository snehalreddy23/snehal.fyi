"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  PlusCircle,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  GitBranch,
  RefreshCw,
  LogOut,
  Building,
  Briefcase,
  Search,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Job } from "@/types";

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [syncInfo, setSyncInfo] = useState<{
    githubConfigured: boolean;
    repo: string;
    branch: string;
    source: string;
  } | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Add Job Form State
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [applyUrl, setApplyUrl] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("Remote / Pan India");
  const [category, setCategory] = useState<Job["category"]>("Software");
  const [badge, setBadge] = useState<Job["badge"]>("Active");
  const [experience, setExperience] = useState("Freshers / 0-1 yrs");
  const [selectedBatches, setSelectedBatches] = useState<string[]>([
    "2024",
    "2025",
    "2026",
  ]);
  const [snehalTips, setSnehalTips] = useState("");
  const [featured, setFeatured] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    const savedPasscode = sessionStorage.getItem("snehal_admin_passcode");
    if (savedPasscode) {
      setPasscode(savedPasscode);
      verifyAuth(savedPasscode);
    }
  }, []);

  const verifyAuth = async (code: string) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: code }),
      });

      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        sessionStorage.setItem("snehal_admin_passcode", code);
        loadJobs(code);
      } else {
        setAuthError(data.error || "Invalid passcode");
        sessionStorage.removeItem("snehal_admin_passcode");
      }
    } catch {
      setAuthError("Failed to authenticate. Please check server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const loadJobs = async (code: string) => {
    setLoadingJobs(true);
    setActionError(null);
    try {
      const res = await fetch("/api/admin/jobs", {
        headers: { "x-admin-passcode": code },
      });
      const data = await res.json();
      if (res.ok) {
        setJobs(data.jobs || []);
        setSyncInfo({
          githubConfigured: data.githubConfigured,
          repo: data.repo,
          branch: data.branch,
          source: data.source,
        });
      } else {
        setActionError(data.error || "Failed to load jobs");
      }
    } catch {
      setActionError("Network error loading jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode("");
    sessionStorage.removeItem("snehal_admin_passcode");
  };

  const toggleBatch = (batchYear: string) => {
    if (selectedBatches.includes(batchYear)) {
      setSelectedBatches(selectedBatches.filter((b) => b !== batchYear));
    } else {
      setSelectedBatches([...selectedBatches, batchYear]);
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !applyUrl.trim()) {
      setActionError("Company, Role, and Apply Link are required.");
      return;
    }

    setActionLoading(true);
    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({
          company,
          role,
          applyUrl,
          salary: salary || "Best in Industry",
          location: location || "Remote / Pan India",
          category,
          badge,
          experience,
          batch: selectedBatches,
          snehalTips:
            snehalTips ||
            `Tailor your resume specifically for ${role} at ${company}. Keep it strictly to 1 page with live project links.`,
          featured,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess(
          data.message || "Job added successfully! Committing to GitHub..."
        );
        // Reset form
        setCompany("");
        setRole("");
        setApplyUrl("");
        setSalary("");
        setLocation("Remote / Pan India");
        setSnehalTips("");
        setFeatured(false);
        // Reload list
        loadJobs(passcode);
      } else {
        setActionError(data.error || "Failed to create job");
      }
    } catch {
      setActionError("Error saving job. Please check network connection.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteJob = async (id: string, roleName: string, companyName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${roleName} at ${companyName}"?\n\nThis will remove it from jobs.json and commit the change to GitHub.`
    );
    if (!confirmed) return;

    setActionLoading(true);
    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/jobs?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-passcode": passcode },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess(data.message || `Deleted job ${id} successfully.`);
        loadJobs(passcode);
      } else {
        setActionError(data.error || "Failed to delete job");
      }
    } catch {
      setActionError("Network error deleting job.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1. Lock Screen View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#000000] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#161618] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-indigo-400">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              snehal.fyi Admin
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Direct GitHub API & Visitor Analytics Control
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyAuth(passcode);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Admin Passcode
              </label>
              <input
                type="password"
                placeholder="Enter passcode (default: snehal2025)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                autoFocus
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading || !passcode.trim()}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-sm flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Unlocking...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unlock Dashboard</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Protected area. Passcode can be configured in Vercel environment
            variables as <code className="text-slate-400">ADMIN_PASSCODE</code>.
          </p>
        </div>
      </div>
    );
  }

  // 2. Main Authenticated Dashboard View
  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 pb-24">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#000000]/80 backdrop-blur-xl border-b border-white/8 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  snehal.fyi Dashboard
                </h1>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                GitHub API Job CMS & Analytics Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/jobs"
              target="_blank"
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Public Jobs</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </Link>

            <button
              onClick={() => loadJobs(passcode)}
              disabled={loadingJobs}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loadingJobs ? "animate-spin" : ""}`}
              />
              <span>Sync</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-xs font-medium text-rose-400 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Status / Alert notifications */}
        {actionSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-start gap-3 shadow-lg">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
            <div className="flex-1">
              <p className="font-semibold">{actionSuccess}</p>
              <p className="text-xs text-emerald-400/80 mt-0.5">
                Vercel monitors your GitHub repository and automatically deploys
                the update in ~30 seconds.
              </p>
            </div>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-xs text-emerald-400/60 hover:text-emerald-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {actionError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-sm flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              <p className="font-semibold">{actionError}</p>
            </div>
            <button
              onClick={() => setActionError(null)}
              className="text-xs text-rose-400/60 hover:text-rose-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Top Cards: Analytics & GitHub Sync State */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Visitor Analytics Hub */}
          <div className="bg-[#161618] border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Vercel Visitor Analytics
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Active Tracking
              </span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
              <span>Live Visitors</span>
              <TrendingUp className="w-4 h-4 text-emerald-400 inline" />
            </div>
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">
              Privacy-first tracking active on every page. View real-time unique
              visitors, top clicked jobs, and referrer sources.
            </p>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <a
                href="https://vercel.com/snehalreddy23/snehal-fyi/analytics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
              >
                Open Vercel Analytics
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 2. Total Published Jobs */}
          <div className="bg-[#161618] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                Total Active Jobs
              </span>
              <span className="text-xs text-slate-500">jobs.json</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {jobs.length}{" "}
              <span className="text-xs font-normal text-slate-400">
                listings
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {jobs.filter((j) => j.featured).length} Featured •{" "}
              {jobs.filter((j) => j.category === "Software").length} Tech •{" "}
              {jobs.filter((j) => j.jobType === "Internship").length} Internships
            </p>
            <div className="mt-4 pt-3 border-t border-white/5">
              <span className="text-xs text-slate-400">
                Updates directly commit to GitHub repo
              </span>
            </div>
          </div>

          {/* 3. GitHub API Connection Status */}
          <div className="bg-[#161618] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-sky-400" />
                GitHub Repository
              </span>
              {syncInfo?.githubConfigured ? (
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Connected
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Local / Setup Token
                </span>
              )}
            </div>
            <div className="text-base font-bold text-white tracking-tight truncate">
              {syncInfo?.repo || "snehalreddy23/snehal.fyi"}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Branch:{" "}
              <code className="text-slate-300 bg-white/5 px-1.5 py-0.5 rounded">
                {syncInfo?.branch || "main"}
              </code>{" "}
              • Source:{" "}
              <span className="capitalize">{syncInfo?.source || "ready"}</span>
            </p>
            {!syncInfo?.githubConfigured && (
              <p className="text-[11px] text-amber-400/90 mt-2">
                Tip: Add <code className="text-white">GITHUB_TOKEN</code> in
                Vercel to enable live remote commits from any device.
              </p>
            )}
          </div>
        </div>

        {/* Main Grid: Add Job Form & Current Jobs List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Add New Job (5 cols) */}
          <div className="lg:col-span-5 bg-[#161618] border border-white/10 rounded-3xl p-6 h-fit sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Publish New Job
                </h2>
                <p className="text-xs text-slate-400">
                  Auto-commits to GitHub & updates feed
                </p>
              </div>
            </div>

            <form onSubmit={handleAddJob} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Company Name *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Atlassian, Swiggy"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Role Title *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Graduate Software Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Apply URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://careers.company.com/job/..."
                  value={applyUrl}
                  onChange={(e) => setApplyUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Salary / CTC
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹10 - ₹15 LPA"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru / Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as Job["category"])
                    }
                    className="w-full px-3 py-2.5 bg-[#1a1a1c] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-xs"
                  >
                    <option value="Software">Software</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Core Engineering">Core Engineering</option>
                    <option value="Internship">Internship</option>
                    <option value="Non-Tech">Non-Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Badge
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value as Job["badge"])}
                    className="w-full px-3 py-2.5 bg-[#1a1a1c] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Hot">Hot</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Closing Soon">Closing Soon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Eligible Batches
                </label>
                <div className="flex flex-wrap gap-2">
                  {["2023", "2024", "2025", "2026", "2027+"].map((yr) => {
                    const active = selectedBatches.includes(yr);
                    return (
                      <button
                        type="button"
                        key={yr}
                        onClick={() => toggleBatch(yr)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          active
                            ? "bg-indigo-600 text-white"
                            : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
                        }`}
                      >
                        {yr}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Snehal&apos;s Pro Tip
                </label>
                <textarea
                  rows={2}
                  placeholder="Tailor resume to include live project links..."
                  value={snehalTips}
                  onChange={(e) => setSnehalTips(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="featured"
                  className="text-xs text-slate-300 select-none cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Mark as Featured (Pops up at top of home feed)
                </label>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-xl transition shadow-lg shadow-indigo-600/20 text-xs flex items-center justify-center gap-2 mt-4"
              >
                {actionLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Committing to GitHub...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Job via GitHub API</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right List: Manage Current Jobs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161618] border border-white/10 rounded-2xl p-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search active jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none text-xs"
                />
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </span>
            </div>

            {loadingJobs ? (
              <div className="p-12 text-center bg-[#161618] border border-white/10 rounded-3xl">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
                <p className="text-xs text-slate-400">
                  Fetching latest jobs from GitHub...
                </p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-12 text-center bg-[#161618] border border-white/10 rounded-3xl">
                <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">
                  No matching jobs found
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search query or add a new job.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 bg-[#161618] border border-white/10 hover:border-white/20 rounded-2xl transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl ${
                          job.logoBg || "bg-indigo-600"
                        } flex items-center justify-center text-white font-bold text-sm shrink-0`}
                      >
                        {job.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white truncate">
                            {job.role}
                          </h3>
                          <span className="text-xs text-slate-400">at</span>
                          <span className="text-xs font-semibold text-indigo-400">
                            {job.company}
                          </span>
                          {job.badge && (
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              {job.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 flex-wrap">
                          <span>{job.salary}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>ID: {job.id}</span>
                          <span>•</span>
                          <span className="text-slate-500">
                            Batch: {job.batch.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Link
                        href={`/jobs/${job.slug}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition"
                        title="View Job Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() =>
                          handleDeleteJob(job.id, job.role, job.company)
                        }
                        disabled={actionLoading}
                        className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Setup Guide for GitHub Token */}
        <div className="bg-[#161618] border border-white/10 rounded-3xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <GitBranch className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                How to set up GitHub API automatic commits on Vercel:
              </h3>
              <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-4 leading-relaxed">
                <li>
                  Open GitHub → Click your profile icon (top right) →{" "}
                  <strong>Settings</strong> →{" "}
                  <strong>Developer Settings</strong> →{" "}
                  <strong>Personal access tokens (classic)</strong>.
                </li>
                <li>
                  Click <strong>&quot;Generate new token (classic)&quot;</strong>
                  , name it <code className="text-white">snehal.fyi-admin</code>,
                  and check the <strong className="text-white">&quot;repo&quot;</strong>{" "}
                  permission box.
                </li>
                <li>
                  Copy the generated token (starts with{" "}
                  <code className="text-white">ghp_...</code>).
                </li>
                <li>
                  Go to your{" "}
                  <a
                    href="https://vercel.com/snehalreddy23/snehal-fyi/settings/environment-variables"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 underline hover:text-indigo-300"
                  >
                    Vercel Project Settings → Environment Variables
                  </a>
                  , add:
                  <div className="mt-1 font-mono text-[11px] text-slate-300 bg-black/60 p-2 rounded-lg border border-white/5 space-y-0.5">
                    <div>GITHUB_TOKEN=ghp_your_copied_token</div>
                    <div>ADMIN_PASSCODE=your_secret_passcode (optional, defaults to snehal2025)</div>
                  </div>
                </li>
                <li>
                  Hit <strong>Redeploy</strong>. Now whenever you add or delete a
                  job here, it will commit straight into your repository and
                  Vercel will auto-deploy the change in ~30 seconds!
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
