"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Inbox } from "lucide-react";
import * as React from "react";
import { TableLoading } from "@/components/table-loading";
import { TablePagination } from "@/components/table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  loading?: boolean;
  pagination?: boolean;
  rowPerPage?: number;
  pageSizes?: string[];
}

const emptyArray: [] = [];

export function useDataTable<TData, TValue>({
  columns,
  data,
  loading,
  pagination = true,
  rowPerPage = 100,
  pageSizes = ["100", "500", "1000"],
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: data || emptyArray,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: rowPerPage,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel:
      pagination && data && data.length > 0 ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
  });

  const handelRowSelect = (row: Row<unknown>) => {
    table.resetRowSelection();
    row.toggleSelected();
  };

  const render = loading ? (
    <TableLoading columnCount={table.getAllColumns().length} />
  ) : (
    <>
      <Table
        className="border-separate border-spacing-0"
        containerClassName="relative h-[calc(100vh-370px)] w-full overflow-auto"
      >
        <TableHeader className="sticky top-0 z-20 bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-muted/50 hover:bg-muted/50 [&>*]:border-t [&>:not(:last-child)]:border-r"
            >
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="truncate border-border border-b">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => handelRowSelect(row)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="truncate border-border border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-32 text-center">
                <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                  <Inbox className="h-12 w-12 text-gray-300" />
                  <p className="font-medium text-lg">No Data Available</p>
                  <p className="text-gray-400 text-sm">
                    There is nothing to display here at the moment.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && data && data.length > 0 && (
        <TablePagination table={table} pageSizes={pageSizes} />
      )}
    </>
  );

  return { render, table };
}
