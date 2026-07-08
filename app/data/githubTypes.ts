export type GitHubContributionDay = {
  date: string;
  count: number;
};

export type GitHubActivity = {
  username: string;
  profileUrl: string;
  avatarUrl?: string;
  name?: string;
  bio?: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  contributions: GitHubContributionDay[];
};
