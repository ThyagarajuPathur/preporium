"use client";

import Link from "next/link";
import { useOptimistic, useTransition, type ReactNode } from "react";
import { toast } from "sonner";

import { updateProgressAction } from "@/app/actions/progress";
import type { ProgressStatus } from "@/lib/types";

function nextStatusFor(status: ProgressStatus): ProgressStatus | null {
  if (status === "not_started") return "in_progress";
  if (status === "solved") return "revisit";
  return null;
}

export function SolveLink({
  url,
  problemId,
  status,
  className,
  children,
}: {
  url: string;
  problemId: string;
  status: ProgressStatus;
  className?: string;
  children: ReactNode;
}) {
  const [, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    status,
    (_previous, next: ProgressStatus) => next,
  );

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        const next = nextStatusFor(optimisticStatus);
        if (!next) return;

        startTransition(async () => {
          setOptimisticStatus(next);
          try {
            await updateProgressAction({ problemId, status: next });
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Unable to update progress.",
            );
          }
        });
      }}
    >
      {children}
    </Link>
  );
}
