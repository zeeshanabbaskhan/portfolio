import type { GitHubActivity } from "@/app/data/githubTypes";
import { buildFullYearHeatmap, GITHUB_HEATMAP_CELL_STEP } from "@/app/lib/github/activity";

type GitHubSectionProps = {
  activity: GitHubActivity;
  heading: string;
  subtext: string;
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function GitHubSection({ activity, heading, subtext }: GitHubSectionProps) {
  const { weeks, monthLabels } = buildFullYearHeatmap(activity.contributions);

  return (
    <section id="github" className="github-section">
      <div className="github-section-wrap">
        <div className="github-section-intro scroll-reveal animate-fade-in-up revealed">
          <h2 className="github-section-heading">{heading}</h2>
          <p className="github-section-subtext">{subtext}</p>
        </div>

        <div className="github-section-card glass-card hover-lift hover-shine">
          <div className="github-profile-row">
            {activity.avatarUrl && (
              <img
                src={activity.avatarUrl}
                alt={`${activity.username} GitHub avatar`}
                className="github-avatar"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="github-profile-copy">
              <a
                href={activity.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="github-profile-name"
              >
                {activity.name ?? `@${activity.username}`}
              </a>
              <p className="github-profile-handle">@{activity.username}</p>
              {activity.bio && <p className="github-profile-bio">{activity.bio}</p>}
            </div>
            <a
              href={activity.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="github-profile-link"
            >
              View on GitHub
            </a>
          </div>

          <div className="github-stats-grid">
            <div className="github-stat">
              <strong>{activity.totalContributions.toLocaleString()}</strong>
              <span>Contributions</span>
            </div>
            <div className="github-stat">
              <strong>{activity.currentStreak}</strong>
              <span>Current Streak</span>
            </div>
            <div className="github-stat">
              <strong>{activity.longestStreak}</strong>
              <span>Longest Streak</span>
            </div>
            <div className="github-stat">
              <strong>{activity.publicRepos}</strong>
              <span>Public Repos</span>
            </div>
            <div className="github-stat">
              <strong>{activity.totalStars.toLocaleString()}</strong>
              <span>Total Stars</span>
            </div>
            <div className="github-stat">
              <strong>{activity.followers.toLocaleString()}</strong>
              <span>Followers</span>
            </div>
          </div>

          <div className="github-panels">
            <div className="github-panel github-panel-activity">
              <div className="github-activity-heatmap">
                <h3>Contribution Graph</h3>
                <div className="github-heatmap-layout">
                  <div className="github-day-labels">
                    {DAY_LABELS.map((label, index) => (
                      <span key={label} className={index % 2 === 0 ? "" : "muted"}>
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="github-heatmap-main">
                    <div
                      className="github-month-labels"
                      style={{
                        width: weeks.length * GITHUB_HEATMAP_CELL_STEP - 3,
                      }}
                    >
                      {monthLabels.map((month) => (
                        <span
                          key={`${month.label}-${month.weekIndex}`}
                          style={{ left: month.weekIndex * GITHUB_HEATMAP_CELL_STEP }}
                        >
                          {month.label}
                        </span>
                      ))}
                    </div>
                    <div className="github-heatmap" aria-label="GitHub contribution heatmap">
                      {weeks.map((week, weekIndex) => (
                        <div key={`week-${weekIndex}`} className="github-week">
                          {week.map((day) => (
                            <span
                              key={day.date}
                              className={`github-cell level-${day.level}`}
                              title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="github-legend">
                  <span>Less</span>
                  <span className="github-cell level-0" />
                  <span className="github-cell level-1" />
                  <span className="github-cell level-2" />
                  <span className="github-cell level-3" />
                  <span className="github-cell level-4" />
                  <span>More</span>
                </div>
              </div>

              <div className="github-activity-repos">
                <h3>Top Repositories</h3>
                {activity.topRepos.length === 0 ? (
                  <p className="github-empty">No public repositories found.</p>
                ) : (
                  <div className="github-repos">
                    {activity.topRepos.slice(0, 5).map((repo) => (
                      <a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-repo-box"
                        title={repo.description ?? repo.name}
                      >
                        <span className="github-repo-name">{repo.name}</span>
                        <span className="github-repo-stars">★ {repo.stars}</span>
                        {repo.language && (
                          <span className="github-repo-lang">{repo.language}</span>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="github-panel github-panel-languages">
              <h3>Top Languages</h3>
              {activity.languages.length === 0 ? (
                <p className="github-empty">No language data available yet.</p>
              ) : (
                <div className="github-languages">
                  {activity.languages.map((language) => (
                    <div key={language.name} className="github-language-row">
                      <div className="github-language-meta">
                        <span
                          className="github-language-dot"
                          style={{ background: language.color }}
                        />
                        <span className="github-language-name">{language.name}</span>
                        <span className="github-language-pct">{language.percentage}%</span>
                      </div>
                      <div className="github-language-bar">
                        <span
                          style={{
                            width: `${language.percentage}%`,
                            background: language.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
