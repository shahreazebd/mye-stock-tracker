import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPlatforms } from "@/actions/platform-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBadgeColor, getPlatformColor } from "@/lib/helpers";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const result = await getPlatforms();
  const platforms = result.success && result.data ? result.data : [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-bold text-4xl text-foreground tracking-tight sm:text-6xl">
          Welcome to Stock Tracker
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-8">
          Check your product information with ease. Choose a platforms below to verify and
          validate product details.
        </p>
      </div>

      {/* platforms Cards Section */}
      <div className="mt-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-center font-bold text-2xl text-foreground lg:text-left">
            Select a platforms
          </h2>
          <div className="flex gap-2">
            <Link href="/platforms">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Manage platforms
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {platforms.map((platform) => (
            <Link
              key={platform.id}
              href={`/platforms/${platform.id}`}
              className="group transition-transform hover:scale-105"
            >
              <Card key={platform.id} className={getPlatformColor(platform.name)}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-white">
                        <Image
                          src={platform.image}
                          alt={platform.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <Badge className={getBadgeColor(platform.name)}>
                          {platform.name.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {platform.description || "No description provided"}
                  </CardDescription>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Accuracy: {platform.accuracy || 0}%</span>
                    <span>Tests: {platform.totalTest || 0}</span>
                  </div>
                  <div className="mt-2 text-muted-foreground text-xs">
                    Created: {new Date(platform.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-20">
        <h2 className="mb-8 text-center font-bold text-2xl text-foreground">
          What You Can Do
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-xl">🔍</span>
            </div>
            <h3 className="mb-2 font-semibold text-lg">Product Validation</h3>
            <p className="text-muted-foreground text-sm">
              Verify product authenticity and check for suspicious listings
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="mb-2 font-semibold text-lg">Price Analysis</h3>
            <p className="text-muted-foreground text-sm">
              Compare prices across platforms and track historical data
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-xl">⚡</span>
            </div>
            <h3 className="mb-2 font-semibold text-lg">Real-time Updates</h3>
            <p className="text-muted-foreground text-sm">
              Get instant notifications about product changes and availability
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
