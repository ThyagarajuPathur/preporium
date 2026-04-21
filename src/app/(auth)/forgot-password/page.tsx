import { forgotPasswordAction } from "@/app/actions/auth";
import { AuthShell } from "@/components/app/auth-shell";
import { SetupRequired } from "@/components/app/setup-required";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function ForgotPasswordPage({
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
      title="Reset your password"
      description="We’ll send a reset link to your email so you can get back into the app."
      error={params.error}
      message={params.message}
    >
      <form action={forgotPasswordAction} className="flex flex-col gap-3">
        <Input type="email" name="email" placeholder="Email" required className="h-12 rounded-2xl" />
        <Button type="submit" className="h-12 rounded-2xl">
          Email me the reset link
        </Button>
      </form>
    </AuthShell>
  );
}
