import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { groupByCompany, formatDuration, type CompanyGroup } from "@/lib/experience";
import { formatMonth } from "@/lib/format";
import type { Experience, Profile, Project, Publication } from "@/lib/types";
import { GithubIcon } from "./icons";
import { FadeIn } from "./motion";

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-label={title} className="mb-16 scroll-mt-16 md:mb-24 lg:mb-32 lg:scroll-mt-24">
      {/* Sticky heading on small screens; the side nav replaces it on desktop. */}
      <div className="sticky top-0 z-20 -mx-6 mb-6 bg-paper/85 px-6 py-4 backdrop-blur md:-mx-12 md:px-12 lg:sr-only">
        <h2 className="text-xs font-semibold tracking-widest text-ember uppercase">{title}</h2>
      </div>
      <FadeIn>{children}</FadeIn>
    </section>
  );
}

function Tags({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="rounded-full bg-ember-soft px-2.5 py-0.5 text-xs font-medium text-ember-ink">{t}</li>
      ))}
    </ul>
  );
}

/** White card on the tinted page; lifts slightly on hover. */
const card = "rounded-xl border border-rule bg-card shadow-sm shadow-ink/5";
const rowClass = `group relative grid gap-2 p-5 transition duration-200 sm:grid-cols-8 sm:gap-6 sm:p-6 hover:-translate-y-0.5 hover:border-ember/40 hover:shadow-lg hover:shadow-ember/10 ${card}`;
/** Makes the whole card clickable through the title link. */
const stretched = "absolute inset-0 rounded-xl";

export function About({ profile }: { profile: Profile }) {
  return (
    <Section id="about" title="About">
      <div className="space-y-4 leading-relaxed text-ink-2">
        {profile.about.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
      </div>
      {profile.stats.length > 0 && (
        <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {profile.stats.map((s) => (
            <div key={s.label} className={`${card} p-4`}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-2xl font-semibold tracking-tight text-ember">{s.value}</dd>
              <dd className="mt-1 text-xs text-ink-3">{s.label}</dd>
            </div>
          ))}
        </dl>
      )}
    </Section>
  );
}

function CompanyBadge({ name }: { name: string }) {
  const initials = name.split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-ember-soft text-sm font-semibold text-ember-ink ring-1 ring-ember/20">
      {initials}
    </div>
  );
}

function CompanyName({ group }: { group: CompanyGroup }) {
  if (!group.companyUrl) return <>{group.company}</>;
  return (
    <a href={group.companyUrl} target="_blank" rel="noreferrer" className="group/link inline-flex items-baseline hover:text-ember">
      {group.company}
      <ArrowUpRight className="ml-1 size-4 shrink-0 translate-y-0.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0" />
    </a>
  );
}

function RoleDetails({ job }: { job: Experience }) {
  return (
    <>
      {job.summary && <p className="mt-2 text-sm leading-relaxed text-ink-2">{job.summary}</p>}
      {job.highlights.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-ink-2 marker:text-rule-strong">
          {job.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      )}
      <Tags items={job.tech} />
    </>
  );
}

const dates = (job: Experience, now: string) => {
  const range = `${formatMonth(job.startDate)} – ${job.endDate ? formatMonth(job.endDate) : "Present"}`;
  const length = formatDuration(job.startDate, job.endDate, now);
  return length ? `${range} · ${length}` : range;
};

/** LinkedIn-style: one card per company; multiple roles sit on a timeline under the company header. */
export function ExperienceList({ jobs, resumeUrl, now }: { jobs: Experience[]; resumeUrl: string; now: string }) {
  if (!jobs.length) return null;
  const groups = groupByCompany(jobs);
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-4">
        {groups.map((group) => (
          <li key={group.key} className={`p-5 transition duration-200 hover:border-ember/40 hover:shadow-lg hover:shadow-ember/10 sm:p-6 ${card}`}>
            {group.roles.length === 1 ? (
              // Single role: logo · title · company · dates
              <div className="flex gap-4">
                <CompanyBadge name={group.company} />
                <div className="min-w-0 flex-1">
                  <h3 className="leading-snug font-semibold text-ink">{group.roles[0].role}</h3>
                  <p className="text-sm text-ink-2">
                    <CompanyName group={group} />
                    {group.roles[0].employmentType && <> · {group.roles[0].employmentType}</>}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-3">{dates(group.roles[0], now)}</p>
                  {group.roles[0].location && <p className="text-sm text-ink-3">{group.roles[0].location}</p>}
                  <RoleDetails job={group.roles[0]} />
                </div>
              </div>
            ) : (
              // Several roles: company header + timeline of roles (newest first)
              <>
                <div className="flex gap-4">
                  <CompanyBadge name={group.company} />
                  <div className="min-w-0">
                    <h3 className="leading-snug font-semibold text-ink">
                      <CompanyName group={group} />
                    </h3>
                    <p className="text-sm text-ink-2">
                      {[group.employmentType, formatDuration(group.start, group.end, now)].filter(Boolean).join(" · ")}
                    </p>
                    {group.location && <p className="text-sm text-ink-3">{group.location}</p>}
                  </div>
                </div>
                <ol className="mt-5">
                  {group.roles.map((job, i) => {
                    const last = i === group.roles.length - 1;
                    return (
                      <li key={job.id} className="relative pb-6 pl-16 last:pb-0">
                        {/* Timeline line + dot, centred under the company badge */}
                        {!last && <span aria-hidden className="absolute top-4 bottom-0 left-6 w-px -translate-x-1/2 bg-rule-strong" />}
                        <span
                          aria-hidden
                          className={`absolute top-1.5 left-6 size-3 -translate-x-1/2 rounded-full border-2 ${
                            job.endDate ? "border-rule-strong bg-card" : "border-ember bg-ember shadow-[0_0_0_4px] shadow-ember/15"
                          }`}
                        />
                        <h4 className="leading-snug font-semibold text-ink">{job.role}</h4>
                        <p className="text-sm text-ink-3">
                          {[!group.employmentType && job.employmentType, dates(job, now)].filter(Boolean).join(" · ")}
                        </p>
                        {!group.location && job.location && <p className="text-sm text-ink-3">{job.location}</p>}
                        <RoleDetails job={job} />
                      </li>
                    );
                  })}
                </ol>
              </>
            )}
          </li>
        ))}
      </ol>
      {/* {resumeUrl && (
        <a href={resumeUrl} target="_blank" rel="noreferrer" className="group mt-12 inline-flex items-center text-sm font-semibold text-ink hover:text-ember">
          View full résumé
          <ArrowUpRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      )} */}
    </Section>
  );
}

export function ProjectList({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  const sorted = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];
  return (
    <Section id="projects" title="Projects">
      <ul className="space-y-4">
        {sorted.map((project) => {
          const href = project.liveUrl || project.repoUrl;
          return (
            <li key={project.id}>
              <div className={rowClass}>
                  <div className="order-2 sm:order-1 sm:col-span-2">
                  {project.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.imageUrl} alt="" loading="lazy" className="aspect-video w-full max-w-48 rounded-md border border-rule object-cover sm:mt-1" />
                  ) : (
                    <div className="hidden aspect-video w-full max-w-48 items-center justify-center rounded border border-rule bg-gradient-to-br from-ember-soft to-chip text-xs font-semibold text-ember sm:mt-1 sm:flex">
                      {project.title.split(" ").map((w) => w[0]).join("").slice(0, 3)}
                    </div>
                  )}
                </div>
                <div className="order-1 sm:order-2 sm:col-span-6">
                  <h3 className="flex items-center gap-2 leading-snug font-medium text-ink">
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer" className="group/link inline-flex items-baseline hover:text-ember focus-visible:text-ember">
                        <span className={stretched} />
                        {project.title}
                        <ArrowUpRight className="ml-1 size-4 shrink-0 translate-y-0.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0" />
                      </a>
                    ) : (
                      project.title
                    )}
                    {project.featured && <span className="rounded-full bg-ember-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-ember-ink uppercase ring-1 ring-ember/30">Featured</span>}
                  </h3>
                  {(project.category || project.year) && (
                    <p className="mt-0.5 text-sm text-ink-3">{[project.category, project.year].filter(Boolean).join(" · ")}</p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{project.description}</p>
                  {project.repoUrl && project.liveUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="relative z-20 mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ember">
                      <GithubIcon className="size-4" /> Source
                    </a>
                  )}
                  <Tags items={project.tech} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function Authors({ authors, me }: { authors: string; me: string }) {
  const list = authors.split(",").map((a) => a.trim()).filter(Boolean);
  return (
    <>
      {list.map((a, i) => (
        <Fragment key={i}>
          {i > 0 && ", "}
          {a.toLowerCase() === me.toLowerCase() ? <span className="font-medium text-ink">{a}</span> : a}
        </Fragment>
      ))}
    </>
  );
}

export function ResearchList({ papers, me, scholarUrl }: { papers: Publication[]; me: string; scholarUrl?: string }) {
  if (!papers.length) return null;
  return (
    <Section id="research" title="Research">
      <ol className="space-y-4">
        {papers.map((paper) => {
          const doi = paper.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, "");
          const links = [
            paper.pdfUrl && { label: "PDF", href: paper.pdfUrl },
            doi && { label: "DOI", href: `https://doi.org/${doi}` },
            paper.codeUrl && { label: "Code", href: paper.codeUrl },
          ].filter(Boolean) as { label: string; href: string }[];
          return (
            <li key={paper.id} className={`grid gap-2 p-5 sm:grid-cols-8 sm:gap-6 sm:p-6 ${card}`}>
              <p className="mt-1 text-xs font-medium tracking-wide text-ember/90 uppercase sm:col-span-2">
                {paper.year}
                {paper.type && <span className="block font-normal normal-case tracking-normal text-ink-4">{paper.type}</span>}
              </p>
              <div className="sm:col-span-6">
                <h3 className="leading-snug font-medium text-ink">
                  {paper.url ? (
                    <a href={paper.url} target="_blank" rel="noreferrer" className="hover:text-ember">{paper.title}</a>
                  ) : (
                    paper.title
                  )}
                </h3>
                {paper.authors && <p className="mt-1 text-sm text-ink-3"><Authors authors={paper.authors} me={me} /></p>}
                {(paper.venue || paper.status) && (
                  <p className="mt-1 text-sm text-ink-2">
                    {paper.venue && <span className="italic">{paper.venue}</span>}
                    {paper.status && paper.status !== "Published" && (
                      <span className="ml-2 rounded-full bg-chip px-2 py-0.5 text-xs text-ink-2 not-italic ring-1 ring-rule-strong">{paper.status}</span>
                    )}
                  </p>
                )}
                {(links.length > 0 || paper.abstract) && (
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    {links.map((l) => (
                      <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center font-medium text-ember hover:text-ember-deep">
                        {l.label}
                        <ArrowUpRight className="ml-0.5 size-3.5" />
                      </a>
                    ))}
                  </div>
                )}
                {paper.abstract && (
                  <details className="group mt-2">
                    <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-ink-3 select-none hover:text-ink [&::-webkit-details-marker]:hidden">
                      Abstract <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 border-l-2 border-ember/40 pl-4 text-sm leading-relaxed text-ink-2">{paper.abstract}</p>
                  </details>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {scholarUrl && (
        <a href={scholarUrl} target="_blank" rel="noreferrer" className="group mt-10 inline-flex items-center text-sm font-semibold text-ink hover:text-ember">
          All publications on Google Scholar
          <ArrowUpRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      )}
    </Section>
  );
}

export function SkillList({ profile }: { profile: Profile }) {
  if (!profile.skills.length) return null;
  return (
    <Section id="skills" title="Skills">
      <dl className={`divide-y divide-rule px-5 sm:px-6 ${card}`}>
        {profile.skills.map((group) => (
          <div key={group.category} className="grid gap-2 py-4 sm:grid-cols-8 sm:gap-6">
            <dt className="text-xs font-medium tracking-wide text-ember/90 uppercase sm:col-span-2 sm:mt-1">{group.category}</dt>
            <dd className="flex flex-wrap gap-1.5 sm:col-span-6">
              {group.items.map((item) => (
                <span key={item} className="rounded-md bg-chip px-2 py-1 text-xs font-medium text-ink-2">{item}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
