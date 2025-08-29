import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  pageSizes: string[];
}

export function TablePagination<TData>({
  table,
  pageSizes,
}: TablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const currentPage = pageIndex + 1;
  const totalPages = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;

  const handlePageChange = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    table.setPageIndex(page - 1);
  };

  const handlePageSizeChange = (size: string) => {
    table.setPageSize(Number(size));
  };

  if (totalRows === 0) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-2 px-2 py-1 xl:flex-row">
      {/* Page size selector */}
      <div className="flex items-center space-x-2">
        <span className="text-xs">Rows per page:</span>
        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        {/* First Page */}
        <Button
          variant="outline"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="h-7 text-xs"
        >
          <ChevronsLeft className="size-5" />
        </Button>

        {/* Prev Page */}
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-7 text-xs"
        >
          <ChevronLeft className="size-5" />
        </Button>

        <span className="text-xs">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next Page */}
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-7 text-xs"
        >
          <ChevronRight className="size-5" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-7 text-xs"
        >
          <ChevronsRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}
