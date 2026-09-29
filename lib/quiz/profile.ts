export const QUIZ_AREAS = [
  { id: "revenue", label: "Revenue" },
  { id: "capacity", label: "Capacity" },
  { id: "fulfillment", label: "Fulfillment" },
  { id: "execution", label: "Execution" },
  { id: "pipeline", label: "Pipeline" },
  { id: "accountability", label: "Accountability" },
] as const;

export type QuizAreaId = (typeof QUIZ_AREAS)[number]["id"];
export type AreaScoreMap = Record<QuizAreaId, number>;

export type QuizFocus = {
  task: string;
  stream: string;
  path: string;
  next: string;
};

const AREA_LABEL = Object.fromEntries(QUIZ_AREAS.map((area) => [area.id, area.label])) as Record<QuizAreaId, string>;

function clamp(value: number, min = 0, max = 10) {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number) {
  return Math.round(clamp(value) * 10) / 10;
}

export function clip(value: unknown, max = 110) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function filled(value: unknown): boolean {
  if (Array.isArray(value)) return value.some((item) => filled(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => filled(item));
  return clip(value).length > 0;
}

function money(value: unknown) {
  const amount = parseFloat(String(value ?? "").replace(/[$,]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function fillScore(responses: Record<string, any>, ids: string[]) {
  if (ids.length === 0) return 0;
  return (ids.filter((id) => filled(responses[id])).length / ids.length) * 10;
}

function firstText(value: unknown) {
  if (Array.isArray(value)) {
    const hit = value.map((item) => clip(item)).find(Boolean);
    return hit || "";
  }
  return clip(value);
}

export function asQuizResponses(value: unknown): Record<string, any> | null {
  if (!value) return null;
  if (typeof value === "string") {
    try {
      return asQuizResponses(JSON.parse(value));
    } catch {
      return null;
    }
  }
  if (typeof value === "object") return value as Record<string, any>;
  return null;
}

export function responsesFromStorage(parsed: unknown) {
  const record = asQuizResponses(parsed);
  if (!record) return {};
  return asQuizResponses(record.quiz_responses) || asQuizResponses(record.raw_quiz_data) || record;
}

export function scoreQuiz(responses: Record<string, any>): AreaScoreMap {
  const satisfaction = filled(responses.q6) ? clamp(Number(responses.q6) || 1) : 1;
  const commitment = filled(responses.q50) ? clamp(Number(responses.q50) || 1) : 1;

  const income = money(responses.q1);
  const target = money(responses.q4);
  const hasStream = Array.isArray(responses.q15_streams) && responses.q15_streams.some((stream) => filled(stream?.name));
  let revenue = 0;
  if (filled(responses.q1)) revenue += 3;
  if (filled(responses.q4)) revenue += 2;
  if (filled(responses.q18) || filled(responses.q21)) revenue += 2;
  if (hasStream) revenue += 3;
  if (target > 0 && target > income) {
    revenue = revenue * 0.4 + (income / target) * 10 * 0.6;
  }

  const hours = Number(responses.q2) || 0;
  const available = Number(responses.q8) || 0;
  let capacity = 8;
  if (hours >= 70) capacity -= 4;
  else if (hours >= 55) capacity -= 2;
  else if (!filled(responses.q2)) capacity -= 3;
  if (filled(responses.q8) && available < 15) capacity -= 3;
  else if (filled(responses.q8) && available < 30) capacity -= 1;
  else if (!filled(responses.q8)) capacity -= 2;

  const budget = responses.q24;
  if (budget && typeof budget === "object") {
    const total = Object.values(budget).reduce<number>((sum, value) => sum + (parseFloat(String(value)) || 0), 0);
    if (total !== 168) capacity -= 2;
  } else {
    capacity -= 2;
  }

  const execution = commitment * 0.5 + fillScore(responses, ["q25", "q26", "q27", "q28", "q29", "q44", "q45", "q47"]) * 0.5;
  const pipeline = fillScore(responses, ["q10", "q11", "q12", "q13", "q14", "q15", "q20", "q36"]);
  const accountability = fillScore(responses, ["q39", "q40", "q41", "q42", "q43"]);

  return {
    revenue: round1(revenue),
    capacity: round1(capacity),
    fulfillment: round1(satisfaction),
    execution: round1(execution),
    pipeline: round1(pipeline),
    accountability: round1(accountability),
  };
}

export function rankAreas(scores: AreaScoreMap) {
  return QUIZ_AREAS.map((area) => ({
    id: area.id,
    label: area.label,
    score: scores[area.id] ?? 0,
  })).sort((a, b) => a.score - b.score || QUIZ_AREAS.findIndex((area) => area.id === a.id) - QUIZ_AREAS.findIndex((area) => area.id === b.id));
}

export function profilePayload(userId: string, email: string | null, responses: Record<string, any>) {
  const area_scores = scoreQuiz(responses);
  return {
    user_id: userId,
    email,
    quiz_responses: responses,
    area_scores,
    lowest_areas: rankAreas(area_scores).slice(0, 3).map((area) => area.id),
    updated_at: new Date().toISOString(),
  };
}

export function focusForArea(id: QuizAreaId, responses: Record<string, any>): QuizFocus {
  switch (id) {
    case "revenue":
      return {
        task: "Close the revenue gap",
        stream: "REVENUE",
        path: "/opportunities/sba",
        next: firstText(responses.q15) || firstText(responses.q35) || "Pick the stream you start first",
      };
    case "capacity":
      return {
        task: "Protect your hours",
        stream: "CAPACITY",
        path: "/calendar",
        next: filled(responses.q2) ? `${clip(responses.q2, 12)} hrs/week already committed` : "Map the 168-hour week before adding work",
      };
    case "fulfillment":
      return {
        task: "Rebuild satisfaction",
        stream: "FULFILLMENT",
        path: "/creative",
        next: firstText(responses.q7) || firstText(responses.q9) || "Name the one thing you would change",
      };
    case "execution":
      return {
        task: "Run the 24-hour actions",
        stream: "EXECUTION",
        path: "/vault",
        next: firstText(responses.q45) || firstText(responses.q44) || "Write the three moves for the next day",
      };
    case "pipeline":
      return {
        task: "Fill the pipeline",
        stream: "PIPELINE",
        path: "/crm",
        next: firstText(responses.q11) || (firstText(responses.q36) ? `Contact ${firstText(responses.q36)}` : "Name the first customers"),
      };
    case "accountability":
      return {
        task: "Install the weekly review",
        stream: "ACCOUNTABILITY",
        path: "/vault",
        next: firstText(responses.q41) || (firstText(responses.q42) ? `Accountable to ${firstText(responses.q42)}` : "Choose when you review the week"),
      };
    default:
      return {
        task: "Review the audit",
        stream: "SYSTEMS",
        path: "/vault",
        next: AREA_LABEL[id],
      };
  }
}

export function profilesTableMissing(message: string) {
  return /profiles|schema cache|relation|does not exist/i.test(message);
}
