import type { Experience } from "./types";

/** "YYYY-MM" → months since year 0 (null if not a valid month). */
function toMonths(value: string) {
  const m = /^(\d{4})-(\d{2})$/.exec(value);
  return m ? Number(m[1]) * 12 + Number(m[2]) - 1 : null;
}

/** LinkedIn-style inclusive length: "1 yr 10 mos", "3 mos", "2 yrs". */
export function formatDuration(start: string, end: string, now: string) {
  const a = toMonths(start);
  const b = toMonths(end || now);
  if (a === null || b === null || b < a) return "";
  const total = b - a + 1;
  const yrs = Math.floor(total / 12);
  const mos = total % 12;
  return [yrs && `${yrs} ${yrs === 1 ? "yr" : "yrs"}`, mos && `${mos} ${mos === 1 ? "mo" : "mos"}`].filter(Boolean).join(" ");
}

export type CompanyGroup = {
  key: string;
  company: string;
  companyUrl: string;
  roles: Experience[]; // newest first
  start: string; // earliest start
  end: string; // latest end, "" = present
  employmentType: string; // shared type, or ""
  location: string; // shared location, or ""
};

const keyOf = (company: string) => company.trim().toLowerCase().replace(/\s+/g, " ");
const shared = (values: string[]) => (values.every((v) => v === values[0]) ? values[0] : "");

/** Merge positions at the same company (case/space-insensitive), keeping admin order of first appearance. */
export function groupByCompany(jobs: Experience[]): CompanyGroup[] {
  const groups = new Map<string, Experience[]>();
  for (const job of jobs) {
    const key = keyOf(job.company);
    groups.set(key, [...(groups.get(key) ?? []), job]);
  }
  return [...groups.entries()].map(([key, roles]) => {
    const sorted = [...roles].sort((x, y) => (toMonths(y.startDate) ?? 0) - (toMonths(x.startDate) ?? 0));
    const current = sorted.some((r) => !r.endDate);
    const ends = sorted.map((r) => r.endDate).filter(Boolean).sort();
    return {
      key,
      company: sorted[0].company,
      companyUrl: sorted.find((r) => r.companyUrl)?.companyUrl ?? "",
      roles: sorted,
      start: [...sorted.map((r) => r.startDate)].sort()[0],
      end: current ? "" : ends[ends.length - 1] ?? "",
      employmentType: shared(sorted.map((r) => r.employmentType)),
      location: shared(sorted.map((r) => r.location)),
    };
  });
}
