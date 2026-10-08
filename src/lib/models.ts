import "server-only";
import mongoose, { Schema, type Model } from "mongoose";

const opts = { timestamps: true, versionKey: false } as const;

const ProfileSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    name: String,
    headline: String,
    roles: [String],
    intro: String,
    about: String,
    location: String,
    email: String,
    available: Boolean,
    availabilityText: String,
    avatarUrl: String,
    resumeUrl: String,
    socials: {
      github: String,
      linkedin: String,
      scholar: String,
      orcid: String,
      researchgate: String,
      twitter: String,
    },
    stats: [{ _id: false, value: String, label: String }],
    skills: [{ _id: false, category: String, items: [String] }],
  },
  opts,
);

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    year: String,
    tech: [String],
    imageUrl: String,
    liveUrl: String,
    repoUrl: String,
    featured: Boolean,
    order: { type: Number, default: 0, index: true },
  },
  opts,
);

const ExperienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    companyUrl: String,
    location: String,
    employmentType: String,
    startDate: String,
    endDate: String,
    summary: String,
    highlights: [String],
    tech: [String],
    order: { type: Number, default: 0, index: true },
  },
  opts,
);

const PublicationSchema = new Schema(
  {
    title: { type: String, required: true },
    authors: String,
    venue: String,
    year: String,
    type: String,
    status: String,
    abstract: String,
    url: String,
    pdfUrl: String,
    doi: String,
    codeUrl: String,
    featured: Boolean,
    order: { type: Number, default: 0, index: true },
  },
  opts,
);

const MessageSchema = new Schema(
  {
    name: String,
    email: String,
    subject: String,
    body: String,
    read: { type: Boolean, default: false },
  },
  opts,
);

// Uploaded binary files (e.g. the profile photo), kept out of the profile doc.
const AssetSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    filename: String,
    size: Number,
  },
  opts,
);

// Daily visit totals (no personal data or IDs are stored).
const PageViewSchema = new Schema(
  {
    day: { type: String, required: true, unique: true }, // YYYY-MM-DD (UTC)
    views: { type: Number, default: 0 },
    visitors: { type: Number, default: 0 },
  },
  { versionKey: false },
);

type Doc = Record<string, unknown>;

function model(name: string, schema: Schema): Model<Doc> {
  return (mongoose.models[name] as Model<Doc>) ?? mongoose.model<Doc>(name, schema);
}

export const ProfileModel = model("Profile", ProfileSchema);
export const ProjectModel = model("Project", ProjectSchema);
export const ExperienceModel = model("Experience", ExperienceSchema);
export const PublicationModel = model("Publication", PublicationSchema);
export const MessageModel = model("Message", MessageSchema);
export const AssetModel = model("Asset", AssetSchema);
export const PageViewModel = model("PageView", PageViewSchema);

export const collectionModels = {
  projects: ProjectModel,
  experience: ExperienceModel,
  publications: PublicationModel,
};
