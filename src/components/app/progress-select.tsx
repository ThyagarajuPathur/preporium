"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { updateProgressAction } from "@/app/actions/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProgressStatus } from "@/lib/types";

const options: Array<{ value: ProgressStatus; label: string }> = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "solved", label: "Solved" },
  { value: "revisit", label: "Revisit" },
];

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
        <SelectValue placeholder="Status" />
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
