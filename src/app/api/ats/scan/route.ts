import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { fetchJobsList } from "@/utils/githubJobs";
import { EnterpriseAIReport } from "@/types";
import { sanitizePII, generateRulesOnlyReport } from "@/utils/rulesFallbackEngine";
import {
  reserveModelTpmBudget,
  adjustModelTpmBudget,
  checkDistributedDualRateLimit,
  getCachedScan,
  setCachedScan,
} from "@/utils/tokenBudgetManager";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const FLAGSHIP_MODEL = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";
const FAST_MODEL = "openai/gpt-oss-20b";

function generateCacheKey(resume: string, jd: string, role?: string): string {
  const payload = `${resume.trim()}:::${jd.trim()}:::${role || ""}`;
  return createHash("sha256").update(payload).digest("hex");
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

// Helper: Calls Groq with model cascading, timeout, and calibrated reasoning effort
async function callGroqModel(
  model: string,
  apiKey: string,
  userContent: string,
  effort: "medium" | "low" = "medium"
) {
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
        reasoning_effort: effort, // "medium" on 120B for nuanced bullet rewrites; "low" on 20B for fast burst processing
        max_tokens: 1000,
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
    const sanitizedResume = sanitizePII(resumeText);

    // Step 2: Check Distributed Scan Cache
    const cacheKey = generateCacheKey(sanitizedResume, targetJobContext, role);
    const cachedReport = await getCachedScan(cacheKey);
    if (cachedReport) {
      return NextResponse.json({
        success: true,
        cached: true,
        model: "cache-distributed",
        latencySeconds: 0.01,
        report: { ...cachedReport, cached: true },
      });
    }

    // Step 3: Dual-Key Rate Limiting (Session ID + Campus NAT IP Protection)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const sessionId = request.headers.get("x-session-id")?.trim() || clientIp;

    const { allowed, minutesUntilReset } = await checkDistributedDualRateLimit(sessionId, clientIp);

    if (!allowed) {
      // Graceful Fallback: Serve high-precision Rules-Only Report instead of blocking candidate!
      const fallbackReport = generateRulesOnlyReport(
        sanitizedResume,
        targetJobContext,
        role,
        `Hourly AI Scan Limit (10/10 used). Displaying instant Heuristic Rules report. Full AI reset in ${minutesUntilReset} min${minutesUntilReset > 1 ? "s" : ""}.`
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

    // Step 5: Multi-Model Pre-Allocation Cascading Pipeline
    // Try reserving in 120B budget -> If near ceiling, reserve in 20B budget -> If both full, rules fallback
    let targetModelKey: "120b" | "20b" = "120b";
    let activeModel = FLAGSHIP_MODEL;

    const canUse120b = await reserveModelTpmBudget("120b", 1300);

    if (canUse120b) {
      targetModelKey = "120b";
      activeModel = FLAGSHIP_MODEL;
    } else {
      // 120B budget near 8K TPM ceiling! Cascade to 20B model (which has its own independent 8K TPM budget)
      console.warn("[Cascading Pipeline] 120B budget near ceiling. Attempting 20B reservation...");
      const canUse20b = await reserveModelTpmBudget("20b", 1300);
      if (canUse20b) {
        targetModelKey = "20b";
        activeModel = FAST_MODEL;
      } else {
        // Both models near 8K ceiling! Pre-emptively serve rules report to avoid 429
        console.warn("[Cascading Pipeline] Both 120B & 20B budgets full. Serving Rules Report.");
        const fallbackReport = generateRulesOnlyReport(
          sanitizedResume,
          targetJobContext,
          role,
          "High momentary AI traffic burst. Served via instant Heuristic Rules report. Full AI capacity refreshes in seconds."
        );
        return NextResponse.json({
          success: true,
          isRulesOnlyFallback: true,
          burstThrottled: true,
          report: fallbackReport,
        });
      }
    }

    // Step 6: Execute Groq Call with Model Cascading
    let groqResponse;
    const effort = activeModel === FLAGSHIP_MODEL ? "medium" : "low";
    try {
      groqResponse = await callGroqModel(activeModel, apiKey, userContent, effort);
      if (!groqResponse.ok && activeModel === FLAGSHIP_MODEL) {
        console.warn(`Groq ${FLAGSHIP_MODEL} error (${groqResponse.status}). Cascading to ${FAST_MODEL}...`);
        const canCascade = await reserveModelTpmBudget("20b", 1300);
        if (canCascade) {
          activeModel = FAST_MODEL;
          targetModelKey = "20b";
          groqResponse = await callGroqModel(FAST_MODEL, apiKey, userContent, "low");
        }
      }
    } catch (modelErr) {
      console.warn(`Primary model call notice (${activeModel}):`, modelErr);
      if (activeModel === FLAGSHIP_MODEL) {
        try {
          activeModel = FAST_MODEL;
          targetModelKey = "20b";
          groqResponse = await callGroqModel(FAST_MODEL, apiKey, userContent, "low");
        } catch (fastErr) {
          console.warn(`Fallback model notice (${FAST_MODEL}):`, fastErr);
        }
      }
    }

    // Step 7: If both models fail, return Rules-Only Report
    if (!groqResponse || !groqResponse.ok) {
      console.warn("AI models busy or rate-limited. Activating Rules-Only Fallback Engine.");
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

    // Adjust reservation with real actual token usage
    const actualTokensUsed = groqData.usage?.total_tokens || 1300;
    await adjustModelTpmBudget(targetModelKey, actualTokensUsed);
    console.log(`[ATS Scan Telemetry] model: ${activeModel} | prompt: ${groqData.usage?.prompt_tokens} | reasoning: ${groqData.usage?.completion_tokens_details?.reasoning_tokens || 0} | output: ${groqData.usage?.completion_tokens} | total: ${actualTokensUsed}`);

    // Store in distributed cache for 24 hours
    await setCachedScan(cacheKey, parsedReport);

    return NextResponse.json({
      success: true,
      model: activeModel,
      latencySeconds: groqData.usage?.total_time || 0.5,
      report: parsedReport,
    });
  } catch (err: unknown) {
    console.error("ATS AI Scan route unexpected error:", err);
    const fallbackReport = generateRulesOnlyReport("", undefined, undefined);
    return NextResponse.json({
      success: true,
      isRulesOnlyFallback: true,
      report: fallbackReport,
    });
  }
}
