"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTable } from "@/hooks/use-data-table";
import type { Summary } from "@/types/common";
import type { EbayProductData } from "@/types/ebay";
import { columns } from "./columns";
import { TableFilter } from "./table-filter";

export function EbayWrapper() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<EbayProductData[]>([]);
  const [summary, setSummary] = useState<Summary | undefined>(undefined);
  const { render, table } = useDataTable({
    data: data,
    columns: columns,
    loading: isLoading,
    rowPerPage: 100,
    pagination: true,
    pageSizes: ["100", "200", "500", "1000"],
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Product Comparison{summary?.name && ` (${summary.name})`}</span>
          <div className="flex gap-4 font-normal text-muted-foreground text-sm">
            <span>Total: {summary?.total}</span>
            <span>Success: {summary?.success}</span>
            <span>Accuracy: {summary?.accuracy}</span>
            <span>Failed: {summary?.failed}</span>
            <span>Unmapped: {summary?.unmapped}</span>
            <span>Max Stock: {summary?.maxStock}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TableFilter
          table={table}
          summary={summary}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setData={setData}
          setSummary={setSummary}
        />
        {render}
      </CardContent>
    </Card>
  );
}
