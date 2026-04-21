"use server";

import { redirect } from "next/navigation";

import { getSiteUrl } from "@/lib/site";
import { createServerSupabase } from "@/lib/supabase/server";

function redirectWithError(path: string, message: string) {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function redirectWithMessage(path: string, message: string) {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectWithError("/login", error.message);
  }

  redirect("/dashboard");
}

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createServerSupabase();
  const siteUrl = await getSiteUrl();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    redirectWithError("/signup", error.message);
  }

  redirectWithMessage(
    "/login",
    "Check your email to confirm the account, then come back and log in.",
  );
}

export async function forgotPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const supabase = await createServerSupabase();
  const siteUrl = await getSiteUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  if (error) {
    redirectWithError("/forgot-password", error.message);
  }

  redirectWithMessage(
    "/forgot-password",
    "Reset instructions are on the way if that email exists in your account.",
  );
}

export async function updatePasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirectWithError("/reset-password", error.message);
  }

  redirectWithMessage("/login", "Password updated. You can sign in now.");
}

export async function signInWithGoogleAction() {
  const supabase = await createServerSupabase();
  const siteUrl = await getSiteUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error || !data.url) {
    redirectWithError("/login", error?.message ?? "Unable to start Google sign-in.");
  }

  redirect(data.url!);
}

export async function signOutAction() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/");
}
