export interface ParameterResult {
  name: string;
  score: number;
  maxScore: number;
  status: "excellent" | "good" | "needs-work" | "critical";
  summary: string;
  strengths: string[];
  improvements: string[];
}

export interface ATSReport {
  overallScore: number;
  grade: string;
  gradeColor: string;
  wordCount: number;
  readingTimeMinutes: number;
  parameters: ParameterResult[];
  criticalFixes: string[];
  detectedSkills: string[];
  suggestedKeywords: string[];
}

const STRONG_VERBS = [
  "architected", "engineered", "developed", "built", "optimized", "designed",
  "implemented", "spearheaded", "refactored", "automated", "deployed",
  "reduced", "accelerated", "collaborated", "analyzed", "streamlined",
  "debugged", "created", "executed", "orchestrated", "migrated", "configured",
  "integrated", "solved", "formulated", "enhanced", "eliminated", "led"
];

const WEAK_VERBS = [
  "responsible for", "worked on", "helped", "assisted", "handled",
  "participated in", "duties included", "was tasked with", "involved in", "tried"
];

const TECH_KEYWORDS: Record<string, string[]> = {
  general: [
    "python", "java", "c++", "sql", "git", "github", "data structures",
    "algorithms", "oop", "dbms", "operating systems", "linux", "rest api",
    "docker", "cloud", "aws", "gcp", "azure"
  ],
  sde: [
    "dsa", "algorithms", "data structures", "system design", "microservices",
    "unit testing", "ci/cd", "concurrency", "dynamic programming", "sql",
    "java", "c++", "python", "javascript", "typescript", "git", "rest api"
  ],
  frontend: [
    "react", "next.js", "typescript", "javascript", "html5", "css3",
    "tailwind", "redux", "state management", "responsive design", "rest api",
    "ui/ux", "web performance", "webpack", "git"
  ],
  data: [
    "sql", "python", "snowflake", "pandas", "numpy", "power bi", "tableau",
    "etl", "data warehouse", "data pipeline", "machine learning", "excel",
    "statistics", "spark", "bigquery"
  ]
};

export function analyzeResume(text: string, targetRole: string = "general"): ATSReport {
  const lowerText = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const parameters: ParameterResult[] = [];
  const criticalFixes: string[] = [];

  // ==========================================
  // PARAMETER 1: Quantifiable Metrics & Impact (Max: 20)
  // ==========================================
  const metricPatterns = [
    /\b\d+%\b/g, // percentages (e.g. 40%, 15%)
    /\b\d+\s*(?:ms|sec|seconds|minutes|hours|days|weeks|months|years)\b/gi,
    /(?:reduced|increased|improved|cut|saved|boosted|scaled)\s+(?:by\s+)?(?:\d+|[\$₹]\d+)/gi,
    /(?:[\$₹]\s*\d+|\d+\s*(?:lpa|k|m|million|thousand|users|requests|records|queries))/gi,
    /\b(?:top\s*\d+%?|\d+(?:st|nd|rd|th)\s*rank)\b/gi,
  ];

  let detectedMetricsCount = 0;
  const detectedMetrics: string[] = [];

  metricPatterns.forEach((pat) => {
    const matches = text.match(pat);
    if (matches) {
      matches.forEach((m) => {
        if (!detectedMetrics.includes(m.trim())) {
          detectedMetrics.push(m.trim());
          detectedMetricsCount++;
        }
      });
    }
  });

  let metricScore = 0;
  if (detectedMetricsCount >= 4) metricScore = 20;
  else if (detectedMetricsCount === 3) metricScore = 16;
  else if (detectedMetricsCount === 2) metricScore = 12;
  else if (detectedMetricsCount === 1) metricScore = 7;
  else metricScore = 2;

  const metricStrengths: string[] = [];
  const metricImprovements: string[] = [];

  if (detectedMetricsCount >= 3) {
    metricStrengths.push(`Found ${detectedMetricsCount} measurable metrics (${detectedMetrics.slice(0, 3).join(", ")}) demonstrating quantifiable business impact.`);
  } else {
    metricImprovements.push("Use the Google X-Y-Z formula: 'Accomplished [X] as measured by [Y], by doing [Z]'.");
    metricImprovements.push("Add concrete numbers: percentage speed improvements, user scale, lines of code, database query times.");
    criticalFixes.push("Add at least 3-4 quantifiable metrics (% or numbers) in your project bullet points.");
  }

  parameters.push({
    name: "Quantifiable Impact & Metrics",
    score: metricScore,
    maxScore: 20,
    status: metricScore >= 16 ? "excellent" : metricScore >= 11 ? "good" : "critical",
    summary: `${detectedMetricsCount} measurable results detected. Recruiters and ATS rank candidate resumes with quantifiable figures 3x higher.`,
    strengths: metricStrengths,
    improvements: metricImprovements
  });

  // ==========================================
  // PARAMETER 2: Action Verbs & Power Phrasing (Max: 15)
  // ==========================================
  const foundStrongVerbs = STRONG_VERBS.filter((v) => new RegExp(`\\b${v}\\b`, "i").test(lowerText));
  const foundWeakVerbs = WEAK_VERBS.filter((v) => new RegExp(`\\b${v}\\b`, "i").test(lowerText));

  let verbScore = 0;
  if (foundStrongVerbs.length >= 6 && foundWeakVerbs.length === 0) verbScore = 15;
  else if (foundStrongVerbs.length >= 4) verbScore = 12;
  else if (foundStrongVerbs.length >= 2) verbScore = 8;
  else verbScore = 4;

  if (foundWeakVerbs.length > 0) {
    verbScore = Math.max(2, verbScore - (foundWeakVerbs.length * 2));
  }

  const verbStrengths: string[] = [];
  const verbImprovements: string[] = [];

  if (foundStrongVerbs.length > 0) {
    verbStrengths.push(`Strong power verbs detected: ${foundStrongVerbs.slice(0, 5).join(", ")}.`);
  }
  if (foundWeakVerbs.length > 0) {
    verbImprovements.push(`Replace weak/passive verbs (${foundWeakVerbs.join(", ")}) with action verbs like 'Engineered', 'Architected', or 'Automated'.`);
    criticalFixes.push(`Eliminate passive phrasing: replace '${foundWeakVerbs[0]}' with an authoritative action verb.`);
  } else if (foundStrongVerbs.length < 4) {
    verbImprovements.push("Begin every bullet point with a high-impact technical action verb (e.g. 'Optimized', 'Deployed', 'Refactored').");
  }

  parameters.push({
    name: "Action Verbs & Power Words",
    score: verbScore,
    maxScore: 15,
    status: verbScore >= 12 ? "excellent" : verbScore >= 8 ? "good" : "needs-work",
    summary: `${foundStrongVerbs.length} high-impact verbs found. Strong verbs establish ownership and leadership over your code.`,
    strengths: verbStrengths,
    improvements: verbImprovements
  });

  // ==========================================
  // PARAMETER 3: Essential Section Architecture (Max: 15)
  // ==========================================
  const sections = [
    { name: "Education", pat: /\b(education|academic|b\.?tech|degree|university|college)\b/i },
    { name: "Technical Skills", pat: /\b(technical skills|skills|technologies|proficiencies|tools)\b/i },
    { name: "Projects", pat: /\b(projects|academic projects|personal projects|key projects)\b/i },
    { name: "Experience / Training", pat: /\b(experience|internship|work experience|employment|training)\b/i },
    { name: "Contact Details", pat: /[\w\.-]+@[\w\.-]+\.\w+/i }
  ];

  let sectionScore = 0;
  const sectionStrengths: string[] = [];
  const sectionImprovements: string[] = [];

  sections.forEach((sec) => {
    if (sec.pat.test(lowerText)) {
      sectionScore += 3;
      sectionStrengths.push(`Standard '${sec.name}' section detected and parseable.`);
    } else {
      sectionImprovements.push(`Missing or non-standard heading for '${sec.name}'. ATS parsers search specifically for this keyword.`);
      if (sec.name === "Projects" || sec.name === "Technical Skills") {
        criticalFixes.push(`Include a clear '${sec.name}' section header for ATS parsing.`);
      }
    }
  });

  parameters.push({
    name: "Section Architecture & Headers",
    score: sectionScore,
    maxScore: 15,
    status: sectionScore >= 12 ? "excellent" : sectionScore >= 9 ? "good" : "critical",
    summary: `${sectionScore / 3} of 5 essential ATS sections verified. Standardized headings prevent ATS parsing errors.`,
    strengths: sectionStrengths,
    improvements: sectionImprovements
  });

  // ==========================================
  // PARAMETER 4: Technical Keywords & Skill Density (Max: 15)
  // ==========================================
  const targetKeywords = TECH_KEYWORDS[targetRole] || TECH_KEYWORDS.general;
  const detectedSkills: string[] = [];
  const missingKeywords: string[] = [];

  targetKeywords.forEach((kw) => {
    if (lowerText.includes(kw)) {
      detectedSkills.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  let skillScore = 0;
  const skillRatio = detectedSkills.length / targetKeywords.length;
  if (skillRatio >= 0.5) skillScore = 15;
  else if (skillRatio >= 0.35) skillScore = 12;
  else if (skillRatio >= 0.2) skillScore = 8;
  else skillScore = 4;

  parameters.push({
    name: "Technical Keyword Matching",
    score: skillScore,
    maxScore: 15,
    status: skillScore >= 12 ? "excellent" : skillScore >= 8 ? "good" : "needs-work",
    summary: `Found ${detectedSkills.length} relevant technical competencies matching fresher standards.`,
    strengths: detectedSkills.length > 0 ? [`Keywords found: ${detectedSkills.slice(0, 6).join(", ")}`] : [],
    improvements: missingKeywords.length > 0 ? [`Consider naturally incorporating missing keywords: ${missingKeywords.slice(0, 5).join(", ")}.`] : []
  });

  // ==========================================
  // PARAMETER 5: Formatting & ATS Parsing Red Flags (Max: 15)
  // ==========================================
  let formatScore = 15;
  const formatStrengths: string[] = [];
  const formatImprovements: string[] = [];

  // Word count check
  if (wordCount >= 380 && wordCount <= 750) {
    formatStrengths.push(`Ideal 1-page length (${wordCount} words). Fits perfectly within modern recruiter review thresholds.`);
  } else if (wordCount > 850) {
    formatScore -= 5;
    formatImprovements.push(`Resume word count is high (${wordCount} words). Freshers must strictly maintain a 1-page resume.`);
    criticalFixes.push("Trim resume length down to under 700 words to ensure a strict 1-page layout.");
  } else if (wordCount < 250) {
    formatScore -= 7;
    formatImprovements.push(`Resume word count is very low (${wordCount} words). Add detailed descriptions of technical projects and coursework.`);
  }

  // Email & Phone checks
  const hasEmail = /[\w\.-]+@[\w\.-]+\.\w+/.test(text);
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/.test(text);

  if (hasEmail && hasPhone) {
    formatStrengths.push("Valid email and phone contact formats detected.");
  } else {
    formatScore -= 4;
    formatImprovements.push("Ensure your email and contact phone number are clearly displayed at the top header.");
  }

  // Non-ASCII / Weird symbol check
  const weirdCharMatch = text.match(/[★☆✦■●◆▲▼►◄]/g);
  if (weirdCharMatch && weirdCharMatch.length > 5) {
    formatScore -= 3;
    formatImprovements.push("Avoid Canva icon graphics or star rating bars (e.g. 'Java: ★★★★☆'). ATS parsers cannot read symbols.");
  }

  parameters.push({
    name: "ATS Formatting & Layout Safety",
    score: Math.max(2, formatScore),
    maxScore: 15,
    status: formatScore >= 12 ? "excellent" : formatScore >= 9 ? "good" : "critical",
    summary: formatScore >= 12 ? "Clean, single-column friendly text formatting without parser-breaking characters." : "Formatting risks detected that may break automated ATS text extraction.",
    strengths: formatStrengths,
    improvements: formatImprovements
  });

  // ==========================================
  // PARAMETER 6: Readability & Bullet Point Quality (Max: 10)
  // ==========================================
  const bulletLines = text.split("\n").filter((l) => l.trim().startsWith("•") || l.trim().startsWith("-") || l.trim().startsWith("*"));
  let bulletScore = 7;
  const bulletStrengths: string[] = [];
  const bulletImprovements: string[] = [];

  if (bulletLines.length >= 6) {
    bulletScore += 3;
    bulletStrengths.push(`Good bullet density (${bulletLines.length} bullet points detected). Structured bullets are 80% easier to scan.`);
  } else {
    bulletImprovements.push("Break dense text paragraphs into concise 1-2 line bullet points.");
  }

  parameters.push({
    name: "Readability & Bullet Structure",
    score: Math.min(10, bulletScore),
    maxScore: 10,
    status: bulletScore >= 8 ? "excellent" : "needs-work",
    summary: "Clear hierarchical structure ensures human recruiters and ATS bots parse information sequentially.",
    strengths: bulletStrengths,
    improvements: bulletImprovements
  });

  // ==========================================
  // PARAMETER 7: Proof of Work & Live Deployments (Max: 10)
  // ==========================================
  let proofScore = 2;
  const proofStrengths: string[] = [];
  const proofImprovements: string[] = [];

  const hasGitHub = /github\.com/i.test(lowerText);
  const hasLinkedIn = /linkedin\.com/i.test(lowerText);
  const hasLiveLink = /(?:vercel\.app|netlify\.app|herokuapp|render\.com|github\.io|https?:\/\/)/i.test(lowerText);

  if (hasGitHub) {
    proofScore += 3;
    proofStrengths.push("GitHub profile link detected.");
  } else {
    proofImprovements.push("Add your active GitHub profile URL in the contact header.");
  }

  if (hasLinkedIn) {
    proofScore += 2;
    proofStrengths.push("LinkedIn profile link detected.");
  } else {
    proofImprovements.push("Add a customized LinkedIn profile URL.");
  }

  if (hasLiveLink) {
    proofScore += 3;
    proofStrengths.push("Live deployed project links detected (e.g. Vercel / GitHub Pages).");
  } else {
    proofImprovements.push("Include at least ONE live hosted demo URL (Vercel, Netlify, or Render) for your top project.");
    criticalFixes.push("Deploy your best project to Vercel/Render and put the live URL in your resume.");
  }

  parameters.push({
    name: "Proof of Work & Live Links",
    score: Math.min(10, proofScore),
    maxScore: 10,
    status: proofScore >= 8 ? "excellent" : proofScore >= 5 ? "good" : "critical",
    summary: proofScore >= 8 ? "Live verification links present, providing undeniable proof of your technical abilities." : "Missing live links. Recruiters heavily favor freshers who show live code and live demos.",
    strengths: proofStrengths,
    improvements: proofImprovements
  });

  // Calculate total composite score (Sum of all 7 parameters = 100 max)
  const totalScore = parameters.reduce((acc, p) => acc + p.score, 0);

  let grade = "Critical Flaws (High Rejection Risk)";
  let gradeColor = "text-rose-400";
  if (totalScore >= 88) {
    grade = "Top 5% — ATS Interview Ready";
    gradeColor = "text-emerald-400";
  } else if (totalScore >= 72) {
    grade = "Competitive — Minor Polish Needed";
    gradeColor = "text-blue-400";
  } else if (totalScore >= 55) {
    grade = "At Risk — Likely Filtered by ATS";
    gradeColor = "text-amber-400";
  }

  return {
    overallScore: Math.round(totalScore),
    grade,
    gradeColor,
    wordCount,
    readingTimeMinutes: Math.max(1, Math.round(wordCount / 200)),
    parameters,
    criticalFixes: criticalFixes.slice(0, 3),
    detectedSkills: detectedSkills.slice(0, 10),
    suggestedKeywords: missingKeywords.slice(0, 6)
  };
}
