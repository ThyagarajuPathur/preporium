"use server";

import { revalidatePath } from "next/cache";

import { getRequiredSession } from "@/lib/session";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ProgressStatus } from "@/lib/types";

type SupabaseWriteError = { code?: string; message?: string } | null;

// JWT expired / invalid — Supabase's PostgREST surfaces these codes for auth failures.
const AUTH_ERROR_CODES = new Set(["PGRST301", "PGRST303"]);

function isAuthError(error: SupabaseWriteError) {
  if (!error) return false;
  if (error.code && AUTH_ERROR_CODES.has(error.code)) return true;
  return /jwt|token.*expired/i.test(error.message ?? "");
}

export async function updateProgressAction(input: {
  problemId: string;
  status: ProgressStatus;
}) {
  const session = await getRequiredSession();

  if (!session?.user) {
    throw new Error("Authentication required.");
  }

  const supabase = await createServerSupabase();
  const row = {
    user_id: session.user.id,
    problem_id: input.problemId,
    status: input.status,
    updated_at: new Date().toISOString(),
  };

  // Retry once on auth errors to cover the narrow window where the access token
  // expires between getRequiredSession() and the DB call (clock skew, long request).
  let { error } = await supabase
    .from("user_problem_progress")
    .upsert(row, { onConflict: "user_id,problem_id" });

  if (isAuthError(error)) {
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      throw new Error(refreshError.message);
    }

    ({ error } = await supabase
      .from("user_problem_progress")
      .upsert(row, { onConflict: "user_id,problem_id" }));
  }

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/problems");
  revalidatePath("/path");
  revalidatePath("/profile");

  return { ok: true };
}
