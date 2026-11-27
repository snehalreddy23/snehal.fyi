import { NextResponse } from "next/server";
import { fetchJobsList } from "@/utils/githubJobs";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription, targetJobId } = body;

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Resume text is too short. Please provide at least 50 characters." },
        { status: 400 }
      );
    }

    // Resolve Job Description if a target job was selected from snehal.fyi
    let targetJobContext = jobDescription || "";
    if (targetJobId && (!jobDescription || jobDescription.trim().length === 0)) {
      const { jobs } = await fetchJobsList();
      const targetJob = jobs.find((j) => j.id === targetJobId);
      if (targetJob) {
        targetJobContext = `TARGET COMPANY: ${targetJob.company}
ROLE: ${targetJob.role}
CATEGORY: ${targetJob.category}
ELIGIBLE BATCHES: ${targetJob.batch.join(", ")}
SALARY / CTC: ${targetJob.salary}
MINIMUM EXPERIENCE: ${targetJob.experience}
JOB REQUIREMENTS:
${targetJob.requirements.join("\n")}
RESPONSIBILITIES:
${targetJob.responsibilities.join("\n")}
ELIGIBILITY CRITERIA:
${targetJob.eligibility.join("\n")}
SNEHAL'S PRO TIP: ${targetJob.snehalTips}`;
      }
    }

    const apiKey = process.env.GROQ_API_KEY?.trim();
    const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL;

    // If Groq is not configured, return fallback note
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "GROQ_API_KEY not configured. Falling back to heuristic scan.",
          useFallback: true,
        },
        { status: 503 }
      );
    }

    const systemPrompt = `You are the Lead ATS Parsing Architect and Senior Technical Recruiter evaluating candidates for Fortune 500 tech companies (using systems like Workday HiredScore, Darwinbox Sense, and Keka Hire).

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
   - eligibility (0 to 15): Graduation batch (2025/2026/2027), degree, location/in-person feasibility.
   - clarity (0 to 15): Zero fluff, professional concise language, no AI buzzwords.

3. AI Buzzword Blacklist: Flag words like "spearheaded", "leveraged", "crucial", "testament", "passionate", "hardworking", "orchestrated", "deep dive".
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

    const userContent = `RESUME TEXT:
${resumeText.slice(0, 12000)}

${
  targetJobContext.trim().length > 0
    ? `TARGET JOB REQUIREMENTS:\n${targetJobContext.slice(0, 4000)}`
    : "TARGET ROLE: Fresher / Early Career Software Engineer, Data & Cloud (General Assessment)"
}`;

    const groqResponse = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errText);
      return NextResponse.json(
        {
          error: `Groq AI API error (${groqResponse.status})`,
          useFallback: true,
        },
        { status: 502 }
      );
    }

    const groqData = await groqResponse.json();
    const rawContent = groqData.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { error: "Empty AI response", useFallback: true },
        { status: 500 }
      );
    }

    const parsedReport = JSON.parse(rawContent);

    return NextResponse.json({
      success: true,
      model: model,
      latencySeconds: groqData.usage?.total_time || 0.4,
      report: parsedReport,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("ATS AI Scan route error:", message);
    return NextResponse.json(
      { error: message, useFallback: true },
      { status: 500 }
    );
  }
}
