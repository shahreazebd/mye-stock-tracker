"use client";

import { Loader } from "lucide-react";
import { useState } from "react";
import type { Summary } from "@/types/common";
import type { ProductData } from "@/types/woocommerce";
import { WooCommerceProductCheckForm } from "./woocommerce-product-check-form";
import { WooCommerceTable } from "./woocommerce-table";

export function WooCommerceWrapper() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ProductData[]>([]);
  const [summary, setSummary] = useState<Summary | undefined>(undefined);

  return (
    <div className="space-y-8">
      <WooCommerceProductCheckForm
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setData={setData}
        setSummary={setSummary}
      />

      {isLoading ? (
        <div className="flex justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <WooCommerceTable summary={summary} data={data} />
      )}
    </div>
  );
}
