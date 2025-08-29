export type StorePlatform = "WOOCOMMERCE" | "SHOPIFY" | "MAGENTO" | "CUSTOM";

export interface Store {
  id: string;
  name: string;
  url: string;
  platform: StorePlatform;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
