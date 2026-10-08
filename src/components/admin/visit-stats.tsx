import type { VisitDay } from "@/lib/data";

type Stats = {
  series: VisitDay[];
  today: VisitDay;
  week: { views: number; visitors: number };
  month: { views: number; visitors: number };
  allTimeViews: number;
};

const dayLabel = (day: string) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString("en", { month: "short", day: "numeric", timeZone: "UTC" });

const n = (v: number) => v.toLocaleString("en");
const visitors = (v: number) => `${n(v)} ${v === 1 ? "visitor" : "visitors"}`;

function Tile({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-bg/60 p-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{n(value)}</p>
      {sub && <p className="mt-0.5 text-xs text-dim">{sub}</p>}
    </div>
  );
}

/** Private visitor counter: stat tiles + a 14-day page-view bar chart. */
export function VisitStats({ stats }: { stats: Stats }) {
  const days = stats.series.slice(-14);
  const max = Math.max(1, ...days.map((d) => d.views));

  return (
    <section className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-sm shadow-slate-200/50">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold">Visitors</h2>
        <p className="text-xs text-dim">Homepage only · excludes bots and you while signed in · UTC days</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Today" value={stats.today.views} sub={visitors(stats.today.visitors)} />
        <Tile label="Last 7 days" value={stats.week.views} sub={visitors(stats.week.visitors)} />
        <Tile label="Last 30 days" value={stats.month.views} sub={visitors(stats.month.visitors)} />
        <Tile label="All time" value={stats.allTimeViews} sub="page views" />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium">Daily page views, last 14 days</p>
        <div className="flex h-28 items-end gap-[2px] border-b border-line" aria-hidden>
          {days.map((d) => (
            <div key={d.day} className="group relative flex h-full flex-1 items-end">
              {/* Bar (zero days show nothing above the baseline) */}
              <div
                className="w-full rounded-t-[4px] bg-accent transition-opacity group-hover:opacity-80"
                style={{ height: d.views ? `${Math.max(4, (d.views / max) * 100)}%` : 0 }}
              />
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs shadow-lg group-hover:block">
                <p className="font-medium text-fg">{dayLabel(d.day)}</p>
                <p className="text-muted">
                  {n(d.views)} {d.views === 1 ? "view" : "views"} · {visitors(d.visitors)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-dim" aria-hidden>
          <span>{dayLabel(days[0].day)}</span>
          <span>Today</span>
        </div>

        <table className="sr-only">
          <caption>Daily homepage views and visitors, last 14 days</caption>
          <thead>
            <tr>
              <th>Day</th>
              <th>Views</th>
              <th>Visitors</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.day}>
                <td>{dayLabel(d.day)}</td>
                <td>{d.views}</td>
                <td>{d.visitors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
