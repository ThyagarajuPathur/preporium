import { redirect } from "next/navigation";

import type { ProfileSummary } from "@/lib/types";
import { createServerSupabase } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export async function getOptionalUser() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function ensureProfile() {
  const user = await getOptionalUser();

  if (!user) {
    return null;
  }

  const supabase = await createServerSupabase();
  await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name:
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        user.email?.split("@")[0] ??
        null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
    },
    { onConflict: "id" },
  );

  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, created_at")
    .eq("id", user.id)
    .single();

  return {
    user,
    profile: (data ?? {
      id: user.id,
      display_name: null,
      avatar_url: null,
      created_at: null,
    }) as {
      id: string;
      display_name: string | null;
      avatar_url: string | null;
      created_at: string | null;
    },
  };
}

export async function getRequiredSession() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const payload = await ensureProfile();

  if (!payload?.user) {
    redirect("/login");
  }

  return payload;
}

export function mapProfileSummary(
  profile:
    | {
        id: string;
        display_name: string | null;
        avatar_url: string | null;
        created_at: string | null;
      }
    | null,
): ProfileSummary | null {
  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    createdAt: profile.created_at,
  };
}
