export interface Job {
  id: string; // e.g. "101", "102" - used for shortlinks snehal.fyi/j/101
  slug: string; // e.g. "google-associate-cloud-engineer"
  company: string;
  role: string;
  category: "Software" | "Data & AI" | "Core Engineering" | "Internship" | "Non-Tech";
  badge?: "Active" | "Urgent" | "Hot" | "Closing Soon";
  logoBg: string;
  location: string;
  jobType: "Full-Time" | "Internship" | "Remote";
  batch: string[]; // e.g. ["2024", "2025", "2026"]
  salary: string; // e.g. "₹8 - ₹12 LPA" or "₹30,000/month"
  experience: string; // e.g. "Freshers / 0-1 yrs"
  postedDate: string;
  deadline: string;
  applyUrl: string;
  eligibility: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  selectionProcess: string[];
  snehalTips: string;
  featured?: boolean;
  tags: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Resume Tips" | "Interview Prep" | "Cold Email" | "Career Strategy";
  readTime: string;
  date: string;
  content: string; // Markdown or formatted HTML/string
  tags: string[];
}

export interface EnterpriseAIReport {
  overallScore: number;
  workdayGrade: "A" | "B" | "C" | "D";
  workdayGradeLabel: string;
  summaryVerdict: string;
  knockoutStatus: {
    passed: boolean;
    details: string;
  };
  scores: {
    parseability: { score: number; max: number; label: string };
    hardSkills: { score: number; max: number; label: string };
    quantification: { score: number; max: number; label: string };
    eligibility: { score: number; max: number; label: string };
    clarity: { score: number; max: number; label: string };
  };
  detectedSkills: string[];
  missingCriticalSkills: string[];
  criticalRedFlags: string[];
  aiBuzzwordsFound: string[];
  bulletRewrites: Array<{
    originalBullet: string;
    issue: string;
    improvedXYZ: string;
  }>;
  isRulesOnlyFallback?: boolean;
  rateLimitNotice?: string;
  cached?: boolean;
}
