import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type React from "react";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { fontClasses } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Stock Tracker",
    template: `%s | Stock Tracker`,
  },
  description: "Check your product information",
  icons: {
    icon: "/favicon.ico",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={cn("min-h-screen font-sans antialiased", fontClasses)}>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <NextTopLoader color="#6F6AF8" />
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors closeButton position="bottom-right" />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
