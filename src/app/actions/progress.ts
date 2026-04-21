"use server";

import { revalidatePath } from "next/cache";

import { getRequiredSession } from "@/lib/session";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ProgressStatus } from "@/lib/types";

export async function updateProgressAction(input: {
  problemId: string;
  status: ProgressStatus;
}) {
  const session = await getRequiredSession();

  if (!session?.user) {
    throw new Error("Authentication required.");
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("user_problem_progress").upsert(
    {
      user_id: session.user.id,
      problem_id: input.problemId,
      status: input.status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,problem_id" },
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/problems");
  revalidatePath("/path");
  revalidatePath("/profile");

  return { ok: true };
}
