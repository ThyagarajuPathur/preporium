import type { ProblemWithProgress } from "@/lib/types";

export const PATH_LENGTH_DAYS = 30;
export const ASSUMED_DAILY_SOLVES = 5;
const MS_PER_DAY = 86_400_000;

export type PathProgress = {
  completion: number;
  solved: number;
  total: number;
  startDate: Date | null;
  targetDate: Date | null;
  daysElapsed: number;
  daysLeft: number;
  isPastTarget: boolean;
  forecastDate: Date | null;
};

function startOfDay(ms: number) {
  const date = new Date(ms);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function getPathProgress(problems: ProblemWithProgress[]): PathProgress {
  const total = problems.length;
  const solved = problems.filter((p) => p.status === "solved").length;
  const completion = total ? Math.round((solved / total) * 100) : 0;
  const remaining = total - solved;
  const todayMs = startOfDay(Date.now());

  let forecastDate: Date | null = null;
  if (total > 0) {
    if (solved >= total) {
      const latestSolveMs = Math.max(
        ...problems
          .filter((p) => p.status === "solved" && p.lastUpdatedAt)
          .map((p) => new Date(p.lastUpdatedAt as string).getTime())
          .filter((value) => !Number.isNaN(value)),
      );
      forecastDate = new Date(Number.isFinite(latestSolveMs) ? latestSolveMs : todayMs);
    } else {
      const daysToFinish = Math.ceil(remaining / ASSUMED_DAILY_SOLVES);
      forecastDate = new Date(todayMs + daysToFinish * MS_PER_DAY);
    }
  }

  const timestamps = problems
    .map((p) => p.lastUpdatedAt)
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));

  if (!timestamps.length) {
    return {
      completion,
      solved,
      total,
      startDate: null,
      targetDate: null,
      daysElapsed: 0,
      daysLeft: PATH_LENGTH_DAYS,
      isPastTarget: false,
      forecastDate,
    };
  }

  const startMs = startOfDay(Math.min(...timestamps));
  const targetMs = startMs + PATH_LENGTH_DAYS * MS_PER_DAY;
  const daysElapsed = Math.max(0, Math.floor((todayMs - startMs) / MS_PER_DAY));
  const rawDaysLeft = Math.floor((targetMs - todayMs) / MS_PER_DAY);
  const daysLeft = Math.max(0, rawDaysLeft);

  return {
    completion,
    solved,
    total,
    startDate: new Date(startMs),
    targetDate: new Date(targetMs),
    daysElapsed,
    daysLeft,
    isPastTarget: rawDaysLeft < 0,
    forecastDate,
  };
}
