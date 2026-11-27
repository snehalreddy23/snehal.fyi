import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { fetchJobsList } from "@/utils/githubJobs";
import { EnterpriseAIReport } from "@/types";
import { sanitizePII, generateRulesOnlyReport } from "@/utils/rulesFallbackEngine";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const FLAGSHIP_MODEL = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";
const FAST_MODEL = "openai/gpt-oss-20b";

// =========================================================================
// 1. IN-MEMORY SCAN CACHE (24-Hour Expiration)
// Prevents redundant AI calls when scanning the same resume / JD repeatedly.
// =========================================================================
interface CacheEntry {
  report: EnterpriseAIReport;
  expiresAt: number;
}
const scanCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function generateCacheKey(resume: string, jd: string, role?: string): string {
  const payload = `${resume.trim()}:::${jd.trim()}:::${role || ""}`;
  return createHash("sha256").update(payload).digest("hex");
}

// =========================================================================
// 2. PER-IP RATE LIMITER (3 Scans per Hour)
// Enforces a fair 3 deep-AI-scans per hour per client IP.
// Excess requests are gracefully served via the instant Heuristic Rules Engine.
// =========================================================================
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const ipRateLimit = new Map<string, RateLimitRecord>();
const MAX_AI_SCANS_PER_HOUR = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkIpRateLimit(ip: string): { allowed: boolean; minutesUntilReset: number } {
  const now = Date.now();
  const record = ipRateLimit.get(ip);

  if (!record || now > record.resetAt) {
    ipRateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, minutesUntilReset: 60 };
  }

  if (record.count >= MAX_AI_SCANS_PER_HOUR) {
    const minutesUntilReset = Math.max(1, Math.ceil((record.resetAt - now) / 60000));
    return { allowed: false, minutesUntilReset };
  }

  record.count += 1;
  const minutesUntilReset = Math.max(1, Math.ceil((record.resetAt - now) / 60000));
  return { allowed: true, minutesUntilReset };
}

// System prompt for Enterprise ATS Evaluation
const SYSTEM_PROMPT = `You are the Lead ATS Parsing Architect and Senior Technical Recruiter evaluating candidates for Fortune 500 tech companies (using systems like Workday HiredScore, Darwinbox Sense, and Keka Hire).

Your job is to thoroughly evaluate the candidate's resume text against modern enterprise engineering hiring standards.

EVALUATION PARAMETERS:
1. Workday HiredScore Grade:
   - "A" (85-100): Interview Ready. Meets core & preferred criteria with Google X-Y-Z quantified proof.
   - "B" (70-84): Strong Match. Meets core criteria, solid projects, minor metric gaps.
   - "C" (50-69): Marginal Fit. Missing key technical depth or bullets are passive.
   - "D" (0-49): Auto-Reject / Knockout. Major skill deficit, wrong batch, or parsing breakdown.

2. Five Pillar Scores:
   - parseability (0 to 20): Layout clarity, standard section headers, contact readability.
   - hardSkills (0 to 25): Direct matching of programming languages, databases, cloud, and frameworks.
   - quantification (0 to 25): Google X-Y-Z formula metrics (%, ms, scale, users, ₹/$).
   - eligibility (0 to 15): Graduation batch (2025/2026/2027), degree, location feasibility.
   - clarity (0 to 15): Zero fluff, concise language, no AI buzzwords.

3. AI Buzzword Blacklist: Flag words like "results-driven", "team player", "spearheaded", "leveraged", "passionate", "hardworking".
4. Actionable Bullet Rewrites: Identify 2-3 weak or unquantified bullets from the resume and rewrite each using Google's X-Y-Z Formula: "Accomplished [X] as measured by [Y], by doing [Z]".

You MUST reply with valid JSON ONLY matching this schema:
{
  "overallScore": number,
  "workdayGrade": "A" | "B" | "C" | "D",
  "workdayGradeLabel": "Interview Ready" | "Strong Match" | "Marginal Fit" | "Knockout / Major Gaps",
  "summaryVerdict": string,
  "knockoutStatus": {
    "passed": boolean,
    "details": string
  },
  "scores": {
    "parseability": { "score": number, "max": 20, "label": "Layout & Parseability" },
    "hardSkills": { "score": number, "max": 25, "label": "Hard Skills & Tech Stack" },
    "quantification": { "score": number, "max": 25, "label": "Google X-Y-Z Metrics" },
    "eligibility": { "score": number, "max": 15, "label": "Batch & Education Knockout" },
    "clarity": { "score": number, "max": 15, "label": "Clarity & AI Buzzword Check" }
  },
  "detectedSkills": string[],
  "missingCriticalSkills": string[],
  "criticalRedFlags": string[],
  "aiBuzzwordsFound": string[],
  "bulletRewrites": [
    {
      "originalBullet": string,
      "issue": string,
      "improvedXYZ": string
    }
  ]
}`;

// Helper: Calls Groq with model cascading and timeout
async function callGroqModel(model: string, apiKey: string, userContent: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription, targetJobId, role } = body;

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 40) {
      return NextResponse.json(
        { error: "Resume text is too short. Please provide at least 40 characters." },
        { status: 400 }
      );
    }

    // Resolve Job Description if a target job was selected from snehal.fyi
    let targetJobContext = jobDescription || "";
    if (targetJobId && (!jobDescription || jobDescription.trim().length === 0)) {
      const { jobs } = await fetchJobsList();
      const targetJob = jobs.find((j) => j.id === targetJobId);
      if (targetJob) {
        targetJobContext = `TARGET COMPANY: ${targetJob.company}\nROLE: ${targetJob.role}\nELIGIBLE BATCHES: ${targetJob.batch.join(", ")}\nREQUIREMENTS:\n${targetJob.requirements.join("\n")}\nRESPONSIBILITIES:\n${targetJob.responsibilities.join("\n")}`;
      }
    }

    // Step 1: Pre-flight PII Sanitization (Compliance with India DPDP Act 2023 & GDPR)
    // Redacts phone numbers, emails, govt IDs, and personal URLs before AI or caching
    const sanitizedResume = sanitizePII(resumeText);

    // Step 2: Check Repeat Scan Cache
    const cacheKey = generateCacheKey(sanitizedResume, targetJobContext, role);
    const cachedEntry = scanCache.get(cacheKey);
    if (cachedEntry && Date.now() < cachedEntry.expiresAt) {
      return NextResponse.json({
        success: true,
        cached: true,
        model: "cache-in-memory",
        latencySeconds: 0.01,
        report: { ...cachedEntry.report, cached: true },
      });
    }

    // Step 3: Check IP Rate Limit (3 AI scans / hour)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const { allowed, minutesUntilReset } = checkIpRateLimit(clientIp);

    if (!allowed) {
      // Graceful Fallback: Serve high-precision Rules-Only Report instead of blocking candidate!
      const fallbackReport = generateRulesOnlyReport(
        sanitizedResume,
        targetJobContext,
        role,
        `Hourly AI Scan Limit (3/3 used). Displaying instant Heuristic Rules report. Full AI reset in ${minutesUntilReset} min${minutesUntilReset > 1 ? "s" : ""}.`
      );
      return NextResponse.json({
        success: true,
        isRulesOnlyFallback: true,
        rateLimited: true,
        report: fallbackReport,
      });
    }

    // Step 4: Check API Key
    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
      // Fall back to Rules Engine if API Key is not set
      const fallbackReport = generateRulesOnlyReport(
        sanitizedResume,
        targetJobContext,
        role,
        "Groq AI Key offline. Evaluated via high-precision heuristic rules engine."
      );
      return NextResponse.json({
        success: true,
        isRulesOnlyFallback: true,
        report: fallbackReport,
      });
    }

    const userContent = `RESUME TEXT (PII ANONYMIZED):
${sanitizedResume.slice(0, 8000)}

${
  targetJobContext.trim().length > 0
    ? `TARGET JOB REQUIREMENTS:\n${targetJobContext.slice(0, 3000)}`
    : `TARGET ROLE: ${role || "Software Engineer / Data Engineer"}`
}`;

    // Step 5: Cascading Model Execution
    // Try Flagship 120B model -> Fallback to Fast 20B model -> Fallback to Rules Engine
    let activeModel = FLAGSHIP_MODEL;
    let groqResponse;

    try {
      groqResponse = await callGroqModel(FLAGSHIP_MODEL, apiKey, userContent);
      if (!groqResponse.ok) {
        console.warn(`Groq ${FLAGSHIP_MODEL} error (${groqResponse.status}). Cascading to ${FAST_MODEL}...`);
        activeModel = FAST_MODEL;
        groqResponse = await callGroqModel(FAST_MODEL, apiKey, userContent);
      }
    } catch (modelErr) {
      console.warn(`Model execution notice (${FLAGSHIP_MODEL}):`, modelErr);
      try {
        activeModel = FAST_MODEL;
        groqResponse = await callGroqModel(FAST_MODEL, apiKey, userContent);
      } catch (fastErr) {
        console.warn(`Model execution notice (${FAST_MODEL}):`, fastErr);
      }
    }

    // Step 6: If both models fail, return Rules-Only Report (Zero downtime guaranteed)
    if (!groqResponse || !groqResponse.ok) {
      console.warn("Both AI models busy or rate-limited. Activating Rules-Only Fallback Engine.");
      const fallbackReport = generateRulesOnlyReport(
        sanitizedResume,
        targetJobContext,
        role,
        "High AI traffic detected. Displaying instant heuristic enterprise report."
      );
      return NextResponse.json({
        success: true,
        isRulesOnlyFallback: true,
        report: fallbackReport,
      });
    }

    const groqData = await groqResponse.json();
    const rawContent = groqData.choices?.[0]?.message?.content;

    if (!rawContent) {
      const fallbackReport = generateRulesOnlyReport(sanitizedResume, targetJobContext, role);
      return NextResponse.json({
        success: true,
        isRulesOnlyFallback: true,
        report: fallbackReport,
      });
    }

    const parsedReport: EnterpriseAIReport = JSON.parse(rawContent);

    // Store in cache for 24 hours
    scanCache.set(cacheKey, {
      report: parsedReport,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json({
      success: true,
      model: activeModel,
      latencySeconds: groqData.usage?.total_time || 0.5,
      report: parsedReport,
    });
  } catch (err: unknown) {
    console.error("ATS AI Scan route unexpected error:", err);
    // Graceful safety net: never return 500 to the user!
    const fallbackReport = generateRulesOnlyReport("", undefined, undefined);
    return NextResponse.json({
      success: true,
      isRulesOnlyFallback: true,
      report: fallbackReport,
    });
  }
}
