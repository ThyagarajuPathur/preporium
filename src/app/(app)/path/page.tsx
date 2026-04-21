import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { ProgressSelect } from "@/components/app/progress-select";
import { StatusBadge } from "@/components/app/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { buildProblemDays, getWorkspaceProblems } from "@/lib/problems";
import { getRequiredSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export default async function PathPage() {
  const session = await getRequiredSession();
  const problems = await getWorkspaceProblems(session?.user.id ?? null);
  const days = buildProblemDays(problems);

  return (
    <div className="flex flex-col gap-6">
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

          return (
            <Card key={day.dayNumber} className="border-border/60 bg-card/80 shadow-none">
              <CardHeader className="gap-3">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Day {day.dayNumber}</p>
                    <CardTitle className="font-heading text-2xl tracking-tight">
                      {day.topic}
                    </CardTitle>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                      {day.focus}
                    </p>
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
              <CardContent className="grid gap-3">
                {day.problems.map((problem) => (
                  <div
                    key={problem.id}
                    className="grid gap-4 rounded-2xl border border-border/60 bg-background/70 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        #{problem.leetcodeNumber} {problem.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {problem.pattern} · {problem.difficulty}
                      </p>
                    </div>
                    <StatusBadge status={problem.status} />
                    <ProgressSelect
                      problemId={problem.id}
                      initialStatus={problem.status}
                    />
                    <Link
                      href={problem.url}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "rounded-full",
                      )}
                    >
                      Solve
                      <ExternalLink data-icon="inline-end" />
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
