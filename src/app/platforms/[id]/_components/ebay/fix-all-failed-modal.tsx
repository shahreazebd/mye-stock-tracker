"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { fixAllFailedAction } from "@/actions/fix-failed-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { openErrorNotification } from "@/lib/helpers";
import type { Summary } from "@/types/common";

interface Props {
  summary: Summary | undefined;
}

export function FixAllFailedModal({ summary }: Props) {
  const { myeCompanyId, myeStoreId, failedSku } = summary || {};
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit() {
    setIsLoading(true);
    try {
      await fixAllFailedAction({
        companyId: myeCompanyId ?? "",
        storeId: myeStoreId ?? "",
        skus: failedSku ?? [],
      });
    } catch (error) {
      openErrorNotification("Error fixing failed products");
    } finally {
      setIsShowDialog(false);
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        disabled={!failedSku?.length}
        onClick={() => setIsShowDialog(true)}
      >
        {isLoading ? "Fixing..." : "Fix all Failed"}
      </Button>

      <Dialog open={isShowDialog} onOpenChange={setIsShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <DialogTitle>Fix all Failed Products</DialogTitle>
            </div>
            <DialogDescription>
              You have <span className="font-semibold">{failedSku?.length || 0}</span>{" "}
              failed product(s). This will attempt to update their stock across the
              selected channel. Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsShowDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button variant="destructive" onClick={onSubmit} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Fix all Failed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
