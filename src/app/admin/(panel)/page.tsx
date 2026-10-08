import { ArrowRight, Briefcase, FileText, FolderKanban, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { loadSampleContent } from "@/app/actions/admin";
import { adminGetOverview, adminGetVisitStats } from "@/lib/data";
import { VisitStats } from "@/components/admin/visit-stats";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/admin/loading-skeleton";

// Each page has its own Suspense boundary so navigating between admin pages
// shows a loading state instead of blocking on the session check.
export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const [o, visits] = await Promise.all([adminGetOverview(), adminGetVisitStats()]);
  const empty = !o.hasProfile && o.projects + o.experience + o.publications === 0;

  const cards = [
    { href: "/admin/projects", label: "Projects", value: o.projects, Icon: FolderKanban },
    { href: "/admin/experience", label: "Positions", value: o.experience, Icon: Briefcase },
    { href: "/admin/publications", label: "Papers", value: o.publications, Icon: FileText },
    { href: "/admin/messages", label: "Unread messages", value: o.unread, Icon: Mail, accent: o.unread > 0 },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Welcome back 👋</h1>
      <p className="mt-2 text-sm text-muted">Everything you save here is published to your site immediately.</p>

      {empty && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-accent/30 bg-accent/10 p-6">
          <div className="flex gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <p className="font-semibold">Your database is empty</p>
              <p className="text-sm text-muted">Load the starter content (your current projects plus sample jobs and papers), then edit it.</p>
            </div>
          </div>
          <form action={loadSampleContent}>
            <button className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">Load starter content</button>
          </form>
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ href, label, value, Icon, accent }) => (
          <Link key={href} href={href} className="group rounded-2xl border border-line bg-surface shadow-sm shadow-slate-200/50 p-5 transition-colors hover:border-slate-300">
            <Icon className={`size-5 ${accent ? "text-accent" : "text-muted"}`} />
            <p className="mt-4 font-display text-4xl font-bold">{value}</p>
            <p className="mt-1 flex items-center justify-between text-sm text-muted">
              {label} <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </p>
          </Link>
        ))}
      </div>

      <VisitStats stats={visits} />

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        <Link href="/admin/profile" className="rounded-2xl border border-line bg-surface shadow-sm shadow-slate-200/50 p-6 transition-colors hover:border-slate-300">
          <p className="font-semibold">Edit profile & skills →</p>
          <p className="mt-1 text-sm text-muted">Name, hero text, bio, stats, social links and skill groups.</p>
        </Link>
        <a href="/" target="_blank" className="rounded-2xl border border-line bg-surface shadow-sm shadow-slate-200/50 p-6 transition-colors hover:border-slate-300">
          <p className="font-semibold">Open the live site ↗</p>
          <p className="mt-1 text-sm text-muted">See your changes as visitors will.</p>
        </a>
      </div>
    </div>
  );
}
