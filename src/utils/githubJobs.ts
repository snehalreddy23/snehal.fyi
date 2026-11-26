import fs from "fs/promises";
import path from "path";
import { Job } from "@/types";

const DEFAULT_PASSCODE = "snehal2025";
const DEFAULT_OWNER = "snehalreddy23";
const DEFAULT_REPO = "snehal.fyi";
const DEFAULT_BRANCH = "main";
const FILE_PATH = "src/data/jobs.json";

export function getAdminPasscode(): string {
  return process.env.ADMIN_PASSCODE || DEFAULT_PASSCODE;
}

export function verifyAdminPasscode(inputPasscode: string | null | undefined): boolean {
  if (!inputPasscode) return false;
  const expected = getAdminPasscode();
  return inputPasscode.trim() === expected.trim();
}

export function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN?.trim() || "";
  const owner = process.env.GITHUB_OWNER?.trim() || DEFAULT_OWNER;
  const repo = process.env.GITHUB_REPO?.trim() || DEFAULT_REPO;
  const branch = process.env.GITHUB_BRANCH?.trim() || DEFAULT_BRANCH;

  return {
    isConfigured: Boolean(token),
    token,
    owner,
    repo,
    branch,
  };
}

export async function fetchJobsList(): Promise<{
  jobs: Job[];
  source: "github" | "local";
  sha?: string;
  error?: string;
}> {
  const { isConfigured, token, owner, repo, branch } = getGitHubConfig();

  if (isConfigured) {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${branch}`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${token}`,
          "User-Agent": "snehal-fyi-admin",
        },
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        const decodedContent = Buffer.from(data.content, "base64").toString("utf-8");
        const jobs = JSON.parse(decodedContent) as Job[];
        return {
          jobs,
          source: "github",
          sha: data.sha,
        };
      }
    } catch (err: unknown) {
      console.error("Failed to fetch jobs from GitHub API, falling back to local:", err);
    }
  }

  // Fallback to local filesystem
  try {
    const localFilePath = path.join(process.cwd(), FILE_PATH);
    const rawData = await fs.readFile(localFilePath, "utf-8");
    const jobs = JSON.parse(rawData) as Job[];
    return {
      jobs,
      source: "local",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      jobs: [],
      source: "local",
      error: `Could not load jobs: ${message}`,
    };
  }
}

export async function saveJobsList(
  jobs: Job[],
  commitMessage: string
): Promise<{
  success: boolean;
  method: "github" | "local";
  commitSha?: string;
  error?: string;
}> {
  const { isConfigured, token, owner, repo, branch } = getGitHubConfig();

  // If GitHub token is provided, commit to GitHub
  if (isConfigured) {
    try {
      // 1. Fetch current file SHA
      const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${branch}`;
      const getRes = await fetch(getUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${token}`,
          "User-Agent": "snehal-fyi-admin",
        },
        cache: "no-store",
      });

      if (!getRes.ok) {
        const errText = await getRes.text();
        throw new Error(`GitHub API GET failed: ${getRes.status} ${errText}`);
      }

      const fileData = await getRes.json();
      const currentSha = fileData.sha;

      // 2. Commit updated file
      const updatedJson = JSON.stringify(jobs, null, 2) + "\n";
      const base64Content = Buffer.from(updatedJson, "utf-8").toString("base64");

      const putRes = await fetch(getUrl, {
        method: "PUT",
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "snehal-fyi-admin",
        },
        body: JSON.stringify({
          message: commitMessage,
          content: base64Content,
          sha: currentSha,
          branch,
        }),
      });

      if (!putRes.ok) {
        const errText = await putRes.text();
        throw new Error(`GitHub API PUT commit failed: ${putRes.status} ${errText}`);
      }

      const putData = await putRes.json();
      return {
        success: true,
        method: "github",
        commitSha: putData.commit?.sha || "committed",
      };
    } catch (err: unknown) {
      console.error("GitHub commit failed:", err);
      // Fallback to local save if running in local dev environment
      const message = err instanceof Error ? err.message : "GitHub commit failed";
      try {
        const localFilePath = path.join(process.cwd(), FILE_PATH);
        await fs.writeFile(localFilePath, JSON.stringify(jobs, null, 2) + "\n", "utf-8");
        return {
          success: true,
          method: "local",
          error: `GitHub sync error (${message}), but saved locally!`,
        };
      } catch {
        return {
          success: false,
          method: "github",
          error: message,
        };
      }
    }
  }

  // If no GitHub token, write directly to local filesystem (dev mode)
  try {
    const localFilePath = path.join(process.cwd(), FILE_PATH);
    await fs.writeFile(localFilePath, JSON.stringify(jobs, null, 2) + "\n", "utf-8");
    return {
      success: true,
      method: "local",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Local write failed";
    return {
      success: false,
      method: "local",
      error: message,
    };
  }
}
