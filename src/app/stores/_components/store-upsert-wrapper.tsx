"use client";

import { useRouter } from "next/navigation";
import { StoreUpsertForm } from "@/components/forms/store-upsert-form";
import type { StorePlatform } from "@/types/store";

interface StoreUpsertWrapperProps {
  store?: {
    id: string;
    name: string;
    url: string;
    platform: StorePlatform;
    description: string | null;
  };
  trigger?: React.ReactNode;
}

export function StoreUpsertWrapper({ store, trigger }: StoreUpsertWrapperProps) {
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  };

  return <StoreUpsertForm store={store} trigger={trigger} onSuccess={handleSuccess} />;
}
