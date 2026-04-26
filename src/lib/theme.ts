export const THEME_STORAGE_KEY = "theme";
export const THEME_CHANGE_EVENT = "preporium-theme-change";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

// Runs in the browser before React hydrates. Reads the persisted theme
// (or falls back to system) and applies the .dark class so the first
// paint matches the chosen theme. Kept as a string so layout.tsx can
// inject it as an inline <script> in <head>.
export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var t=(s==="light"||s==="dark"||s==="system")?s:"system";var r=t==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;var d=document.documentElement;if(r==="dark"){d.classList.add("dark");}else{d.classList.remove("dark");}d.style.colorScheme=r;}catch(e){}})();`;
