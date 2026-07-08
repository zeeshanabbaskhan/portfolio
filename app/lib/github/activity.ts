import { unstable_cache } from "next/cache";
import type { GitHubActivity, GitHubContributionDay } from "@/app/data/githubTypes";

const CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/v4";

type ContributionsApiResponse = {
  contributions?: Array<{ date: string; count: number; level?: number }>;
};

type GitHubUserResponse = {
  login: string;
  html_url: string;
  avatar_url?: string;
  name?: string | null;
  bio?: string | null;
  public_repos?: number;
  followers?: number;
  following?: number;
};

function parseGitHubUsername(githubUrl: string): string | null {
  try {
    const url = new URL(githubUrl);
    if (!url.hostname.includes("github.com")) {
      return null;
    }

    const username = url.pathname.split("/").filter(Boolean)[0];
    return username ?? null;
  } catch {
    return null;
  }
}

function parseDateParts(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

function addDays(date: string, delta: number): string {
  const { year, month, day } = parseDateParts(date);
  const next = new Date(Date.UTC(year, month - 1, day + delta));
  return next.toISOString().slice(0, 10);
}

function computeStreaks(contributions: GitHubContributionDay[]) {
  const dateMap = new Map(contributions.map((day) => [day.date, day.count]));
  const sortedDates = [...contributions].sort((a, b) => a.date.localeCompare(b.date));

  let longestStreak = 0;
  let run = 0;
  for (const day of sortedDates) {
    if (day.count > 0) {
      run += 1;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 0;
    }
  }

  let currentStreak = 0;
  let checkDate = sortedDates[sortedDates.length - 1]?.date;
  if (!checkDate) {
    return { currentStreak: 0, longestStreak, totalContributions: 0 };
  }

  if ((dateMap.get(checkDate) ?? 0) === 0) {
    checkDate = addDays(checkDate, -1);
  }

  while (dateMap.has(checkDate) && (dateMap.get(checkDate) ?? 0) > 0) {
    currentStreak += 1;
    checkDate = addDays(checkDate, -1);
  }

  const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);

  return { currentStreak, longestStreak, totalContributions };
}

async function fetchContributions(username: string): Promise<GitHubContributionDay[]> {
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const payload = (await response.json()) as {
        data?: {
          user?: {
            contributionsCollection?: {
              contributionCalendar?: {
                weeks?: Array<{
                  contributionDays?: Array<{ contributionCount: number; date: string }>;
                }>;
              };
            };
          };
        };
      };

      const weeks = payload.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
      const contributions = weeks.flatMap((week) =>
        (week.contributionDays ?? []).map((day) => ({
          date: day.date,
          count: day.contributionCount,
        }))
      );

      if (contributions.length > 0) {
        return contributions;
      }
    }
  }

  const response = await fetch(`${CONTRIBUTIONS_API}/${encodeURIComponent(username)}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as ContributionsApiResponse;
  return (payload.contributions ?? []).map((day) => ({
    date: day.date,
    count: day.count,
  }));
}

async function fetchGitHubUser(username: string): Promise<GitHubUserResponse | null> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as GitHubUserResponse;
}

async function fetchGitHubActivityUncached(githubUrl: string): Promise<GitHubActivity | null> {
  const username = parseGitHubUsername(githubUrl);
  if (!username) {
    return null;
  }

  const [contributions, user] = await Promise.all([
    fetchContributions(username),
    fetchGitHubUser(username),
  ]);

  if (contributions.length === 0 && !user) {
    return null;
  }

  const streaks = computeStreaks(contributions);

  return {
    username,
    profileUrl: user?.html_url ?? `https://github.com/${username}`,
    avatarUrl: user?.avatar_url,
    name: user?.name ?? undefined,
    bio: user?.bio ?? undefined,
    publicRepos: user?.public_repos ?? 0,
    followers: user?.followers ?? 0,
    following: user?.following ?? 0,
    totalContributions: streaks.totalContributions,
    currentStreak: streaks.currentStreak,
    longestStreak: streaks.longestStreak,
    contributions,
  };
}

export function getGitHubActivity(githubUrl: string): Promise<GitHubActivity | null> {
  const username = parseGitHubUsername(githubUrl);
  if (!username) {
    return Promise.resolve(null);
  }

  return unstable_cache(
    () => fetchGitHubActivityUncached(githubUrl),
    [`github-activity-${username}`],
    { revalidate: 3600 }
  )();
}

export function buildHeatmapWeeks(contributions: GitHubContributionDay[], weekCount = 22) {
  const byDate = new Map(contributions.map((day) => [day.date, day.count]));
  const sortedDates = [...contributions].sort((a, b) => a.date.localeCompare(b.date));
  const endDate = sortedDates[sortedDates.length - 1]?.date;
  if (!endDate) {
    return [];
  }

  const { year, month, day } = parseDateParts(endDate);
  const end = new Date(Date.UTC(year, month - 1, day));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - weekCount * 7);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  const weeks: Array<Array<{ date: string; count: number }>> = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const week: Array<{ date: string; count: number }> = [];

    for (let i = 0; i < 7; i += 1) {
      const date = cursor.toISOString().slice(0, 10);
      week.push({ date, count: byDate.get(date) ?? 0 });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    weeks.push(week);
  }

  return weeks.slice(-weekCount);
}

export function getContributionLevel(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}
