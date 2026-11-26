"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Share2,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Send,
} from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import { analyzeResume, ATSReport } from "@/utils/atsScanner";

export default function ATSCheckerPage() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("sde");
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<ATSReport | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");

  // Sample resume for 1-click test demo
  const sampleResume = `SNEHAL REDDY
Hyderabad, India | +91 9876543210 | snehal@example.com
LinkedIn: linkedin.com/in/snehalreddy | GitHub: github.com/snehalreddy | Portfolio: snehal-fyi.vercel.app

EDUCATION
Anurag University, Hyderabad
Bachelor of Technology in Computer Science & Engineering | CGPA: 8.4/10.0 (2021 – 2025)

TECHNICAL SKILLS
Languages: Python, SQL, Java, TypeScript, C++
Cloud & Data: Snowflake, GCP (Google Cloud Platform), Docker, Git, REST APIs
Core: Data Structures & Algorithms, Database Management Systems (DBMS), Operating Systems

KEY PROJECTS
Real-Time Distributed Pipeline Engine | Next.js, Python, Snowflake
• Architected a real-time data ingestion pipeline processing 50,000+ records per minute with sub-second latency.
• Engineered automated SQL validation queries, reducing data duplication errors by 42%.
• Deployed production service to cloud with 99.9% uptime. Live Demo: https://pipeline-demo.vercel.app

Job Portal & Automation Platform | Next.js, Tailwind CSS, TypeScript
• Developed an automated job board serving 5,000+ college freshers across 2025-2027 batches.
• Optimized search query execution time by 65% utilizing client-side memoized indexes.
• Built end-to-end webhook integration for instant social alerts. Code: github.com/snehalreddy/job-board

EXPERIENCE & LEADERSHIP
Data Engineering Intern | CloudTech Solutions (June 2024 – Nov 2024)
• Automated daily ETL workflows using Python and Snowflake, saving 15 engineering hours weekly.
• Refactored legacy SQL stored procedures, cutting query execution costs by 28%.`;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === "application/pdf") {
      try {
        setIsScanning(true);
        // Load pdfjs-dist dynamically on client
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          fullText += pageText + "\n";
        }

        setResumeText(fullText);
        const result = analyzeResume(fullText, targetRole);
        setReport(result);
      } catch (err) {
        console.error("PDF Parsing error:", err);
        alert("Could not extract text from this PDF. Please copy and paste your resume text into the text box for an instant scan.");
      } finally {
        setIsScanning(false);
      }
    } else {
      // Plain text or markdown
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
        const result = analyzeResume(text, targetRole);
        setReport(result);
      };
      reader.readAsText(file);
    }
  };

  const handleScan = () => {
    if (!resumeText.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      const result = analyzeResume(resumeText, targetRole);
      setReport(result);
      setIsScanning(false);
      // Smooth scroll to report
      window.scrollTo({ top: 400, behavior: "smooth" });
    }, 400);
  };

  const loadSample = () => {
    setResumeText(sampleResume);
    setActiveTab("paste");
    const result = analyzeResume(sampleResume, targetRole);
    setReport(result);
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(sampleResume);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const shareScore = () => {
    if (!report) return;
    const shareUrl = "https://snehal-fyi.vercel.app/ats-checker";
    const text = encodeURIComponent(
      `🎯 I just checked my fresher resume on the free ATS Scanner by @snehal.fyi!\n\n` +
      `📊 My ATS Score: ${report.overallScore}/100 (${report.grade})\n\n` +
      `Test your resume before applying for fresher jobs here 👉 ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="pb-24 pt-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-12 font-sans">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-neutral-300">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>100% Free • Private (Runs in Browser) • No Sign-Up</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          Free ATS Resume Checker
        </h1>

        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Over 75% of fresher resumes get filtered before a recruiter reads them. Audit your resume across 7 key ATS parameters with instant actionable fixes.
        </p>
      </div>

      {/* Main Scanner Card */}
      <div className="apple-glass rounded-3xl p-5 sm:p-8 space-y-6 border border-white/[0.08] shadow-2xl">
        {/* Step 1: Select Target Domain */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
            1. Select Your Target Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "sde", label: "Software Engineer (SDE)" },
              { id: "data", label: "Data Engineer / Analyst" },
              { id: "frontend", label: "Frontend / Web Developer" },
              { id: "general", label: "General Tech & IT" },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setTargetRole(role.id)}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition-all text-center ${
                  targetRole === role.id
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "bg-[#161618] text-neutral-400 hover:text-white border border-white/[0.05]"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Input Tabs (Paste vs Upload) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              2. Add Your Resume Content
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={loadSample}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
              >
                Load Sample 90+ Resume
              </button>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="inline-flex items-center bg-[#161618] p-1 rounded-xl border border-white/[0.06] text-xs font-medium w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("paste")}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg transition-all ${
                activeTab === "paste"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Paste Resume Text
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg transition-all ${
                activeTab === "upload"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Upload PDF / File
            </button>
          </div>

          {activeTab === "paste" ? (
            <textarea
              rows={9}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here (Education, Skills, Projects, Experience)..."
              className="w-full bg-[#121214] border border-white/[0.08] focus:border-white/20 rounded-2xl p-4 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 outline-none leading-relaxed"
            />
          ) : (
            <div className="border-2 border-dashed border-white/[0.1] hover:border-white/25 rounded-2xl p-8 sm:p-12 text-center bg-[#121214]/50 transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-3 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto text-neutral-300">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {fileName ? fileName : "Drop your PDF resume here"}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Supports .pdf and .txt (parsed securely in your browser)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scan Action Button */}
        <div>
          <button
            onClick={handleScan}
            disabled={!resumeText.trim() || isScanning}
            className="w-full bg-white text-black hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed font-semibold py-3.5 px-6 rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing Against 7 ATS Dimensions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Full ATS Audit (Free)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Dashboard Section */}
      {report && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Main Score Hero Card */}
          <div className="apple-glass rounded-3xl p-6 sm:p-10 border border-white/[0.1] shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Left Score Block */}
              <div className="flex items-center gap-6 text-center sm:text-left">
                {/* Big Circular Score Badge */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#141417] border-2 border-white/10 flex flex-col items-center justify-center shadow-inner relative flex-shrink-0">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {report.overallScore}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                    out of 100
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                    ATS Audit Verdict
                  </span>
                  <h2 className={`text-xl sm:text-2xl font-bold ${report.gradeColor} tracking-tight`}>
                    {report.grade}
                  </h2>
                  <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                    Based on 7 parameters: Metrics, Action Verbs, Sections, Technical Keywords, Layout, Bullets, and Live Proof.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <button
                  onClick={shareScore}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition shadow"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </button>
                <a
                  href="https://instagram.com/snehal.fyi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#161618] hover:bg-[#1f1f23] text-white border border-white/10 font-medium text-xs px-4 py-2.5 rounded-full transition"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Follow @snehal.fyi</span>
                </a>
              </div>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 mt-6 border-t border-white/[0.06] text-xs">
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Word Count</span>
                <p className="font-semibold text-white">{report.wordCount} words</p>
              </div>
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Ideal Page Count</span>
                <p className="font-semibold text-white">
                  {report.wordCount > 800 ? "⚠️ Risks 2 Pages" : "✅ 1 Page (Optimal)"}
                </p>
              </div>
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Recruiter Read Time</span>
                <p className="font-semibold text-white">{report.readingTimeMinutes} min scan</p>
              </div>
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Keyword Matches</span>
                <p className="font-semibold text-emerald-400">{report.detectedSkills.length} Tech Skills</p>
              </div>
            </div>
          </div>

          {/* Top Priority Fixes Box */}
          {report.criticalFixes.length > 0 && (
            <div className="apple-card rounded-2xl p-5 sm:p-6 border border-amber-500/30 bg-amber-500/[0.03] space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Top Priority Fixes to Boost Your Score</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
                {report.criticalFixes.map((fix, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed 7 Parameter Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Detailed Breakdown Across 7 Dimensions
            </h3>

            <div className="space-y-3.5">
              {report.parameters.map((param, idx) => (
                <div
                  key={idx}
                  className="apple-card rounded-2xl p-5 space-y-3 border border-white/[0.06]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white text-sm sm:text-base">
                          {param.name}
                        </h4>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            param.status === "excellent"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : param.status === "good"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {param.score} / {param.maxScore} pts
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {param.summary}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        param.status === "excellent"
                          ? "bg-emerald-400"
                          : param.status === "good"
                          ? "bg-blue-400"
                          : "bg-rose-400"
                      }`}
                      style={{
                        width: `${Math.round((param.score / param.maxScore) * 100)}%`,
                      }}
                    />
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    {param.strengths.length > 0 && (
                      <div className="space-y-1.5 bg-emerald-500/[0.03] p-3 rounded-xl border border-emerald-500/10">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          What You Did Well
                        </span>
                        <ul className="space-y-1 text-neutral-300">
                          {param.strengths.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {param.improvements.length > 0 && (
                      <div className="space-y-1.5 bg-rose-500/[0.03] p-3 rounded-xl border border-rose-500/10">
                        <span className="text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
                          <XCircle className="w-3 h-3" />
                          How to Improve
                        </span>
                        <ul className="space-y-1 text-neutral-300">
                          {param.improvements.map((imp, i) => (
                            <li key={i}>• {imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download Free ATS Template CTA */}
          <div className="apple-glass rounded-3xl p-6 sm:p-8 border border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Snehal's Standard 1-Page ATS Resume Template
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-lg">
                  Single-column, zero Canva icons, battle-tested layout engineered to pass Applicant Tracking Systems with 90+ scores.
                </p>
              </div>

              <button
                onClick={copyTemplate}
                className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 font-semibold text-xs px-5 py-2.5 rounded-full transition shadow flex-shrink-0"
              >
                {copiedTemplate ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Template Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Free Template</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
