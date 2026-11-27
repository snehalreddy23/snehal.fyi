import { NextResponse } from "next/server";
import { verifyAdminPasscode, fetchJobsList } from "@/utils/githubJobs";
import { sendTelegramBroadcast, getTelegramConfig } from "@/utils/telegramBot";

function extractPasscode(request: Request): string | null {
  return request.headers.get("x-admin-passcode");
}

export async function POST(request: Request) {
  const passcode = extractPasscode(request);
  if (!verifyAdminPasscode(passcode)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: "jobId is required to broadcast" },
        { status: 400 }
      );
    }

    const { jobs } = await fetchJobsList();
    const targetJob = jobs.find((j) => j.id === jobId);

    if (!targetJob) {
      return NextResponse.json(
        { error: `Job with ID ${jobId} not found` },
        { status: 404 }
      );
    }

    const telegramConfig = getTelegramConfig();
    if (!telegramConfig.isConfigured) {
      return NextResponse.json(
        {
          error:
            "TELEGRAM_BOT_TOKEN is not configured in Vercel environment variables. Add your token to enable auto-posting.",
        },
        { status: 400 }
      );
    }

    const result = await sendTelegramBroadcast(targetJob);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to broadcast to Telegram" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      channel: telegramConfig.channelId,
      message: `Successfully broadcasted "${targetJob.role} at ${targetJob.company}" to ${telegramConfig.channelId}!`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
