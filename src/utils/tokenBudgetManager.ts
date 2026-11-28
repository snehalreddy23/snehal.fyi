import { EnterpriseAIReport } from "@/types";

// Upstash Redis REST credentials (optional, zero-setup fallback to in-memory)
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL?.trim();
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

const TPM_CEILING = 6400; // Leave buffer before Groq's 8,000 TPM limit
const ESTIMATED_RESERVATION = 1300; // Realistic tokens per scan with reasoning_effort="low"

// In-Memory Fallbacks for single-container or dev mode
const localCache = new Map<string, { report: EnterpriseAIReport; expiresAt: number }>();
const localTpmEvents: { [model: string]: Array<{ timestamp: number; tokens: number }> } = {
  "120b": [],
  "20b": [],
};
const localSessionCount = new Map<string, { count: number; resetAt: number }>();
const localIpCount = new Map<string, { count: number; resetAt: number }>();

/**
 * Execute Upstash Redis REST command
 */
async function redisCommand(command: string[]): Promise<any> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(`${REDIS_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.warn("[Redis] Upstash request notice:", err);
    return null;
  }
}

/**
 * Check and reserve tokens BEFORE calling Groq (Pre-allocation to prevent race conditions).
 * Returns true if budget reserved successfully, false if budget near ceiling.
 */
export async function reserveModelTpmBudget(modelKey: "120b" | "20b", tokensToReserve: number = ESTIMATED_RESERVATION): Promise<boolean> {
  const currentMinute = Math.floor(Date.now() / 60000);
  const redisKey = `ats:tpm:${modelKey}:${currentMinute}`;

  if (REDIS_URL && REDIS_TOKEN) {
    try {
      // Atomically increment current minute's token counter
      const current = await redisCommand(["INCRBY", redisKey, String(tokensToReserve)]);
      await redisCommand(["EXPIRE", redisKey, "90"]); // 90s TTL

      if (typeof current === "number") {
        if (current > TPM_CEILING) {
          return false; // Budget full, cascade to next tier
        }
        return true;
      }
    } catch {
      // Fall through to in-memory check
    }
  }

  // Local In-Memory Fallback
  const now = Date.now();
  const events = localTpmEvents[modelKey] || [];
  // Remove events older than 60s
  while (events.length > 0 && now - events[0].timestamp > 60000) {
    events.shift();
  }
  const currentUsage = events.reduce((sum, ev) => sum + ev.tokens, 0);

  if (currentUsage + tokensToReserve > TPM_CEILING) {
    return false;
  }

  // Pre-reserve
  events.push({ timestamp: now, tokens: tokensToReserve });
  localTpmEvents[modelKey] = events;
  return true;
}

/**
 * Adjust reservation with actual tokens returned from Groq usage
 */
export async function adjustModelTpmBudget(modelKey: "120b" | "20b", actualTokens: number) {
  const diff = actualTokens - ESTIMATED_RESERVATION;
  const currentMinute = Math.floor(Date.now() / 60000);
  const redisKey = `ats:tpm:${modelKey}:${currentMinute}`;

  if (REDIS_URL && REDIS_TOKEN && diff !== 0) {
    try {
      await redisCommand(["INCRBY", redisKey, String(diff)]);
    } catch {}
  }
}

/**
 * Dual-Key Rate Limiter (Session ID + IP Ceiling: 10 tries per hour)
 */
export async function checkDistributedDualRateLimit(
  sessionId: string,
  clientIp: string
): Promise<{ allowed: boolean; minutesUntilReset: number }> {
  const MAX_SESSION = 10;
  const MAX_IP = 10;
  const now = Date.now();

  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const sessKey = `ats:sess:${sessionId}`;
      const ipKey = `ats:ip:${clientIp}`;

      const sessCount = (await redisCommand(["INCR", sessKey])) as number;
      if (sessCount === 1) await redisCommand(["EXPIRE", sessKey, "3600"]);

      const ipCount = (await redisCommand(["INCR", ipKey])) as number;
      if (ipCount === 1) await redisCommand(["EXPIRE", ipKey, "3600"]);

      if (sessCount > MAX_SESSION || ipCount > MAX_IP) {
        const ttl = ((await redisCommand(["TTL", sessKey])) as number) || 3600;
        return { allowed: false, minutesUntilReset: Math.max(1, Math.ceil(ttl / 60)) };
      }

      const ttl = ((await redisCommand(["TTL", sessKey])) as number) || 3600;
      return { allowed: true, minutesUntilReset: Math.max(1, Math.ceil(ttl / 60)) };
    } catch {}
  }

  // In-Memory Fallback
  const sessRecord = localSessionCount.get(sessionId);
  if (!sessRecord || now > sessRecord.resetAt) {
    localSessionCount.set(sessionId, { count: 1, resetAt: now + 3600000 });
  } else if (sessRecord.count >= MAX_SESSION) {
    return { allowed: false, minutesUntilReset: Math.max(1, Math.ceil((sessRecord.resetAt - now) / 60000)) };
  } else {
    sessRecord.count += 1;
  }

  const ipRecord = localIpCount.get(clientIp);
  if (!ipRecord || now > ipRecord.resetAt) {
    localIpCount.set(clientIp, { count: 1, resetAt: now + 3600000 });
  } else if (ipRecord.count >= MAX_IP) {
    return { allowed: false, minutesUntilReset: Math.max(1, Math.ceil((ipRecord.resetAt - now) / 60000)) };
  } else {
    ipRecord.count += 1;
  }

  const mins = sessRecord ? Math.max(1, Math.ceil((sessRecord.resetAt - now) / 60000)) : 60;
  return { allowed: true, minutesUntilReset: mins };
}

/**
 * Scan Cache (24-hour expiration)
 */
export async function getCachedScan(cacheKey: string): Promise<EnterpriseAIReport | null> {
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const data = await redisCommand(["GET", `ats:cache:${cacheKey}`]);
      if (data && typeof data === "string") {
        return JSON.parse(data);
      }
    } catch {}
  }

  const entry = localCache.get(cacheKey);
  if (entry && Date.now() < entry.expiresAt) {
    return entry.report;
  }
  return null;
}

export async function setCachedScan(cacheKey: string, report: EnterpriseAIReport) {
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      await redisCommand(["SETEX", `ats:cache:${cacheKey}`, "86400", JSON.stringify(report)]);
      return;
    } catch {}
  }

  localCache.set(cacheKey, {
    report,
    expiresAt: Date.now() + 86400000,
  });
}
