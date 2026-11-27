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
// 2. DUAL-KEY RATE LIMITER (Session + Campus NAT IP Protection)
// Enforces 5 deep AI scans per hour per candidate session.
// College Wi-Fi / hostel NAT sharing a single public IP allows up to 50 scans/hr,
// so multiple students on the same campus router are never blocked by each other.
// =========================================================================
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const sessionRateLimit = new Map<string, RateLimitRecord>();
const ipRateLimit = new Map<string, RateLimitRecord>();
const MAX_SCANS_PER_SESSION = 5;
const MAX_SCANS_PER_IP = 50; // High ceiling for campus NAT / college Wi-Fi
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkDualRateLimit(sessionId: string, clientIp: string): { allowed: boolean; minutesUntilReset: number } {
  const now = Date.now();

  // 1. Check Session Rate Limit
  const sessRecord = sessionRateLimit.get(sessionId);
  if (!sessRecord || now > sessRecord.resetAt) {
    sessionRateLimit.set(sessionId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else if (sessRecord.count >= MAX_SCANS_PER_SESSION) {
    const minutesUntilReset = Math.max(1, Math.ceil((sessRecord.resetAt - now) / 60000));
    return { allowed: false, minutesUntilReset };
  } else {
    sessRecord.count += 1;
  }

  // 2. Check Global IP Safety Valve (prevents bot scraping while allowing campus NAT)
  const ipRecord = ipRateLimit.get(clientIp);
  if (!ipRecord || now > ipRecord.resetAt) {
    ipRateLimit.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else if (ipRecord.count >= MAX_SCANS_PER_IP) {
    const minutesUntilReset = Math.max(1, Math.ceil((ipRecord.resetAt - now) / 60000));
    return { allowed: false, minutesUntilReset };
  } else {
    ipRecord.count += 1;
  }

  const minutesUntilReset = sessRecord ? Math.max(1, Math.ceil((sessRecord.resetAt - now) / 60000)) : 60;
  return { allowed: true, minutesUntilReset };
}

// =========================================================================
// 3. SLIDING-WINDOW 60-SECOND TPM BUDGET TRACKER
// Groq enforces an 8,000 Tokens-Per-Minute (TPM) limit per model.
// Based on real empirical measurements, each scan consumes ~1,730 total tokens
// (including internal model reasoning tokens).
// If rolling 60s usage exceeds 6,200 tokens (leaving an 1,800 token safety buffer),
// concurrent bursts are pre-emptively served via the Rules Engine to avoid 429s.
// =========================================================================
interface TokenLogEvent {
  timestamp: number;
  tokens: number;
}
const recentTokenEvents: TokenLogEvent[] = [];
const ROLLING_WINDOW_MS = 60 * 1000; // 60 seconds
const TPM_BUDGET_CEILING = 6200; // Safety threshold before Groq's 8,000 ceiling
const ESTIMATED_SCAN_TOKENS = 1750;

function getRollingTokenUsage(): number {
  const now = Date.now();
  while (recentTokenEvents.length > 0 && now - recentTokenEvents[0].timestamp > ROLLING_WINDOW_MS) {
    recentTokenEvents.shift();
  }
  return recentTokenEvents.reduce((sum, ev) => sum + ev.tokens, 0);
}

function recordTokensConsumed(tokens: number) {
  recentTokenEvents.push({ timestamp: Date.now(), tokens });
}

// System prompt for Enterprise ATS Evaluation
const SYSTEM_PROMPT = `You are a Principal Technical Recruiter and ATS Evaluation Architect assessing fresher and early-career software engineering resumes against corporate hiring bar standards.

Your job is to thoroughly evaluate the candidate's resume text against modern technical screening guidelines.

EVALUATION PARAMETERS:
1. Readiness Grade:
   - "A" (85-100): Tier A — Top-Tier Fit. Demonstrates core & preferred criteria with Google X-Y-Z quantified proof.
   - "B" (70-84): Tier B — Strong Candidate. Meets core criteria, solid projects, minor metric gaps.
   - "C" (50-69): Tier C — Gaps Identified. Missing key technical depth or bullets are passive.
   - "D" (0-49): Tier D — Filter Risk. Major skill deficit, wrong batch, or parsing breakdown.

2. Five Pillar Scores:
   - parseability (0 to 20): Layout clarity, standard section headers, contact readability.
   - hardSkills (0 to 25): Direct matching of programming languages, databases, cloud, and frameworks.
   - quantification (0 to 25): Google X-Y-Z formula metrics (%, ms, scale, users, ₹/$).
   - eligibility (0 to 15): Graduation batch (2025/2026/2027), degree, prerequisite screening.
   - clarity (0 to 15): Zero fluff, concise language, no passive buzzwords.

3. AI Buzzword Blacklist: Flag words like "results-driven", "team player", "spearheaded", "leveraged", "passionate", "hardworking".
4. Actionable Bullet Rewrites: Identify 2-3 weak or unquantified bullets from the resume and rewrite each using Google's X-Y-Z Formula: "Accomplished [X] as measured by [Y], by doing [Z]".

You MUST reply with valid JSON ONLY matching this schema:
{
  "overallScore": number,
  "readinessGrade": "A" | "B" | "C" | "D",
  "readinessGradeLabel": "Tier A — Top-Tier Fit" | "Tier B — Strong Fit" | "Tier C — Gaps Identified" | "Tier D — High Filter Risk",
  "summaryVerdict": string,
  "eligibilityStatus": {
    "passed": boolean,
    "details": string
  },
  "scores": {
    "parseability": { "score": number, "max": 20, "label": "Layout & Parseability" },
    "hardSkills": { "score": number, "max": 25, "label": "Hard Skills & Tech Stack" },
    "quantification": { "score": number, "max": 25, "label": "Google X-Y-Z Metrics" },
    "eligibility": { "score": number, "max": 15, "label": "Eligibility & Batch Screening" },
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

    // Step 3: Check Dual Rate Limit (Session ID + Campus NAT IP Protection)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const sessionId = request.headers.get("x-session-id")?.trim() || clientIp;

    const { allowed, minutesUntilReset } = checkDualRateLimit(sessionId, clientIp);

    if (!allowed) {
      // Graceful Fallback: Serve high-precision Rules-Only Report instead of blocking candidate!
      const fallbackReport = generateRulesOnlyReport(
        sanitizedResume,
        targetJobContext,
        role,
        `Hourly AI Scan Limit (${MAX_SCANS_PER_SESSION}/${MAX_SCANS_PER_SESSION} used). Displaying instant Heuristic Rules report. Full AI reset in ${minutesUntilReset} min${minutesUntilReset > 1 ? "s" : ""}.`
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
${sanitizedResume.slice(0, 4500)}

${
  targetJobContext.trim().length > 0
    ? `TARGET JOB REQUIREMENTS:\n${targetJobContext.slice(0, 2000)}`
    : `TARGET ROLE: ${role || "Software Engineer / Data Engineer"}`
}`;

    // Pre-emptive 60-Second TPM Budget Guard
    // If rolling token usage is within safety threshold of Groq's 8K TPM ceiling,
    // immediately serve the high-precision rules report to avoid 429 throttling
    const rollingTokens = getRollingTokenUsage();
    if (rollingTokens + ESTIMATED_SCAN_TOKENS > TPM_BUDGET_CEILING) {
      console.warn(`[TPM Budget Guard] Rolling usage at ${rollingTokens}/${TPM_BUDGET_CEILING}. Pre-emptively serving Rules Report.`);
      const fallbackReport = generateRulesOnlyReport(
        sanitizedResume,
        targetJobContext,
        role,
        "High momentary AI traffic burst. Served via instant Heuristic Rules report. Capacity refreshes in seconds."
      );
      return NextResponse.json({
        success: true,
        isRulesOnlyFallback: true,
        burstThrottled: true,
        report: fallbackReport,
      });
    }

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

    // Normalize backward-compatibility fields
    const grade = parsedReport.readinessGrade || parsedReport.workdayGrade || "C";
    const gradeLabel = parsedReport.readinessGradeLabel || parsedReport.workdayGradeLabel || `Tier ${grade}`;
    parsedReport.readinessGrade = grade;
    parsedReport.readinessGradeLabel = gradeLabel;
    parsedReport.workdayGrade = grade;
    parsedReport.workdayGradeLabel = gradeLabel;

    const eligStatus = parsedReport.eligibilityStatus || parsedReport.knockoutStatus || {
      passed: true,
      details: "Passed prerequisite eligibility screening.",
    };
    parsedReport.eligibilityStatus = eligStatus;
    parsedReport.knockoutStatus = eligStatus;

    // Record empirical token usage for sliding-window TPM guard
    const totalTokensUsed = groqData.usage?.total_tokens || ESTIMATED_SCAN_TOKENS;
    recordTokensConsumed(totalTokensUsed);
    console.log(`[ATS Scan Telemetry] model: ${activeModel} | prompt: ${groqData.usage?.prompt_tokens} | reasoning: ${groqData.usage?.completion_tokens_details?.reasoning_tokens || 0} | output: ${groqData.usage?.completion_tokens} | total: ${totalTokensUsed}`);

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
