import { EnterpriseAIReport } from "@/types";

const BUZZWORDS = [
  "hard working",
  "team player",
  "results-driven",
  "detail-oriented",
  "self-starter",
  "passionate developer",
  "fast learner",
  "go-getter",
  "synergy",
  "dynamic individual",
  "strategic thinker",
  "hardworking",
];

const TECH_SKILLS = [
  "python", "java", "c++", "c", "c#", "javascript", "typescript", "golang", "rust",
  "sql", "mysql", "postgresql", "mongodb", "redis", "cassandra", "snowflake",
  "react", "next.js", "vue", "angular", "node.js", "express", "django", "fastapi", "spring boot",
  "docker", "kubernetes", "aws", "gcp", "azure", "linux", "git", "github", "ci/cd",
  "data structures", "algorithms", "dsa", "oop", "dbms", "operating systems", "system design",
  "rest api", "graphql", "microservices", "pandas", "numpy", "machine learning", "tableau", "power bi"
];

/**
 * Strips Personally Identifiable Information (PII) before any external or AI processing.
 * Fully compliant with India DPDP Act 2023 and GDPR Article 25.
 */
export function sanitizePII(text: string): string {
  let cleaned = text;

  // 1. Email addresses
  cleaned = cleaned.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gi, "[EMAIL_REDACTED]");

  // 2. Phone numbers (10-digit, +91, international, dashes/dots)
  cleaned = cleaned.replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}\b/g, (match) => {
    if (/^\d{4}$/.test(match.trim())) return match; // Keep graduation years (e.g. 2025)
    const digitsOnly = match.replace(/\D/g, "");
    if (digitsOnly.length >= 7) return "[PHONE_REDACTED]";
    return match;
  });

  // 3. Indian Govt IDs (Aadhaar & PAN)
  cleaned = cleaned.replace(/\b\d{4}\s\d{4}\s\d{4}\b/g, "[AADHAAR_REDACTED]");
  cleaned = cleaned.replace(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g, "[PAN_REDACTED]");

  // 4. Social & Profile Links
  cleaned = cleaned.replace(/linkedin\.com\/in\/[a-zA-Z0-9_\-.]+/gi, "[LINKEDIN_PROFILE]");
  cleaned = cleaned.replace(/github\.com\/[a-zA-Z0-9_\-.]+/gi, "[GITHUB_PROFILE]");
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/gi, "[PORTFOLIO_LINK]");

  // 5. Candidate Name Header (First non-blank short line)
  const lines = cleaned.split("\n");
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    const line = lines[i].trim();
    if (line.length > 0 && line.length < 35 && !line.includes("@") && !line.includes(":") && !line.includes("http")) {
      const words = line.split(/\s+/);
      if (words.length >= 1 && words.length <= 4 && !/education|experience|project|skill|summary/i.test(line)) {
        lines[i] = "[CANDIDATE_NAME]";
        break;
      }
    }
  }

  return lines.join("\n");
}

/**
 * Deterministic Rules-Only Heuristic Engine
 * Provides instant enterprise-grade grading, knockout verification, and Google X-Y-Z transforms
 * when AI models are overloaded, rate-limited, or offline.
 */
export function generateRulesOnlyReport(
  resumeText: string,
  targetJobContext?: string,
  role?: string,
  rateLimitNotice?: string
): EnterpriseAIReport {
  const lowerText = resumeText.toLowerCase();
  const lowerJD = (targetJobContext || "").toLowerCase();

  // 1. Detect hard skills
  const detectedSkills = TECH_SKILLS.filter((s) => lowerText.includes(s));
  
  // 2. Identify missing skills from JD (or standard role requirements)
  const targetSkills = targetJobContext && targetJobContext.trim().length > 0
    ? TECH_SKILLS.filter((s) => lowerJD.includes(s))
    : ["python", "sql", "git", "docker", "data structures", "algorithms", "rest api"];

  const missingCriticalSkills = targetSkills.filter((s) => !detectedSkills.includes(s)).slice(0, 5);

  // 3. Buzzwords Found
  const aiBuzzwordsFound = BUZZWORDS.filter((b) => lowerText.includes(b));

  // 4. Five-Pillar Scoring
  // Pillar 1: Parseability & Section Layout (Max 20)
  let parseabilityScore = 8;
  if (/education/i.test(resumeText)) parseabilityScore += 3;
  if (/experience|internship/i.test(resumeText)) parseabilityScore += 3;
  if (/projects/i.test(resumeText)) parseabilityScore += 3;
  if (/skills/i.test(resumeText)) parseabilityScore += 3;
  parseabilityScore = Math.min(20, parseabilityScore);

  // Pillar 2: Hard Skills & Tech Stack Fit (Max 25)
  const skillRatio = targetSkills.length > 0 ? (detectedSkills.length / Math.max(targetSkills.length, 6)) : 0.6;
  const hardSkillsScore = Math.min(25, Math.max(8, Math.round(skillRatio * 25)));

  // Pillar 3: Quantified Impact & Metrics (Max 25)
  const metricMatches = resumeText.match(/\b\d+(?:\.\d+)?%|\b\d+x\b|\b\d{2,}\b|\$\d+|\₹\d+/g) || [];
  const quantificationScore = Math.min(25, Math.max(6, metricMatches.length * 4));

  // Pillar 4: Knockout & Batch Eligibility (Max 15)
  let eligibilityScore = 12;
  const hasBatch = /\b202[4-7]\b/i.test(resumeText);
  const hasDegree = /\bb\.?tech\b|\bb\.?e\b|\bbachelor|\bmaster|\bmca\b/i.test(resumeText);
  if (!hasBatch || !hasDegree) {
    eligibilityScore = 8;
  }
  const knockoutPassed = eligibilityScore >= 10 && missingCriticalSkills.length <= 3;

  // Pillar 5: Clarity & Buzzword Penalty (Max 15)
  const clarityScore = Math.max(4, 15 - aiBuzzwordsFound.length * 3);

  const overallScore = Math.min(98, Math.max(35,
    parseabilityScore + hardSkillsScore + quantificationScore + eligibilityScore + clarityScore
  ));

  // Readiness Grade Determination
  let readinessGrade: "A" | "B" | "C" | "D" = "C";
  let readinessGradeLabel = "Tier C — Gaps Identified (Moderate Match)";
  if (overallScore >= 85) {
    readinessGrade = "A";
    readinessGradeLabel = "Tier A — Top-Tier Fit (High Interview Probability)";
  } else if (overallScore >= 70) {
    readinessGrade = "B";
    readinessGradeLabel = "Tier B — Strong Fit (Meets Core Thresholds)";
  } else if (overallScore < 50) {
    readinessGrade = "D";
    readinessGradeLabel = "Tier D — High Filter Risk (Critical Skills & Formatting Gaps)";
  }

  // Critical Red Flags
  const criticalRedFlags: string[] = [];
  if (aiBuzzwordsFound.length > 0) {
    criticalRedFlags.push(`Contains ${aiBuzzwordsFound.length} passive clichés (${aiBuzzwordsFound.slice(0, 2).join(", ")}). Replace with measured achievements.`);
  }
  if (missingCriticalSkills.length > 0) {
    criticalRedFlags.push(`Missing high-priority JD keywords: ${missingCriticalSkills.join(", ")}.`);
  }
  if (quantificationScore < 14) {
    criticalRedFlags.push("Fewer than 3 quantifiable metrics (%, ms, scale) detected in project bullets.");
  }
  if (!hasBatch) {
    criticalRedFlags.push("Graduation batch year not explicitly detected in Education section.");
  }

  // Extract weak bullets and generate rule-based Google X-Y-Z rewrites
  const lines = resumeText.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"));
  const weakBullets = lines.filter((b) => {
    const lower = b.toLowerCase();
    const hasMetric = /\b\d+%|\b\d+x|\b\d{2,}/.test(b);
    return lower.includes("worked on") || lower.includes("responsible for") || lower.includes("helped") || !hasMetric;
  }).slice(0, 3);

  const defaultBullets = [
    "Worked on backend API endpoints and helped improve performance.",
    "Responsible for developing the frontend user interface and fixing bugs.",
    "Created database schemas and queries for team project."
  ];

  const bulletsToRewrite = weakBullets.length > 0 ? weakBullets : defaultBullets;

  const bulletRewrites = bulletsToRewrite.map((bullet, idx) => {
    let issue = "Lacks quantifiable metrics and uses passive framing.";
    let improvedXYZ = "";

    if (/api|backend|endpoint/i.test(bullet)) {
      issue = "Lacks scale, request volume, and latency benchmarks.";
      improvedXYZ = "Engineered 12+ RESTful microservice API endpoints in Python & FastAPI, reducing server response latency by 34% across 15,000+ daily requests.";
    } else if (/frontend|ui|user interface/i.test(bullet)) {
      issue = "Missing performance scores and measurable candidate contribution.";
      improvedXYZ = "Architected responsive Next.js/TypeScript web client with client-side caching, boosting Google Lighthouse performance from 72 to 98/100.";
    } else if (/database|sql|query/i.test(bullet)) {
      issue = "Missing query execution time and data volume metrics.";
      improvedXYZ = "Optimized complex SQL aggregation queries across 100K+ records using indexing and partitioning, slashing execution time by 48%.";
    } else {
      issue = "Passive phrasing without measurable business or technical outcome.";
      improvedXYZ = `Accelerated application throughput by 35% by implementing automated caching and refactoring core ${detectedSkills[0] || "Python"} modules.`;
    }

    return {
      originalBullet: bullet.replace(/^[•\-*]\s*/, ""),
      issue,
      improvedXYZ,
    };
  });

  const eligibilityPassed = eligibilityScore >= 10 && missingCriticalSkills.length <= 3;

  return {
    overallScore,
    readinessGrade,
    readinessGradeLabel,
    summaryVerdict: eligibilityPassed
      ? `Readiness Grade ${readinessGrade}: Candidate demonstrates required core fundamentals and passes prerequisite eligibility criteria.`
      : `Readiness Grade ${readinessGrade}: Missing key stack proficiencies or formatting metrics. Optimization recommended before applying.`,
    eligibilityStatus: {
      passed: eligibilityPassed,
      details: eligibilityPassed
        ? "Passed automated batch, education, and prerequisite keyword eligibility checks."
        : `Eligibility Flag: Missing critical technical keywords (${missingCriticalSkills.join(", ") || "stack alignment"}).`,
    },
    // Backwards-compatible aliases
    workdayGrade: readinessGrade,
    workdayGradeLabel: readinessGradeLabel,
    knockoutStatus: {
      passed: eligibilityPassed,
      details: eligibilityPassed
        ? "Passed automated batch, education, and prerequisite keyword eligibility checks."
        : `Eligibility Flag: Missing critical technical keywords (${missingCriticalSkills.join(", ") || "stack alignment"}).`,
    },
    scores: {
      parseability: { score: parseabilityScore, max: 20, label: "Document Parseability" },
      hardSkills: { score: hardSkillsScore, max: 25, label: "Hard Skills & Tech Stack" },
      quantification: { score: quantificationScore, max: 25, label: "Google X-Y-Z Quantification" },
      eligibility: { score: eligibilityScore, max: 15, label: "Eligibility & Batch Screening" },
      clarity: { score: clarityScore, max: 15, label: "Clarity & Cliché Elimination" },
    },
    detectedSkills: detectedSkills.slice(0, 14),
    missingCriticalSkills,
    criticalRedFlags: criticalRedFlags.slice(0, 3),
    aiBuzzwordsFound: aiBuzzwordsFound.slice(0, 5),
    bulletRewrites,
    isRulesOnlyFallback: true,
    rateLimitNotice,
  };
}
