import { BRAND } from "@/lib/brand";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function SetupRequired() {
  return (
    <Card className="border-border/60 bg-card/80 shadow-none backdrop-blur">
      <CardHeader>
        <CardTitle>Finish Supabase setup to unlock the app</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
        <p>
          {BRAND.name} is fully wired for Supabase auth and progress tracking, but
          this environment still needs project credentials.
        </p>
        <Separator />
        <div className="flex flex-col gap-2">
          <p>1. Copy <code>.env.example</code> to <code>.env.local</code>.</p>
          <p>2. Add your Supabase URL and anon key.</p>
          <p>3. Run the SQL in <code>supabase/schema.sql</code>.</p>
          <p>4. Generate <code>supabase/seed.sql</code> with the included script and load it.</p>
        </div>
      </CardContent>
    </Card>
  );
}
