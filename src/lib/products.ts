import xior from "xior";
import type { EbayProduct, MappedProduct, MyeProductStock } from "@/types/product";

async function getMyeProductStock(company: string, location: string) {
  const url = `https://api.manageyourecommerce.com/miams/api/v1/stock/get-all-stock/${company}/${location}/?page_size=5000&page=1`;

  const response = await xior.get(url, {
    headers: { "SECRET-KEY": `${process.env.MIAMS_SECRET_KEY}` },
  });

  return response.data?.data as MyeProductStock[];
}

export type StockRespose = {
  success: boolean;
  message: string;
  channel_uid: string;
  company_uid: string;
  channel_type: string;
  location_id: number;
  total_data: number;
  stock_data: StockData[];
};

export type StockData = {
  remote_product_sku: string;
  product_id: string;
  available_quantity: number;
};

async function getMyeStock(_company: string, _location: string) {
  const url = `https://api.manageyourecommerce.com/miams/api/v1/mapping/get-mye-stock-by-channel/${_company}/${_location}`;
  const options = {
    method: "GET",
    url,
    headers: {
      "secret-key": "ab7622ba-7713-42de-bab6-b0bbb54ef716",
      "User-Agent": "insomnia/11.4.0",
    },
  };

  try {
    const { data } = await xior.request<StockRespose>(options);

    return data;
  } catch (error) {
    console.error(error);
    return {} as StockRespose;
  }
}

async function getMyeMappedProducts(company: string, storeId: string) {
  const url = `https://api.manageyourecommerce.com/miams/api/v1/mapping/mapped-product/${company}/${storeId}/`;

  const response = await xior.get(url, {
    headers: { "SECRET-KEY": `${process.env.MIAMS_SECRET_KEY}` },
  });

  return response.data?.data as MappedProduct[];
}

async function fetchEbayProducts(storeId: string) {
  const products = await xior.get(
    `https://api.manageyourecommerce.com/ebay/api/v1/products/fetch-ebay?channel_uid=${storeId}`,
  );

  return products.data?.data as EbayProduct[];
}

export { fetchEbayProducts, getMyeMappedProducts, getMyeProductStock, getMyeStock };
