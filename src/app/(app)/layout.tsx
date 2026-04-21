import { redirect } from "next/navigation";

import { SetupRequired } from "@/components/app/setup-required";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getRequiredSession } from "@/lib/session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabaseEnv()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SetupRequired />
      </div>
    );
  }

  const session = await getRequiredSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
