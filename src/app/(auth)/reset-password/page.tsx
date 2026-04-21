import { redirect } from "next/navigation";

import { updatePasswordAction } from "@/app/actions/auth";
import { AuthShell } from "@/components/app/auth-shell";
import { SetupRequired } from "@/components/app/setup-required";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getOptionalUser } from "@/lib/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  if (!hasSupabaseEnv()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SetupRequired />
      </div>
    );
  }

  // `updateUser({ password })` requires an authenticated session. The reset link
  // goes through /auth/callback which establishes one; if someone lands here
  // without it, push them back to request a fresh link.
  const user = await getOptionalUser();
  if (!user) {
    redirect(
      `/forgot-password?error=${encodeURIComponent("Your reset link has expired. Please request a new one.")}`,
    );
  }

  const params = await searchParams;

  return (
    <AuthShell
      title="Choose a new password"
      description="Set a new password and jump right back into the prep flow."
      error={params.error}
      message={params.message}
    >
      <form action={updatePasswordAction} className="flex flex-col gap-3">
        <Input
          type="password"
          name="password"
          placeholder="New password"
          required
          minLength={8}
          className="h-12 rounded-2xl"
        />
        <Button type="submit" className="h-12 rounded-2xl">
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
