import { cache } from "react";

import { allProblems, problemDays } from "@/lib/problem-data";
import { createServerSupabase } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type {
  Difficulty,
  Problem,
  ProblemDay,
  ProblemWithProgress,
  ProgressStatus,
  UserProgress,
} from "@/lib/types";

type ProblemRow = {
  id: string;
  day_number: number;
  day_order: number;
  topic: string;
  focus: string;
  title: string;
  leetcode_number: number;
  slug: string;
  url: string;
  difficulty: Difficulty;
  pattern: string;
  path_name: string;
};

type ProgressRow = {
  problem_id: string;
  status: ProgressStatus;
  updated_at: string | null;
};

function mapProblemRow(row: ProblemRow): Problem {
  return {
    id: row.id,
    dayNumber: row.day_number,
    dayOrder: row.day_order,
    topic: row.topic,
    focus: row.focus,
    title: row.title,
    leetcodeNumber: row.leetcode_number,
    slug: row.slug,
    url: row.url,
    difficulty: row.difficulty,
    pattern: row.pattern,
    pathName: row.path_name,
  };
}

export const getProblemCatalog = cache(async () => {
  if (!hasSupabaseEnv()) {
    return allProblems;
  }

  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("problems")
    .select(
      "id, day_number, day_order, topic, focus, title, leetcode_number, slug, url, difficulty, pattern, path_name",
    )
    .eq("is_active", true)
    .order("day_number", { ascending: true })
    .order("day_order", { ascending: true });

  if (!data?.length) {
    return allProblems;
  }

  return data.map(mapProblemRow);
});

export function buildProblemDays<TProblem extends Problem>(
  problems: TProblem[],
): ProblemDay<TProblem>[] {
  return problems.reduce<ProblemDay<TProblem>[]>((days, problem) => {
    const bucket = days.find((entry) => entry.dayNumber === problem.dayNumber);

    if (bucket) {
      bucket.problems.push(problem);
      return days;
    }

    days.push({
      dayNumber: problem.dayNumber,
      topic: problem.topic,
      focus: problem.focus,
      problems: [problem],
    });

    return days;
  }, []);
}

export async function getProblemDays() {
  const catalog = await getProblemCatalog();
  return buildProblemDays(catalog);
}

export async function getUserProgress(userId: string) {
  if (!hasSupabaseEnv()) {
    return [] satisfies UserProgress[];
  }

  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("user_problem_progress")
    .select("problem_id, status, updated_at")
    .eq("user_id", userId);

  return (data ?? []).map((item: ProgressRow) => ({
    problemId: item.problem_id,
    status: item.status,
    lastUpdatedAt: item.updated_at,
  }));
}

export async function getWorkspaceProblems(userId: string | null) {
  const [catalog, progress] = await Promise.all([
    getProblemCatalog(),
    userId ? getUserProgress(userId) : Promise.resolve([] as UserProgress[]),
  ]);

  const progressMap = new Map(progress.map((item) => [item.problemId, item]));

  return catalog.map<ProblemWithProgress>((problem) => {
    const entry = progressMap.get(problem.id);

    return {
      ...problem,
      status: entry?.status ?? "not_started",
      lastUpdatedAt: entry?.lastUpdatedAt ?? null,
    };
  });
}

export function getStatusCount(
  problems: ProblemWithProgress[],
  status: ProgressStatus,
) {
  return problems.filter((problem) => problem.status === status).length;
}

export function getDifficultyBreakdown(problems: ProblemWithProgress[]) {
  return (["Easy", "Medium", "Hard"] as Difficulty[]).map((difficulty) => {
    const scoped = problems.filter((problem) => problem.difficulty === difficulty);
    const solved = scoped.filter((problem) => problem.status === "solved").length;

    return {
      difficulty,
      total: scoped.length,
      solved,
    };
  });
}

export function getTopicBreakdown(problems: ProblemWithProgress[]) {
  return Array.from(
    problems.reduce((acc, problem) => {
      const current = acc.get(problem.topic) ?? { topic: problem.topic, total: 0, solved: 0 };
      current.total += 1;
      if (problem.status === "solved") {
        current.solved += 1;
      }
      acc.set(problem.topic, current);
      return acc;
    }, new Map<string, { topic: string; total: number; solved: number }>()),
  )
    .map(([, value]) => value)
    .sort((left, right) => right.solved - left.solved)
    .slice(0, 8);
}

export function getRecommendedDay(problems: ProblemWithProgress[]) {
  const grouped = buildProblemDays(problems);
  const fallback = problemDays[0];
  return (
    grouped.find((entry) =>
      entry.problems.some((problem) => problem.status !== "solved"),
    ) ??
    grouped.at(-1) ?? {
      ...fallback,
      problems: fallback.problems.map((problem) => ({
        ...problem,
        status: "not_started" as const,
        lastUpdatedAt: null,
      })),
    }
  );
}

export function getRecentActivity(problems: ProblemWithProgress[]) {
  return problems
    .filter((problem) => problem.lastUpdatedAt)
    .sort((left, right) =>
      new Date(right.lastUpdatedAt ?? 0).getTime() -
      new Date(left.lastUpdatedAt ?? 0).getTime(),
    )
    .slice(0, 8);
}
