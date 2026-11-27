import { NextResponse } from "next/server";
import { verifyAdminPasscode, fetchJobsList, saveJobsList, getGitHubConfig } from "@/utils/githubJobs";
import { sendTelegramBroadcast, getTelegramConfig } from "@/utils/telegramBot";
import { Job } from "@/types";

function extractPasscode(request: Request): string | null {
  return request.headers.get("x-admin-passcode");
}

export async function GET(request: Request) {
  const passcode = extractPasscode(request);
  if (!verifyAdminPasscode(passcode)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { jobs, source, sha, error } = await fetchJobsList();
  const config = getGitHubConfig();
  const telegramConfig = getTelegramConfig();

  return NextResponse.json({
    jobs,
    source,
    sha,
    error,
    githubConfigured: config.isConfigured,
    telegramConfigured: telegramConfig.isConfigured,
    telegramChannel: telegramConfig.channelId,
    repo: `${config.owner}/${config.repo}`,
    branch: config.branch,
  });
}

export async function POST(request: Request) {
  const passcode = extractPasscode(request);
  if (!verifyAdminPasscode(passcode)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      company,
      role,
      category,
      badge,
      location,
      jobType,
      batch,
      salary,
      experience,
      deadline,
      applyUrl,
      eligibility,
      description,
      responsibilities,
      requirements,
      selectionProcess,
      snehalTips,
      featured,
      tags,
    } = body;

    if (!company || !role || !applyUrl) {
      return NextResponse.json(
        { error: "Company, Role, and Apply URL are strictly required." },
        { status: 400 }
      );
    }

    const { jobs } = await fetchJobsList();

    // Auto-generate numeric ID
    const existingIds = jobs
      .map((j) => parseInt(j.id, 10))
      .filter((n) => !isNaN(n));
    const nextId = existingIds.length > 0 ? String(Math.max(...existingIds) + 1) : "101";

    // Auto-generate slug
    const cleanCompany = company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const cleanRole = role.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const baseSlug = `${cleanCompany}-${cleanRole}`;
    const slugSuffix = Date.now().toString().slice(-4);
    const slug = `${baseSlug}-${slugSuffix}`;

    // Color palette for company logos
    const colorOptions = [
      "bg-blue-600",
      "bg-indigo-600",
      "bg-emerald-600",
      "bg-purple-600",
      "bg-rose-600",
      "bg-amber-600",
      "bg-teal-600",
      "bg-cyan-600",
    ];
    const logoBg = colorOptions[Math.floor(Math.random() * colorOptions.length)];

    const newJob: Job = {
      id: nextId,
      slug,
      company: company.trim(),
      role: role.trim(),
      category: category || "Software",
      badge: badge || "Active",
      logoBg,
      location: location?.trim() || "Remote / Pan India",
      jobType: jobType || "Full-Time",
      batch: Array.isArray(batch) && batch.length > 0 ? batch : ["2024", "2025", "2026"],
      salary: salary?.trim() || "Best in Industry",
      experience: experience?.trim() || "Freshers / 0-1 yrs",
      postedDate: "Today",
      deadline: deadline?.trim() || "Apply ASAP",
      applyUrl: applyUrl.trim(),
      eligibility:
        Array.isArray(eligibility) && eligibility.length > 0
          ? eligibility
          : [
              "B.Tech / B.E / BCA / MCA / B.Sc or related degree",
              `Eligible batches: ${(batch || ["2024", "2025", "2026"]).join(", ")}`,
              "Strong fundamental knowledge and quick learning mindset",
            ],
      description:
        description?.trim() ||
        `${company} is actively hiring for the position of ${role}. Freshers and early career professionals with relevant problem solving skills are encouraged to apply directly.`,
      responsibilities:
        Array.isArray(responsibilities) && responsibilities.length > 0
          ? responsibilities
          : [
              "Collaborate with cross-functional teams to build and scale features.",
              "Write clean, maintainable, and well-tested code.",
              "Participate in agile sprints, code reviews, and technical documentation.",
            ],
      requirements:
        Array.isArray(requirements) && requirements.length > 0
          ? requirements
          : [
              "Familiarity with core programming fundamentals and databases.",
              "Good communication and collaborative problem-solving skills.",
              "Demonstrated project portfolio or previous internship experience is a plus.",
            ],
      selectionProcess:
        Array.isArray(selectionProcess) && selectionProcess.length > 0
          ? selectionProcess
          : [
              "Round 1: Online Assessment / Resume Shortlisting",
              "Round 2: Technical Interview (Core Concepts + Problem Solving)",
              "Round 3: HR / Fitment Discussion",
            ],
      snehalTips:
        snehalTips?.trim() ||
        `Tailor your resume specifically for ${role} at ${company}. Keep it strictly to 1 page and make sure your key projects have live links.`,
      featured: Boolean(featured),
      tags:
        Array.isArray(tags) && tags.length > 0
          ? tags
          : [company, role, category || "Software", "Freshers"],
    };

    // Prepend new job to top of array
    const updatedJobs = [newJob, ...jobs];

    const commitMsg = `Add job: ${newJob.role} at ${newJob.company} (ID: ${newJob.id})`;
    const saveResult = await saveJobsList(updatedJobs, commitMsg);

    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error || "Failed to persist new job" },
        { status: 500 }
      );
    }

    let telegramStatus: { success: boolean; error?: string } | null = null;
    if (body.autoBroadcastTelegram) {
      telegramStatus = await sendTelegramBroadcast(newJob);
    }

    return NextResponse.json({
      success: true,
      job: newJob,
      method: saveResult.method,
      commitSha: saveResult.commitSha,
      telegramBroadcast: telegramStatus,
      message:
        saveResult.method === "github"
          ? `Job committed to GitHub!${
              telegramStatus?.success
                ? " Also broadcasted to Telegram!"
                : telegramStatus?.error
                ? ` (Telegram error: ${telegramStatus.error})`
                : ""
            }`
          : "Job saved to local database file.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const passcode = extractPasscode(request);
  if (!verifyAdminPasscode(passcode)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const { jobs } = await fetchJobsList();
    const targetJob = jobs.find((j) => j.id === id);

    if (!targetJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const updatedJobs = jobs.filter((j) => j.id !== id);
    const commitMsg = `Remove job: ${targetJob.role} at ${targetJob.company} (ID: ${id})`;

    const saveResult = await saveJobsList(updatedJobs, commitMsg);

    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error || "Failed to delete job" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      removedId: id,
      method: saveResult.method,
      commitSha: saveResult.commitSha,
      message:
        saveResult.method === "github"
          ? "Job removed & committed to GitHub! Vercel will redeploy in ~30 seconds."
          : "Job deleted from local database file.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
