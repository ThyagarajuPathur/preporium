import { format } from "date-fns";

import { BrandMark } from "@/components/app/brand-mark";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getDifficultyBreakdown, getRecentActivity, getStatusCount, getTopicBreakdown, getWorkspaceProblems } from "@/lib/problems";
import { getRequiredSession, mapProfileSummary } from "@/lib/session";
import { signOutAction } from "@/app/actions/auth";

export default async function ProfilePage() {
  const session = await getRequiredSession();
  const profile = mapProfileSummary(session?.profile ?? null);
  const problems = await getWorkspaceProblems(session?.user.id ?? null);
  const solved = getStatusCount(problems, "solved");
  const topicBreakdown = getTopicBreakdown(problems);
  const difficultyBreakdown = getDifficultyBreakdown(problems);
  const recent = getRecentActivity(problems);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
      <Card className="border-border/60 bg-card/80 shadow-none">
        <CardHeader>
          <BrandMark />
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div>
            <p className="font-heading text-3xl font-semibold tracking-tight">
              {profile?.displayName ?? session?.user.email?.split("@")[0] ?? "Prep owner"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{session?.user.email}</p>
            {profile?.createdAt ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Joined {format(new Date(profile.createdAt), "MMM d, yyyy")}
              </p>
            ) : null}
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Solved count</p>
              <p className="mt-2 font-heading text-3xl font-semibold">{solved}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Completion</p>
              <p className="mt-2 font-heading text-3xl font-semibold">
                {Math.round((solved / problems.length) * 100)}%
              </p>
            </div>
          </div>
          <form action={signOutAction}>
            <Button type="submit" variant="secondary" className="w-full rounded-2xl">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="border-border/60 bg-card/80 shadow-none">
          <CardHeader>
            <CardTitle className="font-heading text-2xl tracking-tight">
              Progress by difficulty
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {difficultyBreakdown.map((item) => (
              <div key={item.difficulty} className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">{item.difficulty}</p>
                <p className="mt-2 font-heading text-2xl font-semibold">
                  {item.solved}/{item.total}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 shadow-none">
          <CardHeader>
            <CardTitle className="font-heading text-2xl tracking-tight">
              Strongest topics so far
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {topicBreakdown.map((item) => (
              <div key={item.topic} className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-4">
                <div>
                  <p className="font-medium">{item.topic}</p>
                  <p className="text-xs text-muted-foreground">{item.solved} solved of {item.total}</p>
                </div>
                <span className="font-heading text-xl font-semibold">{Math.round((item.solved / item.total) * 100)}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 shadow-none">
          <CardHeader>
            <CardTitle className="font-heading text-2xl tracking-tight">
              Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recent.length ? (
              recent.map((problem) => (
                <div key={problem.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 px-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{problem.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {problem.lastUpdatedAt
                        ? format(new Date(problem.lastUpdatedAt), "MMM d, h:mm a")
                        : "Recently updated"}
                    </p>
                  </div>
                  <StatusBadge status={problem.status} />
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-border/80 px-4 py-8 text-center text-sm text-muted-foreground">
                Start updating problem statuses and your recent activity stream will appear here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
