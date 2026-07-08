import type { CSSProperties } from "react";
import type { Metadata } from "next";
import GitHubSection from "./components/GitHubSection";
import PortfolioNavObserver from "./components/PortfolioNavObserver";
import PortfolioAnalytics from "./components/PortfolioAnalytics";
import ResumePickerButton from "./components/ResumePickerButton";
import type { PortfolioProject } from "./data/portfolioTypes";
import { getGitHubActivity } from "./lib/github/activity";
import { getFeaturedProjects, getPortfolioData } from "./lib/portfolioStore";
import { getProjectCategoryLabel } from "./lib/projectUtils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  return {
    title: data.seo.title,
    description: data.seo.description,
  };
}

const glowPositions = [
  { x: "86%", y: "10%" },
  { x: "80%", y: "6%" },
  { x: "6%", y: "6%" },
  { x: "20%", y: "8%" },
  { x: "84%", y: "22%" },
  { x: "95%", y: "16%" },
] as const;

function getProjectSecondaryLinks(project: PortfolioProject) {
  const links: Array<{ label: string; url: string }> = [];

  if (project.liveUrl) {
    links.push({ label: "Live Demo", url: project.liveUrl });
  }

  if (project.githubUrls?.frontend) {
    links.push({ label: "Frontend Code", url: project.githubUrls.frontend });
  }

  if (project.githubUrls?.backend) {
    links.push({ label: "Backend Code", url: project.githubUrls.backend });
  }

  if (project.githubUrls?.fullProject) {
    links.push({ label: "Code", url: project.githubUrls.fullProject });
  }

  if (!project.githubUrls && project.githubUrl) {
    links.push({ label: "Code", url: project.githubUrl });
  }

  return links;
}

function projectIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function getSkillsLayout(count: number) {
  if (count <= 3) {
    return { className: "", rows: count };
  }

  if (count === 4) {
    return { className: " hero-right-cols-2", rows: 2 };
  }

  return { className: " hero-right-cols-2", rows: 3 };
}

export default async function Home() {
  const data = await getPortfolioData();
  const { profile, heroStats, skills, about, contact, githubSection, experienceSection, experiences, educationCertificationsSection, education, certifications, projectsSection, projectCategories, sections, navigation, resumes } =
    data;
  const featuredProjects = getFeaturedProjects(data);
  const githubActivity =
    sections.github && profile.github ? await getGitHubActivity(profile.github) : null;
  const enabledNav = navigation.filter((item) => item.enabled);
  const skillsLayout = getSkillsLayout(skills.length);

  const nameParts = profile.name.split(" ");
  const firstLine = nameParts.slice(0, 1).join(" ");
  const secondLine = nameParts.slice(1).join(" ");

  return (
    <>
      <PortfolioAnalytics page="/" />
      <PortfolioNavObserver />
      <div className="portfolio-home">
        <div className="top-bar" />

        <nav className="side-nav">
          {enabledNav.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={index === 0 ? "active" : undefined}
              data-nav-target={item.id}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <nav className="mobile-dock-nav" aria-label="Mobile navigation">
          <div className="glass-card mobile-dock-inner">
            {enabledNav.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`mobile-dock-item${index === 0 ? " active" : ""}`}
                data-nav-target={item.id}
              >
                {item.id === "about" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
                {item.id === "github" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-.1.56-.18.88-.27A13.16 13.16 0 0 0 16 5c-.88 0-1.7.3-2.36.8A6.6 6.6 0 0 0 9 5c-.34 0-.67.03-1 .08A4.48 4.48 0 0 0 5.5 8.5c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                )}
                {item.id === "experience" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    <rect width="20" height="14" x="2" y="6" rx="2" />
                  </svg>
                )}
                {item.id === "projects" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    <rect width="20" height="14" x="2" y="6" rx="2" />
                  </svg>
                )}
                {item.id === "education" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                )}
                {item.id === "contact" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                )}
                <span>{item.label.split(" ")[0]}</span>
              </a>
            ))}
          </div>
        </nav>

        <main className="portfolio-main">
          <section id="about" itemScope itemType="https://schema.org/Person">
            {sections.hero && (
            <div className="hero-left glass-card hover-shine hover-lift animate-fade-in-left">
              <div>
                <h1 className="hero-name" itemProp="name">
                  {firstLine}
                  <br />
                  <span>{secondLine}</span>
                </h1>
                <p className="hero-tag" itemProp="jobTitle">
                  <span className="text-tech">&lt;</span>
                  <span>{profile.role}</span>
                  <span className="text-tech">/&gt;</span>
                </p>
                <p className="hero-desc" itemProp="description">
                  {profile.tagline}
                </p>

                <div className="hero-stats">
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="stat-box">
                      <span className="stat-num">{stat.value}</span>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-btns">
                <ResumePickerButton
                  resumes={resumes}
                  label={data.heroButtons.downloadCv}
                  className="btn-primary btn-shine"
                  icon={
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  }
                />
                <a href="#projects" className="btn-outline">
                  {data.heroButtons.viewWork}
                </a>
              </div>
            </div>
            )}

            {sections.hero && (
            <div className="hero-center glass-card hover-shine hover-lift animate-fade-in-up">
              <div className="hero-photo-area">
                <img
                  src={profile.imagePath}
                  alt={`${profile.name} - Full Stack Developer`}
                  className="hero-photo"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={270}
                  height={370}
                  itemProp="image"
                />
              </div>
              <div
                  className="hero-info"
                  itemProp="address"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                >
                <div className="info-row">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span itemProp="addressLocality">{profile.location}</span>
                </div>
                <div className="info-row">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <a href={`mailto:${profile.email}`} itemProp="email">
                    {profile.email}
                  </a>
                </div>
                <div className="info-row">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                  <button type="button">{profile.availabilityText}</button>
                </div>
              </div>
            </div>
            )}

            {sections.skills && skills.length > 0 && (
            <div
              className={`hero-right animate-fade-in-right${skillsLayout.className}`}
              style={{ "--skill-rows": skillsLayout.rows } as CSSProperties}
            >
              <p className="sr-only">
                Featured projects from {profile.name}: {data.projects.map((p) => p.title).join(", ")}
              </p>

              {skills.map((category, index) => (
                <div
                  key={`${category.title}-${index}`}
                  className="skill-card glass-card hover-shine hover-lift"
                  itemProp="knowsAbout"
                >
                  <div className="skill-card-header">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                    <h3>{category.title}</h3>
                  </div>
                  <div className="tags">
                    {category.skills.map((skill) => (
                      <span key={skill} className="tag" itemProp="knowsAbout">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            )}
          </section>

          {sections.aboutCard && (
          <div className="about-section animate-fade-in-up">
            <div className="glass-card about-card hover-lift hover-shine">
              <h2 className="about-heading">{about.heading}</h2>

              <div className="about-columns">
                {about.paragraphs.map((paragraph, index) => (
                  <div key={index}>
                    <p className="about-text">{paragraph}</p>
                  </div>
                ))}
              </div>

              <div className="about-achievements-wrap">
                <h4 className="about-subheading">{about.subheading}</h4>
                <div className="about-achievements-grid">
                  {about.achievements.map((item) => (
                    <div key={item} className="about-achievement">
                      <div className="about-dot" />
                      <span className="about-text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          )}

          {sections.github && githubActivity && (
            <GitHubSection
              activity={githubActivity}
              heading={githubSection.heading}
              subtext={githubSection.subtext}
            />
          )}

          {sections.experience && experiences.length > 0 && (
          <section id="experience" itemScope itemType="https://schema.org/ItemList">
            <div className="experience-wrap">
              <div className="experience-intro scroll-reveal animate-fade-in-up revealed">
                <h2 className="experience-heading" itemProp="name">
                  {experienceSection.heading}
                </h2>
                <p className="experience-subtext animate-fade-in-left" itemProp="description">
                  {experienceSection.subtext}
                </p>
              </div>

              <div className="experience-timeline">
                {experiences.map((item, index) => (
                  <article
                    key={item.id}
                    className="experience-card glass-card hover-lift hover-shine scroll-reveal revealed"
                    itemScope
                    itemType="https://schema.org/OrganizationRole"
                    itemProp="itemListElement"
                  >
                    <div className="experience-marker">
                      <span className="experience-marker-dot" />
                      {index < experiences.length - 1 && <span className="experience-marker-line" />}
                    </div>
                    <div className="experience-content">
                      <div className="experience-head">
                        <div className="experience-head-text">
                          <div className="experience-meta">
                            <span className="experience-period">{item.period}</span>
                            {item.location && (
                              <span className="experience-location">{item.location}</span>
                            )}
                          </div>
                          <h3 className="experience-role" itemProp="roleName">
                            {item.role}
                          </h3>
                          <p className="experience-company" itemProp="name">
                            {item.company}
                          </p>
                        </div>
                        {item.companyLogoUrl && (
                          <img
                            src={item.companyLogoUrl}
                            alt={`${item.company} logo`}
                            className="experience-company-logo"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      <p className="experience-description" itemProp="description">
                        {item.description}
                      </p>
                      {item.highlights.length > 0 && (
                        <ul className="experience-highlights">
                          {item.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
          )}

          {sections.projects && (
          <section id="projects" itemScope itemType="https://schema.org/ItemList">
            <div className="sr-only" aria-hidden="true">
              <h2>{profile.name} Latest Software Development Projects Portfolio</h2>
              <p>
                Featured projects by {profile.name}: {featuredProjects
                  .map((project) => project.title)
                  .join(", ")}
              </p>
            </div>

            <div className="projects-wrap">
              <div className="projects-intro scroll-reveal animate-fade-in-up revealed">
                <h2 className="projects-heading" itemProp="name">
                  {projectsSection.heading}
                </h2>
                <p className="projects-subtext animate-fade-in-left" itemProp="description">
                  {projectsSection.subtext}
                </p>
                <a className="projects-all-link glass-card hover-lift hover-shine" href="/projects">
                  {projectsSection.viewAllLabel}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>

              <div className="projects-modern-grid">
                {featuredProjects.map((project, index) => {
                  const glow = glowPositions[index % glowPositions.length];
                  const style = {
                    "--glow-x": glow.x,
                    "--glow-y": glow.y,
                  } as CSSProperties;

                  const secondaryLinks = getProjectSecondaryLinks(project);

                  return (
                    <article
                      key={project.id}
                      className="project-glow-card glass-card scroll-reveal revealed"
                      style={style}
                      itemScope
                      itemType="https://schema.org/CreativeWork"
                      itemProp="itemListElement"
                    >
                      <div className="project-glow" />
                      <div className="project-glow-inner">
                        <div className="project-head">
                          <div className="project-icon-box">{projectIcon()}</div>
                          <span className="project-genre" itemProp="genre">
                            {getProjectCategoryLabel(project, projectCategories)}
                          </span>
                          <h3 className="project-name" itemProp="name">
                            {project.title}
                          </h3>
                        </div>
                        <div className="project-body">
                          <p className="project-description" itemProp="description">
                            {project.shortDescription}
                          </p>
                          <div className="project-tech-list">
                            {project.technologies.slice(0, 8).map((tech) => (
                              <span key={tech} className="project-tech" itemProp="about">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="project-actions-modern">
                            {secondaryLinks.slice(0, 2).map((link) => (
                              <a
                                key={`${project.id}-${link.label}`}
                                className="project-action-btn"
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M15 3h6v6" />
                                  <path d="M10 14 21 3" />
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                </svg>
                                {link.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="projects-footer scroll-reveal animate-fade-in-up revealed">
                <a className="projects-all-link glass-card hover-lift hover-shine" href="/projects">
                  {projectsSection.viewAllLabel}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
          )}

          {sections.education && (education.length > 0 || certifications.length > 0) && (
          <section id="education">
            <div className="edu-cert-wrap">
              <div className="edu-cert-intro scroll-reveal animate-fade-in-up revealed">
                <h2 className="edu-cert-heading">{educationCertificationsSection.heading}</h2>
                <p className="edu-cert-subtext">{educationCertificationsSection.subtext}</p>
              </div>

              <div className="edu-cert-columns">
                <div className="edu-cert-column">
                  <h3 className="edu-cert-column-heading">
                    {educationCertificationsSection.educationHeading}
                  </h3>
                  <div className="edu-cert-list">
                    {education.map((item) => (
                      <article
                        key={item.id}
                        className="edu-cert-card glass-card hover-lift hover-shine scroll-reveal revealed"
                        itemScope
                        itemType="https://schema.org/EducationalOccupationalCredential"
                      >
                        <div className="edu-cert-meta">
                          <span className="edu-cert-period">{item.period}</span>
                          {item.location && (
                            <span className="edu-cert-location">{item.location}</span>
                          )}
                        </div>
                        <h4 className="edu-cert-title" itemProp="name">
                          {item.degree}
                        </h4>
                        <p className="edu-cert-subtitle" itemProp="credentialCategory">
                          {item.institution}
                        </p>
                        {item.description && (
                          <p className="edu-cert-description">{item.description}</p>
                        )}
                        {item.highlights.length > 0 && (
                          <ul className="edu-cert-highlights">
                            {item.highlights.map((highlight) => (
                              <li key={`${item.id}-${highlight}`}>{highlight}</li>
                            ))}
                          </ul>
                        )}
                      </article>
                    ))}
                  </div>
                </div>

                <div className="edu-cert-column">
                  <h3 className="edu-cert-column-heading">
                    {educationCertificationsSection.certificationsHeading}
                  </h3>
                  <div className="edu-cert-list">
                    {certifications.map((item) => (
                      <article
                        key={item.id}
                        className="edu-cert-card glass-card hover-lift hover-shine scroll-reveal revealed"
                        itemScope
                        itemType="https://schema.org/Certification"
                      >
                        <div className="edu-cert-meta">
                          {item.period && <span className="edu-cert-period">{item.period}</span>}
                        </div>
                        <h4 className="edu-cert-title" itemProp="name">
                          {item.credentialUrl ? (
                            <a
                              href={item.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.title}
                            </a>
                          ) : (
                            item.title
                          )}
                        </h4>
                        <p className="edu-cert-subtitle" itemProp="recognizedBy">
                          {item.issuer}
                        </p>
                        {item.description && (
                          <p className="edu-cert-description">{item.description}</p>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          )}

          <div className="section-divider" />

          {sections.contact && (
          <section id="contact">
            <div className="contact-wrap">
              <div className="contact-intro scroll-reveal animate-fade-in-up revealed">
                <h2 className="contact-heading hover-glow">{contact.heading}</h2>
                <p className="contact-subtext animate-fade-in-up">
                  {contact.subtext}
                </p>
              </div>

              <div className="contact-panels">
                <div className="contact-card glass-card hover-lift hover-shine scroll-reveal animate-fade-in-up revealed">
                  <h3 className="contact-card-title">{contact.formTitle}</h3>
                  <form className="contact-form">
                    <div className="contact-form-grid">
                      <div className="contact-field">
                        <label htmlFor="name" className="contact-label">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="contact-input"
                          placeholder={contact.namePlaceholder}
                        />
                      </div>
                      <div className="contact-field">
                        <label htmlFor="email" className="contact-label">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="contact-input"
                          placeholder={contact.emailPlaceholder}
                        />
                      </div>
                    </div>

                    <div className="contact-field">
                      <label htmlFor="message" className="contact-label">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={8}
                        className="contact-textarea"
                        placeholder={contact.messagePlaceholder}
                      />
                    </div>

                    <button type="submit" className="contact-submit btn-shine">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                        <path d="m21.854 2.147-10.94 10.939" />
                      </svg>
                      {contact.submitLabel}
                    </button>
                  </form>
                </div>

                <div
                  className="contact-card glass-card hover-lift hover-shine scroll-reveal animate-fade-in-right revealed"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <h3 className="contact-card-title">{contact.infoTitle}</h3>
                  <p className="contact-info-text">
                    {contact.infoText}
                  </p>

                  <div className="contact-meta">
                    <div>
                      <h4>Email</h4>
                      <p>{profile.email}</p>
                    </div>
                    <div>
                      <h4>Location</h4>
                      <p>{profile.location}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <ResumePickerButton
                      resumes={resumes}
                      label={data.heroButtons.downloadCv}
                      className="contact-download"
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                      }
                    />
                  </div>

                  <div className="contact-social-wrap">
                    <h4 className="contact-social-title">{contact.socialTitle}</h4>
                    <div className="contact-social-grid">
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-chip social-github"
                        aria-label="GitHub"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                      </a>
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-chip social-linkedin"
                        aria-label="LinkedIn"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                      <a href={`mailto:${profile.email}`} className="social-chip" aria-label="Email">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          )}
        </main>
      </div>
    </>
  );
}
