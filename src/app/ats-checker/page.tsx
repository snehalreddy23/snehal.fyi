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
  Share2,
  RefreshCw,
  Copy,
  Check,
  Target,
  ArrowRight,
} from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import {
  analyzeResume,
  analyzeJobMatch,
  ATSReport,
  JobMatchReport,
} from "@/utils/atsScanner";

export default function ATSCheckerPage() {
  // Mode: "general" vs "job-specific"
  const [scannerMode, setScannerMode] = useState<"general" | "job-specific">("general");

  // Inputs
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("sde");
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");

  // Loading & Results
  const [isScanning, setIsScanning] = useState(false);
  const [generalReport, setGeneralReport] = useState<ATSReport | null>(null);
  const [matchReport, setMatchReport] = useState<JobMatchReport | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Sample Resume
  const sampleResume = `SNEHAL REDDY
Hyderabad, India | +91 9876543210 | snehal@example.com
LinkedIn: linkedin.com/in/snehalreddy | GitHub: github.com/snehalreddy | Portfolio: snehal-fyi.vercel.app

EDUCATION
Anurag University, Hyderabad
Bachelor of Technology in Computer Science & Engineering | CGPA: 8.4/10.0 (2021 – 2025)

TECHNICAL SKILLS
Languages: Python, SQL, Java, TypeScript, C++
Cloud & Data: Snowflake, GCP, Docker, Git, REST APIs, Microservices
Core: Data Structures & Algorithms, DBMS, Operating Systems, OOP

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

  // Sample Job Description
  const sampleJD = `Role: Associate Software Engineer / Data Engineer
Company: Leading Tech Enterprise
Eligibility: Batch 2025 / 2026 / 2027 B.Tech in Computer Science or IT. Minimum 60% with no backlogs.

Key Requirements:
• Hands-on proficiency in Python, Java, or C++.
• Strong working knowledge of SQL, Database Management Systems (DBMS), and Data Structures & Algorithms (DSA).
• Familiarity with cloud platforms (AWS, GCP, Snowflake) and Docker containerization.
• Knowledge of Git version control, REST APIs, and microservices architecture.
• Ability to build automated data pipelines or scalable web backend services.`;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === "application/pdf") {
      try {
        setIsScanning(true);
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n";
        }

        setResumeText(fullText);

        if (scannerMode === "general") {
          setGeneralReport(analyzeResume(fullText, targetRole));
        } else if (jobDescription.trim()) {
          setMatchReport(analyzeJobMatch(fullText, jobDescription));
        }
      } catch (err) {
        console.error("PDF Parsing error:", err);
        alert("Could not extract text from this PDF. Please paste your resume text into the text box for an instant scan.");
      } finally {
        setIsScanning(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
        if (scannerMode === "general") {
          setGeneralReport(analyzeResume(text, targetRole));
        } else if (jobDescription.trim()) {
          setMatchReport(analyzeJobMatch(text, jobDescription));
        }
      };
      reader.readAsText(file);
    }
  };

  const runScan = () => {
    if (!resumeText.trim()) return;

    setIsScanning(true);
    setTimeout(() => {
      if (scannerMode === "general") {
        const result = analyzeResume(resumeText, targetRole);
        setGeneralReport(result);
      } else {
        if (!jobDescription.trim()) {
          alert("Please paste the target Job Description to compare your resume against.");
          setIsScanning(false);
          return;
        }
        const match = analyzeJobMatch(resumeText, jobDescription);
        setMatchReport(match);
      }
      setIsScanning(false);
      window.scrollTo({ top: 440, behavior: "smooth" });
    }, 350);
  };

  const loadSampleData = () => {
    setResumeText(sampleResume);
    setActiveTab("paste");
    if (scannerMode === "job-specific") {
      setJobDescription(sampleJD);
      setMatchReport(analyzeJobMatch(sampleResume, sampleJD));
    } else {
      setGeneralReport(analyzeResume(sampleResume, targetRole));
    }
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(sampleResume);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const shareScore = () => {
    const shareUrl = "https://snehal-fyi.vercel.app/ats-checker";
    let scoreText = "";

    if (scannerMode === "general" && generalReport) {
      scoreText = `My Resume Score: ${generalReport.overallScore}/100 (${generalReport.grade})`;
    } else if (scannerMode === "job-specific" && matchReport) {
      scoreText = `My Job Match Score: ${matchReport.matchScore}% (${matchReport.verdict})`;
    }

    const text = encodeURIComponent(
      `🎯 Tested my fresher resume on the free ATS Scanner by @snehal.fyi!\n\n` +
      `📊 ${scoreText}\n\n` +
      `Test your resume before applying for fresher jobs here 👉 ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="pb-24 pt-8 sm:pt-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-10 font-sans">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-neutral-300">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>100% Free • Private Browser-Based • Zero Sign-Up</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          ATS Resume Checker & Job Matcher
        </h1>

        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Audit your resume against core ATS standards or cross-match it directly against any specific Job Description.
        </p>
      </div>

      {/* Mode Selector Segmented Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex items-center bg-[#161618] p-1.5 rounded-2xl border border-white/[0.08] text-xs font-semibold shadow-xl w-full sm:w-auto">
          <button
            onClick={() => {
              setScannerMode("general");
              if (resumeText.trim()) setGeneralReport(analyzeResume(resumeText, targetRole));
            }}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              scannerMode === "general"
                ? "bg-white text-black shadow"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. General ATS Audit</span>
          </button>

          <button
            onClick={() => {
              setScannerMode("job-specific");
              if (resumeText.trim() && jobDescription.trim()) {
                setMatchReport(analyzeJobMatch(resumeText, jobDescription));
              }
            }}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              scannerMode === "job-specific"
                ? "bg-white text-black shadow"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>2. Job-Specific Matcher (JD vs Resume)</span>
          </button>
        </div>
      </div>

      {/* Main Input Form Card */}
      <div className="apple-glass rounded-3xl p-5 sm:p-8 space-y-6 border border-white/[0.08] shadow-2xl">
        {/* If Job-Specific Mode: Show Job Description Input first */}
        {scannerMode === "job-specific" && (
          <div className="space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                <span>Step 1: Paste Target Job Description (JD)</span>
              </label>
              <button
                onClick={loadSampleData}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
              >
                Load Sample JD & Resume
              </button>
            </div>
            <textarea
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description from Google, Amazon, TCS, or LinkedIn here (requirements, qualifications, skills)..."
              className="w-full bg-[#121214] border border-white/[0.08] focus:border-white/20 rounded-2xl p-4 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 outline-none leading-relaxed"
            />
          </div>
        )}

        {/* If General Mode: Role selector */}
        {scannerMode === "general" && (
          <div className="space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                Select Your Target Domain
              </label>
              <button
                onClick={loadSampleData}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
              >
                Load Sample 90+ Resume
              </button>
            </div>
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
        )}

        {/* Resume Input Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              {scannerMode === "job-specific" ? "Step 2: Add Your Resume" : "Paste or Upload Your Resume"}
            </label>
          </div>

          {/* Toggle Tab */}
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
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here (Education, Skills, Projects, Experience)..."
              className="w-full bg-[#121214] border border-white/[0.08] focus:border-white/20 rounded-2xl p-4 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 outline-none leading-relaxed"
            />
          ) : (
            <div className="border-2 border-dashed border-white/[0.1] hover:border-white/25 rounded-2xl p-8 sm:p-10 text-center bg-[#121214]/50 transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-2 pointer-events-none">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto text-neutral-300">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-white">
                  {fileName ? fileName : "Drop your PDF resume here"}
                </p>
                <p className="text-xs text-neutral-500">
                  Supports .pdf and .txt (parsed securely in your browser)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Scan Action Button */}
        <div>
          <button
            onClick={runScan}
            disabled={!resumeText.trim() || isScanning}
            className="w-full bg-white text-black hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed font-semibold py-3.5 px-6 rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>
                  {scannerMode === "general"
                    ? "Auditing Across 7 Dimensions..."
                    : "Cross-Matching Resume Against JD..."}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {scannerMode === "general"
                    ? "Run General ATS Audit (Free)"
                    : "Calculate Match & Keyword Gaps (Free)"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RESULTS: MODE 2 - JOB SPECIFIC MATCHER RESULTS */}
      {/* ========================================================= */}
      {scannerMode === "job-specific" && matchReport && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Match Score Hero Card */}
          <div className="apple-glass rounded-3xl p-6 sm:p-10 border border-white/[0.1] shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 text-center sm:text-left">
                {/* Score Dial */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#141417] border-2 border-white/10 flex flex-col items-center justify-center shadow-inner relative flex-shrink-0">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {matchReport.matchScore}%
                  </span>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                    Relevance
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                    JD Match Verdict
                  </span>
                  <h2 className={`text-xl sm:text-2xl font-bold ${matchReport.verdictColor} tracking-tight`}>
                    {matchReport.verdict}
                  </h2>
                  <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                    Based on keyword density, technical overlap, and qualification matching against the target job.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <button
                  onClick={shareScore}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition shadow"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Result</span>
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

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 mt-6 border-t border-white/[0.06] text-xs">
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Keywords Matched</span>
                <p className="font-semibold text-emerald-400">{matchReport.matchedKeywords.length} Skills</p>
              </div>
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Missing JD Skills</span>
                <p className="font-semibold text-rose-400">{matchReport.missingKeywords.length} Missing</p>
              </div>
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Resume Word Count</span>
                <p className="font-semibold text-white">{matchReport.resumeWordCount} words</p>
              </div>
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">JD Length</span>
                <p className="font-semibold text-white">{matchReport.jdWordCount} words</p>
              </div>
            </div>
          </div>

          {/* Keywords Comparison: Matched vs Missing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Matched Keywords */}
            <div className="apple-card rounded-2xl p-5 space-y-3 border border-emerald-500/20 bg-emerald-500/[0.02]">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Matched Skills in Your Resume ({matchReport.matchedKeywords.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchReport.matchedKeywords.length > 0 ? (
                  matchReport.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                    >
                      ✓ {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500">No direct technical keyword overlap found.</p>
                )}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="apple-card rounded-2xl p-5 space-y-3 border border-rose-500/20 bg-rose-500/[0.02]">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
                <XCircle className="w-4 h-4" />
                <span>Missing Skills Requested by JD ({matchReport.missingKeywords.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchReport.missingKeywords.length > 0 ? (
                  matchReport.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30"
                    >
                      + {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-emerald-400 font-medium">All technical keywords from JD matched!</p>
                )}
              </div>
            </div>
          </div>

          {/* Tailored Recommendations */}
          <div className="apple-card rounded-2xl p-5 sm:p-6 space-y-3 border border-white/[0.08]">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span>Tailoring Recommendations to Pass This Exact JD</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
              {matchReport.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* RESULTS: MODE 1 - GENERAL ATS AUDIT RESULTS (7 DIMS) */}
      {/* ========================================================= */}
      {scannerMode === "general" && generalReport && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Main Score Hero Card */}
          <div className="apple-glass rounded-3xl p-6 sm:p-10 border border-white/[0.1] shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 text-center sm:text-left">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#141417] border-2 border-white/10 flex flex-col items-center justify-center shadow-inner relative flex-shrink-0">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {generalReport.overallScore}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                    out of 100
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                    General ATS Audit Verdict
                  </span>
                  <h2 className={`text-xl sm:text-2xl font-bold ${generalReport.gradeColor} tracking-tight`}>
                    {generalReport.grade}
                  </h2>
                  <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                    Evaluated across 7 foundational dimensions: Metrics, Action Verbs, Sections, Keywords, Layout Safety, Bullets, and Proof of Work.
                  </p>
                </div>
              </div>

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
                <p className="font-semibold text-white">{generalReport.wordCount} words</p>
              </div>
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Ideal Page Count</span>
                <p className="font-semibold text-white">
                  {generalReport.wordCount > 800 ? "⚠️ Risks 2 Pages" : "✅ 1 Page (Optimal)"}
                </p>
              </div>
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Recruiter Read Time</span>
                <p className="font-semibold text-white">{generalReport.readingTimeMinutes} min scan</p>
              </div>
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Keyword Matches</span>
                <p className="font-semibold text-emerald-400">{generalReport.detectedSkills.length} Tech Skills</p>
              </div>
            </div>
          </div>

          {/* Top Priority Fixes Box */}
          {generalReport.criticalFixes.length > 0 && (
            <div className="apple-card rounded-2xl p-5 sm:p-6 border border-amber-500/30 bg-amber-500/[0.03] space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Top Priority Fixes to Boost Your Score</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
                {generalReport.criticalFixes.map((fix, idx) => (
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
              {generalReport.parameters.map((param, idx) => (
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
