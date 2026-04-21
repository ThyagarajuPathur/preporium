import Link from "next/link";

import { BrandMark } from "@/components/app/brand-mark";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthShell({
  title,
  description,
  children,
  footer,
  message,
  error,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  message?: string;
  error?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-10 lg:grid-cols-[1fr_480px]">
        <div className="hidden flex-col justify-center gap-8 lg:flex">
          <BrandMark />
          <div className="max-w-xl">
            <h1 className="font-heading text-5xl font-semibold tracking-[-0.05em] text-foreground">
              Structured prep without the spreadsheet juggling.
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Sign in to track every problem, move through the curated 30-day
              path, and keep your senior interview prep honest.
            </p>
          </div>
        </div>
        <Card className="border-border/60 bg-card/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <CardHeader className="gap-2">
            <Link href="/" className="mb-2 w-fit">
              <BrandMark />
            </Link>
            <CardTitle className="font-heading text-3xl tracking-tight">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {message ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
            {children}
            {footer ? <div className="pt-2 text-sm text-muted-foreground">{footer}</div> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
