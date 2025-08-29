import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full flex-shrink-0 border-t bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-2 py-3 sm:flex-row sm:py-4">
          <p className="text-gray-500 text-xs sm:text-sm dark:text-gray-400">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">Stock Tracker</span>. All rights reserved.
          </p>
          <nav>
            <div>
              <Link
                className="text-xs underline-offset-4 transition-all duration-300 hover:text-primary hover:underline sm:text-sm"
                href="/"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
