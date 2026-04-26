"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/app/theme-provider";
import { Button } from "@/components/ui/button";
import type { Theme } from "@/lib/theme";

const ORDER: Theme[] = ["system", "light", "dark"];

const NEXT_LABEL: Record<Theme, string> = {
  system: "Switch to light theme",
  light: "Switch to dark theme",
  dark: "Use system theme",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={NEXT_LABEL[theme]}
      title={NEXT_LABEL[theme]}
      onClick={() => {
        const nextIndex = (ORDER.indexOf(theme) + 1) % ORDER.length;
        setTheme(ORDER[nextIndex]);
      }}
    >
      <Icon aria-hidden />
    </Button>
  );
}
