export interface EbayProductData {
  isFailed: boolean;
  ebay: {
    id: string | undefined;
    remoteProductSku: string | undefined;
    name: string | undefined;
    stockQuantity: number;
  };
  mye: {
    isMapped: boolean | undefined;
    localProductId: number | undefined;
    localProductName: string | undefined;
    localProductSku: string | undefined;
    inOpen: number;
    stockLevel: number;
    available: number;
    pendingQuantity: number;
    remoteProductId: number;
    remote_product_sku: string;
  };
}
