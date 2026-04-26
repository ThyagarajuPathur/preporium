"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const ORDER = ["system", "light", "dark"] as const;
type ThemeChoice = (typeof ORDER)[number];

const NEXT_LABEL: Record<ThemeChoice, string> = {
  system: "Switch to light theme",
  light: "Switch to dark theme",
  dark: "Use system theme",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const current: ThemeChoice =
    theme && (ORDER as readonly string[]).includes(theme)
      ? (theme as ThemeChoice)
      : "system";

  const Icon = current === "light" ? Sun : current === "dark" ? Moon : Monitor;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={NEXT_LABEL[current]}
      title={NEXT_LABEL[current]}
      onClick={() => {
        const nextIndex = (ORDER.indexOf(current) + 1) % ORDER.length;
        setTheme(ORDER[nextIndex]);
      }}
    >
      <Icon aria-hidden />
    </Button>
  );
}
