import { clip } from "@/lib/quiz/profile";

export type UserOpportunity = {
  id: string;
  name: string;
  detail: string;
  status: string;
  currentRevenue: number;
  targetRevenue: number;
  href: string;
};

export type FlywheelRow = {
  name: string;
  current: number;
  target: number;
};

export const EMPTY_OPPORTUNITY_COPY = "Complete diagnostic to auto-populate";
export const EMPTY_FOCUS_COPY = "Undefined";

export const emptyOpportunity = (): UserOpportunity => ({
  id: "placeholder-1",
  name: "Opportunity #1",
  detail: EMPTY_OPPORTUNITY_COPY,
  status: "EMPTY",
  currentRevenue: 0,
  targetRevenue: 0,
  href: "/quiz",
});

function money(value: unknown) {
  const amount = parseFloat(String(value ?? "").replace(/[$,]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

export function opportunitiesFromQuiz(responses: Record<string, any> | null): UserOpportunity[] {
  if (!responses) return [];
  const streams = Array.isArray(responses.q15_streams) ? responses.q15_streams : [];
  const listed: UserOpportunity[] = [];

  streams.forEach((stream: any, index: number) => {
    const name = clip(stream?.name, 80);
    if (!name) return;
    const monthly = money(stream?.monthlyRevenue);
    listed.push({
      id: `stream-${index}`,
      name,
      detail: monthly > 0 ? `$${monthly.toLocaleString()} / mo from your diagnostic` : "Listed in your diagnostic",
      status: listed.length === 0 ? "FIRST" : "OPEN",
      currentRevenue: monthly,
      targetRevenue: monthly,
      href: `/opportunities/stream-${index}`,
    });
  });

  const first = clip(responses.q15, 80);
  if (first && !listed.some((item) => item.name.toLowerCase() === first.toLowerCase())) {
    listed.unshift({
      id: "stream-first",
      name: first,
      detail: clip(responses.q15_why1, 120) || "Marked first in your diagnostic",
      status: "FIRST",
      currentRevenue: 0,
      targetRevenue: money(responses.q18) || money(responses.q4),
      href: "/opportunities/stream-first",
    });
  }

  return listed;
}

export function opportunitiesFromRows(rows: Array<Record<string, any>> | null | undefined): UserOpportunity[] {
  if (!rows?.length) return [];
  return rows
    .map((row) => {
      const name = clip(row.name || row.stream_name, 80);
      if (!name) return null;
      const id = String(row.id);
      return {
        id,
        name,
        detail: clip(row.notes || row.detail, 140) || "Saved to your account",
        status: clip(row.status, 24) || "OPEN",
        currentRevenue: Number(row.current_revenue) || 0,
        targetRevenue: Number(row.target_revenue) || 0,
        href: `/opportunities/${id}`,
      } satisfies UserOpportunity;
    })
    .filter((row): row is UserOpportunity => Boolean(row));
}

export function mergeOpportunities(
  tableRows: Array<Record<string, any>> | null | undefined,
  quizOpportunities: UserOpportunity[]
): UserOpportunity[] {
  const saved = opportunitiesFromRows(tableRows);
  if (!saved.length) return quizOpportunities;
  const names = new Set(saved.map((item) => item.name.toLowerCase()));
  return [...saved, ...quizOpportunities.filter((item) => !names.has(item.name.toLowerCase()))];
}

export function flywheelFromOpportunities(opportunities: UserOpportunity[]): FlywheelRow[] {
  return opportunities
    .filter((item) => item.id !== "placeholder-1")
    .map((item) => ({
      name: item.name,
      current: item.currentRevenue,
      target: item.targetRevenue,
    }));
}

export function flywheelFromStreams(rows: Array<Record<string, any>> | null | undefined): FlywheelRow[] {
  if (!rows?.length) return [];
  return rows
    .map((row) => {
      const name = clip(row.stream_name || row.name, 80);
      if (!name) return null;
      return {
        name,
        current: Number(row.current_revenue) || 0,
        target: Number(row.target_revenue) || 0,
      } satisfies FlywheelRow;
    })
    .filter((row): row is FlywheelRow => Boolean(row));
}
