"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  RotateCcw,
} from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import { JOBS_DATA } from "@/data/jobs";
import EnterpriseAIGradingView from "@/components/EnterpriseAIGradingView";
import { EnterpriseAIReport } from "@/types";
import {
  analyzeResume,
  analyzeJobMatch,
  ATSReport,
  JobMatchReport,
} from "@/utils/atsScanner";

function ATSCheckerContent() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mode: "general" vs "job-specific"
  const [scannerMode, setScannerMode] = useState<"general" | "job-specific">("general");

  // Inputs
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [targetRole, setTargetRole] = useState("sde");
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPdfParsing, setIsPdfParsing] = useState(false);

  // Loading & Results
  const [isScanning, setIsScanning] = useState(false);
  const [generalReport, setGeneralReport] = useState<ATSReport | null>(null);
  const [matchReport, setMatchReport] = useState<JobMatchReport | null>(null);
  const [aiReport, setAiReport] = useState<EnterpriseAIReport | null>(null);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

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
• Integrated Snowflake Data Cloud for automated partitioned transformations, reducing compute costs by 32%.
• Deployed production service to cloud with 99.9% uptime. Live Demo: https://pipeline-demo.vercel.app

Interactive Fresher Career Portal | Next.js, TypeScript, Tailwind CSS
• Built responsive single-page web application achieving 99/100 Google Lighthouse performance score.
• Engineered client-side text parsing engine processing 10,000+ resume tokens in <200ms with zero server latency.
• Optimized search query execution time by 65% utilizing client-side memoized indexes.

WORK EXPERIENCE / INTERNSHIP
Data Engineering Intern | Snowflake Ecosystem Solutions (Jun 2024 – Nov 2024)
• Built automated SQL queries and ETL pipelines aggregating analytics for 12 enterprise clients.
• Reduced weekly report generation run time from 4 hours to 18 minutes using clustering keys.
• Authored comprehensive developer documentation adopted by team of 8 junior engineers.

CERTIFICATIONS & ACHIEVEMENTS
• Solved 350+ Data Structures problems across LeetCode & GeeksforGeeks
• Top 5% in University Coding Hackathon (out of 450 participants)`;

  const sampleJD = `Google Associate Cloud Engineer (Batch 2025, 2026)
Location: Hyderabad / Bengaluru

About the role:
As an Associate Cloud Engineer, you will deploy applications, monitor operations, and manage enterprise solutions on Google Cloud Platform.

Minimum qualifications:
- Bachelor's degree in Computer Science, IT, or related technical field (Batches 2025 or 2026).
- Experience with one or more general-purpose programming languages: Python, Java, or C++.
- Basic knowledge of Cloud fundamentals (GCP, AWS, or Azure), Docker, Linux, and REST APIs.
- Understanding of networking, databases (SQL, NoSQL), and distributed systems.

Responsibilities:
- Deploy and maintain containerized applications using Docker and Kubernetes.
- Write clean, maintainable automation scripts in Python.
- Monitor cloud performance metrics and troubleshoot system bottlenecks.`;

  // Auto-load job if passed via query param (e.g. /ats-checker?job=google-associate-cloud-engineer)
  useEffect(() => {
    const jobSlug = searchParams.get("job");
    if (jobSlug) {
      const found = JOBS_DATA.find((j) => j.slug === jobSlug || j.id === jobSlug);
      if (found) {
        setSelectedJobId(found.id);
        setScannerMode("job-specific");
        const formattedJd = `${found.company} — ${found.role}\nLocation: ${found.location} | Batches: ${found.batch.join(", ")} | CTC: ${found.salary}\n\nJob Description:\n${found.description}\n\nKey Responsibilities:\n${found.responsibilities.join("\n")}\n\nRequirements & Skills:\n${found.requirements.join("\n")}\n\nEligibility:\n${found.eligibility.join("\n")}`;
        setJobDescription(formattedJd);
        if (resumeText.trim()) {
          setMatchReport(analyzeJobMatch(resumeText, formattedJd));
          executeAiScan(resumeText, formattedJd, targetRole);
        }
      }
    }
  }, [searchParams]);

  const getSessionId = (): string => {
    if (typeof window === "undefined") return "browser_client";
    try {
      let sid = localStorage.getItem("snehal_ats_session_id");
      if (!sid) {
        sid = "sid_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
        localStorage.setItem("snehal_ats_session_id", sid);
      }
      return sid;
    } catch {
      return "browser_client";
    }
  };

  const executeAiScan = async (text: string, jd?: string, role?: string) => {
    if (!text.trim()) return;
    setIsAiScanning(true);
    try {
      const res = await fetch("/api/ats/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": getSessionId(),
        },
        body: JSON.stringify({
          resumeText: text,
          jobDescription: jd && jd.trim().length > 0 ? jd : undefined,
          role: role || targetRole,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setAiReport(data.report);
        }
      }
    } catch (err) {
      console.warn("AI ATS scan notice:", err);
    } finally {
      setIsAiScanning(false);
    }
  };

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    const found = JOBS_DATA.find((j) => j.id === jobId);
    if (found) {
      const jd = `${found.company} — ${found.role}\nLocation: ${found.location} | Batches: ${found.batch.join(", ")} | CTC: ${found.salary}\n\nJob Description:\n${found.description}\n\nKey Responsibilities:\n${found.responsibilities.join("\n")}\n\nRequirements & Skills:\n${found.requirements.join("\n")}\n\nEligibility:\n${found.eligibility.join("\n")}`;
      setJobDescription(jd);
      if (resumeText.trim()) {
        setMatchReport(analyzeJobMatch(resumeText, jd));
        executeAiScan(resumeText, jd, targetRole);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadError(null);

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      setIsPdfParsing(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/ats/parse-pdf", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setUploadError(
            data.error ||
              "Could not extract text from this PDF. Please switch to 'Paste Text' and paste your resume text."
          );
          setActiveTab("paste");
          setIsPdfParsing(false);
          return;
        }

        const extractedText = data.text;
        setResumeText(extractedText);
        setActiveTab("paste"); // Switch to paste tab so the user can verify their extracted text!
        setIsPdfParsing(false);

        // Run scans automatically
        setIsScanning(true);
        if (scannerMode === "general") {
          setGeneralReport(analyzeResume(extractedText, targetRole));
          executeAiScan(extractedText, undefined, targetRole);
        } else if (jobDescription.trim()) {
          setMatchReport(analyzeJobMatch(extractedText, jobDescription));
          executeAiScan(extractedText, jobDescription, targetRole);
        }
        setIsScanning(false);
      } catch (err) {
        console.error("PDF upload error:", err);
        setUploadError(
          "Network error while parsing PDF. Please switch to 'Paste Text' and paste your resume text directly."
        );
        setActiveTab("paste");
        setIsPdfParsing(false);
      }
    } else {
      // Plain text or markdown
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || "";
        setResumeText(text);
        setActiveTab("paste");
        if (scannerMode === "general") {
          setGeneralReport(analyzeResume(text, targetRole));
          executeAiScan(text, undefined, targetRole);
        } else if (jobDescription.trim()) {
          setMatchReport(analyzeJobMatch(text, jobDescription));
          executeAiScan(text, jobDescription, targetRole);
        }
      };
      reader.onerror = () => {
        setUploadError("Could not read file. Please paste your resume text directly.");
        setActiveTab("paste");
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
        executeAiScan(resumeText, undefined, targetRole);
      } else {
        if (!jobDescription.trim()) {
          alert("Please paste the target Job Description to compare your resume against.");
          setIsScanning(false);
          return;
        }
        const match = analyzeJobMatch(resumeText, jobDescription);
        setMatchReport(match);
        executeAiScan(resumeText, jobDescription, targetRole);
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
      executeAiScan(sampleResume, sampleJD, targetRole);
    } else {
      setGeneralReport(analyzeResume(sampleResume, targetRole));
      executeAiScan(sampleResume, undefined, targetRole);
    }
  };

  const clearAll = () => {
    setResumeText("");
    setJobDescription("");
    setSelectedJobId("");
    setFileName(null);
    setUploadError(null);
    setIsPdfParsing(false);
    setGeneralReport(null);
    setMatchReport(null);
    setAiReport(null);
    setIsAiScanning(false);
    setCopiedPrompt(false);
    setCopiedReport(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyChatGptPrompt = () => {
    let prompt = "";
    if (scannerMode === "job-specific" && matchReport) {
      prompt = `═══════════════════════════════════════════════════════════════
🤖 SNEHAL.FYI ATS OPTIMIZER & RE-ENGINEERING DIRECTIVE
═══════════════════════════════════════════════════════════════
ACT AS:
A Principal Technical Recruiter & Senior Hiring Bar Raiser at a FAANG / Tier-1 Tech Company who has screened 25,000+ software engineering resumes. You have a zero-tolerance policy for generic buzzwords, unquantified claims, and ATS formatting flaws.

MISSION:
Transform the attached fresher resume into an ATS-optimized single-column document engineered to align with Workday, Greenhouse, and Taleo standards and maximize interview callback chances for this exact opening.

═══════════════════════════════════════════════════════════════
📊 REAL-TIME ATS AUDIT DIAGNOSTICS (FROM SNEHAL.FYI):
═══════════════════════════════════════════════════════════════
• Current Match Score: ${matchReport.matchScore}% (${matchReport.verdict})
• Matched Technical Keywords: ${matchReport.matchedKeywords.join(", ") || "None"}
• 🚨 CRITICAL MISSING KEYWORDS (Must naturally incorporate):
  ${matchReport.missingKeywords.join(", ") || "None"}
• Audit Recommendations:
${matchReport.recommendations.map((r) => `  - ${r}`).join("\n")}

═══════════════════════════════════════════════════════════════
🎯 TARGET JOB DESCRIPTION:
═══════════════════════════════════════════════════════════════
${jobDescription.trim()}

═══════════════════════════════════════════════════════════════
📄 CANDIDATE CURRENT RESUME:
═══════════════════════════════════════════════════════════════
${resumeText.trim()}

═══════════════════════════════════════════════════════════════
⚡ STRICT RE-ENGINEERING RULES (FOLLOW TO THE LETTER):
═══════════════════════════════════════════════════════════════
1. ZERO HALLUCINATION & REALISTIC CLAIMS:
   - Do NOT invent companies, college degrees, or fabricated tools the candidate didn't use.
   - Weave the MISSING KEYWORDS (${matchReport.missingKeywords.slice(0, 8).join(", ")}) into relevant projects where technically plausible (e.g., adding Docker containerization, REST API optimization, unit testing, SQL indexing).

2. BANNED AI BUZZWORDS (STRICT BLACKLIST):
   - Never use: "Spearheaded", "Leveraged", "Utilized", "Passionate", "Dynamic", "Synergistic", "Hardworking", "Fast-paced", "Helped", "Assisted".
   - Replace with hard engineering action verbs: "Architected", "Engineered", "Benchmarked", "Refactored", "Containerized", "Automated", "Deployed", "Reduced", "Optimized".

3. GOOGLE'S STRICT X-Y-Z FORMULA FOR EVERY BULLET:
   - Format: "Accomplished [X] as measured by [Y], by doing [Z]"
   - Every single project bullet MUST have a realistic, defendable fresher metric:
     * Latency reduction (e.g., "cut API response time by 42% from 380ms to 220ms")
     * Throughput / scale (e.g., "handling 5,000+ simulated concurrent requests")
     * Efficiency (e.g., "reduced cloud compute cost by 32% through payload compression")
     * Database performance (e.g., "indexed 4 SQL tables reducing full-table scan times by 65%")

4. SINGLE-PAGE ATS LAYOUT COMPLIANCE:
   - Output must be 100% single-column, standard plain text.
   - Max 3-4 high-impact bullets per project.
   - Max 1 page when pasted into standard Word/Docs (10pt font, 0.5" margins).

═══════════════════════════════════════════════════════════════
🚀 REQUIRED OUTPUT FORMAT (DO NOT DEVIATE):
═══════════════════════════════════════════════════════════════
Output in 3 clearly separated sections:

SECTION 1: THE 3 BIGGEST RED FLAGS FIXED
(Brief 3-bullet diagnosis explaining what was hurting this resume's ATS score).

SECTION 2: COMPLETE READY-TO-PASTE ATS RESUME
(Provide the full, beautifully formatted plain-text resume from Contact Header to Technical Skills, Projects, Experience, and Education, with all missing keywords seamlessly embedded).

SECTION 3: INTERVIEW DEFENSE TALKING POINTS
(For the 3 biggest metrics you introduced, give the candidate a 2-sentence script explaining exactly how to defend the number in a live technical interview if asked "How did you measure this 35% improvement?").`;
    } else if (generalReport) {
      prompt = `═══════════════════════════════════════════════════════════════
🤖 SNEHAL.FYI GENERAL ATS RESUME ELEVATION DIRECTIVE
═══════════════════════════════════════════════════════════════
ACT AS:
A Principal Technical Recruiter & Senior Hiring Bar Raiser at a Tier-1 Tech Company.

MISSION:
Audit and completely re-engineer this fresher resume into an elite, ATS 95+ score single-column document optimized for ${targetRole.toUpperCase()} campus and off-campus placement drives.

═══════════════════════════════════════════════════════════════
📊 SNEHAL.FYI ATS DIAGNOSTICS:
═══════════════════════════════════════════════════════════════
• Current Score: ${generalReport.overallScore}/100 (${generalReport.grade})
• Critical Priority Red Flags:
${generalReport.criticalFixes.map((f: string) => `  - ${f}`).join("\n")}
• Detailed 7-Parameter Evaluation:
${generalReport.parameters.map((p) => `  - ${p.name}: ${p.score}/${p.maxScore} (${p.status}) → ${p.summary}`).join("\n")}
• Detected Skills: ${generalReport.detectedSkills.join(", ") || "None"}
• High-Priority Missing Skills for ${targetRole.toUpperCase()}: ${generalReport.suggestedKeywords.join(", ") || "None"}

═══════════════════════════════════════════════════════════════
📄 CANDIDATE CURRENT RESUME:
═══════════════════════════════════════════════════════════════
${resumeText.trim()}

═══════════════════════════════════════════════════════════════
⚡ STRICT RE-ENGINEERING RULES:
═══════════════════════════════════════════════════════════════
1. ZERO HALLUCINATION: Maintain true technical integrity without fabricating false company roles.
2. BANNED AI BUZZWORDS: Zero tolerance for "Spearheaded", "Leveraged", "Utilized", "Passionate", "Dynamic", "Synergistic".
3. GOOGLE X-Y-Z FORMULA: "Accomplished [X] as measured by [Y], by doing [Z]" with measurable performance metrics, latency drops, database optimizations, or scale.
4. STRICT 1-PAGE SINGLE COLUMN: Top-to-bottom hierarchy (Header → Education → Skills → Projects → Experience → Certifications).

═══════════════════════════════════════════════════════════════
🚀 REQUIRED OUTPUT FORMAT:
═══════════════════════════════════════════════════════════════
SECTION 1: THE 3 BIGGEST RED FLAGS ELIMINATED
SECTION 2: COMPLETE READY-TO-PASTE RE-ENGINEERED RESUME
SECTION 3: METRIC DEFENSE SCRIPTS (How to defend each percentage/number in a live interview).`;
    }

    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 5000);
    }
  };

  const copyReportSummary = () => {
    let reportText = "";
    if (scannerMode === "job-specific" && matchReport) {
      reportText = `snehal.fyi Job Match ATS Report\nOverall Match: ${matchReport.matchScore}% (${matchReport.verdict})\nMatched Skills: ${matchReport.matchedKeywords.join(", ")}\nMissing Skills: ${matchReport.missingKeywords.join(", ")}\n\nRecommendations:\n${matchReport.recommendations.join("\n")}`;
    } else if (generalReport) {
      reportText = `snehal.fyi General ATS Audit Report\nOverall Score: ${generalReport.overallScore}/100 (${generalReport.grade})\n\nParameters Breakdown:\n${generalReport.parameters.map((p) => `- ${p.name}: ${p.score}/${p.maxScore} (${p.status})`).join("\n")}\n\nCritical Priority Fixes:\n${generalReport.criticalFixes.join("\n")}\n\nDetected Skills: ${generalReport.detectedSkills.join(", ")}`;
    }
    if (reportText) {
      navigator.clipboard.writeText(reportText);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2500);
    }
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
          <div className="space-y-2.5 animate-in fade-in duration-300">
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
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description from Google, Amazon, TCS, or LinkedIn here (requirements, qualifications, skills)..."
              className="w-full bg-[#121214] border border-white/[0.08] focus:border-white/20 rounded-2xl p-4 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 outline-none leading-relaxed"
            />

            {/* Quick Load live jobs from snehal.fyi */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-neutral-400">Quick-load opening:</span>
              {JOBS_DATA.map((job) => {
                const isSelected = selectedJobId === job.id;
                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => handleSelectJob(job.id)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                      isSelected
                        ? "bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold"
                        : "bg-white/[0.05] hover:bg-white/10 text-neutral-300 hover:text-white border border-white/[0.08]"
                    }`}
                  >
                    <span className="font-medium text-white">{job.company}</span>
                    <span className="text-neutral-400">({job.role.split(" ")[0]})</span>
                  </button>
                );
              })}
            </div>
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

        {/* Resume Input Area */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
              {scannerMode === "job-specific" ? "Step 2: " : ""}Upload or Paste Your Resume
            </label>

            <div className="flex items-center gap-2">
              {(resumeText || fileName || generalReport || matchReport) && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-rose-400 transition px-2.5 py-1 rounded-lg hover:bg-rose-500/10"
                  title="Clear resume input and scan results"
                >
                  <RotateCcw className="w-3 h-3 text-rose-400" />
                  <span>Clear All</span>
                </button>
              )}

              {/* Sub-tabs: Paste vs Upload */}
              <div className="inline-flex items-center bg-[#161618] p-1 rounded-xl border border-white/[0.06] text-xs font-medium w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab("paste")}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg transition ${
                    activeTab === "paste"
                      ? "bg-white/10 text-white font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Paste Text
                </button>
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg transition ${
                    activeTab === "upload"
                      ? "bg-white/10 text-white font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Upload PDF
                </button>
              </div>
            </div>
          </div>

          {/* Upload Error Alert Callout (if unreadable or scanned PDF) */}
          {uploadError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-center justify-between text-xs text-rose-300 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{uploadError}</span>
              </div>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="text-neutral-400 hover:text-white px-2 py-0.5 text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}

          {activeTab === "paste" ? (
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste the full text of your resume here (Education, Skills, Projects, Experience, Links)..."
              className="w-full bg-[#121214] border border-white/[0.08] focus:border-white/20 rounded-2xl p-4 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 outline-none leading-relaxed"
            />
          ) : (
            <div className="border border-dashed border-white/15 hover:border-white/30 rounded-2xl p-8 sm:p-12 text-center transition bg-[#121214] space-y-3">
              {isPdfParsing ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                  <div>
                    <p className="text-sm font-semibold text-white">Extracting text from PDF...</p>
                    <p className="text-xs text-neutral-400 mt-0.5">Reading layout and text streams safely</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-neutral-300">
                    <Upload className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {fileName ? fileName : "Upload your resume PDF"}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Private & secure. Text is processed in-memory with personal contact details stripped.
                    </p>
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition shadow">
                      <span>Browse PDF</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Scan Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
          <p className="text-neutral-500 text-[11px] text-center sm:text-left">
            Privacy-First Design: In-memory evaluation with automated personal data protection.
          </p>

          <button
            onClick={runScan}
            disabled={isScanning || !resumeText.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs sm:text-sm px-7 py-3 rounded-full transition shadow-lg active:scale-95"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running ATS Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>
                  {scannerMode === "job-specific"
                    ? "Calculate Job Match & Skills Gap"
                    : "Audit My Resume Now"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Enterprise ATS Readiness & Eligibility Engine */}
      {(aiReport || isAiScanning) && (
        <EnterpriseAIGradingView
          aiReport={aiReport}
          isAiScanning={isAiScanning}
          targetRoleName={
            scannerMode === "job-specific"
              ? "Target Job Match & Role Fit"
              : targetRole === "sde"
              ? "Software Development Engineer"
              : targetRole === "data"
              ? "Data Engineer & Analyst"
              : targetRole === "frontend"
              ? "Frontend Engineer"
              : "General Tech & IT"
          }
        />
      )}

      {/* ============================================================ */}
      {/* JOB-SPECIFIC REPORT OUTPUT */}
      {/* ============================================================ */}
      {scannerMode === "job-specific" && matchReport && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Score Hero */}
          <div className="apple-glass rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                {/* Match Ring */}
                <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={
                        matchReport.matchScore >= 80
                          ? "#10b981"
                          : matchReport.matchScore >= 60
                          ? "#3b82f6"
                          : "#f43f5e"
                      }
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 40 * (1 - matchReport.matchScore / 100)
                      }`}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-white">
                      {matchReport.matchScore}%
                    </span>
                    <span className="text-[10px] text-neutral-400 uppercase font-medium">
                      JD Match
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                    <Target className="w-3.5 h-3.5" />
                    <span>Cross-Match Analysis</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {matchReport.verdict}
                  </h2>
                  <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                    Based on keyword density, technical overlap, and qualification matching against the target job.
                  </p>
                </div>
              </div>

              {/* Action Buttons: AI Prompt + Report Copy + Clear + Share */}
              <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto justify-center sm:justify-end">
                  <button
                    onClick={copyChatGptPrompt}
                    className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-full transition shadow-md active:scale-95"
                    title="Copies a Bar-Raiser engineered prompt with rules & defense scripts for ChatGPT/Claude"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Sparkles className="w-3.5 h-3.5 text-blue-200" />}
                    <span>{copiedPrompt ? "God-Mode Prompt Copied!" : "Copy God-Mode ChatGPT Prompt"}</span>
                  </button>

                  <button
                    onClick={copyReportSummary}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#161618] hover:bg-[#1f1f23] text-neutral-200 border border-white/10 font-medium text-xs px-3.5 py-2.5 rounded-full transition active:scale-95"
                  >
                    {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedReport ? "Copied!" : "Copy Report"}</span>
                  </button>

                  <button
                    onClick={() => {
                      clearAll();
                      window.scrollTo({ top: 220, behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#161618] hover:bg-rose-500/10 hover:border-rose-500/30 text-neutral-300 hover:text-rose-300 border border-white/10 font-medium text-xs px-3.5 py-2.5 rounded-full transition active:scale-95"
                    title="Clear resume and start fresh"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Clear</span>
                  </button>

                  <button
                    onClick={shareScore}
                    className="inline-flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-xs px-3.5 py-2.5 rounded-full transition active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>

                {copiedPrompt && (
                  <div className="flex items-center gap-2 text-[11px] text-neutral-300 animate-in fade-in duration-200 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full">
                    <span className="text-neutral-400">Ready to paste into:</span>
                    <a
                      href="https://chatgpt.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline font-medium"
                    >
                      ChatGPT ↗
                    </a>
                    <span className="text-neutral-600">•</span>
                    <a
                      href="https://claude.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline font-medium"
                    >
                      Claude ↗
                    </a>
                  </div>
                )}
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
                <span>Matched Technical Keywords ({matchReport.matchedKeywords.length})</span>
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
                  <p className="text-xs text-neutral-400">No overlapping technical skills detected.</p>
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

          {/* Want Us to Personally Tailor Your Resume? CTA */}
          <div className="apple-glass rounded-3xl p-6 sm:p-8 border border-blue-500/30 bg-blue-500/[0.03] space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-on-1 Personalized Optimization</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Want Us to Personally Tailor Your Resume for This Role?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Have your resume reviewed & matched to this exact Job Description by <strong className="text-white font-medium">Snehal Reddy</strong> (Data Engineer @ Snowflake). We incorporate relevant missing skills naturally, rewrite your bullets with quantifiable impact, and optimize for top ATS performance.
                </p>
                <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-400">
                  <span className="flex items-center gap-1 text-neutral-300">✓ Targeted JD Keyword Alignment</span>
                  <span className="flex items-center gap-1 text-neutral-300">✓ Google X-Y-Z Bullet Phrasing</span>
                  <span className="flex items-center gap-1 text-neutral-300">✓ Delivered in 24–48 Hours</span>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                    Fresher Student Price
                  </span>
                  <span className="text-2xl font-extrabold text-white">₹299</span>
                  <span className="text-xs text-neutral-500 line-through ml-2">₹999</span>
                </div>
                <a
                  href="https://forms.gle/example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 font-semibold text-xs px-6 py-3 rounded-full transition shadow-lg w-full sm:w-auto active:scale-95"
                >
                  <span>Request Tailoring (Google Form)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Clear & Scan Another Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                clearAll();
                window.scrollTo({ top: 220, behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#161618] hover:bg-rose-500/10 hover:border-rose-500/30 text-neutral-300 hover:text-rose-300 border border-white/10 font-semibold text-xs px-6 py-3 rounded-full transition active:scale-95 shadow"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear Resume & Scan Another</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* GENERAL ATS AUDIT REPORT OUTPUT */}
      {/* ============================================================ */}
      {scannerMode === "general" && generalReport && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Score Hero Card */}
          <div className="apple-glass rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                {/* Score Gauge */}
                <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={
                        generalReport.overallScore >= 80
                          ? "#10b981"
                          : generalReport.overallScore >= 60
                          ? "#3b82f6"
                          : "#f43f5e"
                      }
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 40 * (1 - generalReport.overallScore / 100)
                      }`}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-white">
                      {generalReport.overallScore}
                    </span>
                    <span className="text-[10px] text-neutral-400 uppercase font-medium">
                      out of 100
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        generalReport.overallScore >= 80
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : generalReport.overallScore >= 60
                          ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                          : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                      }`}
                    >
                      Grade: {generalReport.grade}
                    </span>
                    <span className="text-xs text-neutral-400">
                      Target: {targetRole.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {generalReport.overallScore >= 80
                      ? "Top 5% — ATS Interview Ready"
                      : generalReport.overallScore >= 60
                      ? "Competitive — Minor Polish Needed"
                      : "Critical Fixes Required to Pass ATS"}
                  </h2>
                  <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                    Evaluated across 7 core Applicant Tracking System parameters.
                  </p>
                </div>
              </div>

              {/* Action Buttons: AI Prompt + Report Copy + Clear + Share */}
              <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto justify-center sm:justify-end">
                  <button
                    onClick={copyChatGptPrompt}
                    className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-full transition shadow-md active:scale-95"
                    title="Copies a Bar-Raiser engineered prompt with rules & defense scripts for ChatGPT/Claude"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Sparkles className="w-3.5 h-3.5 text-blue-200" />}
                    <span>{copiedPrompt ? "God-Mode Prompt Copied!" : "Copy God-Mode ChatGPT Prompt"}</span>
                  </button>

                  <button
                    onClick={copyReportSummary}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#161618] hover:bg-[#1f1f23] text-neutral-200 border border-white/10 font-medium text-xs px-3.5 py-2.5 rounded-full transition active:scale-95"
                  >
                    {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedReport ? "Copied!" : "Copy Report"}</span>
                  </button>

                  <button
                    onClick={() => {
                      clearAll();
                      window.scrollTo({ top: 220, behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#161618] hover:bg-rose-500/10 hover:border-rose-500/30 text-neutral-300 hover:text-rose-300 border border-white/10 font-medium text-xs px-3.5 py-2.5 rounded-full transition active:scale-95"
                    title="Clear resume and start fresh"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Clear</span>
                  </button>

                  <button
                    onClick={shareScore}
                    className="inline-flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-xs px-3.5 py-2.5 rounded-full transition active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>

                {copiedPrompt && (
                  <div className="flex items-center gap-2 text-[11px] text-neutral-300 animate-in fade-in duration-200 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full">
                    <span className="text-neutral-400">Ready to paste into:</span>
                    <a
                      href="https://chatgpt.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline font-medium"
                    >
                      ChatGPT ↗
                    </a>
                    <span className="text-neutral-600">•</span>
                    <a
                      href="https://claude.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline font-medium"
                    >
                      Claude ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 mt-6 border-t border-white/[0.06] text-xs">
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Word Count</span>
                <p className="font-semibold text-white">{generalReport.wordCount} words</p>
              </div>
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Reading Time</span>
                <p className="font-semibold text-emerald-400">~{generalReport.readingTimeMinutes} min</p>
              </div>
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Detected Skills</span>
                <p className="font-semibold text-blue-400">{generalReport.detectedSkills.length} Found</p>
              </div>
              <div className="apple-card p-3 rounded-xl">
                <span className="text-neutral-500 text-[11px] block">Missing Skills</span>
                <p className="font-semibold text-rose-400">{generalReport.suggestedKeywords.length} Recommended</p>
              </div>
            </div>
          </div>

          {/* Top Priority Action Items */}
          {generalReport.criticalFixes.length > 0 && (
            <div className="apple-card rounded-2xl p-5 sm:p-6 space-y-3 border border-rose-500/20 bg-rose-500/[0.02]">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Priority Action Items to Beat ATS Filters</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
                {generalReport.criticalFixes.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed 7-Parameter Breakdown Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
              7-Dimension ATS Evaluation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {generalReport.parameters.map((param) => (
                <div
                  key={param.name}
                  className="apple-card p-4 sm:p-5 rounded-2xl space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{param.name}</span>
                      <span
                        className={`text-xs font-bold ${
                          param.score / param.maxScore >= 0.8
                            ? "text-emerald-400"
                            : param.score / param.maxScore >= 0.5
                            ? "text-blue-400"
                            : "text-rose-400"
                        }`}
                      >
                        {param.score}/{param.maxScore}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          param.score / param.maxScore >= 0.8
                            ? "bg-emerald-500"
                            : param.score / param.maxScore >= 0.5
                            ? "bg-blue-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${(param.score / param.maxScore) * 100}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">{param.summary}</p>

                  {param.improvements.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.05] text-[11px] text-neutral-400 flex items-start gap-1">
                      <span className="text-rose-400 flex-shrink-0">Fix:</span>
                      <span>{param.improvements[0]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Want Us to Personally Tailor Your Resume? CTA */}
          <div className="apple-glass rounded-3xl p-6 sm:p-8 border border-blue-500/30 bg-blue-500/[0.03] space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-on-1 Personalized Optimization</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Want Us to Personally Tailor Your Resume?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Get your resume reviewed & optimized by <strong className="text-white font-medium">Snehal Reddy</strong> (Data Engineer @ Snowflake). We rewrite your project bullets using the Google X-Y-Z formula, eliminate ATS parsing pitfalls, and maximize your interview callback rate.
                </p>
                <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-400">
                  <span className="flex items-center gap-1 text-neutral-300">✓ 1-Page ATS Single Column</span>
                  <span className="flex items-center gap-1 text-neutral-300">✓ Google X-Y-Z Bullet Phrasing</span>
                  <span className="flex items-center gap-1 text-neutral-300">✓ Delivered in 24–48 Hours</span>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                    Fresher Student Price
                  </span>
                  <span className="text-2xl font-extrabold text-white">₹299</span>
                  <span className="text-xs text-neutral-500 line-through ml-2">₹999</span>
                </div>
                <a
                  href="https://forms.gle/example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 font-semibold text-xs px-6 py-3 rounded-full transition shadow-lg w-full sm:w-auto active:scale-95"
                >
                  <span>Request Tailoring (Google Form)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Clear & Scan Another Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                clearAll();
                window.scrollTo({ top: 220, behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#161618] hover:bg-rose-500/10 hover:border-rose-500/30 text-neutral-300 hover:text-rose-300 border border-white/10 font-semibold text-xs px-6 py-3 rounded-full transition active:scale-95 shadow"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear Resume & Scan Another</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ATSCheckerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center text-xs text-neutral-400">
          Loading ATS Scanner...
        </div>
      }
    >
      <ATSCheckerContent />
    </Suspense>
  );
}
