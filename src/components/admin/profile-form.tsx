"use client";

import { useActionState, type ReactNode } from "react";
import { saveProfile, type FormState } from "@/app/actions/admin";
import type { Field } from "@/lib/collections";
import type { Profile } from "@/lib/types";
import { AvatarUpload } from "./avatar-upload";
import { ResumeUpload } from "./resume-upload";
import { FormField, PageHeader, SaveButton, submitWithoutReset } from "./ui";

function Card({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface shadow-sm shadow-slate-200/50 p-6">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

const f = (name: string, label: string, type: Field["type"] = "text", extra: Partial<Field> = {}): Field => ({ name, label, type, ...extra });

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProfile, undefined);
  const err = (k: string) => state?.errors?.[k];

  const values: Record<string, unknown> = {
    ...profile,
    ...profile.socials,
    roles: profile.roles,
    stats: profile.stats.map((s) => `${s.value} | ${s.label}`).join("\n"),
    skills: profile.skills.map((g) => `${g.category}: ${g.items.join(", ")}`).join("\n"),
  };

  const field = (def: Field) => <FormField key={def.name} field={def} defaultValue={values[def.name]} error={err(def.name)} />;

  return (
    <form onSubmit={submitWithoutReset(action)} className="mx-auto max-w-4xl">
      <PageHeader
        title="Profile & skills"
        description="Your name, intro, bio, links and skills. Changes go live as soon as you save."
        action={<SaveButton pending={pending} savedAt={state?.savedAt} />}
      />
      {state?.error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>}

      <div className="space-y-5">
        <Card title="Basics">
          {field(f("name", "Full name", "text", { required: true, half: true }))}
          {field(f("headline", "Headline", "text", { required: true, half: true, placeholder: "Full Stack Developer" }))}
          {field(f("roles", "Rotating hero titles", "lines", { help: "One per line" }))}
          {field(f("intro", "Hero intro", "textarea", { help: "1–2 sentences" }))}
          {field(f("about", "About me", "textarea", { help: "Blank line = new paragraph" }))}
          {field(f("location", "Location", "text", { half: true }))}
          {field(f("email", "Public email", "text", { half: true }))}
        </Card>

        <Card title="Availability">
          {field(f("available", "Show “available for work” badge", "checkbox"))}
          {field(f("availabilityText", "Badge text", "text", { placeholder: "Open to full-time roles & freelance projects" }))}
        </Card>

        <Card title="Profile photo" description="Shown as a circle above your name on the homepage.">
          <AvatarUpload current={profile.avatarUrl} />
        </Card>

        <Card title="Resume" description="Shown as the Resume button on your homepage.">
          <ResumeUpload current={profile.resumeUrl} />
        </Card>

        <Card title="Links">
          {field(f("github", "GitHub", "url", { half: true }))}
          {field(f("linkedin", "LinkedIn", "url", { half: true }))}
          {field(f("scholar", "Google Scholar", "url", { half: true }))}
          {field(f("orcid", "ORCID", "url", { half: true }))}
          {field(f("researchgate", "ResearchGate", "url", { half: true }))}
          {field(f("twitter", "X / Twitter", "url", { half: true }))}
        </Card>

        <Card title="Stats" description="Shown under your bio. Format: value | label, one per line.">
          {field(f("stats", "Stats", "lines", { placeholder: "3+ | Years experience" }))}
        </Card>

        <Card title="Skills" description="Format: Category: skill, skill, skill. One category per line.">
          {field(f("skills", "Skills", "lines", { placeholder: "Frontend: React, Next.js, TypeScript" }))}
        </Card>
      </div>

      <div className="sticky bottom-4 mt-6 flex justify-end">
        <div className="rounded-2xl border border-line bg-surface/90 p-2 shadow-2xl backdrop-blur">
          <SaveButton pending={pending} savedAt={state?.savedAt} />
        </div>
      </div>
    </form>
  );
}
