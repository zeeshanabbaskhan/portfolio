import type { PortfolioData } from "./portfolioTypes";

export const defaultPortfolioData: PortfolioData = {
  profile: {
    name: "Muhammad Zeeshan Abbas",
    firstName: "Muhammad",
    role: "Full Stack Developer",
    tagline:
      "I craft modern web applications with React, Next.js, and the MERN stack. Focused on building performant, scalable solutions that deliver real business value.",
    location: "Islamabad, Pakistan",
    email: "zzabbaskhan830@email.com",
    linkedin: "https://www.linkedin.com/in/muhammad-zeeshan-abbas-82076a36b/",
    github: "https://github.com/zeeshan-890",
    imagePath: "/profilepic.png",
    availabilityText: "Available for new projects",
  },
  heroStats: [
    { value: "7+", label: "Projects Completed" },
    { value: "5+", label: "Technologies Mastered" },
  ],
  heroButtons: {
    downloadCv: "Download CV",
  },
  skills: [
    {
      title: "Frontend",
      skills: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "Backend",
      skills: ["Node.js", "Express.js", "MongoDB", "MySQL", "Spring Boot"],
    },
    {
      title: "Tools & DevOps",
      skills: ["Git", "GitHub", "Docker", "Postman", "VS Code", "npm"],
    },
  ],
  about: {
    heading: "About Me",
    subheading: "Key Highlights",
    paragraphs: [
      "As a dedicated MERN Full Stack Developer, I specialize in creating dynamic, responsive web applications using MongoDB, Express.js, React, and Node.js. My expertise extends to modern frameworks like Next.js and styling with Tailwind CSS.",
      "Currently pursuing my Bachelor's degree in Artificial Intelligence at NUST, I'm actively seeking opportunities to apply my skills in a professional environment. I'm passionate about clean code, user experience, and scalable solutions.",
    ],
    achievements: [
      "7+ projects completed",
      "5+ core technologies mastered",
      "100% commitment level",
      "24/7 learning mode",
    ],
  },
  githubSection: {
    heading: "GitHub Activity",
    subtext:
      "Open-source contributions, coding streaks, languages, and repository activity pulled live from GitHub.",
  },
  experienceSection: {
    heading: "Experience",
    subtext:
      "Professional journey across internships, freelance work, and product-focused engineering roles.",
  },
  experiences: [
    {
      id: "freelance-fullstack",
      role: "Freelance Full Stack Developer",
      company: "Self-employed",
      period: "2024 – Present",
      location: "Remote",
      description:
        "Building production-ready web applications for clients using React, Next.js, Node.js, and MongoDB.",
      highlights: [
        "Delivered 7+ full-stack projects from design to deployment",
        "Integrated payments, auth, and real-time features",
      ],
    },
    {
      id: "nust-ai-student",
      role: "BSc Artificial Intelligence",
      company: "NUST",
      period: "2022 – Present",
      location: "Islamabad, Pakistan",
      description:
        "Studying AI fundamentals while applying software engineering through MERN stack projects and coursework.",
      highlights: [
        "Focused on web development, databases, and applied AI",
        "Built academic and personal projects with modern tooling",
      ],
    },
  ],
  educationCertificationsSection: {
    heading: "Education & Certifications",
    subtext:
      "Academic background and professional credentials that support my work in software engineering and AI.",
    educationHeading: "Education",
    certificationsHeading: "Certifications",
  },
  education: [
    {
      id: "nust-bsc-ai",
      degree: "BSc Artificial Intelligence",
      institution: "National University of Sciences and Technology (NUST)",
      period: "2022 – Present",
      location: "Islamabad, Pakistan",
      description:
        "Studying AI fundamentals, software engineering, databases, and applied machine learning.",
      highlights: [
        "Coursework in web development, data structures, and AI systems",
        "Built academic and personal projects with modern MERN tooling",
      ],
    },
    {
      id: "fsc-pre-engineering",
      degree: "FSc Pre-Engineering",
      institution: "Local College",
      period: "2020 – 2022",
      location: "Pakistan",
      highlights: ["Mathematics, Physics, and Computer Science focus"],
    },
  ],
  certifications: [
    {
      id: "meta-front-end",
      title: "Meta Front-End Developer Professional Certificate",
      issuer: "Meta / Coursera",
      period: "2024",
      description: "React, JavaScript, HTML/CSS, and responsive UI development.",
    },
    {
      id: "google-it-automation",
      title: "Google IT Automation with Python",
      issuer: "Google / Coursera",
      period: "2023",
      description: "Python scripting, Git, troubleshooting, and automation workflows.",
    },
    {
      id: "freecodecamp-responsive",
      title: "Responsive Web Design",
      issuer: "freeCodeCamp",
      period: "2023",
      credentialUrl: "https://www.freecodecamp.org",
    },
  ],
  projectsSection: {
    heading: "Latest Projects",
    subtext:
      "Showcasing recently added projects with modern full-stack engineering, production workflows, and practical problem solving.",
    viewAllLabel: "View All Projects",
    featuredCount: 6,
  },
  projectsPage: {
    title: "All Projects",
    heading: "Complete Portfolio",
    description:
      "Explore the complete collection of {name}'s projects across full-stack systems, AI-first products, and frontend applications.",
    allLabel: "All",
  },
  projectCategories: [
    { id: "full-stack", label: "Full Stack" },
    { id: "web-app", label: "Web App" },
    { id: "gen-ai", label: "Gen AI" },
    { id: "agentic-ai", label: "Agentic AI" },
  ],
  projects: [
    {
      id: "viralix-ai-platform",
      title: "VIRALIX - AI Social Media Management Platform",
      shortDescription:
        "A full-stack AI-powered platform to manage, schedule, and analyze social media with smart captions, multi-platform publishing, and analytics.",
      technologies: [
        "Next.js 15",
        "React 19",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Google Gemini AI",
        "Meta Graph API",
      ],
      categoryId: "gen-ai",
      showOnHomepage: true,
      liveUrl: "www.viralix.dev/",
    },
    {
      id: "ecommerce-website",
      title: "Handphone E-Commerce Platform",
      shortDescription:
        "Production-ready full-stack e-commerce solution with Next.js storefront, Node.js/Express backend, Stripe payments, and admin dashboard.",
      technologies: [
        "Next.js 14",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Stripe API",
        "Cloudinary",
        "JWT",
      ],
      categoryId: "full-stack",
      showOnHomepage: true,
      liveUrl: "https://handphone.app.zeeshan-abbas.tech/",
      githubUrl: "https://github.com/zeeshan-890/handphone",
    },
    {
      id: "chat-videocall-app",
      title: "Converza - FullStack Realtime Chat & Video Call App",
      shortDescription:
        "MERN + Socket.IO + WebRTC app with real-time messaging, peer-to-peer video calls, JWT auth, and online presence.",
      technologies: [
        "React 18",
        "Socket.IO",
        "PeerJS",
        "WebRTC",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Docker",
      ],
      categoryId: "full-stack",
      showOnHomepage: true,
      liveUrl: "https://converza.app.zeeshan-abbas.tech",
      githubUrl: "https://github.com/zeeshan-890/Chat-App",
    },
    {
      id: "remote-vitals-monitoring",
      title: "Remote Vitals Monitoring System",
      shortDescription:
        "Healthcare monitoring platform for patients, doctors, and admins with vitals tracking, appointment flow, and role-based access.",
      technologies: [
        "Java",
        "Spring Boot",
        "Jakarta EE",
        "Spring Data JPA",
        "JavaFX",
        "MySQL",
        "Maven",
      ],
      categoryId: "full-stack",
      showOnHomepage: true,
      liveUrl:
        "https://drive.google.com/file/d/1_LwV-QvoZtN-33BFwwXDd1KQW6JqiFhM/view?usp=sharing",
      githubUrl: "https://github.com/zeeshan-890/RHMS",
    },
    {
      id: "nust-internship-system",
      title: "NUST Internship Management System",
      shortDescription:
        "Internship lifecycle platform for NUST students with application tracking, document management, and coordinator workflows.",
      technologies: ["JavaScript", "HTML", "CSS3", "Java", "Spring Boot"],
      categoryId: "full-stack",
      showOnHomepage: true,
      githubUrl: "https://github.com/zeeshan-890/Nust-Internship-Mangement-System",
    },
    {
      id: "weather-application",
      title: "Weather Application",
      shortDescription:
        "Weather app with real-time conditions, forecasts, and location search powered by OpenWeatherMap API.",
      technologies: ["HTML", "CSS", "JavaScript", "OpenWeatherMap API"],
      categoryId: "web-app",
      showOnHomepage: true,
      liveUrl: "https://weather-app-five-sooty-22.vercel.app/",
      githubUrl: "https://github.com/zeeshan-890/weather--app",
    },
    {
      id: "currency-converter",
      title: "Currency Converter",
      shortDescription:
        "Currency conversion app with live exchange rates, historical comparisons, and support for major world currencies.",
      technologies: ["HTML", "CSS", "JavaScript", "Currency Exchange API"],
      categoryId: "web-app",
      showOnHomepage: false,
      liveUrl: "https://currency-converter-tawny-phi.vercel.app/",
      githubUrl: "https://github.com/zeeshan-890/currency-Converter",
    },
    {
      id: "financer-app",
      title: "Financer - Personal & Group Finance Platform",
      shortDescription:
        "Full-stack finance platform with expense tracking, bill splitting, savings goals, reminders, and analytics dashboard.",
      technologies: [
        "Next.js 16",
        "React 19",
        "TypeScript",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Recharts",
      ],
      categoryId: "full-stack",
      showOnHomepage: false,
      liveUrl: "https://financer.app.zeeshan-abbas.tech/",
      githubUrl: "https://github.com/zeeshan-890/financer",
    },
  ],
  resumes: [],
  contact: {
    heading: "Let's Work Together",
    subtext:
      "I'm actively seeking opportunities to contribute to innovative products. Let's discuss how I can bring value to your team.",
    formTitle: "Send a Message",
    infoTitle: "Get in Touch",
    infoText:
      "Feel free to reach out through any channel. I'm always open to discussing projects, collaboration, and product ideas.",
    socialTitle: "Connect with me",
    namePlaceholder: "Your name",
    emailPlaceholder: "your.email@example.com",
    messagePlaceholder: "Tell me about your project...",
    submitLabel: "Send Message",
  },
  navigation: [
    { id: "about", label: "About Me", enabled: true },
    { id: "github", label: "GitHub", enabled: true },
    { id: "experience", label: "Experience", enabled: true },
    { id: "projects", label: "Projects", enabled: true },
    { id: "education", label: "Education", enabled: true },
    { id: "contact", label: "Contact", enabled: true },
  ],
  sections: {
    hero: true,
    skills: true,
    aboutCard: true,
    github: true,
    experience: true,
    projects: true,
    education: true,
    contact: true,
  },
  seo: {
    title: "Muhammad Zeeshan Abbas — Full Stack Developer",
    description:
      "Portfolio of Muhammad Zeeshan Abbas, Full Stack Developer specializing in React, Next.js, TypeScript, and MERN stack applications.",
    projectsTitle: "All Projects — Muhammad Zeeshan Abbas",
    projectsDescription:
      "Complete projects portfolio of Muhammad Zeeshan Abbas across full-stack and frontend development.",
  },
};
