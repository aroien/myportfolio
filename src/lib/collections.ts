import type { CollectionName } from "./types";

// Field definitions drive both the admin forms and server-side parsing.
export type FieldType = "text" | "textarea" | "url" | "tags" | "lines" | "checkbox" | "month" | "select";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: string[];
  half?: boolean;
};

export type CollectionConfig = {
  name: CollectionName;
  label: string;
  singular: string;
  description: string;
  titleField: string;
  subtitle: (item: Record<string, unknown>) => string;
  fields: Field[];
};

export const collections: Record<CollectionName, CollectionConfig> = {
  projects: {
    name: "projects",
    label: "Projects",
    singular: "Project",
    description: "Work you want to showcase. Featured projects get large cards at the top.",
    titleField: "title",
    subtitle: (i) => [i.category, i.year].filter(Boolean).join(" · "),
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "select", options: ["Full Stack", "Frontend", "Backend", "Mobile", "AI / ML", "Open Source"], half: true },
      { name: "year", label: "Year", type: "text", placeholder: "2025", half: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "tech", label: "Tech stack", type: "tags", placeholder: "Next.js, PostgreSQL, Prisma", help: "Comma separated" },
      { name: "imageUrl", label: "Cover image URL", type: "url", placeholder: "https://… or /images/project.png" },
      { name: "liveUrl", label: "Live URL", type: "url", half: true },
      { name: "repoUrl", label: "Source code URL", type: "url", half: true },
      { name: "featured", label: "Featured project", type: "checkbox" },
    ],
  },
  experience: {
    name: "experience",
    label: "Experience",
    singular: "Position",
    description: "Your job history, shown as a timeline. Leave the end date empty for your current role.",
    titleField: "role",
    subtitle: (i) => [i.company, i.endDate ? `${i.startDate} – ${i.endDate}` : `${i.startDate} – Present`].filter(Boolean).join(" · "),
    fields: [
      { name: "role", label: "Role / title", type: "text", required: true, half: true },
      { name: "company", label: "Company", type: "text", required: true, half: true },
      { name: "companyUrl", label: "Company website", type: "url", half: true },
      { name: "location", label: "Location", type: "text", placeholder: "Remote", half: true },
      { name: "employmentType", label: "Employment type", type: "select", options: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"], half: true },
      { name: "startDate", label: "Start date", type: "month", required: true, placeholder: "2024-01", half: true },
      { name: "endDate", label: "End date", type: "month", placeholder: "2025-06", help: "Empty = current role", half: true },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "highlights", label: "Key achievements", type: "lines", help: "One per line" },
      { name: "tech", label: "Technologies", type: "tags", help: "Comma separated" },
    ],
  },
  publications: {
    name: "publications",
    label: "Research",
    singular: "Paper",
    description: "Research papers and publications. Your name is highlighted automatically in the author list.",
    titleField: "title",
    subtitle: (i) => [i.venue, i.year].filter(Boolean).join(" · "),
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "authors", label: "Authors", type: "text", placeholder: "Your Name, Co-Author", help: "Comma separated, in order" },
      { name: "venue", label: "Venue (journal / conference)", type: "text" },
      { name: "year", label: "Year", type: "text", half: true },
      { name: "type", label: "Type", type: "select", options: ["Journal", "Conference", "Preprint", "Book Chapter", "Thesis", "Workshop"], half: true },
      { name: "status", label: "Status", type: "select", options: ["Published", "Accepted", "Under Review", "In Preparation"], half: true },
      { name: "doi", label: "DOI", type: "text", placeholder: "10.1000/xyz123", half: true },
      { name: "abstract", label: "Abstract", type: "textarea" },
      { name: "url", label: "Paper URL", type: "url", half: true },
      { name: "pdfUrl", label: "PDF URL", type: "url", half: true },
      { name: "codeUrl", label: "Code / dataset URL", type: "url" },
      { name: "featured", label: "Featured paper", type: "checkbox" },
    ],
  },
};

export function isCollection(name: string): name is CollectionName {
  return name in collections;
}

export function splitTags(value: string) {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

export function splitLines(value: string) {
  return value.split("\n").map((s) => s.trim()).filter(Boolean);
}

/** Turn submitted FormData into a document for the given collection. */
export function parseCollectionForm(name: CollectionName, form: FormData) {
  const data: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  for (const field of collections[name].fields) {
    const raw = String(form.get(field.name) ?? "").trim();
    if (field.type === "checkbox") {
      data[field.name] = form.get(field.name) === "on";
      continue;
    }
    if (field.required && !raw) errors[field.name] = `${field.label} is required`;
    if (field.type === "url" && raw && !/^(https?:\/\/|\/|mailto:)/.test(raw)) {
      errors[field.name] = "Must start with https://, / or mailto:";
    }
    if (field.type === "month" && raw && !/^\d{4}-(0[1-9]|1[0-2])$/.test(raw)) {
      errors[field.name] = "Use the format YYYY-MM";
    }
    if (field.type === "tags") data[field.name] = splitTags(raw);
    else if (field.type === "lines") data[field.name] = splitLines(raw);
    else data[field.name] = raw.slice(0, 5000);
  }
  return { data, errors };
}
