import type { Metadata } from "next";

import { AppHeader } from "@/components/app/header";
import { Toaster } from "@/components/ui/sonner";
import { BRAND } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BRAND.name} | Structured DSA prep`,
  description: BRAND.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full bg-background text-foreground">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(255,106,61,0.16),_transparent_62%)]" />
          <div className="pointer-events-none absolute right-0 top-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(32,178,170,0.12),_transparent_70%)] blur-3xl" />
          <AppHeader />
          <main>{children}</main>
        </div>
        <Toaster richColors />
      </body>
    </html>
  );
}
