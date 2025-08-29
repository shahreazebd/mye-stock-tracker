"use client";

import { useRouter } from "next/navigation";
import { PlatformUpsertForm } from "@/components/forms/platform-upsert-form";

interface Props {
  platform?: {
    id: string;
    name: string;
    description: string | null;
    image: string;
  };
  trigger?: React.ReactNode;
}

export function PlatformUpsertWrapper({ platform, trigger }: Props) {
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <PlatformUpsertForm platform={platform} trigger={trigger} onSuccess={handleSuccess} />
  );
}
