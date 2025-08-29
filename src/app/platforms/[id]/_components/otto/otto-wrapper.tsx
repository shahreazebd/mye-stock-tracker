"use client";

import { Loader } from "lucide-react";
import { useState } from "react";
import type { Summary } from "@/types/common";
import type { OttoProductData } from "@/types/otto";
import { OttoProductCheckForm } from "./otto-product-check-form";
import { OttoTable } from "./otto-table";

export function OttoWrapper() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OttoProductData[]>([]);
  const [summary, setSummary] = useState<Summary | undefined>(undefined);

  return (
    <div className="space-y-8">
      <OttoProductCheckForm
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
        <OttoTable summary={summary} data={data} />
      )}
    </div>
  );
}
