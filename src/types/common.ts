export interface Summary {
  name: string;
  myeStoreId: string;
  myeCompanyId: string;
  myeLocationId: string;
  accuracy: string;
  success: number;
  maxStock: number;
  total: number;
  failed: number;
  unmapped: number;
  failedSku: string[];
  unmappedSku: string[];
}
