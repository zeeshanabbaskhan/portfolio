export type SkillCategory = {
  title: string;
  skills: string[];
};

export type ProjectCategory = {
  id: string;
  label: string;
};

export type PortfolioProject = {
  id: string;
  title: string;
  shortDescription: string;
  technologies: string[];
  categoryId: string;
  showOnHomepage: boolean;
  liveUrl?: string;
  githubUrl?: string;
  githubUrls?: {
    frontend?: string;
    backend?: string;
    fullProject?: string;
  };
};

export type NavItem = {
  id: "about" | "github" | "experience" | "projects" | "education" | "contact";
  label: string;
  enabled: boolean;
};

export type SectionVisibility = {
  hero: boolean;
  skills: boolean;
  aboutCard: boolean;
  experience: boolean;
  projects: boolean;
  education: boolean;
  contact: boolean;
  github: boolean;
};

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  companyLogoUrl?: string;
  period: string;
  location?: string;
  description: string;
  highlights: string[];
};

export type EducationItem = {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location?: string;
  description?: string;
  highlights: string[];
};

export type CertificationItem = {
  id: string;
  title: string;
  issuer: string;
  period?: string;
  credentialUrl?: string;
  description?: string;
};

export type PortfolioResume = {
  id: string;
  title: string;
};

export type PortfolioData = {
  profile: {
    name: string;
    firstName: string;
    role: string;
    tagline: string;
    location: string;
    email: string;
    linkedin: string;
    github: string;
    imagePath: string;
    availabilityText: string;
  };
  heroStats: Array<{ value: string; label: string }>;
  heroButtons: {
    downloadCv: string;
    viewWork: string;
  };
  skills: SkillCategory[];
  about: {
    heading: string;
    subheading: string;
    paragraphs: string[];
    achievements: string[];
  };
  githubSection: {
    heading: string;
    subtext: string;
  };
  experienceSection: {
    heading: string;
    subtext: string;
  };
  experiences: ExperienceItem[];
  educationCertificationsSection: {
    heading: string;
    subtext: string;
    educationHeading: string;
    certificationsHeading: string;
  };
  education: EducationItem[];
  certifications: CertificationItem[];
  projectsSection: {
    heading: string;
    subtext: string;
    viewAllLabel: string;
    featuredCount: number;
  };
  projectsPage: {
    title: string;
    heading: string;
    description: string;
    allLabel: string;
  };
  projectCategories: ProjectCategory[];
  projects: PortfolioProject[];
  resumes: PortfolioResume[];
  contact: {
    heading: string;
    subtext: string;
    formTitle: string;
    infoTitle: string;
    infoText: string;
    socialTitle: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    submitLabel: string;
  };
  navigation: NavItem[];
  sections: SectionVisibility;
  seo: {
    title: string;
    description: string;
    projectsTitle: string;
    projectsDescription: string;
  };
};
