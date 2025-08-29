"use client";

import { ChevronLeft, ChevronRight, ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Summary } from "@/types/common";
import type { ProductData } from "@/types/woocommerce";

const ITEMS_PER_PAGE = 500;

interface Props {
  data: ProductData[];
  summary: Summary | undefined;
}

export function WooCommerceTable({ data, summary }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockDifferenceFilter, setStockDifferenceFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    return data.filter((product) => {
      const matchesSearch =
        (product.woocommerce.remoteProductSku?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        ) || (product.woocommerce.id?.toString() || "").includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || product.woocommerce.stockStatus === statusFilter;

      const stockDifference =
        (product.woocommerce.stockQuantity || 0) - product.mye.available_quantity;
      const matchesStockDifference =
        stockDifferenceFilter === "all" ||
        (stockDifferenceFilter === "match" && stockDifference === 0) ||
        (stockDifferenceFilter === "mismatch" && stockDifference !== 0) ||
        (stockDifferenceFilter === "higher" && stockDifference > 0) ||
        (stockDifferenceFilter === "lower" && stockDifference < 0);

      return matchesSearch && matchesStatus && matchesStockDifference;
    });
  }, [data, searchTerm, statusFilter, stockDifferenceFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, stockDifferenceFilter]);

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "instock":
        return "bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full font-medium text-green-700 dark:text-green-300 text-xs";
      case "outofstock":
        return "bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full font-medium text-red-700 dark:text-red-300 text-xs";
      default:
        return "bg-gray-100 dark:bg-gray-800/50 px-2 py-1 rounded-full font-medium text-gray-700 dark:text-gray-300 text-xs";
    }
  };

  const getStockLevelColor = (myeStock: number, wooStock: number) => {
    const difference = myeStock - wooStock;
    if (difference >= 0) return "text-green-600 dark:text-green-400";
    return "text-red-600 dark:text-red-400";
  };

  const stockStats = useMemo(() => {
    const total = filteredProducts.length;
    const inStock = filteredProducts.filter(
      (p) => p.woocommerce.stockStatus === "instock",
    ).length;
    const matching = filteredProducts.filter(
      (p) => (p.woocommerce.stockQuantity || 0) === p.mye.available_quantity,
    ).length;

    return { total, inStock, matching };
  }, [filteredProducts]);

  console.log(paginatedProducts);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Product Comparison</span>
          <div className="flex gap-4 font-normal text-muted-foreground text-sm">
            <span>Filtered: {filteredProducts.length}</span>
            <span>In Stock: {stockStats.inStock}</span>
            <span>Stock Match: {stockStats.matching}</span>
            <span>Total: {summary?.total}</span>
            <span>Success: {summary?.success}</span>
            <span>Accuracy: {summary?.accuracy}</span>
            <span>Failed: {summary?.failed}</span>
            <span>Unmapped: {summary?.unmapped}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by SKU or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="instock">In Stock</SelectItem>
              <SelectItem value="outofstock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stockDifferenceFilter} onValueChange={setStockDifferenceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stock Difference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Differences</SelectItem>
              <SelectItem value="match">Exact Match</SelectItem>
              <SelectItem value="mismatch">Any Difference</SelectItem>
              <SelectItem value="higher">WooCommerce Higher</SelectItem>
              <SelectItem value="lower">WooCommerce Lower</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-md border">
          <div className="max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white">
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[200px]">Remote SKU</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[100px]">MYE</TableHead>
                  <TableHead className="w-[100px]">WooCommerce</TableHead>
                  {/* <TableHead className="w-[100px]">Difference</TableHead> */}
                  {/* <TableHead className="w-[120px]">Pending</TableHead> */}
                  {/* <TableHead className="w-[100px]">In Open</TableHead> */}
                  {/* <TableHead className="w-[100px]">Minimum</TableHead> */}
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No products found with current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => {
                    const stockDifference =
                      product.mye.available_quantity - product.woocommerce.stockQuantity;

                    return (
                      <TableRow
                        key={product.woocommerce.id || product.mye.remote_product_sku}
                      >
                        {/* ID */}
                        <TableCell className="font-medium">
                          {product.woocommerce.id || "N/A"}
                        </TableCell>

                        {/* Remote SKU */}
                        <TableCell className="font-mono text-sm">
                          {product.woocommerce.remoteProductSku || "N/A"}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <span
                            className={getStockStatusColor(
                              product.woocommerce.stockStatus || "unknown",
                            )}
                          >
                            {product.woocommerce.stockStatus || "Unknown"}
                          </span>
                        </TableCell>

                        {/* MYE Avaiable*/}

                        <TableCell className="text-center">
                          {product.mye.available_quantity}
                        </TableCell>
                        <TableCell className="text-center">
                          {product.woocommerce.stockQuantity || 0}
                        </TableCell>

                        {/* <TableCell
                          className={`text-center font-medium ${getStockLevelColor(
                            product.mye.stockLevel,
                            product.woocommerce.stockQuantity,
                          )}`}
                        >
                          {stockDifference > 0 ? "+" : ""}
                          {stockDifference}
                        </TableCell> */}
                        {/* <TableCell className="text-center">
                          {product.mye.pendingQuantity}
                        </TableCell> */}
                        {/* <TableCell className="text-center">
                          {product.mye.inOpen}
                        </TableCell> */}
                        {/* <TableCell className="text-center">
                          {product.mye.maxStock}
                        </TableCell> */}
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={product.woocommerce.permalink || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </div>

            <div className="flex items-center space-x-2">
              {/* First Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                « First
              </Button>

              {/* Previous */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>

              {/* Next */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Last Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last »
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
