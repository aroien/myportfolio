import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/logo";
import { Backdrop } from "@/components/site/backdrop";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { BackToTop } from "@/components/site/back-to-top";
import { EasterEgg } from "@/components/site/easter-egg";
import { VisitTracker } from "@/components/site/visit-tracker";
import { ContactForm } from "@/components/site/contact";
import { socialMeta } from "@/components/site/icons";
import { About, ExperienceList, ProjectList, ResearchList, Section, SkillList } from "@/components/site/sections";
import { SideNav, type NavItem } from "@/components/site/side-nav";
import { getPortfolio } from "@/lib/data";
import { initialsOf } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolio();
  const title = `${profile.name} — ${profile.headline}`;
  return {
    title: { absolute: title },
    description: profile.intro,
    openGraph: { title, description: profile.intro, type: "profile" },
    twitter: { card: "summary_large_image", title, description: profile.intro },
  };
}

/** Current month as "YYYY-MM" (cached daily) for footer year and "Present" durations. */
async function currentMonth() {
  "use cache";
  cacheLife("days");
  return new Date().toISOString().slice(0, 7);
}

export default async function Home() {
  const [{ profile, projects, experience, publications }, now] = await Promise.all([getPortfolio(), currentMonth()]);
  const year = now.slice(0, 4);

  const nav: NavItem[] = [
    { id: "about", label: "About" },
    experience.length && { id: "experience", label: "Experience" },
    projects.length && { id: "projects", label: "Projects" },
    publications.length && { id: "research", label: "Research" },
    profile.skills.length && { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ].filter(Boolean) as NavItem[];

  const siteHost = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mmehedi.me").host;
  const socials = Object.entries(profile.socials).filter(([, url]) => url) as [keyof typeof socialMeta, string][];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.headline,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    address: profile.location || undefined,
    sameAs: socials.map(([, url]) => url),
  };

  return (
    <div className="relative mx-auto min-h-dvh max-w-6xl px-6 md:px-12 lg:px-16">
      <Backdrop />
      <BackToTop />
      <EasterEgg />
      <VisitTracker />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-ember focus:px-4 focus:py-2 focus:text-on-ember">
        Skip to content
      </a>

      <div className="lg:flex lg:justify-between lg:gap-12">
        <header className="pt-16 pb-12 lg:sticky lg:top-0 lg:flex lg:max-h-dvh lg:w-[44%] lg:flex-col lg:justify-between lg:gap-8 lg:overflow-y-auto lg:py-24 lg:[scrollbar-width:none] lg:short:py-12 lg:shorter:py-10 lg:[&::-webkit-scrollbar]:hidden">
          <div>
            <a href="#" className="group mb-10 inline-flex items-center gap-2.5 lg:short:mb-6 lg:shorter:hidden" aria-label="Back to top">
              <Logo className="size-9 transition-transform group-hover:-rotate-6" />
              <span className="text-sm font-semibold tracking-tight text-ink">{siteHost}</span>
            </a>
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt={profile.name} className="mb-6 size-24 rounded-full object-cover shadow-md ring-4 ring-card lg:short:mb-4 lg:short:size-20" />
            ) : (
              <div className="mb-6 flex size-24 lg:short:mb-4 lg:short:size-20 items-center justify-center rounded-full bg-gradient-to-br from-ember to-gold text-2xl font-semibold text-on-ember shadow-md ring-4 ring-card">
                {initialsOf(profile.name)}
              </div>
            )}
            <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:short:text-4xl">{profile.name}</h1>
            <p className="mt-3 text-lg font-medium text-ember">{profile.headline}</p>
            <p className="mt-4 max-w-sm leading-relaxed text-ink-2">{profile.intro}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-3">
              {profile.location && (
                <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" /> {profile.location}</span>
              )}
              {profile.available && (
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 rounded-full bg-green-500" />
                  {profile.availabilityText || "Available for work"}
                </span>
              )}
            </div>

            <SideNav items={nav} />
          </div>

          <div className="mt-8 flex items-center gap-5 lg:mt-0">
            {socials.map(([key, url]) => {
              const { Icon, label } = socialMeta[key];
              return (
                <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={label} title={label} className="text-ink-4 transition-colors hover:text-ember">
                  <Icon className="size-5" />
                </a>
              );
            })}
            {profile.email && (
              <a href={`mailto:${profile.email}`} aria-label="Email" title="Email" className="text-ink-4 transition-colors hover:text-ember">
                <Mail className="size-5" />
              </a>
            )}
            <div className="ml-auto flex items-center gap-2 lg:ml-2">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="group inline-flex h-9 items-center rounded-md bg-ember px-3 text-sm font-medium text-on-ember shadow-sm transition hover:bg-ember-deep">
                  Resume
                  <ArrowUpRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main id="content" className="pt-8 lg:w-[52%] lg:py-24">
          <About profile={profile} />
          <ExperienceList jobs={experience} resumeUrl={profile.resumeUrl} now={now} />
          <ProjectList projects={projects} />
          <ResearchList papers={publications} me={profile.name} scholarUrl={profile.socials.scholar} />
          <SkillList profile={profile} />
          <Section id="contact" title="Contact">
            <ContactForm email={profile.email} />
          </Section>
          <footer className="pb-16 text-sm text-ink-4 lg:pb-0">
            © {year} {profile.name}. Built with Next.js and Tailwind CSS.
          </footer>
        </main>
      </div>
    </div>
  );
}
