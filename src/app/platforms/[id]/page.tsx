import { notFound } from "next/navigation";
import { getPlatformById } from "@/actions/platform-actions";
import { EbayWrapper } from "./_components/ebay/ebay-wrapper";
import { OttoWrapper } from "./_components/otto/otto-wrapper";
import { WooCommerceWrapper } from "./_components/woocommerce/woocommerce-wrapper";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PlatformDetailsPage({ params }: Props) {
  const param = await params;
  const result = await getPlatformById(param.id);

  const platform = result.success && result.data ? result.data : null;

  if (!platform) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      {platform.name === "WOOCOMMERCE" ? (
        <WooCommerceWrapper />
      ) : platform.name === "EBAY" ? (
        <EbayWrapper />
      ) : platform.name === "OTTO" ? (
        <OttoWrapper />
      ) : null}
    </div>
  );
}
