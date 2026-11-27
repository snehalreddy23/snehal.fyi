"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  ArrowRight,
  Target,
  FileText,
  AlertCircle,
} from "lucide-react";
import { EnterpriseAIReport } from "@/types";

interface Props {
  aiReport: EnterpriseAIReport | null;
  isAiScanning: boolean;
  targetRoleName?: string;
}

export default function EnterpriseAIGradingView({
  aiReport,
  isAiScanning,
  targetRoleName,
}: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (isAiScanning) {
    return (
      <div className="p-5 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-black border border-blue-500/30 rounded-3xl relative overflow-hidden animate-in fade-in duration-300 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  Enterprise AI Engine Active
                </span>
                <span className="text-[10px] font-semibold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Groq LPU Powered
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Auditing ATS Readiness Grade, eligibility criteria & Google X-Y-Z metrics...
              </p>
            </div>
          </div>
          <div className="w-full sm:w-32 bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-2/3 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!aiReport) return null;

  const currentGrade = aiReport.readinessGrade || aiReport.workdayGrade || "C";
  const currentGradeLabel = aiReport.readinessGradeLabel || aiReport.workdayGradeLabel || `Tier ${currentGrade}`;
  const elig = aiReport.eligibilityStatus || aiReport.knockoutStatus || {
    passed: true,
    details: "Passed prerequisite eligibility screening.",
  };

  // Grade badge color schemes (A-D)
  const gradeStyles = {
    A: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      glow: "shadow-emerald-500/10",
    },
    B: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
      badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      glow: "shadow-blue-500/10",
    },
    C: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      glow: "shadow-amber-500/10",
    },
    D: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      text: "text-rose-400",
      badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      glow: "shadow-rose-500/10",
    },
  }[currentGrade] || {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    glow: "shadow-blue-500/10",
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* 1. Readiness Grade & Eligibility Header */}
      <div className={`apple-glass rounded-3xl p-6 sm:p-8 border ${gradeStyles.border} shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Grade Stamp */}
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${gradeStyles.bg} border ${gradeStyles.border} flex flex-col items-center justify-center shrink-0 shadow-lg ${gradeStyles.glow}`}
            >
              <span className={`text-4xl sm:text-5xl font-black ${gradeStyles.text} tracking-tight`}>
                {currentGrade}
              </span>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Readiness Tier
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-bold tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Enterprise ATS Standard
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${gradeStyles.badge}`}>
                  {currentGradeLabel}
                </span>
                {elig.passed ? (
                  <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Eligibility Met
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    Eligibility Flagged
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Overall Candidate Rating: {aiReport.overallScore}/100
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
                {aiReport.summaryVerdict}
              </p>

              <p className="text-[11px] text-neutral-400 pt-1">
                <span className="text-neutral-500">Eligibility check:</span> {elig.details}
              </p>
            </div>
          </div>

              {/* Model / Engine Stamp */}
              <div className="self-end lg:self-center text-right shrink-0 flex flex-col items-end gap-1.5">
                {aiReport.cached && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    Instant Cache (0ms)
                  </span>
                )}
                {aiReport.isRulesOnlyFallback ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                    <Zap className="w-3 h-3 text-amber-400" />
                    Heuristic Rules Engine
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-neutral-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    Groq LPU • AI Tiered Engine
                  </span>
                )}
              </div>
            </div>

            {/* Rate Limit Fair-Usage Alert (if applicable) */}
            {aiReport.rateLimitNotice && (
              <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5 text-xs text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{aiReport.rateLimitNotice}</span>
              </div>
            )}

            {/* Privacy & Compliance Assurance Badge */}
            <div className="mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between flex-wrap gap-2 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Privacy Protected:</strong> Candidate names, emails, phones & handles are stripped before AI evaluation.</span>
              </span>
              <span className="text-[10px] text-neutral-500">
                DPDP Act 2023 & GDPR Compliant • Zero Data Retention
              </span>
            </div>

        {/* 2. Five Pillar Score Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/[0.08]">
          {Object.entries(aiReport.scores).map(([key, item]) => {
            const pct = Math.round((item.score / item.max) * 100);
            return (
              <div
                key={key}
                className="bg-black/30 border border-white/5 rounded-2xl p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-medium text-[11px] truncate">
                    {item.label}
                  </span>
                  <span className="text-white font-bold text-[11px]">
                    {item.score}/{item.max}
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      pct >= 80
                        ? "bg-emerald-500"
                        : pct >= 60
                        ? "bg-blue-500"
                        : pct >= 40
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Missing Critical Skills vs Detected Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Missing Skills */}
        <div className="bg-[#161618] border border-amber-500/20 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Missing Critical Skills for Target Role</span>
          </div>
          <p className="text-xs text-neutral-400">
            Enterprise screeners check for these essential technologies. Add them to your projects or skills list:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {aiReport.missingCriticalSkills && aiReport.missingCriticalSkills.length > 0 ? (
              aiReport.missingCriticalSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium"
                >
                  + {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-500">
                No major skill deficiencies detected!
              </span>
            )}
          </div>
        </div>

        {/* Detected Verified Skills */}
        <div className="bg-[#161618] border border-white/10 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Parsed Verified Tech Stack</span>
          </div>
          <p className="text-xs text-neutral-400">
            Technologies successfully extracted and recognized in your resume:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {aiReport.detectedSkills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-200 text-xs font-medium"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. AI Buzzword Blacklist Detected */}
      {aiReport.aiBuzzwordsFound && aiReport.aiBuzzwordsFound.length > 0 && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">
                AI Buzzwords Flagged ({aiReport.aiBuzzwordsFound.length})
              </p>
              <p className="text-[11px] text-neutral-400">
                Found overused generic filler words:{" "}
                <span className="text-rose-300 font-semibold">
                  {aiReport.aiBuzzwordsFound.join(", ")}
                </span>
                . Replace them with concrete technical verbs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. 1-Click AI Bullet Rewriter (The Flagship Feature) */}
      {aiReport.bulletRewrites && aiReport.bulletRewrites.length > 0 && (
        <div className="bg-[#161618] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  1-Click AI Bullet Rewriter (Google X-Y-Z Formula)
                </h3>
                <p className="text-xs text-neutral-400">
                  Transformed from passive statements into quantifiable engineering achievements
                </p>
              </div>
            </div>
            <span className="text-[11px] text-neutral-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              {aiReport.bulletRewrites.length} Recommendations
            </span>
          </div>

          <div className="space-y-4">
            {aiReport.bulletRewrites.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl space-y-3 transition"
              >
                {/* Original Bullet */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400 uppercase tracking-wider mb-1">
                    <span>Weak / Unquantified Original</span>
                  </div>
                  <p className="text-xs text-neutral-400 line-through decoration-rose-500/40 leading-relaxed font-mono bg-rose-500/5 p-2.5 rounded-xl border border-rose-500/10">
                    &ldquo;{item.originalBullet}&rdquo;
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1 italic">
                    Why recruiters downgrade it: {item.issue}
                  </p>
                </div>

                {/* Rewritten Google X-Y-Z Bullet */}
                <div className="pt-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Google X-Y-Z High-Impact Upgrade
                    </span>
                    <button
                      onClick={() => handleCopyBullet(item.improvedXYZ, idx)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg transition active:scale-95"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-300" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-emerald-400" />
                          <span>Copy Bullet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-emerald-200 leading-relaxed font-mono font-medium">
                    {item.improvedXYZ}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
