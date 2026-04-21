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

export function StatusBadge({ status }: { status: ProgressStatus }) {
  return (
    <Badge className={cn("border-0 font-medium", statusStyles[status])}>
      {statusCopy[status]}
    </Badge>
  );
}
