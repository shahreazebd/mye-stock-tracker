export interface OttoProductData {
  otto: {
    remoteProductSku: string;
    stockQuantity: number;
  };
  mye: {
    available_quantity: number;
    product_id: string;
    remote_product_sku: string;
  };
}
