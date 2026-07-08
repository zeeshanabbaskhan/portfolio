import type { GitHubActivity } from "@/app/data/githubTypes";
import {
  buildHeatmapWeeks,
  getContributionLevel,
} from "@/app/lib/github/activity";

type GitHubActivityCardProps = {
  activity: GitHubActivity;
};

export default function GitHubActivityCard({ activity }: GitHubActivityCardProps) {
  const weeks = buildHeatmapWeeks(activity.contributions, 22);

  return (
    <div className="hero-github-card">
      <div className="hero-github-header">
        <div>
          <span className="hero-github-kicker">GitHub Activity</span>
          <a
            href={activity.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-github-username"
          >
            @{activity.username}
          </a>
        </div>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="hero-github-icon">
          <path
            fill="currentColor"
            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-1.125-.615-2.25-.21-2.85.075-.96.405-1.725 1.125-2.475 1.125-.75 0-1.515-.72-2.475-1.125-.6-.285-1.725-.69-2.85.075-.51.285-1.095 1.35-1.23 1.695-.24.675-1.02 1.965-4.035 1.41 0 1.005-.015 1.95-.015 2.235 0 .315.225.675.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"
          />
        </svg>
      </div>

      <div className="hero-github-stats">
        <div className="hero-github-stat">
          <strong>{activity.currentStreak}</strong>
          <span>Current Streak</span>
        </div>
        <div className="hero-github-stat">
          <strong>{activity.longestStreak}</strong>
          <span>Longest Streak</span>
        </div>
        <div className="hero-github-stat">
          <strong>{activity.totalContributions.toLocaleString()}</strong>
          <span>Contributions</span>
        </div>
        <div className="hero-github-stat">
          <strong>{activity.publicRepos}</strong>
          <span>Public Repos</span>
        </div>
      </div>

      <div className="hero-github-meta">
        <span>{activity.followers.toLocaleString()} followers</span>
        <span>{activity.following.toLocaleString()} following</span>
      </div>

      <div className="hero-github-heatmap-wrap" aria-label="GitHub contribution heatmap">
        <div className="hero-github-heatmap">
          {weeks.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="hero-github-week">
              {week.map((day) => (
                <span
                  key={day.date}
                  className={`hero-github-cell level-${getContributionLevel(day.count)}`}
                  title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="hero-github-legend">
          <span>Less</span>
          <span className="hero-github-cell level-0" />
          <span className="hero-github-cell level-1" />
          <span className="hero-github-cell level-2" />
          <span className="hero-github-cell level-3" />
          <span className="hero-github-cell level-4" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
