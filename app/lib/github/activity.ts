import { unstable_cache } from "next/cache";
import type {
  GitHubActivity,
  GitHubContributionDay,
  GitHubLanguageStat,
  GitHubTopRepo,
} from "@/app/data/githubTypes";

const CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/v4";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  MDX: "#fcb32c",
  JSON: "#292929",
  Markdown: "#083fa1",
};

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
  public_gists?: number;
  followers?: number;
  following?: number;
};

type GitHubRepoResponse = {
  name: string;
  html_url: string;
  description?: string | null;
  stargazers_count?: number;
  language?: string | null;
};

function getGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

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

function getLanguageColor(name: string): string {
  return LANGUAGE_COLORS[name] ?? "#8b949e";
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
          level: getContributionLevel(day.contributionCount),
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
    level: typeof day.level === "number" ? day.level : getContributionLevel(day.count),
  }));
}

async function fetchGitHubUser(username: string): Promise<GitHubUserResponse | null> {
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers: getGitHubHeaders(),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as GitHubUserResponse;
}

async function fetchRepos(username: string): Promise<GitHubRepoResponse[]> {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=30&sort=updated`,
    {
      headers: getGitHubHeaders(),
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as GitHubRepoResponse[];
}

async function fetchLanguagesFromRepos(
  username: string,
  repos: GitHubRepoResponse[]
): Promise<GitHubLanguageStat[]> {
  const langTotals = new Map<string, number>();
  const sample = repos.slice(0, 12);

  await Promise.all(
    sample.map(async (repo) => {
      const response = await fetch(
        `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo.name)}/languages`,
        {
          headers: getGitHubHeaders(),
          next: { revalidate: 3600 },
        }
      );

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as Record<string, number>;
      Object.entries(payload).forEach(([language, bytes]) => {
        langTotals.set(language, (langTotals.get(language) ?? 0) + bytes);
      });
    })
  );

  const totalBytes = Array.from(langTotals.values()).reduce((sum, bytes) => sum + bytes, 0);
  if (totalBytes === 0) {
    return [];
  }

  return Array.from(langTotals.entries())
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
      color: getLanguageColor(name),
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);
}

async function fetchGitHubActivityUncached(githubUrl: string): Promise<GitHubActivity | null> {
  const username = parseGitHubUsername(githubUrl);
  if (!username) {
    return null;
  }

  const [contributions, user, repos] = await Promise.all([
    fetchContributions(username),
    fetchGitHubUser(username),
    fetchRepos(username),
  ]);

  if (contributions.length === 0 && !user) {
    return null;
  }

  const languages = await fetchLanguagesFromRepos(username, repos);
  const streaks = computeStreaks(contributions);

  const topRepos: GitHubTopRepo[] = repos
    .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
    .slice(0, 5)
    .map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description ?? undefined,
      stars: repo.stargazers_count ?? 0,
      language: repo.language ?? undefined,
    }));

  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0);

  return {
    username,
    profileUrl: user?.html_url ?? `https://github.com/${username}`,
    avatarUrl: user?.avatar_url,
    name: user?.name ?? undefined,
    bio: user?.bio ?? undefined,
    publicRepos: user?.public_repos ?? repos.length,
    publicGists: user?.public_gists ?? 0,
    followers: user?.followers ?? 0,
    following: user?.following ?? 0,
    totalStars,
    totalContributions: streaks.totalContributions,
    currentStreak: streaks.currentStreak,
    longestStreak: streaks.longestStreak,
    contributions,
    languages,
    topRepos,
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

export function getContributionLevel(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

export const GITHUB_HEATMAP_CELL_STEP = 14;

function getLastYearHeatmapRange() {
  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 364);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  return { start, end };
}

export function buildFullYearHeatmap(contributions: GitHubContributionDay[]) {
  const byDate = new Map(contributions.map((day) => [day.date, day]));
  const { start, end } = getLastYearHeatmapRange();

  const weeks: Array<Array<GitHubContributionDay & { level: number }>> = [];
  const cursor = new Date(start);
  let weekIndex = 0;
  const monthLabels: Array<{ label: string; weekIndex: number }> = [];
  let lastMonth = -1;

  while (cursor <= end) {
    const weekStartMonth = cursor.getUTCMonth();

    if (weekStartMonth !== lastMonth) {
      monthLabels.push({
        label: new Date(Date.UTC(cursor.getUTCFullYear(), weekStartMonth, 1)).toLocaleString(
          "en-US",
          { month: "short", timeZone: "UTC" }
        ),
        weekIndex,
      });
      lastMonth = weekStartMonth;
    }

    const week: Array<GitHubContributionDay & { level: number }> = [];

    for (let i = 0; i < 7; i += 1) {
      if (cursor > end) {
        week.push({
          date: cursor.toISOString().slice(0, 10),
          count: 0,
          level: 0,
        });
        cursor.setUTCDate(cursor.getUTCDate() + 1);
        continue;
      }

      const date = cursor.toISOString().slice(0, 10);
      const entry = byDate.get(date);
      const count = entry?.count ?? 0;
      week.push({
        date,
        count,
        level: entry?.level ?? getContributionLevel(count),
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    weeks.push(week);
    weekIndex += 1;
  }

  return { weeks, monthLabels };
}
