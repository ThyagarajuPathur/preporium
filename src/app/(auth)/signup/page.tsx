import Link from "next/link";

import { signInWithGoogleAction, signupAction } from "@/app/actions/auth";
import { AuthShell } from "@/components/app/auth-shell";
import { SetupRequired } from "@/components/app/setup-required";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function SignupPage({
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
      title="Create your prep space"
      description="Start the curated path, save progress, and keep the grind structured."
      error={params.error}
      message={params.message}
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <form action={signupAction} className="flex flex-col gap-3">
        <Input type="email" name="email" placeholder="Email" required className="h-12 rounded-2xl" />
        <Input type="password" name="password" placeholder="Password" required minLength={8} className="h-12 rounded-2xl" />
        <Button type="submit" className="h-12 rounded-2xl">
          Create account
        </Button>
      </form>
      <form action={signInWithGoogleAction}>
        <Button type="submit" variant="secondary" className="h-12 w-full rounded-2xl">
          Sign up with Google
        </Button>
      </form>
    </AuthShell>
  );
}
