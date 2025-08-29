"use client";

import { Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlatformDeleteDialog } from "./platform-delete-dialog";
import { PlatformUpsertWrapper } from "./platform-upsert-wrapper";

interface Platform {
  id: string;
  name: string;
  description: string | null;
  image: string;
  accuracy: number | null;
  totalTest: number | null;
  createdAt: Date;
  updatedAt: Date | null;
}

interface Props {
  platform: Platform;
}

export function PlatformActionsDropdown({ platform }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <PlatformUpsertWrapper
          platform={platform}
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          }
        />
        <PlatformDeleteDialog platformId={platform.id} platformName={platform.name} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
