"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { updateProgressAction } from "@/app/actions/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProgressStatus } from "@/lib/types";

const labelByStatus: Record<ProgressStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  solved: "Solved",
  revisit: "Revisit",
};

const options: Array<{ value: ProgressStatus; label: string }> = (
  Object.entries(labelByStatus) as Array<[ProgressStatus, string]>
).map(([value, label]) => ({ value, label }));

export function ProgressSelect({
  problemId,
  initialStatus,
}: {
  problemId: string;
  initialStatus: ProgressStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    initialStatus,
    (_previous, next: ProgressStatus) => next,
  );

  return (
    <Select
      value={optimisticStatus}
      onValueChange={(value) => {
        if (!value) {
          return;
        }

        const nextStatus = value as ProgressStatus;
        startTransition(async () => {
          setOptimisticStatus(nextStatus);

          try {
            await updateProgressAction({ problemId, status: nextStatus });
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Unable to update progress.",
            );
          }
        });
      }}
    >
      <SelectTrigger className="w-[148px] bg-background" disabled={isPending}>
        <SelectValue placeholder="Status">
          {(value) =>
            value ? labelByStatus[value as ProgressStatus] : "Status"
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
