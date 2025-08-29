import type { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, Check, ExternalLink, X } from "lucide-react";
import { CopyText } from "@/components/copy-text";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EbayProductData } from "@/types/ebay";

export const columns: ColumnDef<EbayProductData>[] = [
  {
    id: "#",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    id: "id",
    accessorKey: "ebay.id",
    header: "Ebay Id",
  },
  {
    id: "remoteSku",
    accessorKey: "mye.remote_product_sku",
    header: "Remote SKU",
    cell: ({ row }) =>
      row.original.mye.remote_product_sku && (
        <CopyText text={row.original.mye.remote_product_sku} />
      ),
  },
  // {
  //   id: "localSku",
  //   accessorKey: "mye.localProductSku",
  //   header: "Local SKU",
  //   cell: ({ row }) =>
  //     row.original.mye.localProductSku && (
  //       <CopyText text={row.original.mye.localProductSku} />
  //     ),
  // },
  {
    accessorKey: "ebay.stockQuantity",
    header: "eBay",
  },
  // {
  //   accessorKey: "mye.stockLevel",
  //   header: "MYE",
  // },
  // {
  //   accessorKey: "mye.maxStock",
  //   header: "Max",
  // },
  {
    accessorKey: "mye.available_quantity",
    header: "Available",
  },
  {
    id: "status",
    header: "Status",
    accessorFn: (row) => {
      if (row.isFailed) return "failed";
      if (row.mye?.isMapped) return "mapped";
      if (!row.mye?.isMapped) return "unmapped";
    },

    cell: ({ row }) => {
      const failed = row.original?.isFailed;
      const isMapped = row.original?.mye?.isMapped;

      return (
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center gap-1 rounded-full font-semibold text-sm",
            failed
              ? "bg-red-100 text-red-700"
              : isMapped
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700",
          )}
        >
          {failed ? (
            <X className="h-4 w-4" />
          ) : isMapped ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => row.getValue(columnId) === filterValue,
  },

  // {
  //   accessorKey: "mye.inOpen",
  //   header: "In Open",
  //   cell: ({ row }) => row.original.mye.inOpen - row.original.mye.pendingQuantity,
  // },
  // {
  //   accessorKey: "mye.pendingQuantity",
  //   header: "Pending",
  // },

  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <a
          href={`https://www.ebay.com/itm/${row.original.ebay.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          <ExternalLink className="h-3 w-3" />
          View
        </a>
      );
    },
  },
];
