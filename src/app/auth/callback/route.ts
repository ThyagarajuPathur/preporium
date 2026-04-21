import { type NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";

import { safeRedirectPath } from "@/lib/redirects";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=Unable%20to%20verify%20login.", origin),
    );
  }

  const { url, anonKey } = getSupabaseEnv();
  const response = NextResponse.redirect(new URL(next, origin));
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=Unable%20to%20verify%20login.", origin),
    );
  }

  return response;
}
