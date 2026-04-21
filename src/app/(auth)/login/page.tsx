import Link from "next/link";

import { loginAction, signInWithGoogleAction } from "@/app/actions/auth";
import { AuthShell } from "@/components/app/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SetupRequired } from "@/components/app/setup-required";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  if (!hasSupabaseEnv()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SetupRequired />
      </div>
    );
  }

  return (
    <AuthShell
      title="Log back in"
      description="Pick up exactly where you left off in the 30-day path."
      error={params.error}
      message={params.message}
      footer={
        <p>
          New here?{" "}
          <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <form action={loginAction} className="flex flex-col gap-3">
        <Input type="email" name="email" placeholder="Email" required className="h-12 rounded-2xl" />
        <Input type="password" name="password" placeholder="Password" required className="h-12 rounded-2xl" />
        <Button type="submit" className="h-12 rounded-2xl">
          Continue with email
        </Button>
      </form>
      <form action={signInWithGoogleAction}>
        <Button type="submit" variant="secondary" className="h-12 w-full rounded-2xl">
          Continue with Google
        </Button>
      </form>
      <Link href="/forgot-password" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
        Forgot password?
      </Link>
    </AuthShell>
  );
}
