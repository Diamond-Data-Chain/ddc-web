import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 300;

const GITHUB_OWNER = "Diamond-Data-Chain";
const GITHUB_REPOSITORY = "ddc-web";
const GITHUB_BRANCH = "main";

type GitHubCommitResponse = {
  sha: string;
  html_url: string;
  commit?: {
    message?: string;
    author?: {
      name?: string;
      date?: string;
    } | null;
    committer?: {
      name?: string;
      date?: string;
    } | null;
    verification?: {
      verified?: boolean;
      reason?: string;
    } | null;
  };
  author?: {
    login?: string;
    avatar_url?: string;
    html_url?: string;
  } | null;
};

function cleanCommitMessage(message: string): {
  title: string;
  description: string;
} {
  const lines = message
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    title: lines[0] || "Untitled commit",
    description: lines.slice(1).join(" "),
  };
}

export async function GET() {
  try {
    const url = new URL(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/commits`
    );

    url.searchParams.set("sha", GITHUB_BRANCH);
    url.searchParams.set("per_page", "50");

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Diamond-Data-Chain-Website",
    };

    const githubToken = process.env.GITHUB_TOKEN?.trim();

    if (githubToken) {
      headers.Authorization = `Bearer ${githubToken}`;
    }

    const response = await fetch(url, {
      headers,
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      const body = await response.text();

      throw new Error(
        `GitHub API returned ${response.status}: ${
          body.slice(0, 300) || response.statusText
        }`
      );
    }

    const data = (await response.json()) as GitHubCommitResponse[];

    const items = data.map((item) => {
      const message = cleanCommitMessage(
        item.commit?.message || ""
      );

      return {
        sha: item.sha,
        shortSha: item.sha.slice(0, 7),
        title: message.title,
        description: message.description,
        url: item.html_url,
        date:
          item.commit?.author?.date ||
          item.commit?.committer?.date ||
          null,
        author:
          item.author?.login ||
          item.commit?.author?.name ||
          item.commit?.committer?.name ||
          "Unknown",
        authorUrl: item.author?.html_url || null,
        avatarUrl: item.author?.avatar_url || null,
        verified:
          item.commit?.verification?.verified === true,
        verificationReason:
          item.commit?.verification?.reason || null,
      };
    });

    return NextResponse.json({
      source: "github",
      repository: `${GITHUB_OWNER}/${GITHUB_REPOSITORY}`,
      branch: GITHUB_BRANCH,
      repositoryUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPOSITORY}`,
      count: items.length,
      items,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to read GitHub commits.";

    console.error("GitHub commits API error:", error);

    return NextResponse.json(
      {
        source: "github",
        repository: `${GITHUB_OWNER}/${GITHUB_REPOSITORY}`,
        branch: GITHUB_BRANCH,
        count: 0,
        items: [],
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}
