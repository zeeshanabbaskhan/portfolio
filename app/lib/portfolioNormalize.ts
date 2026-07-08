import { defaultPortfolioData } from "../data/defaultPortfolio";
import type {
  PortfolioData,
  PortfolioProject,
  ProjectCategory,
  SkillCategory,
  NavItem,
  PortfolioResume,
  ExperienceItem,
  EducationItem,
  CertificationItem,
} from "../data/portfolioTypes";
import { LEGACY_PROJECT_CATEGORY_MAP, createCategoryId } from "./projectUtils";

type NormalizeOptions = {
  /** When true, missing list fields stay empty instead of falling back to seed defaults. */
  fromStorage?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeProjectCategories(value: unknown): ProjectCategory[] {
  if (!Array.isArray(value) || value.length === 0) {
    return defaultPortfolioData.projectCategories;
  }

  return value.map((item, index) => {
    const source = isRecord(item) ? item : {};
    const label = asString(source.label, `Category ${index + 1}`);
    return {
      id: asString(source.id, createCategoryId(label)),
      label,
    };
  });
}

function normalizeProject(
  value: unknown,
  index: number,
  categories: ProjectCategory[],
  featuredCount: number
): PortfolioProject {
  const source = isRecord(value) ? value : {};
  const fallbackCategoryId = categories[0]?.id ?? "full-stack";

  let categoryId = asString(source.categoryId, "");
  if (!categoryId && typeof source.category === "string") {
    categoryId = LEGACY_PROJECT_CATEGORY_MAP[source.category] ?? fallbackCategoryId;
  }
  if (!categories.some((category) => category.id === categoryId)) {
    categoryId = fallbackCategoryId;
  }

  const githubUrlsSource = isRecord(source.githubUrls) ? source.githubUrls : undefined;
  const showOnHomepage =
    typeof source.showOnHomepage === "boolean" ? source.showOnHomepage : index < featuredCount;

  return {
    id: asString(source.id, `project-${index + 1}`),
    title: asString(source.title, "Untitled Project"),
    shortDescription: asString(source.shortDescription, ""),
    technologies: asStringArray(source.technologies, []),
    categoryId,
    showOnHomepage,
    liveUrl: typeof source.liveUrl === "string" ? source.liveUrl : undefined,
    githubUrl: typeof source.githubUrl === "string" ? source.githubUrl : undefined,
    githubUrls: githubUrlsSource
      ? {
          frontend:
            typeof githubUrlsSource.frontend === "string"
              ? githubUrlsSource.frontend
              : undefined,
          backend:
            typeof githubUrlsSource.backend === "string"
              ? githubUrlsSource.backend
              : undefined,
          fullProject:
            typeof githubUrlsSource.fullProject === "string"
              ? githubUrlsSource.fullProject
              : undefined,
        }
      : undefined,
  };
}

function normalizeSkills(value: unknown): SkillCategory[] {
  if (!Array.isArray(value)) {
    return defaultPortfolioData.skills;
  }

  return value.map((item, index) => {
    const source = isRecord(item) ? item : {};
    return {
      title: asString(source.title, `Category ${index + 1}`),
      skills: asStringArray(source.skills, []),
    };
  });
}

function normalizeExperience(value: unknown, index: number): ExperienceItem {
  const source = isRecord(value) ? value : {};
  return {
    id: asString(source.id, `experience-${index + 1}`),
    role: asString(source.role, "Role"),
    company: asString(source.company, "Company"),
    companyLogoUrl:
      typeof source.companyLogoUrl === "string" && source.companyLogoUrl.trim()
        ? source.companyLogoUrl.trim()
        : undefined,
    period: asString(source.period, "Period"),
    location: typeof source.location === "string" ? source.location : undefined,
    description: asString(source.description, ""),
    highlights: asStringArray(source.highlights, []),
  };
}

function normalizeEducation(value: unknown, index: number): EducationItem {
  const source = isRecord(value) ? value : {};
  return {
    id: asString(source.id, `education-${index + 1}`),
    degree: asString(source.degree, "Degree"),
    institution: asString(source.institution, "Institution"),
    period: asString(source.period, "Period"),
    location: typeof source.location === "string" ? source.location : undefined,
    description: typeof source.description === "string" ? source.description : undefined,
    highlights: asStringArray(source.highlights, []),
  };
}

function normalizeCertification(value: unknown, index: number): CertificationItem {
  const source = isRecord(value) ? value : {};
  return {
    id: asString(source.id, `certification-${index + 1}`),
    title: asString(source.title, "Certification"),
    issuer: asString(source.issuer, "Issuer"),
    period: typeof source.period === "string" ? source.period : undefined,
    credentialUrl: typeof source.credentialUrl === "string" ? source.credentialUrl : undefined,
    description: typeof source.description === "string" ? source.description : undefined,
  };
}

function normalizeNavigation(value: unknown): NavItem[] {
  const base: NavItem[] = Array.isArray(value)
    ? value.map((item) => {
        const source = isRecord(item) ? item : {};
        const id = source.id;
        const navId: NavItem["id"] =
          id === "about" ||
          id === "github" ||
          id === "experience" ||
          id === "projects" ||
          id === "education" ||
          id === "contact"
            ? id
            : "about";
        return {
          id: navId,
          label: asString(source.label, navId),
          enabled: typeof source.enabled === "boolean" ? source.enabled : true,
        };
      })
    : defaultPortfolioData.navigation;

  if (!base.some((item) => item.id === "experience")) {
    const aboutIndex = base.findIndex((item) => item.id === "about");
    const insertAt = aboutIndex >= 0 ? aboutIndex + 1 : base.length;
    base.splice(insertAt, 0, {
      id: "experience",
      label: "Experience",
      enabled: true,
    });
  }

  if (!base.some((item) => item.id === "github")) {
    const aboutIndex = base.findIndex((item) => item.id === "about");
    const insertAt = aboutIndex >= 0 ? aboutIndex + 1 : base.length;
    base.splice(insertAt, 0, {
      id: "github",
      label: "GitHub",
      enabled: true,
    });
  }

  if (!base.some((item) => item.id === "education")) {
    const projectsIndex = base.findIndex((item) => item.id === "projects");
    const insertAt = projectsIndex >= 0 ? projectsIndex + 1 : base.length;
    base.splice(insertAt, 0, {
      id: "education",
      label: "Education",
      enabled: true,
    });
  }

  return base;
}

export function normalizePortfolioData(
  input: unknown,
  options: NormalizeOptions = {}
): PortfolioData {
  const fromStorage = options.fromStorage ?? false;
  const partial = isRecord(input) ? input : {};
  const profileSource = isRecord(partial.profile) ? partial.profile : {};
  const aboutSource = isRecord(partial.about) ? partial.about : {};
  const githubSectionSource = isRecord(partial.githubSection) ? partial.githubSection : {};
  const experienceSectionSource = isRecord(partial.experienceSection)
    ? partial.experienceSection
    : {};
  const educationCertificationsSectionSource = isRecord(partial.educationCertificationsSection)
    ? partial.educationCertificationsSection
    : {};
  const projectsSectionSource = isRecord(partial.projectsSection) ? partial.projectsSection : {};
  const projectsPageSource = isRecord(partial.projectsPage) ? partial.projectsPage : {};
  const contactSource = isRecord(partial.contact) ? partial.contact : {};
  const sectionsSource = isRecord(partial.sections) ? partial.sections : {};
  const seoSource = isRecord(partial.seo) ? partial.seo : {};
  const heroButtonsSource = isRecord(partial.heroButtons) ? partial.heroButtons : {};

  const featuredCount =
    typeof projectsSectionSource.featuredCount === "number"
      ? Math.max(0, projectsSectionSource.featuredCount)
      : defaultPortfolioData.projectsSection.featuredCount;

  const projectCategories = normalizeProjectCategories(partial.projectCategories);

  const projects = Array.isArray(partial.projects)
    ? partial.projects.map((item, index) =>
        normalizeProject(item, index, projectCategories, featuredCount)
      )
    : fromStorage
      ? []
      : defaultPortfolioData.projects;

  const heroStats = Array.isArray(partial.heroStats)
    ? partial.heroStats.map((item, index) => {
        const source = isRecord(item) ? item : {};
        return {
          value: asString(source.value, defaultPortfolioData.heroStats[index]?.value ?? ""),
          label: asString(source.label, defaultPortfolioData.heroStats[index]?.label ?? ""),
        };
      })
    : fromStorage
      ? []
      : defaultPortfolioData.heroStats;

  const navigation = normalizeNavigation(partial.navigation);

  const experiences = Array.isArray(partial.experiences)
    ? partial.experiences.map(normalizeExperience)
    : fromStorage
      ? []
      : defaultPortfolioData.experiences;

  const education = Array.isArray(partial.education)
    ? partial.education.map(normalizeEducation)
    : fromStorage
      ? []
      : defaultPortfolioData.education;

  const certifications = Array.isArray(partial.certifications)
    ? partial.certifications.map(normalizeCertification)
    : fromStorage
      ? []
      : defaultPortfolioData.certifications;

  const resumes: PortfolioResume[] = Array.isArray(partial.resumes)
    ? partial.resumes
        .map((item, index) => {
          const source = isRecord(item) ? item : {};
          return {
            id: asString(source.id, `resume-${index + 1}`),
            title: asString(source.title, `Resume ${index + 1}`),
          };
        })
        .filter((item) => item.id && item.title)
    : fromStorage
      ? []
      : defaultPortfolioData.resumes;

  const legacyResumePath =
    isRecord(profileSource) && typeof profileSource.resumePath === "string"
      ? profileSource.resumePath
      : "";

  const normalizedResumes =
    resumes.length === 0 && legacyResumePath === "/api/resume"
      ? [{ id: "legacy", title: "Resume" }]
      : resumes;

  return {
    profile: {
      name: asString(profileSource.name, defaultPortfolioData.profile.name),
      firstName: asString(profileSource.firstName, defaultPortfolioData.profile.firstName),
      role: asString(profileSource.role, defaultPortfolioData.profile.role),
      tagline: asString(profileSource.tagline, defaultPortfolioData.profile.tagline),
      location: asString(profileSource.location, defaultPortfolioData.profile.location),
      email: asString(profileSource.email, defaultPortfolioData.profile.email),
      linkedin: asString(profileSource.linkedin, defaultPortfolioData.profile.linkedin),
      github: asString(profileSource.github, defaultPortfolioData.profile.github),
      imagePath: asString(profileSource.imagePath, defaultPortfolioData.profile.imagePath),
      availabilityText: asString(
        profileSource.availabilityText,
        defaultPortfolioData.profile.availabilityText
      ),
    },
    heroStats,
    heroButtons: {
      downloadCv: asString(
        heroButtonsSource.downloadCv,
        defaultPortfolioData.heroButtons.downloadCv
      ),
      viewWork: asString(heroButtonsSource.viewWork, defaultPortfolioData.heroButtons.viewWork),
    },
    skills: Array.isArray(partial.skills)
      ? normalizeSkills(partial.skills).slice(0, 6)
      : fromStorage
        ? []
        : defaultPortfolioData.skills,
    about: {
      heading: asString(aboutSource.heading, defaultPortfolioData.about.heading),
      subheading: asString(aboutSource.subheading, defaultPortfolioData.about.subheading),
      paragraphs: asStringArray(aboutSource.paragraphs, defaultPortfolioData.about.paragraphs),
      achievements: asStringArray(aboutSource.achievements, defaultPortfolioData.about.achievements),
    },
    githubSection: {
      heading: asString(githubSectionSource.heading, defaultPortfolioData.githubSection.heading),
      subtext: asString(githubSectionSource.subtext, defaultPortfolioData.githubSection.subtext),
    },
    experienceSection: {
      heading: asString(
        experienceSectionSource.heading,
        defaultPortfolioData.experienceSection.heading
      ),
      subtext: asString(
        experienceSectionSource.subtext,
        defaultPortfolioData.experienceSection.subtext
      ),
    },
    experiences,
    educationCertificationsSection: {
      heading: asString(
        educationCertificationsSectionSource.heading,
        defaultPortfolioData.educationCertificationsSection.heading
      ),
      subtext: asString(
        educationCertificationsSectionSource.subtext,
        defaultPortfolioData.educationCertificationsSection.subtext
      ),
      educationHeading: asString(
        educationCertificationsSectionSource.educationHeading,
        defaultPortfolioData.educationCertificationsSection.educationHeading
      ),
      certificationsHeading: asString(
        educationCertificationsSectionSource.certificationsHeading,
        defaultPortfolioData.educationCertificationsSection.certificationsHeading
      ),
    },
    education,
    certifications,
    projectsSection: {
      heading: asString(
        projectsSectionSource.heading,
        defaultPortfolioData.projectsSection.heading
      ),
      subtext: asString(
        projectsSectionSource.subtext,
        defaultPortfolioData.projectsSection.subtext
      ),
      viewAllLabel: asString(
        projectsSectionSource.viewAllLabel,
        defaultPortfolioData.projectsSection.viewAllLabel
      ),
      featuredCount,
    },
    projectsPage: {
      title: asString(projectsPageSource.title, defaultPortfolioData.projectsPage.title),
      heading: asString(projectsPageSource.heading, defaultPortfolioData.projectsPage.heading),
      description: asString(
        projectsPageSource.description,
        defaultPortfolioData.projectsPage.description
      ),
      allLabel: asString(projectsPageSource.allLabel, defaultPortfolioData.projectsPage.allLabel),
    },
    projectCategories,
    projects,
    resumes: normalizedResumes,
    contact: {
      heading: asString(contactSource.heading, defaultPortfolioData.contact.heading),
      subtext: asString(contactSource.subtext, defaultPortfolioData.contact.subtext),
      formTitle: asString(contactSource.formTitle, defaultPortfolioData.contact.formTitle),
      infoTitle: asString(contactSource.infoTitle, defaultPortfolioData.contact.infoTitle),
      infoText: asString(contactSource.infoText, defaultPortfolioData.contact.infoText),
      socialTitle: asString(contactSource.socialTitle, defaultPortfolioData.contact.socialTitle),
      namePlaceholder: asString(
        contactSource.namePlaceholder,
        defaultPortfolioData.contact.namePlaceholder
      ),
      emailPlaceholder: asString(
        contactSource.emailPlaceholder,
        defaultPortfolioData.contact.emailPlaceholder
      ),
      messagePlaceholder: asString(
        contactSource.messagePlaceholder,
        defaultPortfolioData.contact.messagePlaceholder
      ),
      submitLabel: asString(contactSource.submitLabel, defaultPortfolioData.contact.submitLabel),
    },
    navigation,
    sections: {
      hero:
        typeof sectionsSource.hero === "boolean"
          ? sectionsSource.hero
          : defaultPortfolioData.sections.hero,
      skills:
        typeof sectionsSource.skills === "boolean"
          ? sectionsSource.skills
          : defaultPortfolioData.sections.skills,
      aboutCard:
        typeof sectionsSource.aboutCard === "boolean"
          ? sectionsSource.aboutCard
          : defaultPortfolioData.sections.aboutCard,
      github:
        typeof sectionsSource.github === "boolean"
          ? sectionsSource.github
          : defaultPortfolioData.sections.github,
      experience:
        typeof sectionsSource.experience === "boolean"
          ? sectionsSource.experience
          : defaultPortfolioData.sections.experience,
      projects:
        typeof sectionsSource.projects === "boolean"
          ? sectionsSource.projects
          : defaultPortfolioData.sections.projects,
      education:
        typeof sectionsSource.education === "boolean"
          ? sectionsSource.education
          : defaultPortfolioData.sections.education,
      contact:
        typeof sectionsSource.contact === "boolean"
          ? sectionsSource.contact
          : defaultPortfolioData.sections.contact,
    },
    seo: {
      title: asString(seoSource.title, defaultPortfolioData.seo.title),
      description: asString(seoSource.description, defaultPortfolioData.seo.description),
      projectsTitle: asString(seoSource.projectsTitle, defaultPortfolioData.seo.projectsTitle),
      projectsDescription: asString(
        seoSource.projectsDescription,
        defaultPortfolioData.seo.projectsDescription
      ),
    },
  };
}
