export interface ProductData {
  woocommerce: {
    id: number;
    remoteProductSku: string;
    permalink: string;
    stockStatus: string;
    stockQuantity: number;
  };
  mye: {
    available_quantity: number;
    product_id: string;
    remote_product_sku: string;
  };
}
