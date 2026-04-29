import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProgressStatus } from "@/lib/types";

const statusCopy: Record<ProgressStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  solved: "Solved",
  revisit: "Revisit",
};

const statusStyles: Record<ProgressStatus, string> = {
  not_started: "bg-muted text-muted-foreground",
  in_progress: "bg-sky-100 text-sky-700",
  solved: "bg-emerald-100 text-emerald-700",
  revisit: "bg-amber-100 text-amber-700",
};

const MS_PER_DAY = 86_400_000;

function formatDaysAgo(iso: string): string | null {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const days = Math.floor((Date.now() - then) / MS_PER_DAY);
  if (days < 0) return null;
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

export function StatusBadge({
  status,
  lastUpdatedAt,
}: {
  status: ProgressStatus;
  lastUpdatedAt?: string | null;
}) {
  const suffix = lastUpdatedAt ? formatDaysAgo(lastUpdatedAt) : null;

  return (
    <Badge className={cn("border-0 font-medium", statusStyles[status])}>
      {statusCopy[status]}
      {suffix ? <span className="ml-1 opacity-70">· {suffix}</span> : null}
    </Badge>
  );
}
