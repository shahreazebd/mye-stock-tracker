"use server";

import xior from "xior";

interface Payload {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  myeLocationId: string;
  myeCompanyId: string;
  myeStoreId: string;
  maxStock: number;
  name: string;
}

async function fetchProducts(url: string, auth: string) {
  let page = 1;
  let allProducts: any[] = [];

  while (true) {
    const res = await xior.get(
      `${url}/wp-json/wc/v3/products?page=${page}&per_page=100`,
      {
        headers: { Authorization: `Basic ${auth}` },
      },
    );

    const products = res.data;
    allProducts = [...allProducts, ...products];

    if (products.length < 100) break; // no more pages
    page++;
  }

  return allProducts;
}

async function fetchProductVariationsById(url: string, auth: string, id: number) {
  let page = 1;
  let allVariations: any[] = [];

  while (true) {
    const res = await xior.get(
      `${url}/wp-json/wc/v3/products/${id}/variations?page=${page}&per_page=100`,
      {
        headers: { Authorization: `Basic ${auth}` },
      },
    );

    const variations = res.data;
    allVariations = [...allVariations, ...variations];

    if (variations.length < 100) break; // no more pages
    page++;
  }

  return allVariations;
}

async function getMyeProducts(company: string, location: string) {
  const url = `https://api.manageyourecommerce.com/miams/api/v1/stock/get-all-stock/${company}/${location}/?page_size=5000&page=1`;

  const response = await xior.get(url, {
    headers: { "SECRET-KEY": `${process.env.MIAMS_SECRET_KEY}` },
  });

  return response.data?.data;
}

async function getMyeMappedProducts(company: string, storeId: string) {
  const url = `https://api.manageyourecommerce.com/miams/api/v1/mapping/mapped-product/${company}/${storeId}/`;

  const response = await xior.get(url, {
    headers: { "SECRET-KEY": `${process.env.MIAMS_SECRET_KEY}` },
  });

  return response.data?.data;
}

export async function checkWooCommerceProducts(payload: Payload) {
  try {
    const {
      url,
      consumerKey,
      consumerSecret,
      myeStoreId,
      myeLocationId,
      myeCompanyId,
      maxStock,
      name,
    } = payload;

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    const products = await fetchProducts(url, auth);
    const variations: unknown[] = [];

    for (const product of products) {
      const productVariations = await fetchProductVariationsById(url, auth, product.id);
      variations.push(...productVariations);
    }

    const myeProducts = await getMyeProducts(myeCompanyId, myeLocationId);
    const myeMappedProducts = await getMyeMappedProducts(myeCompanyId, myeStoreId);

    const productWithInventory = myeMappedProducts.map((mapped: any) => {
      const mappedProduct = myeProducts.find(
        (product: any) =>
          product.local_product.local_product_id === mapped?.mapping?.local_product,
      );

      return {
        isMapped: !!mapped?.mapping?.local_product,
        localProductId: mappedProduct?.local_product?.local_product_id,
        localProductName: mappedProduct?.local_product?.local_product_name,
        localProductSku: mappedProduct?.local_product?.local_product_sku,
        inOpen: mappedProduct?.in_open || 0,
        stockLevel: mappedProduct?.stock_level || 0,
        pendingQuantity: mappedProduct?.pending_quantity || 0,
        remoteProductId: +mapped?.remote_product_id,
        remoteProductSku: mapped?.remote_product_sku,
      };
    });

    const final = productWithInventory.map((product: any) => {
      const variation: any = variations.find(
        (v: any) => v.sku === product?.remoteProductSku,
      );

      return {
        woocommerce: {
          id: variation?.id,
          remoteProductSku: variation?.sku,
          permalink: variation?.permalink,
          stockStatus: variation?.stock_status,
          stockQuantity: variation?.stock_quantity,
        },
        mye: product,
      };
    });

    const summary = {
      name,
      myeStoreId,
      myeCompanyId,
      myeLocationId,
      maxStock,
      accuracy: "0",
      success: 0,
      total: 0,
      failed: 0,
      unmapped: 0,
      failedSku: [] as any[],
      unmappedSku: [] as any[],
    };

    const finalData = final
      // .filter((item: any) => item?.woocommerce?.id)
      .map((item: any) => {
        summary.total += 1;
        const { mye, woocommerce } = item;
        if (!mye.isMapped) {
          summary.unmapped += 1;
          summary.unmappedSku.push(item?.woocommerce?.remoteProductSku ?? "");
        } else {
          let isFailed = false;

          if (mye.stockLevel < woocommerce.stockQuantity) {
            isFailed = true;
          } else if (mye.stockLevel <= 10) {
            isFailed = mye.stockLevel !== woocommerce.stockQuantity + mye.inOpen;
          } else {
            isFailed = woocommerce.stockQuantity !== maxStock;
          }

          if (isFailed) {
            summary.failed += 1;
            summary.failedSku.push(item?.woocommerce?.remoteProductSku ?? "");
          } else {
            summary.success += 1;
          }
        }

        return item;
      });

    return {
      success: true,
      message: "Products checked successfully",
      data: finalData,
      summary: {
        ...summary,
        accuracy: ((summary.success / summary.total) * 100).toFixed(2),
      },
    };
  } catch (error) {
    console.error("Error checking products:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while checking products",
    };
  }
}
