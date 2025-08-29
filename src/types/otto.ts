export interface OttoProductData {
  otto: {
    remoteProductSku: string;
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
