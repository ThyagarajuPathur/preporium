"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  footer,
}: {
  links: NavLink[];
  footer?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X aria-hidden /> : <Menu aria-hidden />}
      </Button>
      {open ? (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full border-b border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
        >
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a")) {
                setOpen(false);
              }
            }}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-base text-foreground/90 transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            {footer ? (
              <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-3">
                {footer}
              </div>
            ) : null}
          </nav>
        </div>
      ) : null}
    </>
  );
}
