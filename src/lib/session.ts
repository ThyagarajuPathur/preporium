import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import type { ProfileSummary } from "@/lib/types";
import { createServerSupabase } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

type ProfileRow = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
};

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

function deriveDisplayName(user: User): string | null {
  const metadata = user.user_metadata as Record<string, unknown> | null;
  const fullName = typeof metadata?.full_name === "string" ? metadata.full_name : null;
  const name = typeof metadata?.name === "string" ? metadata.name : null;
  return fullName ?? name ?? user.email?.split("@")[0] ?? null;
}

function deriveAvatarUrl(user: User): string | null {
  const metadata = user.user_metadata as Record<string, unknown> | null;
  return typeof metadata?.avatar_url === "string" ? metadata.avatar_url : null;
}

export async function ensureProfile() {
  const user = await getOptionalUser();

  if (!user) {
    return null;
  }

  const supabase = await createServerSupabase();

  // Read first: in steady state the profile already exists, so we avoid a write
  // per authenticated request. Only insert when missing.
  const { data: existing } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, created_at")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (existing) {
    return { user, profile: existing };
  }

  const inserted: ProfileRow = {
    id: user.id,
    display_name: deriveDisplayName(user),
    avatar_url: deriveAvatarUrl(user),
    created_at: null,
  };

  // Use upsert to stay race-safe if two concurrent requests race to create the row.
  const { data: created } = await supabase
    .from("profiles")
    .upsert(
      {
        id: inserted.id,
        display_name: inserted.display_name,
        avatar_url: inserted.avatar_url,
      },
      { onConflict: "id" },
    )
    .select("id, display_name, avatar_url, created_at")
    .single<ProfileRow>();

  return { user, profile: created ?? inserted };
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

export function mapProfileSummary(profile: ProfileRow | null): ProfileSummary | null {
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
