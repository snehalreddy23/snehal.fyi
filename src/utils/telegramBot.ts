import { Job } from "@/types";

const DEFAULT_CHANNEL_ID = "@snehal_fyi";

export function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
  const channelId = process.env.TELEGRAM_CHANNEL_ID?.trim() || DEFAULT_CHANNEL_ID;

  return {
    isConfigured: Boolean(token),
    token,
    channelId,
  };
}

export function formatTelegramJobPost(job: Job): string {
  const eligibilityList = (job.eligibility || [])
    .slice(0, 3)
    .map((e) => `• ${escapeHtml(e)}`)
    .join("\n");

  const companyEscaped = escapeHtml(job.company);
  const roleEscaped = escapeHtml(job.role);
  const salaryEscaped = escapeHtml(job.salary);
  const locationEscaped = escapeHtml(job.location);
  const batchesEscaped = escapeHtml(job.batch.join(", "));
  const experienceEscaped = escapeHtml(job.experience);
  const tipsEscaped = escapeHtml(job.snehalTips);

  return `🚨 <b>OFF-CAMPUS HIRING: ${companyEscaped.toUpperCase()}</b> 🚨

🔥 <b>Role:</b> ${roleEscaped}
🏢 <b>Company:</b> ${companyEscaped}
💰 <b>Salary / CTC:</b> ${salaryEscaped}
📍 <b>Location:</b> ${locationEscaped}
🎓 <b>Eligible Batches:</b> ${batchesEscaped}
💼 <b>Experience:</b> ${experienceEscaped}

📌 <b>Key Eligibility:</b>
${eligibilityList}

💡 <b>Snehal's Pro Tip:</b>
${tipsEscaped}

🔗 <b>Direct Official Apply Link:</b>
👉 https://snehal.fyi/jobs/${job.slug}
<i>(Fast Shortlink: https://snehal.fyi/j/${job.id})</i>

⚡ <b>Join Telegram for daily verified off-campus alerts:</b>
👉 @snehal_fyi | https://t.me/snehal_fyi`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendTelegramBroadcast(job: Job): Promise<{
  success: boolean;
  messageId?: number;
  error?: string;
}> {
  const { isConfigured, token, channelId } = getTelegramConfig();

  if (!isConfigured) {
    return {
      success: false,
      error:
        "TELEGRAM_BOT_TOKEN is not configured. Please add it to your environment variables.",
    };
  }

  const messageText = formatTelegramJobPost(job);
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: channelId,
        text: messageText,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      const errMsg =
        data.description || `Telegram API responded with status ${res.status}`;
      return {
        success: false,
        error: errMsg,
      };
    }

    return {
      success: true,
      messageId: data.result?.message_id,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      success: false,
      error: `Network error calling Telegram API: ${message}`,
    };
  }
}
