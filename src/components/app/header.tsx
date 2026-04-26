import Link from "next/link";

import { BrandMark } from "@/components/app/brand-mark";
import { MobileNav } from "@/components/app/mobile-nav";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { getOptionalUser } from "@/lib/session";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/problems", label: "Problem library" },
  { href: "/path", label: "30-day path" },
];

const appLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/problems", label: "Problems" },
  { href: "/path", label: "Path" },
  { href: "/profile", label: "Profile" },
];

export async function AppHeader() {
  const user = await getOptionalUser();
  const links = user ? appLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <BrandMark />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {user ? (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "hidden sm:inline-flex",
                )}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariants(), "hidden sm:inline-flex")}
              >
                Start free
              </Link>
            </>
          )}
          <MobileNav
            links={links}
            footer={
              user ? (
                <span className="px-3 text-sm text-muted-foreground">
                  {user.email}
                </span>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full justify-center",
                    )}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className={cn(buttonVariants(), "w-full justify-center")}
                  >
                    Start free
                  </Link>
                </>
              )
            }
          />
        </div>
      </div>
    </header>
  );
}
