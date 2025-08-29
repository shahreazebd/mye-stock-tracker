import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableLoadingProps {
  columnCount: number;
  rowCount?: number;
}

function generateKeys(count: number) {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

export function TableLoading({ columnCount, rowCount = 17 }: TableLoadingProps) {
  const headerRowKeys = generateKeys(1);
  const headerCellKeys = generateKeys(columnCount);
  const rowKeys = generateKeys(rowCount);
  const cellKeys = rowKeys.map(() => generateKeys(columnCount));

  return (
    <>
      <Table containerClassName="relative border-t h-[calc(100vh-370px)] w-full overflow-auto">
        <TableHeader>
          {headerRowKeys.map((rowKey) => (
            <TableRow key={rowKey} className="hover:bg-transparent">
              {headerCellKeys.map((cellKey) => (
                <TableHead key={cellKey} className=" border-r last:border-0">
                  <Skeleton className="my-2 size-full" />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rowKeys.map((rowKey, rowIndex) => (
            <TableRow key={rowKey} className="hover:bg-transparent">
              {cellKeys[rowIndex].map((cellKey) => (
                <TableCell key={cellKey} className="h-8 border-r last:border-0">
                  <Skeleton className="size-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex w-full flex-col items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
        <div className="flex-1">
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-7 w-24" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-7 w-8" />
              <Skeleton className="h-7 w-8" />
              <Skeleton className="h-7 w-8" />
              <Skeleton className="h-7 w-8" />
            </div>
            <Skeleton className="h-7 w-24" />
          </div>
        </div>
      </div>
    </>
  );
}
