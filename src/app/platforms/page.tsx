import { Plus } from "lucide-react";
import Image from "next/image";
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
import { PlatformActionsDropdown } from "./_components/platform-actions-dropdown";
import { PlatformUpsertWrapper } from "./_components/platform-upsert-wrapper";

export const dynamic = "force-dynamic";

export default async function PlatformsPage() {
  const result = await getPlatforms();
  const platforms = result.success && result.data ? result.data : [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">Platforms</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your platform integrations and configurations
          </p>
        </div>
        <PlatformUpsertWrapper />
      </div>

      {platforms.length === 0 ? (
        <Card className="py-12 text-center">
          <CardHeader>
            <CardTitle>No platforms found</CardTitle>
            <CardDescription>
              Get started by creating your first platform integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlatformUpsertWrapper
              trigger={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Platform
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
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
                  <PlatformActionsDropdown platform={platform} />
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
          ))}
        </div>
      )}
    </div>
  );
}
