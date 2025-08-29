import type { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadJSON } from "@/lib/helpers";
import type { Summary } from "@/types/common";
import type { EbayProductData } from "@/types/ebay";
import { EbayProductCheckModal } from "./ebay-product-check-modal";
import { FixAllFailedModal } from "./fix-all-failed-modal";

interface Props {
  summary: Summary | undefined;
  table: Table<EbayProductData>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<EbayProductData[]>>;
  setSummary: Dispatch<SetStateAction<Summary | undefined>>;
}

export function TableFilter(props: Props) {
  const { isLoading, setIsLoading, setData, setSummary, table, summary } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  // Filter SKU dynamically
  useEffect(() => {
    table.getColumn("remoteSku")?.setFilterValue(searchTerm);
  }, [searchTerm, table]);

  // Filter status dynamically
  useEffect(() => {
    table
      .getColumn("status")
      ?.setFilterValue(statusFilter === "all" ? undefined : statusFilter);
  }, [statusFilter, table]);

  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative min-w-[200px] flex-1">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by Remote SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="mapped">Mapped</SelectItem>
          <SelectItem value="unmapped">Unmapped</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      <FixAllFailedModal summary={summary} />

      <Button
        variant="outline"
        disabled={!summary?.failed}
        onClick={() => downloadJSON(summary, `${summary?.name}.json`)}
      >
        Download
      </Button>

      <EbayProductCheckModal
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setData={setData}
        setSummary={setSummary}
      />
    </div>
  );
}
