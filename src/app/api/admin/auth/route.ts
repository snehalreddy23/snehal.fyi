import { NextResponse } from "next/server";
import { verifyAdminPasscode, getGitHubConfig } from "@/utils/githubJobs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode } = body;

    const isValid = verifyAdminPasscode(passcode);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid admin passcode" },
        { status: 401 }
      );
    }

    const { isConfigured, owner, repo, branch } = getGitHubConfig();

    return NextResponse.json({
      authenticated: true,
      githubConfigured: isConfigured,
      repo: `${owner}/${repo}`,
      branch,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
}
