"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Sparkles, Terminal, Code2, Plus } from "lucide-react";

export default function PostJobPage() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    id: "107",
    slug: "microsoft-software-engineer-2025",
    company: "Microsoft",
    role: "Software Development Engineer (Fresher)",
    category: "Software",
    badge: "Hot",
    logoBg: "bg-blue-600",
    location: "Hyderabad / Bengaluru",
    jobType: "Full-Time",
    batch: "2024, 2025, 2026",
    salary: "₹16 - ₹22 LPA",
    experience: "Freshers Eligible (0-1 yrs)",
    postedDate: "Today",
    deadline: "Apply ASAP",
    applyUrl: "https://careers.microsoft.com/",
    eligibility: "B.Tech/B.E in CS/IT/ECE\nBatch 2024, 2025, 2026\n60% or 6.0 CGPA minimum\nNo active backlogs",
    description: "Microsoft is hiring fresh graduates for its Cloud + AI and Core Engineering organizations in India.",
    responsibilities: "Build scalable microservices and cloud tooling on Azure.\nCollaborate in agile engineering sprints.\nMaintain high testing standards.",
    requirements: "Solid foundation in Data Structures and Algorithms.\nProficiency in C++, C#, Java, or Python.\nUnderstanding of OOP and OS concepts.",
    selectionProcess: "Round 1: Online Assessment (Coding + CS Fundamentals)\nRound 2: Technical Interview (DSA & Problem Solving)\nRound 3: System Architecture & Culture Fitment",
    snehalTips: "Make sure your resume highlights at least 1 deployed full-stack project or open-source PR. Practice binary search and graph questions on LeetCode!",
    tags: "Microsoft, SDE, Fresher, Azure, High CTC",
  });

  const generatedCode = `  {
    id: "${formData.id}",
    slug: "${formData.slug}",
    company: "${formData.company}",
    role: "${formData.role}",
    category: "${formData.category}",
    badge: "${formData.badge}",
    logoBg: "${formData.logoBg}",
    location: "${formData.location}",
    jobType: "${formData.jobType}",
    batch: [${formData.batch
      .split(",")
      .map((b) => `"${b.trim()}"`)
      .join(", ")}],
    salary: "${formData.salary}",
    experience: "${formData.experience}",
    postedDate: "${formData.postedDate}",
    deadline: "${formData.deadline}",
    applyUrl: "${formData.applyUrl}",
    eligibility: [
${formData.eligibility
  .split("\n")
  .filter((l) => l.trim())
  .map((l) => `      "${l.trim()}",`)
  .join("\n")}
    ],
    description:
      "${formData.description.replace(/"/g, '\\"')}",
    responsibilities: [
${formData.responsibilities
  .split("\n")
  .filter((l) => l.trim())
  .map((l) => `      "${l.trim()}",`)
  .join("\n")}
    ],
    requirements: [
${formData.requirements
  .split("\n")
  .filter((l) => l.trim())
  .map((l) => `      "${l.trim()}",`)
  .join("\n")}
    ],
    selectionProcess: [
${formData.selectionProcess
  .split("\n")
  .filter((l) => l.trim())
  .map((l) => `      "${l.trim()}",`)
  .join("\n")}
    ],
    snehalTips:
      "${formData.snehalTips.replace(/"/g, '\\"')}",
    featured: true,
    tags: [${formData.tags
      .split(",")
      .map((t) => `"${t.trim()}"`)
      .join(", ")}],
  },`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const updateSlug = (company: string, role: string) => {
    const raw = `${company}-${role}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug: raw }));
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 font-sans">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK_TO_HOME</span>
      </Link>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono text-cyan-300">
          <Terminal className="w-3.5 h-3.5" />
          <span>JOB_GENERATOR // 30-SEC DISPATCH</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white font-mono">
          New Job Post Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Fill in this form to generate the exact code snippet. Then paste it into{" "}
          <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded font-mono">
            src/data/jobs.ts
          </code>
          .
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Form Column */}
        <div className="bg-[#070b16] border border-cyan-500/30 rounded-2xl p-5 space-y-4 text-xs font-mono">
          <div>
            <label className="text-slate-300 block mb-1">
              Job ID (For Instagram Reel & ManyChat, e.g. 107):
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className="w-full bg-[#030611] text-cyan-300 border border-slate-800 rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1">Company Name:</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => {
                  setFormData({ ...formData, company: e.target.value });
                  updateSlug(e.target.value, formData.role);
                }}
                className="w-full bg-[#030611] text-white border border-slate-800 rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Role Title:</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value });
                  updateSlug(formData.company, e.target.value);
                }}
                className="w-full bg-[#030611] text-white border border-slate-800 rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1">Eligible Batches (comma separated):</label>
              <input
                type="text"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                placeholder="2024, 2025, 2026"
                className="w-full bg-[#030611] text-white border border-slate-800 rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Salary / CTC:</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="₹8 - ₹12 LPA or ₹40,000/mo"
                className="w-full bg-[#030611] text-emerald-400 border border-slate-800 rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Official Apply URL:</label>
            <input
              type="url"
              value={formData.applyUrl}
              onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
              placeholder="https://careers.company.com/..."
              className="w-full bg-[#030611] text-cyan-300 border border-slate-800 rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Location:</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-[#030611] text-white border border-slate-800 rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Eligibility Criteria (1 per line):</label>
            <textarea
              rows={3}
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              className="w-full bg-[#030611] text-slate-300 border border-slate-800 rounded-xl p-2.5 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Snehal's Insider Application Tip:</label>
            <textarea
              rows={2}
              value={formData.snehalTips}
              onChange={(e) => setFormData({ ...formData, snehalTips: e.target.value })}
              className="w-full bg-[#030611] text-slate-300 border border-slate-800 rounded-xl p-2.5 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Code Output Column */}
        <div className="bg-[#030611] border border-cyan-500/40 rounded-2xl p-5 flex flex-col justify-between font-mono text-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                <Code2 className="w-4 h-4" />
                <span>GENERATED CODE</span>
              </span>
              <button
                onClick={copyCode}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold px-3 py-1.5 rounded-xl transition shadow"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-black" />
                    <span>COPY CODE</span>
                  </>
                )}
              </button>
            </div>

            <pre className="text-slate-300 overflow-x-auto p-2 bg-[#020409] rounded-xl border border-slate-800 text-[11px] leading-relaxed max-h-[460px]">
              {generatedCode}
            </pre>
          </div>

          <div className="pt-4 border-t border-slate-800 text-slate-400 space-y-1 text-[11px]">
            <p className="text-cyan-300 font-bold">🚀 2-Step Execution:</p>
            <p>1. Click <strong>COPY CODE</strong> above.</p>
            <p>2. Open <code>src/data/jobs.ts</code> and paste it inside the <code>JOBS_DATA</code> array.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
