"use client";

import Link from "next/link";
import {
  useDeferredValue,
  useMemo,
  useState,
} from "react";
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

const DIFFICULTY_OPTIONS = [
  { value: "all", label: "All difficulties" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
] as const;

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "solved", label: "Solved" },
  { value: "revisit", label: "Revisit" },
] as const;

const DAY_OPTIONS = [
  { value: "all", label: "All days" },
  ...Array.from({ length: 30 }, (_, index) => ({
    value: String(index + 1),
    label: `Day ${index + 1}`,
  })),
] as const;

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function ProblemExplorer({
  problems,
}: {
  problems: ProblemWithProgress[];
}) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const [day, setDay] = useState("all");
  const [topic, setTopic] = useState("all");

  const deferredSearch = useDeferredValue(search);

  const topics = useMemo(
    () => Array.from(new Set(problems.map((p) => p.topic))).sort(),
    [problems],
  );

  const topicOptions = useMemo(
    () => [
      { value: "all", label: "All topics" },
      ...topics.map((t) => ({ value: t, label: t })),
    ],
    [topics],
  );

  const normalizedSearch = useMemo(() => normalize(deferredSearch), [deferredSearch]);

  const filtered = useMemo(() => {
    return problems.filter((problem) => {
      if (difficulty !== "all" && problem.difficulty !== difficulty) return false;
      if (topic !== "all" && problem.topic !== topic) return false;
      if (status !== "all" && problem.status !== status) return false;
      if (day !== "all" && String(problem.dayNumber) !== day) return false;
      if (
        normalizedSearch &&
        !normalize(problem.title).includes(normalizedSearch) &&
        !String(problem.leetcodeNumber).includes(normalizedSearch)
      ) {
        return false;
      }
      return true;
    });
  }, [difficulty, topic, status, day, normalizedSearch, problems]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title or LC number"
            className="h-12 rounded-2xl border-border/60 bg-background pl-11"
            aria-label="Search problems"
          />
        </div>
        <FilterSelect
          value={difficulty}
          onChange={setDifficulty}
          placeholder="Difficulty"
          options={DIFFICULTY_OPTIONS}
        />
        <FilterSelect
          value={status}
          onChange={setStatus}
          placeholder="Status"
          options={STATUS_OPTIONS}
        />
        <FilterSelect
          value={day}
          onChange={setDay}
          placeholder="Day"
          options={DAY_OPTIONS}
        />
        <FilterSelect
          value={topic}
          onChange={setTopic}
          placeholder="Topic"
          options={topicOptions}
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
                    rel="noopener noreferrer"
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
                  No problems match the current filters.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: ReadonlyArray<{ value: string; label: string }>;
};

function FilterSelect({ value, onChange, placeholder, options }: FilterSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (!nextValue) return;
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
