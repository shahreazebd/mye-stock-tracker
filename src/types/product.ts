export interface EbayProduct {
  id: string;
  sku: string;
  name: string;
  quantity: number;
}

export interface MyeProductStock {
  id: string;
  local_product: {
    name: string;
    sku: string;
    local_product_id: number;
    is_composite: boolean;
    is_child: boolean;
    image: string;
    stock_notification: boolean;
  };
  is_mapped: boolean;
  createdAt: string;
  updatedAt: string;
  stock_level: number;
  in_open: number;
  minimum_quantity: number;
  location: number;
  company_uid: string;
  pending_quantity: number;
}

export interface MappedProduct {
  remote_id: number;
  remote_product_id: string;
  remote_product_sku: string;
  remote_product_title: string;
  channel_uid: string;
  company_uid: string;
  fba_status: boolean;
  mapping?: {
    mapped_id: number;
    remote_product: number;
    local_product: number;
    channel_uid: string;
    company_uid: string;
    mapped_local_product: {
      local_id: number;
      name: string;
      sku: string;
      company_uid: string;
    };
  };
  sync_inventory: boolean;
}
