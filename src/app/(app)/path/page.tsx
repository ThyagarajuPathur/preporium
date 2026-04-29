import { ChevronDown, ExternalLink } from "lucide-react";

import { PathProgressBanner } from "@/components/app/path-progress-banner";
import { ProgressSelect } from "@/components/app/progress-select";
import { SolveLink } from "@/components/app/solve-link";
import { StatusBadge } from "@/components/app/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  buildProblemDays,
  getRecommendedDay,
  getWorkspaceProblems,
} from "@/lib/problems";
import { getRequiredSession } from "@/lib/session";
import { cn } from "@/lib/utils";

import { ScrollToHash } from "./scroll-to-hash";

export default async function PathPage() {
  const session = await getRequiredSession();
  const problems = await getWorkspaceProblems(session?.user.id ?? null);
  const days = buildProblemDays(problems);
  const recommendedDayNumber = getRecommendedDay(problems).dayNumber;

  return (
    <div className="flex flex-col gap-6">
      <ScrollToHash />
      <PathProgressBanner problems={problems} />
      <Card className="border-border/60 bg-card/80 shadow-none">
        <CardHeader>
          <CardTitle className="font-heading text-3xl tracking-tight">
            30-day senior DSA path
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          The path ramps from arrays, windows, and stacks into trees, graphs,
          dynamic programming, and mixed senior-level review without leaving you
          to invent the sequence alone.
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {days.map((day) => {
          const solved = day.problems.filter((problem) => problem.status === "solved").length;
          const completion = Math.round((solved / day.problems.length) * 100);
          const isOpen = day.dayNumber === recommendedDayNumber;

          return (
            <Card
              key={day.dayNumber}
              id={`day-${day.dayNumber}`}
              className="scroll-mt-24 border-border/60 bg-card/80 p-0 shadow-none"
            >
              <details
                open={isOpen}
                className="group/day [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="cursor-pointer list-none">
                  <CardHeader className="gap-3 py-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div className="flex items-start gap-3">
                        <ChevronDown
                          className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-open/day:rotate-180"
                          aria-hidden
                        />
                        <div>
                          <p className="text-sm text-muted-foreground">Day {day.dayNumber}</p>
                          <CardTitle className="font-heading text-2xl tracking-tight">
                            {day.topic}
                          </CardTitle>
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                            {day.focus}
                          </p>
                        </div>
                      </div>
                      <div className="min-w-52">
                        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                          <span>Completion</span>
                          <span>{completion}%</span>
                        </div>
                        <Progress value={completion} className="h-2" />
                      </div>
                    </div>
                  </CardHeader>
                </summary>
                <CardContent className="grid gap-3 pb-4">
                  {day.problems.map((problem) => (
                    <div
                      key={problem.id}
                      className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:items-center lg:gap-4"
                    >
                      <div className="flex items-start justify-between gap-3 lg:contents">
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            #{problem.leetcodeNumber} {problem.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {problem.pattern} · {problem.difficulty}
                          </p>
                        </div>
                        <StatusBadge status={problem.status} lastUpdatedAt={problem.lastUpdatedAt} />
                      </div>
                      <div className="flex items-center justify-between gap-3 lg:contents">
                        <ProgressSelect
                          problemId={problem.id}
                          initialStatus={problem.status}
                        />
                        <SolveLink
                          url={problem.url}
                          problemId={problem.id}
                          status={problem.status}
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "rounded-full",
                          )}
                        >
                          Solve
                          <ExternalLink data-icon="inline-end" />
                        </SolveLink>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </details>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
