export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProgressStatus =
  | "not_started"
  | "in_progress"
  | "solved"
  | "revisit";

export type Problem = {
  id: string;
  dayNumber: number;
  dayOrder: number;
  topic: string;
  focus: string;
  title: string;
  leetcodeNumber: number;
  slug: string;
  url: string;
  difficulty: Difficulty;
  pattern: string;
  pathName: string;
};

export type ProblemDay<TProblem = Problem> = {
  dayNumber: number;
  topic: string;
  focus: string;
  problems: TProblem[];
};

export type UserProgress = {
  problemId: string;
  status: ProgressStatus;
  lastUpdatedAt: string | null;
};

export type ProblemWithProgress = Problem & {
  status: ProgressStatus;
  lastUpdatedAt: string | null;
};

export type ProfileSummary = {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string | null;
};
