import type { ComponentType } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  Flame,
  Layers2,
  RotateCcw,
  Target,
} from "lucide-react";

import { ProgressSelect } from "@/components/app/progress-select";
import { StatusBadge } from "@/components/app/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getRecommendedDay, getStatusCount, getWorkspaceProblems } from "@/lib/problems";
import { getRequiredSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getRequiredSession();
  const problems = await getWorkspaceProblems(session?.user.id ?? null);
  const solved = getStatusCount(problems, "solved");
  const inProgress = getStatusCount(problems, "in_progress");
  const revisit = getStatusCount(problems, "revisit");
  const completion = Math.round((solved / problems.length) * 100);
  const today = getRecommendedDay(problems);
  const quickList = problems.filter((problem) =>
    problem.status === "in_progress" || problem.status === "revisit",
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col gap-5 rounded-[2rem] border border-border/60 bg-gradient-to-b from-card/95 to-card/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-7">
          <span className="w-fit rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            current workspace
          </span>
          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-4xl font-semibold tracking-[-0.05em]">
              Stay close to the next meaningful solve.
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Your curated prep plan is organized around the first incomplete day,
              with quick access to the problems you’re still actively shaping.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric title="Solved" value={String(solved)} icon={Target} />
            <Metric title="In progress" value={String(inProgress)} icon={Flame} />
            <Metric title="Revisit" value={String(revisit)} icon={RotateCcw} />
          </div>
          <div className="rounded-[1.5rem] border border-border/60 bg-background/80 p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="font-heading text-3xl font-semibold">{completion}%</p>
              </div>
              <Link
                href="/path"
                className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
              >
                Open path
                <ArrowUpRight data-icon="inline-end" />
              </Link>
            </div>
            <Progress value={completion} className="mt-4 h-2" />
          </div>
        </div>
        <Card className="border-border/60 bg-card/80 shadow-none">
          <CardHeader>
            <CardTitle className="font-heading text-2xl tracking-tight">
              Today’s recommended set
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Day {today.dayNumber}</p>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                {today.topic}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {today.focus}
              </p>
            </div>
            {today.problems.map((problem) => (
              <div
                key={problem.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      #{problem.leetcodeNumber} {problem.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{problem.pattern}</p>
                  </div>
                  <StatusBadge status={problem.status} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <ProgressSelect
                    problemId={problem.id}
                    initialStatus={problem.status}
                  />
                  <Link
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
                  >
                    Solve
                    <ExternalLink data-icon="inline-end" />
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-border/60 bg-card/80 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-2xl tracking-tight">
              Open loops
            </CardTitle>
            <Link
              href="/problems"
              className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {quickList.length ? (
              quickList.slice(0, 8).map((problem) => (
                <div
                  key={problem.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{problem.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Day {problem.dayNumber} · {problem.topic}
                    </p>
                  </div>
                  <StatusBadge status={problem.status} />
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-border/80 px-4 py-8 text-center text-sm text-muted-foreground">
                Everything is either solved or untouched. Mark a few problems in
                progress to build your working queue.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80 shadow-none">
          <CardHeader>
            <CardTitle className="font-heading text-2xl tracking-tight">
              What this MVP does well
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              "Keeps the 30-day path in a single flow instead of scattered notes and tabs.",
              "Lets you see solve state instantly without opening LeetCode history.",
              "Surfaces your revisit backlog so hard problems do not quietly disappear.",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-border/60 px-4 py-4">
                <Layers2 className="mt-0.5 text-muted-foreground" />
                <p className="text-sm leading-6 text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Metric({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-[1.5rem] border border-border/60 bg-background/80 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className="text-muted-foreground" />
      </div>
      <p className="mt-4 font-heading text-3xl font-semibold">{value}</p>
    </div>
  );
}
