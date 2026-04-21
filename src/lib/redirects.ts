const DEFAULT_PATH = "/dashboard";

/**
 * Only allow relative paths starting with a single `/`. Rejects protocol-relative
 * (`//evil.com`), backslash tricks (`/\evil.com`), and absolute URLs. The `next`
 * param on auth flows is user-controlled, so everything passed to `redirect()`
 * must pass through here.
 */
export function safeRedirectPath(
  path: string | null | undefined,
  fallback: string = DEFAULT_PATH,
): string {
  if (typeof path !== "string" || path.length === 0) return fallback;
  if (!path.startsWith("/")) return fallback;
  if (path.startsWith("//") || path.startsWith("/\\")) return fallback;
  return path;
}
