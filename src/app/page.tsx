import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarRange, ChartColumnIncreasing, Filter } from "lucide-react";

import { BrandMark } from "@/components/app/brand-mark";
import { buttonVariants } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { getOptionalUser } from "@/lib/session";
import { cn } from "@/lib/utils";

const featureRows = [
  {
    title: "A real 30-day roadmap",
    body: "Move from arrays and hashing to advanced DP, graphs, and senior-level mixed review without guessing what to practice next.",
    icon: CalendarRange,
  },
  {
    title: "Track every solve",
    body: "See solved count, revisit backlog, and current momentum at a glance so the prep plan stays honest.",
    icon: ChartColumnIncreasing,
  },
  {
    title: "Filter by exactly what matters",
    body: "Browse the whole library by day, topic, difficulty, and status, then jump straight to LeetCode in one click.",
    icon: Filter,
  },
];

export default async function Home() {
  const user = await getOptionalUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <section className="grid min-h-[calc(100svh-7rem)] items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex max-w-3xl flex-col gap-8">
          <BrandMark />
          <div className="flex flex-col gap-5">
            <span className="w-fit rounded-full border border-border/70 bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              personal prep system
            </span>
            <h1 className="max-w-4xl font-heading text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
              Brush up your DSA with a plan that actually feels buildable.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              {BRAND.name} turns a scattered LeetCode grind into a structured,
              trackable prep workflow with daily sets, live progress, and a
              cleaner path from fundamentals to senior-level problems.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "h-13 rounded-full px-7 text-base")}
            >
              Start the MVP
              <ArrowRight data-icon="inline-end" />
            </Link>
            <Link
              href="/path"
              className={cn(
                buttonVariants({ size: "lg", variant: "ghost" }),
                "h-13 rounded-full px-7 text-base",
              )}
            >
              Preview the 30-day path
            </Link>
          </div>
        </div>
        <div className="relative lg:justify-self-end">
          <div className="rounded-[2rem] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,245,240,0.92))] p-6 shadow-[0_30px_100px_rgba(15,23,42,0.10)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today’s stack</p>
                <h2 className="font-heading text-2xl font-semibold tracking-tight">
                  Day 12 · BSTs & Heaps
                </h2>
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                58 solved
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              {[
                { number: "230", title: "Kth Smallest Element in a BST", status: "Solved" },
                { number: "124", title: "Binary Tree Maximum Path Sum", status: "Revisit" },
                { number: "973", title: "K Closest Points to Origin", status: "In progress" },
              ].map((item) => (
                <div
                  key={item.number}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-border/50 bg-background/90 px-4 py-4 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <div className="rounded-xl bg-muted px-3 py-2 text-sm font-semibold text-muted-foreground">
                    #{item.number}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{item.title}</p>
                  </div>
                  <div className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border/60 pt-6 text-sm">
              <div>
                <p className="text-muted-foreground">Completion</p>
                <p className="mt-1 font-heading text-2xl font-semibold">38%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Revisit queue</p>
                <p className="mt-1 font-heading text-2xl font-semibold">11</p>
              </div>
              <div>
                <p className="text-muted-foreground">This week</p>
                <p className="mt-1 font-heading text-2xl font-semibold">23</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 border-t border-border/60 py-20 lg:grid-cols-3">
        {featureRows.map((feature) => (
          <div key={feature.title} className="flex flex-col gap-4">
            <feature.icon className="text-muted-foreground" />
            <h3 className="font-heading text-2xl font-semibold tracking-tight">
              {feature.title}
            </h3>
            <p className="max-w-sm leading-7 text-muted-foreground">
              {feature.body}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
