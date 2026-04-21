"use client";

import Link from "next/link";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
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

const SEARCH_DEBOUNCE_MS = 250;

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

  const topicOptions = useMemo(
    () => [
      { value: "all", label: "All topics" },
      ...topics.map((topic) => ({ value: topic, label: topic })),
    ],
    [topics],
  );

  const normalizedSearch = useMemo(() => normalize(deferredSearch), [deferredSearch]);

  const filtered = useMemo(() => {
    const difficulty = filters.difficulty && filters.difficulty !== "all" ? filters.difficulty : null;
    const topic = filters.topic && filters.topic !== "all" ? filters.topic : null;
    const status = filters.status && filters.status !== "all" ? filters.status : null;
    const day = filters.day && filters.day !== "all" ? filters.day : null;

    return problems.filter((problem) => {
      if (difficulty && problem.difficulty !== difficulty) return false;
      if (topic && problem.topic !== topic) return false;
      if (status && problem.status !== status) return false;
      if (day && String(problem.dayNumber) !== day) return false;
      if (
        normalizedSearch &&
        !normalize(problem.title).includes(normalizedSearch) &&
        !String(problem.leetcodeNumber).includes(normalizedSearch)
      ) {
        return false;
      }
      return true;
    });
  }, [
    filters.day,
    filters.difficulty,
    filters.status,
    filters.topic,
    normalizedSearch,
    problems,
  ]);

  const searchParamsString = searchParams.toString();

  const pushFilters = useCallback(
    (next: Partial<Filters>) => {
      const params = new URLSearchParams(searchParamsString);

      for (const [key, value] of Object.entries(next)) {
        if (!value || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParamsString],
  );

  // Debounce search -> URL so typing doesn't spam history replace. Selects are
  // rare events and go through pushFilters directly.
  const isFirstSearchRender = useRef(true);
  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }

    const handle = setTimeout(() => {
      pushFilters({ search: localSearch });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [localSearch, pushFilters]);

  const onDifficultyChange = useCallback(
    (value: string) => pushFilters({ difficulty: value }),
    [pushFilters],
  );
  const onStatusChange = useCallback(
    (value: string) => pushFilters({ status: value }),
    [pushFilters],
  );
  const onDayChange = useCallback(
    (value: string) => pushFilters({ day: value }),
    [pushFilters],
  );
  const onTopicChange = useCallback(
    (value: string) => pushFilters({ topic: value }),
    [pushFilters],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(event) => setLocalSearch(event.target.value)}
            placeholder="Search title or LC number"
            className="h-12 rounded-2xl border-border/60 bg-background pl-11"
            aria-label="Search problems"
          />
        </div>
        <FilterSelect
          value={filters.difficulty || "all"}
          onChange={onDifficultyChange}
          placeholder="Difficulty"
          options={DIFFICULTY_OPTIONS}
        />
        <FilterSelect
          value={filters.status || "all"}
          onChange={onStatusChange}
          placeholder="Status"
          options={STATUS_OPTIONS}
        />
        <FilterSelect
          value={filters.day || "all"}
          onChange={onDayChange}
          placeholder="Day"
          options={DAY_OPTIONS}
        />
        <FilterSelect
          value={filters.topic || "all"}
          onChange={onTopicChange}
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
