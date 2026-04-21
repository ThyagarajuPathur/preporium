"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { safeRedirectPath } from "@/lib/redirects";
import { getSiteUrl } from "@/lib/site";
import { createServerSupabase } from "@/lib/supabase/server";

const emailSchema = z.string().trim().toLowerCase().email();
const passwordSchema = z.string().min(8).max(128);
// Supabase caps passwords at 72 bytes for bcrypt; cap input at 128 chars for a small safety margin.

const credentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const emailOnlySchema = z.object({ email: emailSchema });
const passwordOnlySchema = z.object({ password: passwordSchema });

const GENERIC_LOGIN_ERROR = "Invalid email or password.";
const GENERIC_SIGNUP_ERROR = "Could not create account. Please try again.";
const GENERIC_RESET_SENT =
  "Reset instructions are on the way if that email exists in your account.";
const GENERIC_PASSWORD_UPDATE_ERROR =
  "Could not update password. Please request a new reset link and try again.";
const GENERIC_OAUTH_ERROR = "Unable to start Google sign-in.";
const INVALID_INPUT_ERROR = "Please check the email and password you entered.";

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function redirectWithMessage(path: string, message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

function formString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function loginAction(formData: FormData) {
  const parsed = credentialsSchema.safeParse({
    email: formString(formData, "email"),
    password: formString(formData, "password"),
  });

  if (!parsed.success) {
    redirectWithError("/login", INVALID_INPUT_ERROR);
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    console.error("[auth] login failed", { code: error.code, name: error.name });
    redirectWithError("/login", GENERIC_LOGIN_ERROR);
  }

  const next = safeRedirectPath(formString(formData, "next"));
  redirect(next);
}

export async function signupAction(formData: FormData) {
  const parsed = credentialsSchema.safeParse({
    email: formString(formData, "email"),
    password: formString(formData, "password"),
  });

  if (!parsed.success) {
    redirectWithError("/signup", INVALID_INPUT_ERROR);
  }

  const supabase = await createServerSupabase();
  const siteUrl = await getSiteUrl();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    console.error("[auth] signup failed", { code: error.code, name: error.name });
    redirectWithError("/signup", GENERIC_SIGNUP_ERROR);
  }

  redirectWithMessage(
    "/login",
    "Check your email to confirm the account, then come back and log in.",
  );
}

export async function forgotPasswordAction(formData: FormData) {
  const parsed = emailOnlySchema.safeParse({
    email: formString(formData, "email"),
  });

  // Always show the same generic message to avoid leaking whether an email is registered.
  if (!parsed.success) {
    redirectWithMessage("/forgot-password", GENERIC_RESET_SENT);
  }

  const supabase = await createServerSupabase();
  const siteUrl = await getSiteUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  if (error) {
    console.error("[auth] resetPasswordForEmail failed", {
      code: error.code,
      name: error.name,
    });
  }

  redirectWithMessage("/forgot-password", GENERIC_RESET_SENT);
}

export async function updatePasswordAction(formData: FormData) {
  const parsed = passwordOnlySchema.safeParse({
    password: formString(formData, "password"),
  });

  if (!parsed.success) {
    redirectWithError("/reset-password", "Password must be at least 8 characters.");
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // updateUser requires an authenticated recovery session. Refuse early so we
  // don't produce a confusing Supabase error and to block drive-by submissions.
  if (!user) {
    redirectWithError(
      "/forgot-password",
      "Your reset link has expired. Please request a new one.",
    );
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    console.error("[auth] updatePassword failed", { code: error.code, name: error.name });
    redirectWithError("/reset-password", GENERIC_PASSWORD_UPDATE_ERROR);
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
    console.error("[auth] google oauth failed", {
      code: error?.code,
      name: error?.name,
    });
    redirectWithError("/login", GENERIC_OAUTH_ERROR);
  }

  redirect(data.url);
}

export async function signOutAction() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/");
}
