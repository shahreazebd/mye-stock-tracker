export interface ProductData {
  woocommerce: {
    id: number;
    remoteProductSku: string;
    permalink: string;
    stockStatus: string;
    stockQuantity: number;
  };
  mye: {
    localProductId: number;
    inOpen: number;
    maxStock: number;
    pendingQuantity: number;
    stockLevel: number;
    remoteProductId: number;
    remoteProductSku: string;
  };
}
