"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ExternalLink, Search } from "lucide-react";

import { ProgressSelect } from "@/components/app/progress-select";
import { StatusBadge } from "@/components/app/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProblemWithProgress } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filters = {
  search: string;
  difficulty: string;
  topic: string;
  status: string;
  day: string;
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function ProblemExplorer({
  problems,
  filters,
}: {
  problems: ProblemWithProgress[];
  filters: Filters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const deferredSearch = useDeferredValue(localSearch);

  const topics = useMemo(
    () => Array.from(new Set(problems.map((problem) => problem.topic))).sort(),
    [problems],
  );

  const filtered = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        !deferredSearch ||
        normalize(problem.title).includes(normalize(deferredSearch)) ||
        String(problem.leetcodeNumber).includes(normalize(deferredSearch));
      const matchesDifficulty =
        !filters.difficulty || filters.difficulty === "all"
          ? true
          : problem.difficulty === filters.difficulty;
      const matchesTopic =
        !filters.topic || filters.topic === "all"
          ? true
          : problem.topic === filters.topic;
      const matchesStatus =
        !filters.status || filters.status === "all"
          ? true
          : problem.status === filters.status;
      const matchesDay =
        !filters.day || filters.day === "all"
          ? true
          : String(problem.dayNumber) === filters.day;

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesTopic &&
        matchesStatus &&
        matchesDay
      );
    });
  }, [deferredSearch, filters.day, filters.difficulty, filters.status, filters.topic, problems]);

  function pushFilters(next: Partial<Filters>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(event) => {
              const nextValue = event.target.value;
              setLocalSearch(nextValue);
              pushFilters({ search: nextValue });
            }}
            placeholder="Search title or LC number"
            className="h-12 rounded-2xl border-border/60 bg-background pl-11"
          />
        </div>
        <FilterSelect
          value={filters.difficulty || "all"}
          onChange={(value) => pushFilters({ difficulty: value })}
          placeholder="Difficulty"
          options={[
            { value: "all", label: "All difficulties" },
            { value: "Easy", label: "Easy" },
            { value: "Medium", label: "Medium" },
            { value: "Hard", label: "Hard" },
          ]}
        />
        <FilterSelect
          value={filters.status || "all"}
          onChange={(value) => pushFilters({ status: value })}
          placeholder="Status"
          options={[
            { value: "all", label: "All status" },
            { value: "not_started", label: "Not started" },
            { value: "in_progress", label: "In progress" },
            { value: "solved", label: "Solved" },
            { value: "revisit", label: "Revisit" },
          ]}
        />
        <FilterSelect
          value={filters.day || "all"}
          onChange={(value) => pushFilters({ day: value })}
          placeholder="Day"
          options={[
            { value: "all", label: "All days" },
            ...Array.from({ length: 30 }, (_, index) => ({
              value: String(index + 1),
              label: `Day ${index + 1}`,
            })),
          ]}
        />
        <FilterSelect
          value={filters.topic || "all"}
          onChange={(value) => pushFilters({ topic: value })}
          placeholder="Topic"
          options={[
            { value: "all", label: "All topics" },
            ...topics.map((topic) => ({ value: topic, label: topic })),
          ]}
        />
      </div>

      <div className="rounded-[1.75rem] border border-border/60 bg-card/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">LC #</TableHead>
              <TableHead>Problem</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Track</TableHead>
              <TableHead className="text-right">Solve</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell className="font-medium text-muted-foreground">
                  #{problem.leetcodeNumber}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{problem.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {problem.topic} · {problem.pattern}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Day {problem.dayNumber}</span>
                    <span className="text-xs text-muted-foreground">
                      Slot {problem.dayOrder}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{problem.difficulty}</TableCell>
                <TableCell>
                  <StatusBadge status={problem.status} />
                </TableCell>
                <TableCell>
                  <ProgressSelect
                    problemId={problem.id}
                    initialStatus={problem.status}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={problem.url}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
                  >
                    Open
                    <ExternalLink data-icon="inline-end" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {!filtered.length ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  {isPending
                    ? "Refreshing the filtered list..."
                    : "No problems match the current filters."}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (!nextValue) {
          return;
        }

        onChange(nextValue);
      }}
    >
      <SelectTrigger className="h-12 rounded-2xl border-border/60 bg-background">
        <SelectValue placeholder={placeholder} />
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
