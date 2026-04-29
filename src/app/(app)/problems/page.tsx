import { PathProgressBanner } from "@/components/app/path-progress-banner";
import { ProblemExplorer } from "@/components/app/problem-explorer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkspaceProblems } from "@/lib/problems";
import { getRequiredSession } from "@/lib/session";

export default async function ProblemsPage() {
  const session = await getRequiredSession();
  const problems = await getWorkspaceProblems(session?.user.id ?? null);

  return (
    <div className="flex flex-col gap-6">
      <PathProgressBanner problems={problems} />
      <Card className="border-border/60 bg-card/80 shadow-none">
        <CardHeader>
          <CardTitle className="font-heading text-3xl tracking-tight">
            Problem library
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Filter the curated library by difficulty, day, topic, and your own
          solve state, then jump directly to LeetCode when you are ready.
        </CardContent>
      </Card>
      <ProblemExplorer problems={problems} />
    </div>
  );
}
