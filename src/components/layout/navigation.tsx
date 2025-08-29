import { Globe, Store } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";

export function Navigation() {
  return (
    <header className="w-full flex-shrink-0 border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between sm:h-14 lg:h-16">
          <div>
            <Link
              className="group flex items-center justify-center"
              href="/"
              aria-label="Home"
            >
              <div>
                <Globe className="mr-2 h-5 w-5 text-primary sm:h-6 sm:w-6" />
              </div>
              <span className="font-bold text-base transition-colors duration-300 group-hover:text-primary sm:text-lg lg:text-xl">
                Stock Tracker
              </span>
            </Link>
          </div>
          <nav className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <Link href="/platforms">
              <Button variant="ghost" size="sm" className="gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Platforms</span>
              </Button>
            </Link>
            <div>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
