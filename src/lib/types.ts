export type SkillGroup = { category: string; items: string[] };
export type Stat = { value: string; label: string };

export type Socials = {
  github?: string;
  linkedin?: string;
  scholar?: string;
  orcid?: string;
  researchgate?: string;
  twitter?: string;
};

export type Profile = {
  name: string;
  headline: string;
  roles: string[];
  intro: string;
  about: string;
  location: string;
  email: string;
  available: boolean;
  availabilityText: string;
  avatarUrl: string;
  resumeUrl: string;
  socials: Socials;
  stats: Stat[];
  skills: SkillGroup[];
};

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  tech: string[];
  imageUrl: string;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  order: number;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  companyUrl: string;
  location: string;
  employmentType: string;
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM, empty = present
  summary: string;
  highlights: string[];
  tech: string[];
  order: number;
};

export type Publication = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  type: string;
  status: string;
  abstract: string;
  url: string;
  pdfUrl: string;
  doi: string;
  codeUrl: string;
  featured: boolean;
  order: number;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type Portfolio = {
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  publications: Publication[];
};

export type CollectionName = "projects" | "experience" | "publications";
