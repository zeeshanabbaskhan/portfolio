export type GitHubContributionDay = {
  date: string;
  count: number;
  level?: number;
};

export type GitHubLanguageStat = {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
};

export type GitHubTopRepo = {
  name: string;
  url: string;
  description?: string;
  stars: number;
  language?: string;
};

export type GitHubActivity = {
  username: string;
  profileUrl: string;
  avatarUrl?: string;
  name?: string;
  bio?: string;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  totalStars: number;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  contributions: GitHubContributionDay[];
  languages: GitHubLanguageStat[];
  topRepos: GitHubTopRepo[];
};
