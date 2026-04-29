import { format } from "date-fns";
import { CalendarCheck, CalendarClock, Hourglass, Rocket } from "lucide-react";
import type { ComponentType } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getPathProgress } from "@/lib/path-progress";
import type { ProblemWithProgress } from "@/lib/types";

const dateFormat = "MMM d, yyyy";

export function PathProgressBanner({
  problems,
}: {
  problems: ProblemWithProgress[];
}) {
  const progress = getPathProgress(problems);
  const {
    completion,
    solved,
    total,
    startDate,
    targetDate,
    daysLeft,
    isPastTarget,
    forecastDate,
  } = progress;

  const startedValue = startDate ? format(startDate, dateFormat) : "Not started";
  const targetValue = targetDate ? format(targetDate, dateFormat) : "—";
  const daysLeftValue = !startDate
    ? "—"
    : isPastTarget
      ? "Target passed"
      : `${daysLeft} ${daysLeft === 1 ? "day" : "days"}`;
  const forecastValue = forecastDate
    ? solved >= total
      ? `Completed ${format(forecastDate, dateFormat)}`
      : format(forecastDate, dateFormat)
    : "—";

  return (
    <Card className="border-border/60 bg-card/80 shadow-none">
      <CardContent className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Path completion</p>
            <p className="font-heading text-4xl font-semibold tracking-tight">
              {completion}%
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {solved} of {total} solved
          </p>
        </div>
        <Progress value={completion} className="h-2" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={Rocket} label="Started" value={startedValue} />
          <Metric icon={CalendarCheck} label="Target date" value={targetValue} />
          <Metric icon={Hourglass} label="Days left" value={daysLeftValue} />
          <Metric icon={CalendarClock} label="On pace for" value={forecastValue} />
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
      <div className="flex items-center justify-between gap-2 text-muted-foreground">
        <span className="text-xs">{label}</span>
        <Icon className="size-4" />
      </div>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
